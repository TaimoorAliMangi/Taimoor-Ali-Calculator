import {copyFile, mkdir, rm, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, 'dist');
await rm(dist, {recursive:true, force:true});
await mkdir(path.join(dist, 'assets'), {recursive:true});
const assets = ['index.html','styles.css','app.js','calculator.js','i18n.js','assets/knowledgecity-logo.svg'];
for (const asset of assets) await copyFile(path.join(root,'src',asset), path.join(dist,asset));
await writeFile(path.join(dist,'_headers'),`/*
  Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000
`);
console.log('Prepared static dist/ with six application assets and security headers.');
