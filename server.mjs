import http from 'node:http';
import {readFile, realpath} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = await realpath(path.join(path.dirname(fileURLToPath(import.meta.url)), 'src'));
const routes = new Map([['/','index.html'],['/index.html','index.html'],['/styles.css','styles.css'],['/app.js','app.js'],['/calculator.js','calculator.js'],['/i18n.js','i18n.js'],['/assets/knowledgecity-logo.svg','assets/knowledgecity-logo.svg']]);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml'};
const server = http.createServer(async (req,res) => {
  res.setHeader('Content-Security-Policy',"default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'");
  res.setHeader('X-Content-Type-Options','nosniff'); res.setHeader('Referrer-Policy','no-referrer'); res.setHeader('X-Frame-Options','DENY'); res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()'); res.setHeader('Cache-Control','no-store');
  if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405,{'Allow':'GET, HEAD'});res.end('Method not allowed');return;}
  try {
    if (!req.url.startsWith('/') || /%|\\|\.\./.test(req.url.split('?')[0])) {res.writeHead(404);res.end('Not found');return;}
    const url = new URL(req.url,'http://localhost');
    if (/%|\\|\.\./.test(url.pathname) || !routes.has(url.pathname)) {res.writeHead(404);res.end('Not found');return;}
    const relative = routes.get(url.pathname), target = path.join(root,relative);
    const actual = await realpath(target);
    if (actual !== target || !actual.startsWith(root + path.sep)) {res.writeHead(404);res.end('Not found');return;}
    const body = await readFile(actual);res.writeHead(200,{'Content-Type':types[path.extname(actual)],'Content-Length':body.length});res.end(req.method === 'HEAD' ? undefined : body);
  } catch {res.writeHead(404);res.end('Not found');}
});
server.listen(4173,'127.0.0.1',() => console.log('Calculator ready at http://127.0.0.1:4173'));
