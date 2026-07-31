import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getArticles } from '../../../lib/articles';

export async function getStaticPaths() {
  const articles = await getArticles();
  return articles.filter((article) => article.source === 'html').map((article) => ({
    params: { slug: article.slug },
    props: { article },
  }));
}

export async function GET({ props }) {
  const html = await readFile(join(process.cwd(), 'blog', props.article.slug, 'index.html'));
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
