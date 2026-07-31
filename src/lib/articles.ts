import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

const root = join(process.cwd(), 'blog');

export type Article = {
  slug: string;
  title: string;
  date: string;
  source: 'markdown' | 'html';
  path: string;
};

function parseFolder(folder: string) {
  const match = folder.match(/^(\d{4})(\d{2})(\d{2})-(.+)$/);
  if (!match) return null;

  return {
    date: `${match[1]}-${match[2]}-${match[3]}`,
    slug: folder,
    title: match[4].replace(/[-_]+/g, ' '),
  };
}

export async function getArticles(): Promise<Article[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const articles: Article[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const metadata = parseFolder(entry.name);
    if (!metadata) continue;

    const folder = join(root, entry.name);
    const files = await readdir(folder);
    const source = files.includes('index.md') ? 'markdown' : files.includes('index.html') ? 'html' : null;
    if (!source) continue;

    articles.push({ ...metadata, source, path: `/blog/${entry.name}/${source === 'html' ? 'index.html' : ''}` });
  }

  return articles.sort((a, b) => b.date.localeCompare(a.date));
}
