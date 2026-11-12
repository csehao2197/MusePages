import copy
from contextlib import nullcontext
import io
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

import select_deploy_pages as selector


class SelectorTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.file = Path(self.temporary.name) / "config.json"
        self.config = {
            "version": 2,
            "extra": {"preserved": True},
            "pages": {
                "001-guide": [
                    {"model": "GPT-6", "title": "Tokyo", "enabled": True,
                     "deployed": True, "tags": ["Travel"], "staticDir": "out", "slug": "guide"},
                    {"model": "other-model", "title": "Another guide", "enabled": False,
                     "deployed": False, "tags": [], "staticDir": ".", "slug": "guide"},
                ],
                "002-deals": [
                    {"model": "GPT-6", "title": "旅行优惠", "enabled": False,
                     "deployed": False, "tags": ["Travel"], "staticDir": "out", "slug": "deals"},
                ],
            },
        }
        self.file.write_bytes((json.dumps(self.config, ensure_ascii=False, indent=2) + "\n").encode())

    def menu(self, options, keys):
        reader = iter(keys)
        output = io.StringIO()
        with patch.object(selector.shutil, "get_terminal_size", return_value=os.terminal_size((50, 9))):
            result = selector.choose(options, lambda: next(reader), output)
        return result, output.getvalue()

    def test_arrow_keys_toggle_each_prompt_and_model_without_mutating_config(self):
        original, config, options = selector.load_config(self.file)
        result, output = self.menu(options, ["up", "toggle", "down", "toggle", "down", "toggle", "save"])
        self.assertEqual(result, [False, True, True])
        self.assertIn("> [x] GPT-6 | Tokyo", output)
        self.assertEqual(config, self.config)
        self.assertEqual(self.file.read_bytes(), original)

    def test_scrolling_home_end_and_cancel(self):
        _, _, options = selector.load_config(self.file)
        options = [(str(index), copy.deepcopy(options[0][1])) for index in range(20)]
        result, output = self.menu(options, ["end", "toggle", "up", "toggle", "home", "toggle", "save"])
        self.assertFalse(result[0])
        self.assertFalse(result[18])
        self.assertFalse(result[19])
        self.assertIn("Options 18-20 of 20", output)
        self.assertEqual(len(output.split("\x1b[H\x1b[2J")[-1].splitlines()), 8)
        cancelled, _ = self.menu(options, ["toggle", "cancel"])
        self.assertIsNone(cancelled)

    @unittest.skipUnless(os.name == "nt", "Windows key reader")
    def test_native_key_sequences(self):
        cases = [
            (["\xe0", "H"], "up"), (["\x00", "P"], "down"),
            (["\xe0", "G"], "home"), (["\xe0", "O"], "end"),
            ([" "], "toggle"), (["\r"], "save"),
            (["\x1b"], "cancel"), (["\x03"], "cancel"),
            (["\xe0", "K"], ""), (["z"], ""),
        ]
        for sequence, expected in cases:
            with self.subTest(sequence=sequence), patch("msvcrt.getwch", side_effect=sequence):
                self.assertEqual(selector.read_key(), expected)

    def test_save_changes_only_enabled_and_preserves_grouping_and_extensions(self):
        original, config, _ = selector.load_config(self.file)
        changed = selector.save_selection(self.file, original, config, [False, True, True])
        expected = copy.deepcopy(self.config)
        expected["pages"]["001-guide"][0]["enabled"] = False
        expected["pages"]["001-guide"][1]["enabled"] = True
        expected["pages"]["002-deals"][0]["enabled"] = True
        self.assertEqual(changed, 3)
        self.assertEqual(json.loads(self.file.read_bytes()), expected)
        self.assertEqual(config, self.config)
        self.assertEqual(sorted(p.name for p in self.file.parent.iterdir()), ["config.json"])

    def test_unchanged_selection_keeps_exact_bytes_and_timestamp(self):
        original = json.dumps(self.config, ensure_ascii=False, separators=(",", ":")).encode()
        self.file.write_bytes(original)
        timestamp = self.file.stat().st_mtime_ns
        original, config, _ = selector.load_config(self.file)
        self.assertEqual(selector.save_selection(self.file, original, config, [True, False, False]), 0)
        self.assertEqual(self.file.read_bytes(), original)
        self.assertEqual(self.file.stat().st_mtime_ns, timestamp)

    def test_external_changes_are_not_overwritten(self):
        original, config, _ = selector.load_config(self.file)
        external = original + b" \n"
        self.file.write_bytes(external)
        with self.assertRaisesRegex(ValueError, "Config changed"):
            selector.save_selection(self.file, original, config, [False, True, True])
        self.assertEqual(self.file.read_bytes(), external)
        self.assertFalse((self.file.parent / ".publish.lock").exists())

    def test_existing_publisher_lock_is_preserved(self):
        original, config, _ = selector.load_config(self.file)
        lock = self.file.parent / ".publish.lock"
        lock.write_text("existing owner\n")
        with self.assertRaisesRegex(ValueError, "Deployment is locked"):
            selector.save_selection(self.file, original, config, [False, True, True])
        self.assertEqual(self.file.read_bytes(), original)
        self.assertEqual(lock.read_text(), "existing owner\n")

    def test_failed_replace_retains_config_and_cleans_owned_files(self):
        original, config, _ = selector.load_config(self.file)
        with patch.object(selector.os, "replace", side_effect=PermissionError("busy")):
            with self.assertRaises(PermissionError):
                selector.save_selection(self.file, original, config, [False, True, True])
        self.assertEqual(self.file.read_bytes(), original)
        self.assertEqual(sorted(p.name for p in self.file.parent.iterdir()), ["config.json"])

    def test_preserves_crlf_and_unicode_on_save(self):
        self.file.write_bytes(self.file.read_bytes().replace(b"\n", b"\r\n"))
        original, config, _ = selector.load_config(self.file)
        selector.save_selection(self.file, original, config, [False, False, False])
        result = self.file.read_bytes()
        self.assertNotIn(b"\n", result.replace(b"\r\n", b""))
        self.assertIn("旅行优惠", result.decode())

    def test_invalid_configs_fail_before_writing(self):
        cases = [[], {"version": 1, "pages": []}, {"version": 2, "pages": {"p": {}}}]
        invalid = copy.deepcopy(self.config)
        invalid["pages"]["001-guide"][0]["enabled"] = 1
        cases.append(invalid)
        duplicate = copy.deepcopy(self.config)
        duplicate["pages"]["001-guide"][1]["model"] = "gpt-6"
        cases.append(duplicate)
        for config in cases:
            with self.subTest(config=config):
                self.file.write_text(json.dumps(config), encoding="utf-8")
                original = self.file.read_bytes()
                with self.assertRaises(ValueError):
                    selector.load_config(self.file)
                self.assertEqual(self.file.read_bytes(), original)

    def test_terminal_text_handles_wide_names_and_strips_escape_controls(self):
        self.assertEqual(selector.fit_text("优惠ABC", 5), "优惠A")
        self.assertNotIn("\x1b", selector.fit_text("Title\x1b[2J\n", 40))

    def test_main_keyboard_save_then_cancel_isolated_config(self):
        keys = iter(["down", "toggle", "save"])
        with patch.object(selector, "interactive_console", return_value=nullcontext()), \
                patch.object(selector, "read_key", side_effect=lambda: next(keys)), \
                patch("sys.stdout", new_callable=io.StringIO) as output:
            self.assertEqual(selector.main(["--config", str(self.file)]), 0)
        self.assertIn("1 changed", output.getvalue())
        self.assertIn("No deployment was performed", output.getvalue())
        saved = self.file.read_bytes()
        keys = iter(["toggle", "cancel"])
        with patch.object(selector, "interactive_console", return_value=nullcontext()), \
                patch.object(selector, "read_key", side_effect=lambda: next(keys)), \
                patch("sys.stdout", new_callable=io.StringIO) as output:
            self.assertEqual(selector.main(["--config", str(self.file)]), 0)
        self.assertIn("Cancelled", output.getvalue())
        self.assertEqual(self.file.read_bytes(), saved)

    def test_redirected_console_fails_without_modifying_config(self):
        original = self.file.read_bytes()
        with patch("sys.stdin.isatty", return_value=False), \
                patch("sys.stderr", new_callable=io.StringIO) as errors:
            self.assertEqual(selector.main(["--config", str(self.file)]), 1)
        self.assertIn("interactive Windows terminal", errors.getvalue())
        self.assertEqual(self.file.read_bytes(), original)

    def test_empty_config_leaves_file_untouched(self):
        self.file.write_bytes(b'{"version":2,"pages":{}}\n')
        original = self.file.read_bytes()
        with patch("sys.stdout", new_callable=io.StringIO) as output:
            self.assertEqual(selector.main(["--config", str(self.file)]), 0)
        self.assertIn("No model options", output.getvalue())
        self.assertEqual(self.file.read_bytes(), original)


if __name__ == "__main__":
    unittest.main()
