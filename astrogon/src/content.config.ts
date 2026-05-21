import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

// May also need to update /src/types/index.d.ts when updating this file
// When updating the set of searchable collections, update collectionList in /src/pages/search.astro

const searchable = z.object({
  title: z.string(),
  description: z.string().optional(),
  autodescription: z.boolean().default(true),
  draft: z.boolean().default(false),
});

const social = z.object({
  discord: z.string().optional(),
  email: z.string().optional(),
  facebook: z.string().optional(),
  github: z.string().optional(),
  instagram: z.string().optional(),
  linkedIn: z.string().optional(),
  pinterest: z.string().optional(),
  tiktok: z.string().optional(),
  website: z.string().optional(),
  youtube: z.string().optional(),
});

const about = defineCollection({
  loader: glob({ pattern: "-index.{md,mdx}", base: "./src/content/about" }),
  schema: ({ image }) =>
    searchable.extend({
      image: image().optional(),
      imageAlt: z.string().default(""),
    }),
});

const authors = defineCollection({
  loader: glob({
    pattern: "**\/[^_]*.{md,mdx}",
    base: "./src/content/authors",
  }),
  schema: ({ image }) =>
    searchable.extend({
      email: z.string().optional(),
      image: image().optional(),
      imageAlt: z.string().default(""),
      social: social.optional(),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**\/[^_]*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    searchable.extend({
      date: z.date().optional(),
      image: image().optional(),
      imageAlt: z.string().default(""),
      author: reference("authors").optional(),
      recipe: reference("recipes").optional(),
      howTo: reference("how-tos").optional(),
      categories: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
      complexity: z.number().default(1),
      hideToc: z.boolean().default(false),
      showFeaturedImage: z.boolean().default(true),
      url: z.string().optional(),
    }),
});

const cakeGallery = defineCollection({
  loader: glob({
    pattern: "**\/[^_]*.{md,mdx}",
    base: "./src/content/cake-gallery",
  }),
  schema: ({ image }) =>
    searchable.extend({
      image: image().optional(),
      imageAlt: z.string().default(""),
      hideToc: z.boolean().default(false),
      hideNav: z.boolean().default(false),
      objectPosition: z.string().default("center"),
    }),
});

const artGallery = defineCollection({
  loader: glob({
    pattern: "**\/[^_]*.{md,mdx}",
    base: "./src/content/art",
  }),
  schema: ({ image }) =>
    searchable.extend({
      image: image().optional(),
      imageAlt: z.string().default(""),
      hideToc: z.boolean().default(false),
      hideNav: z.boolean().default(false),
      objectPosition: z.string().default("center"),
    }),
});

const foodArtGallery = defineCollection({
  loader: glob({
    pattern: "**\/[^_]*.{md,mdx}",
    base: "./src/content/food-art",
  }),
  schema: ({ image }) =>
    searchable.extend({
      image: image().optional(),
      imageAlt: z.string().default(""),
      hideToc: z.boolean().default(false),
      hideNav: z.boolean().default(false),
      objectPosition: z.string().default("center"),
    }),
});

const home = defineCollection({
  loader: glob({ pattern: "-index.{md,mdx}", base: "./src/content/home" }),
  schema: ({ image }) =>
    z.object({
      image: image().optional(),
      imageAlt: z.string().default(""),
      title: z.string(),
      content: z.string().optional(),
      button: z
        .object({
          label: z.string(),
          link: z.string().optional(),
        })
        .optional(),
      objectPosition: z.string().default("top center"),
      tagline: z.string().optional(),
      bio: z.string().optional(),
      facebook: z.string().optional(),
      instagram: z.string().optional(),
    }),
});

const indexCards = defineCollection({
  loader: glob({
    pattern: "-index.{md,mdx}",
    base: "./src/content/index-cards",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    cards: z.array(z.string()),
  }),
});

const poetry = defineCollection({
  loader: glob({ pattern: "**\/[^_]*.{md,mdx}", base: "./src/content/poetry" }),
  schema: ({ image }) =>
    searchable.extend({
      date: z.date().optional(),
      image: image().optional(),
      imageAlt: z.string().default(""),
      author: reference("authors").optional(),
    }),
});

const portfolio = defineCollection({
  loader: glob({
    pattern: "-index.{md,mdx}",
    base: "./src/content/portfolio",
  }),
  schema: searchable.extend({
    projects: z.array(
      z.object({
        title: z.string(),
        github: z.string().optional(),
        technologies: z.array(z.string()).optional(),
        content: z.array(z.string()).optional(),
      }),
    ),
  }),
});

const recipes = defineCollection({
  loader: glob({
    pattern: "**\/[^_]*.{md,mdx}",
    base: "./src/content/recipes",
  }),
  schema: ({ image }) =>
    searchable.extend({
      date: z.date().optional(),
      image: image().optional(),
      imageAlt: z.string().default(""),
      author: reference("authors").optional(),
      prepTime: z.number().optional(),
      cookTime: z.number().optional(),
      coolTime: z.number().optional(),
      servings: z.number().optional(),
      diet: z.string().optional(),
      ingredients: z
        .object({
          list: z.array(z.string()).optional(),
          qty: z.array(z.string()).optional(),
          groups: z
            .array(
              z.object({
                label: z.string(),
                list: z.array(z.string()),
                qty: z.array(z.string()),
              }),
            )
            .optional(),
        })
        .refine(
          (data) => data.list !== undefined || data.groups !== undefined,
          { message: "Provide either 'list' or 'groups' for ingredients" },
        )
        .optional(),
      notes: z.array(z.string()).optional(),
    }),
});

const howTos = defineCollection({
  loader: glob({
    pattern: "**\/[^_]*.{md,mdx}",
    base: "./src/content/how-tos",
  }),
  schema: ({ image }) =>
    searchable.extend({
      date: z.date().optional(),
      image: image().optional(),
      imageAlt: z.string().default(""),
      author: reference("authors").optional(),
      skillLevel: z.string().optional(),
      timeRequired: z.string().optional(),
      cost: z.string().optional(),
      supplies: z
        .object({
          list: z.array(z.string()).optional(),
          groups: z
            .array(
              z.object({
                label: z.string(),
                list: z.array(z.string()),
              }),
            )
            .optional(),
        })
        .refine(
          (data) => data.list !== undefined || data.groups !== undefined,
          { message: "Provide either 'list' or 'groups' for supplies" },
        )
        .optional(),
      notes: z.array(z.string()).optional(),
    }),
});

const terms = defineCollection({
  loader: glob({ pattern: "-index.{md,mdx}", base: "./src/content/terms" }),
  schema: searchable,
});

// Export collections
export const collections = {
  about,
  authors,
  blog,
  cakeGallery,
  artGallery,
  foodArtGallery,
  home,
  indexCards,
  poetry,
  portfolio,
  recipes,
  terms,
  "how-tos": howTos,
};
