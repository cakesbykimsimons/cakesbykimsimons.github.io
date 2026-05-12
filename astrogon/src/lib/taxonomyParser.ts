import { getEntries } from "./contentParser";
import { slugify } from "./textConverter";
import type { CollectionKey } from "astro:content";

export const getTaxaMultiset = async (collection: CollectionKey, name: string) => {
  const entries = await getEntries(collection);
  const taxonomyPages = entries.map((entry: any) => entry.data[name]);
  let taxonomies: string[] = [];
  for (let i = 0; i < taxonomyPages.length; i++) {
    const categoryArray = taxonomyPages[i];
    for (let j = 0; j < categoryArray.length; j++) {
      taxonomies.push(slugify(categoryArray[j]));
    }
  }
  return taxonomies;
};

export const getTaxa = async (collection: CollectionKey, name: string, multiset?: string[]) => {
  const allTaxa = await getTaxaMultiset(collection, name);
  let taxonomy = [...new Set(allTaxa)];
  if (multiset) {
    taxonomy.sort((a, b) => {
      const countB = multiset.filter((c) => c === b).length;
      const countA = multiset.filter((c) => c === a).length;
      return countB - countA || a.localeCompare(b);
    });
  } else {
    taxonomy.sort((a, b) => a.localeCompare(b)); // alphabetize
  }
  return taxonomy;
};

export const getSidebarTaxa = async (collection: CollectionKey, name: string) => {
  const multiset = await getTaxaMultiset(collection, name);
  const counts: Record<string, number> = {};
  for (const t of multiset) {
    counts[t] = (counts[t] || 0) + 1;
  }
  let taxonomy = [...new Set(multiset)].filter((t) => counts[t] > 1);
  taxonomy.sort((a, b) => {
    const countB = counts[b];
    const countA = counts[a];
    return countB - countA || a.localeCompare(b);
  });
  return taxonomy;
};
