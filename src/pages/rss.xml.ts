import rss from '@astrojs/rss';
import { publishedPosts } from '../lib/posts';
export async function GET(context) {
  const posts = await publishedPosts();
  return rss({ title: 'Gloria Li — a personal notebook', description: 'Notes on mathematics, machine learning, and learning out loud.', site: context.site, items: posts.map(post => ({ title: post.data.title, description: post.data.description, pubDate: post.data.date, link: `/posts/${post.id}/` })) });
}
