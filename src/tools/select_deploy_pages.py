"""Interactively select enabled deployment options without publishing."""

import argparse
import copy
import ctypes
from contextlib import contextmanager
import json
import os
from pathlib import Path
import shutil
import sys
import tempfile
import unicodedata


DEFAULT_CONFIG = Path(__file__).resolve().parents[2] / "deploy" / "config.json"


def load_config(file):
    if file.is_symlink():
        raise ValueError("Deployment config cannot be a symbolic link.")
    original = file.read_bytes()
    config = json.loads(original.decode("utf-8"))
    if (not isinstance(config, dict) or type(config.get("version")) is not int
            or config["version"] != 2 or not isinstance(config.get("pages"), dict)):
        raise ValueError("Expected config version 2 with a pages object.")
    options = []
    identities = set()
    for prompt, group in config["pages"].items():
        if isinstance(group, list):
            group = config["pages"][prompt] = {"pages": group}
        if not prompt.strip() or not isinstance(group, dict) or not isinstance(group.get("pages"), list):
            raise ValueError("Each prompt must be an object with a pages array.")
        for model in group["pages"]:
            if (not isinstance(model, dict)
                    or not isinstance(model.get("model"), str) or not model["model"].strip()
                    or not isinstance(model.get("title"), str) or not model["title"].strip()
                    or type(model.get("enabled")) is not bool):
                raise ValueError(f"Invalid model option for {prompt}.")
            identity = (prompt.casefold(), model["model"].casefold())
            if identity in identities:
                raise ValueError(f"Duplicate model option for {prompt}/{model['model']}.")
            identities.add(identity)
            options.append((prompt, model))
    return original, config, options


@contextmanager
def deployment_lock(file):
    lock = file.parent / ".publish.lock"
    try:
        descriptor = os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    except FileExistsError:
        raise ValueError("Deployment is locked. Retry after the active operation finishes.") from None
    try:
        with os.fdopen(descriptor, "w", encoding="ascii") as handle:
            handle.write(f"{os.getpid()}\n")
        yield
    finally:
        lock.unlink()


def save_selection(file, original, config, selected):
    updated = copy.deepcopy(config)
    options = [model for group in updated["pages"].values() for model in group["pages"]]
    if len(options) != len(selected) or any(type(value) is not bool for value in selected):
        raise ValueError("Selection does not match the model options.")
    changed = sum(model["enabled"] != enabled for model, enabled in zip(options, selected))
    with deployment_lock(file):
        if file.is_symlink() or file.read_bytes() != original:
            raise ValueError("Config changed while selecting. Reopen the selector and try again.")
        if not changed:
            return 0
        for model, enabled in zip(options, selected):
            model["enabled"] = enabled
        newline = "\r\n" if b"\r\n" in original else "\n"
        contents = (json.dumps(updated, ensure_ascii=False, indent=2) + "\n").replace("\n", newline)
        temporary = None
        try:
            with tempfile.NamedTemporaryFile(
                dir=file.parent, prefix=file.name + ".", suffix=".tmp", delete=False
            ) as handle:
                temporary = Path(handle.name)
                handle.write(contents.encode("utf-8"))
                handle.flush()
                os.fsync(handle.fileno())
            os.replace(temporary, file)
        finally:
            if temporary is not None:
                temporary.unlink(missing_ok=True)
    return changed


def read_key():
    import msvcrt

    key = msvcrt.getwch()
    if key in ("\x00", "\xe0"):
        return {"H": "up", "P": "down", "G": "home", "O": "end"}.get(msvcrt.getwch(), "")
    return {" ": "toggle", "\r": "save", "\n": "save",
            "\x1b": "cancel", "\x03": "cancel"}.get(key, "")


def fit_text(text, width):
    result = []
    used = 0
    for char in text:
        if unicodedata.category(char).startswith("C"):
            char = " "
        size = 0 if unicodedata.combining(char) else 2 if unicodedata.east_asian_width(char) in ("W", "F") else 1
        if used + size > width:
            break
        result.append(char)
        used += size
    return "".join(result)


