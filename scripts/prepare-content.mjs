import { copyFile, mkdir, readdir, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const source = join(root, 'blog');
const destination = join(root, 'public', 'blog');

await rm(destination, { recursive: true, force: true });
await mkdir(join(root, 'public'), { recursive: true });

async function copyAssets(from, to) {
  await mkdir(to, { recursive: true });
  for (const entry of await readdir(from, { withFileTypes: true })) {
    if (entry.name === 'index.md' || entry.name === 'index.html') continue;

    const sourcePath = join(from, entry.name);
    const targetPath = join(to, entry.name);
    if (entry.isDirectory()) await copyAssets(sourcePath, targetPath);
    else if ((await stat(sourcePath)).isFile()) await copyFile(sourcePath, targetPath);
  }
}

await copyAssets(source, destination);
