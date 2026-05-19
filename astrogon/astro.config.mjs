import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import AutoImport from "astro-auto-import";
import { defineConfig } from "astro/config";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import cloudflare from "@astrojs/cloudflare";
import { rehypeGuideInstructions } from "./src/lib/rehypeGuideInstructions.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://cakesbykimsimons.github.io",
  base: "/",
  trailingSlash: "ignore",
  prefetch: {
    prefetchAll: true
  },
  adapter: cloudflare(),
  integrations: [react(), sitemap(), tailwind({
    config: {
      applyBaseStyles: false
    }
  }), AutoImport({
    imports: ["@components/common/Button.astro", "@components/common/RecipeEmbed.astro", "@components/common/HowToEmbed.astro", "@components/common/StepImage.astro", "@components/common/StepImageLightbox", "@shortcodes/Accordion", "@shortcodes/Notice", "@shortcodes/Youtube", "@shortcodes/Tabs", "@shortcodes/Tab"]
  }), mdx({ rehypePlugins: [rehypeGuideInstructions] })],
  markdown: {
    remarkPlugins: [remarkToc, [remarkCollapse, {
      test: "Table of contents"
    }], remarkMath],
    rehypePlugins: [[rehypeKatex, {}], rehypeGuideInstructions],
    shikiConfig: {
      themes: { // https://shiki.style/themes
        light: "light-plus",
        dark: "dark-plus",
      }
    },
    extendDefaultPlugins: true
  },
});