def choose(options, key_reader=None, stream=None):
    key_reader = key_reader or read_key
    stream = stream or sys.stdout
    selected = [model["enabled"] for _, model in options]
    if not options:
        return selected
    cursor = first = 0
    while True:
        width, height = shutil.get_terminal_size((100, 24))
        rows = max(1, height - 6)
        first = max(0, min(first, cursor, max(0, len(options) - rows)))
        first = max(first, cursor - rows + 1)
        end = min(len(options), first + rows)
        lines = [
            f"Deployment selection: {sum(selected)}/{len(options)} enabled",
            "Up/Down: move | Space: toggle | Enter: save | Esc/Ctrl+C: cancel",
            "Saving changes enabled only; publication is a separate step.",
            "",
        ]
        for index in range(first, end):
            prompt, model = options[index]
            marker = ">" if index == cursor else " "
            checked = "x" if selected[index] else " "
            lines.append(f"{marker} [{checked}] {model['model']} | {model['title']} ({prompt})")
        lines.append(f"Options {first + 1}-{end} of {len(options)}")
        stream.write("\x1b[H\x1b[2J" + "\n".join(fit_text(line, max(0, width - 1)) for line in lines))
        stream.flush()
        key = key_reader()
        if key == "up":
            cursor = (cursor - 1) % len(options)
        elif key == "down":
            cursor = (cursor + 1) % len(options)
        elif key == "home":
            cursor = 0
        elif key == "end":
            cursor = len(options) - 1
        elif key == "toggle":
            selected[cursor] = not selected[cursor]
        elif key == "save":
            return selected
        elif key == "cancel":
            return None


@contextmanager
def interactive_console():
    if os.name != "nt" or not sys.stdin.isatty() or not sys.stdout.isatty():
        raise ValueError("Run this script in an interactive Windows terminal (without redirection).")
    from ctypes import wintypes

    kernel = ctypes.WinDLL("kernel32", use_last_error=True)
    kernel.GetStdHandle.argtypes = [wintypes.DWORD]
    kernel.GetStdHandle.restype = wintypes.HANDLE
    kernel.GetConsoleMode.argtypes = [wintypes.HANDLE, ctypes.POINTER(wintypes.DWORD)]
    kernel.GetConsoleMode.restype = wintypes.BOOL
    kernel.SetConsoleMode.argtypes = [wintypes.HANDLE, wintypes.DWORD]
    kernel.SetConsoleMode.restype = wintypes.BOOL
    handle = kernel.GetStdHandle(-11)
    mode = wintypes.DWORD()
    if not kernel.GetConsoleMode(handle, ctypes.byref(mode)):
        raise ctypes.WinError(ctypes.get_last_error())
    if not kernel.SetConsoleMode(handle, mode.value | 0x0004):
        raise ctypes.WinError(ctypes.get_last_error())
    try:
        sys.stdout.write("\x1b[?1049h\x1b[?25l")
        sys.stdout.flush()
        yield
    finally:
        try:
            sys.stdout.write("\x1b[?25h\x1b[?1049l")
            sys.stdout.flush()
        finally:
            kernel.SetConsoleMode(handle, mode.value)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG,
                        help="Deployment config path (default: repository deploy/config.json).")
    args = parser.parse_args(argv)
    try:
        original, config, options = load_config(args.config)
        if not options:
            print("No model options found. Configuration left untouched.")
            return 0
        with interactive_console():
            selected = choose(options)
        if selected is None:
            print("Cancelled. Configuration left untouched.")
        else:
            changed = save_selection(args.config, original, config, selected)
            if changed:
                print(f"Saved: {sum(selected)}/{len(selected)} enabled, {changed} changed.")
            else:
                print("No changes. Configuration left untouched.")
            print("No deployment was performed.")
        return 0
    except KeyboardInterrupt:
        print("\nInterrupted. No deployment was performed.", file=sys.stderr)
        return 130
    except (OSError, ValueError, UnicodeError) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
