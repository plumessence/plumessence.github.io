import { getCollection } from 'astro:content';
export async function publishedPosts() {
  return (await getCollection('posts', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
export const formatDate = (date: Date) => date.toLocaleDateString('en-US', {
  month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
});
export const readingTime = (body = '') => Math.max(1, Math.ceil(body.trim().split(/\s+/).length / 200));
