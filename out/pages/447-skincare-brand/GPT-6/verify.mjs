import path from "node:path";
import { fileURLToPath } from "node:url";
import { run } from "./.checks/harness.mjs";

await run(path.dirname(fileURLToPath(import.meta.url)), process.argv[2]);
