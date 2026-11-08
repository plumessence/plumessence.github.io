import { publishedPosts } from '../lib/posts';
export async function GET() {
  const posts = await publishedPosts();
  const paths = ['/', '/about/', ...posts.map(p => `/posts/${p.id}/`)];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path => `<url><loc>${new URL(path, 'https://plumessence.github.io').href}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml' } });
}
