import { publishedPosts } from '../../lib/posts';
export async function getStaticPaths() {
  return (await publishedPosts()).map(post => ({ params: { id: `${post.id}.md` }, props: { post } }));
}
export function GET({ props }) {
  const { post } = props;
  const fields = { title: post.data.title, description: post.data.description, date: post.data.date.toISOString().slice(0, 10), topic: post.data.topic, draft: post.data.draft, example: post.data.example };
  const frontmatter = Object.entries(fields).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n');
  return new Response(`---\n${frontmatter}\n---\n\n${post.body}`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
