const http = require("node:http");
const path = require("node:path");
const fs = require("node:fs");
const serve = require("next/dist/compiled/serve-handler");

const args = process.argv.slice(2);
const hostnameIndex = args.indexOf("--hostname");
const portIndex = args.indexOf("--port");
const hostname = hostnameIndex >= 0 ? args[hostnameIndex + 1] : "127.0.0.1";
const port = Number(portIndex >= 0 ? args[portIndex + 1] : 3000);
const directory = path.resolve(__dirname, "..", "out");

if (!fs.existsSync(path.join(directory, "index.html"))) {
  throw new Error("Static export missing. Run npm run build first.");
}

http.createServer((request, response) => {
  serve(request, response, { public: directory }).catch((error) => {
    console.error(error);
    response.statusCode = 500;
    response.end("Internal server error");
  });
}).listen(port, hostname, () => {
  console.log(`Static preview: http://${hostname}:${port}`);
});
