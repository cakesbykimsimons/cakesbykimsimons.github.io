import { getEntry, getCollection, type CollectionKey } from "astro:content";
import type { GenericEntry, MenuItem } from "@/types";

export const getIndex = async (collection: CollectionKey): Promise<GenericEntry> => {
  const index = await getEntry(collection, "-index");
  return index;
}

export const getEntries = async (
  collection: CollectionKey,
  sortFunction?: ((array: any[]) => any[]),
  noIndex = true,
  noDrafts = true
): Promise<GenericEntry[]> => {
  let entries: GenericEntry[] = await getCollection(collection);
  entries = noIndex
    ? entries.filter((entry: GenericEntry) => !entry.id.match(/^-/))
    : entries;
  entries = noDrafts
    ? entries.filter((entry: GenericEntry) => 'draft' in entry.data && !entry.data.draft)
    : entries;
  entries = sortFunction ? sortFunction(entries) : entries;
  return entries;
};

// Fetch all pages in all specified collections, flattened into a single array
export const getEntriesBatch = async (
  collections: CollectionKey[],
  sortFunction?: ((array: any[]) => any[]),
  noIndex = true,
  noDrafts = true
): Promise<GenericEntry[]> => {
  const allCollections = await Promise.all(
    collections.map(async (collection) => {
      return await getEntries(collection, sortFunction, noIndex, noDrafts);
    })
  );
  return allCollections.flat();
};

// Fetch all subgroups (any depth) within the specified parent path
export const getGroups = async (
  collection: CollectionKey,
  sortFunction?: ((array: any[]) => any[]),
  parentPath: string = ""
): Promise<GenericEntry[]> => {
  let entries = await getEntries(collection, sortFunction, false);
  const prefix = parentPath ? `${parentPath}/` : "";
  const prefixLen = prefix.length;
  entries = entries.filter((entry: GenericEntry) => {
    if (!entry.id.startsWith(prefix)) return false;
    const remainder = entry.id.slice(prefixLen);
    const segments = remainder.split("/");
    return segments.length === 2 && segments[1] === "-index";
  });
  return entries;
};

// Fetch entries within the specified collection and group (immediate children only)
export const getEntriesInGroup = async (
  collection: CollectionKey,
  groupSlug: string,
  sortFunction?: ((array: any[]) => any[]),
): Promise<GenericEntry[]> => {
  let entries = await getEntries(collection, sortFunction, false);
  const prefix = `${groupSlug}/`;
  const prefixLen = prefix.length;
  entries = entries.filter((data: GenericEntry) => {
    if (!data.id.startsWith(prefix)) return false;
    const remainder = data.id.slice(prefixLen);
    const segments = remainder.split("/");
    return segments.length === 1 && segments[0] !== "-index";
  });
  return entries;
};

// Fetch all immediate children (both subgroups and regular entries) within a group
export const getAllChildrenInGroup = async (
  collection: CollectionKey,
  groupSlug: string,
  sortFunction?: ((array: any[]) => any[]),
): Promise<GenericEntry[]> => {
  let entries = await getEntries(collection, sortFunction, false);
  const prefix = `${groupSlug}/`;
  const prefixLen = prefix.length;
  entries = entries.filter((data: GenericEntry) => {
    if (!data.id.startsWith(prefix)) return false;
    const remainder = data.id.slice(prefixLen);
    const segments = remainder.split("/");
    return (segments.length === 1 && segments[0] !== "-index") || (segments.length === 2 && segments[1] === "-index");
  });
  return entries;
};

// Recursively build a MenuItem tree from collection entries
export const buildMenuTree = async (
  collection: CollectionKey,
  sortFunction?: ((array: any[]) => any[]),
  parentPath: string = ""
): Promise<MenuItem[]> => {
  const childGroups = await getGroups(collection, sortFunction, parentPath);
  const childEntries = await getEntriesInGroup(collection, parentPath, sortFunction);
  const menuItems: MenuItem[] = [];

  for (const group of childGroups) {
    const groupSlug = group.id.replace("/-index", "");
    const subChildren = await buildMenuTree(collection, sortFunction, groupSlug);
    menuItems.push({
      title: group.data.title,
      id: groupSlug,
      children: subChildren,
    });
  }

  for (const entry of childEntries) {
    menuItems.push({
      title: entry.data.title,
      id: entry.id,
      children: [],
    });
  }

  return menuItems;
};
