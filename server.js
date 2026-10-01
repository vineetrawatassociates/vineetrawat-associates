import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const publicRoot = path.join(root, 'public');
const port = Number(process.env.PORT) || 3000;

const pages = {
  '/': 'pages/index.html',
  '/about': 'pages/about.html',
  '/services': 'pages/services.html',
  '/blog': 'pages/blog.html',
  '/contact': 'pages/contact.html',
  '/blog/understanding-statutory-audit-india': 'articles/understanding-statutory-audit-india.html',
};

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const notFound = fs.readFileSync(path.join(root, 'pages/404.html'));

function safePublicPath(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null;
  }
  if (decoded.includes('\0')) return null;
  const relative = decoded.replace(/^\/+/, '');
  const filePath = path.resolve(publicRoot, relative);
  if (filePath !== publicRoot && !filePath.startsWith(publicRoot + path.sep)) return null;
  return filePath;
}

function notFoundResponse(res, method) {
  res.writeHead(404, {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Length': notFound.length,
  });
  res.end(method === 'HEAD' ? undefined : notFound);
}

const server = http.createServer((req, res) => {
  const method = req.method || 'GET';
  if (method !== 'GET' && method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    res.end();
    return;
  }

  let pathname;
  try {
    pathname = new URL(req.url || '/', 'http://localhost').pathname;
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(method === 'HEAD' ? undefined : 'Bad request');
    return;
  }

  if (pathname === '/health') {
    const body = 'ok';
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Length': Buffer.byteLength(body),
    });
    res.end(method === 'HEAD' ? undefined : body);
    return;
  }

  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  let filePath = pages[pathname] ? path.join(root, pages[pathname]) : null;
  const isPublicAsset =
    pathname.startsWith('/css/') ||
    pathname.startsWith('/js/') ||
    pathname.startsWith('/images/') ||
    pathname === '/CNAME';

  if (!filePath && isPublicAsset) {
    filePath = safePublicPath(pathname);
  }

  if (!filePath) {
    notFoundResponse(res, method);
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      notFoundResponse(res, method);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': types[ext] || 'application/octet-stream',
      'Content-Length': stat.size,
    });
    if (method === 'HEAD') {
      res.end();
      return;
    }
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Listening on http://127.0.0.1:${port}/`);
});
