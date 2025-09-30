import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders"; // Not available with legacy API

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    createAt: z.date(),
    publish: z.boolean(),
    tags: z.array(z.string()),
    archives: z.array(z.string()),
    desc: z.string().optional(),
    heroImage: z.string().optional(),
  }),
});

export const collections = { blog };
