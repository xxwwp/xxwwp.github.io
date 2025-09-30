// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";

// https://astro.build/config
export default defineConfig({
  site: "https://xxwwp.github.io",
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    rehypePlugins: [
      // 标题自动添加 id 前置插件
      rehypeSlug,
      // 标题自动添加锚点
      [
        rehypeAutolinkHeadings,
        { behavior: "wrap", properties: { className: ["hd-link"] } },
      ],
      // 外链自动添加 target="_blank" 和 rel="noopener noreferrer"
      [rehypeExternalLinks, { target: "_blank", rel: "noopener noreferrer" }],

      rehypeHeadingIds,
    ],
  },
});
