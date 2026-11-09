import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    topic: z.enum(['Math', 'Machine learning', 'Thoughts']),
    draft: z.boolean().default(false),
    example: z.boolean().default(false),
  }),
});
export const collections = { posts };
