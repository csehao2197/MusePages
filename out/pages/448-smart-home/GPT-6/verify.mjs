import path from "node:path";
import { fileURLToPath } from "node:url";
import { run } from "../../447-skincare-brand/GPT-6/.checks/harness.mjs";

await run(path.dirname(fileURLToPath(import.meta.url)), process.argv[2]);
