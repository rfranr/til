import http from "http";
import path from "node:path";
import { createReadStream, statSync } from "fs";
import { extname, join, dirname } from "path";
import { fileURLToPath } from "url";


const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const BASE_DIR = path.resolve( CURRENT_DIR, "../../");
const DIST_PATH = join(BASE_DIR, "dist");

const mimeTypes = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

const server = http.createServer((req, res) => {
  let filePath = req.url === "/" ? "/index.html" : req.url;
  filePath = join(DIST_PATH, filePath);

  try {
    statSync(filePath); 
    const ext = extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || "application/octet-stream";

    res.writeHead(200, { "Content-Type": contentType });
    createReadStream(filePath).pipe(res);
  } catch (err) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Serving /dist at http://localhost:${PORT}`);
});
console.log(`Serving files from ${DIST_PATH}`);