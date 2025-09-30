import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const docs = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/docs", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      id: z.coerce.string(),
      title: z.string(),
      slug: z.string(),
      createAt: z.date(),
      publish: z.boolean(),
      tags: z.array(z.string()).optional(),
      archives: z.array(z.string()).optional(),
      desc: z.string().optional().nullable(),
      heroImage: z.string().optional(),
    }),
});

export const collections = { docs };
