import { cpSync, mkdirSync, readdirSync, rmSync } from 'node:fs';

const OUTPUT = 'dist';
const ROOT_FILES = new Set(['_redirects', 'robots.txt', 'sitemap.xml', 'favicon.svg', 'apple-touch-icon.png']);
const isPublicRootFile = (name) => ROOT_FILES.has(name) || /\.(html|css|js)$/.test(name);

rmSync(OUTPUT, { recursive: true, force: true });
mkdirSync(OUTPUT);
readdirSync('.', { withFileTypes: true })
  .filter((entry) => entry.isFile() && isPublicRootFile(entry.name))
  .forEach((entry) => cpSync(entry.name, `${OUTPUT}/${entry.name}`));
cpSync('assets', `${OUTPUT}/assets`, { recursive: true });
