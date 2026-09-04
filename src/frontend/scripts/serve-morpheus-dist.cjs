// Minimal static server with SPA fallback, used by the Playwright e2e config
// to serve the built Morpheus application (dist/morpheus). Unlike plain
// `python3 -m http.server` it returns index.html for deep client-side routes
// such as /projects/<id>/model.
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../dist/morpheus');
const port = Number(process.argv[2] || process.env.PORT || 4173);
const host = '0.0.0.0';

const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.map': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405).end();
    return;
  }

  const requestPath = decodeURIComponent(new URL(req.url, `http://${host}`).pathname);
  const filePath = path.normalize(path.join(root, requestPath));

  let target = path.join(root, 'index.html');
  if (filePath.startsWith(root) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    target = filePath;
  }

  const ext = path.extname(target);
  const body = fs.readFileSync(target);
  res.writeHead(200, {'Content-Type': mime[ext] || 'application/octet-stream', 'Content-Length': body.length});
  res.end(body);
}).listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`[morpheus-dist] serving ${root} at http://${host}:${port}`);
});
