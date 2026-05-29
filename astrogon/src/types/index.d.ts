import type { CollectionEntry, CollectionKey } from "astro:content";
import type { MarkdownHeading } from "astro";

export type GenericEntry = CollectionEntry<CollectionKey>;

export type AboutEntry = CollectionEntry<"about">;
export type AuthorsEntry = CollectionEntry<"authors">;
export type BlogEntry = CollectionEntry<"blog">;
export type CakeGalleryEntry = CollectionEntry<"cakeGallery">;
export type ArtGalleryEntry = CollectionEntry<"artGallery">;
export type FoodArtGalleryEntry = CollectionEntry<"foodArtGallery">;
export type HomeEntry = CollectionEntry<"home">;
export type HowTosEntry = CollectionEntry<"how-tos">;
export type RecipesEntry = CollectionEntry<"recipes">;
export type TermsEntry = CollectionEntry<"terms">;

export type SearchableEntry =
  | AboutEntry
  | AuthorsEntry
  | BlogEntry
  | CakeGalleryEntry
  | ArtGalleryEntry
  | FoodArtGalleryEntry
  | HowTosEntry
  | RecipesEntry
  | TermsEntry;

export type SocialLinks = {
  discord?: string;
  email?: string;
  facebook?: string;
  github?: string;
  instagram?: string;
  linkedIn?: string;
  pinterest?: string;
  tiktok?: string;
  website?: string;
  youtube?: string;
};

export type EntryReference = {
  id: string;
  collection: string;
};

// Define heading hierarchy so that we can generate ToC
export interface HeadingHierarchy extends MarkdownHeading {
  subheadings: HeadingHierarchy[];
}

export type MenuItem = {
  title?: string;
  id: string;
  children: MenuItem[];
};
