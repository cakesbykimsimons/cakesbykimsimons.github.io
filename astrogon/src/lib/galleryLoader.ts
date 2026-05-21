// Shared Gallery Loader — pure logic, no eager globs
// Each gallery creates its own eager globs to avoid duplicate React instances

interface GalleryEntry {
  file: string;
  caption?: string;
  credit?: string;
  alt?: string;
}

export interface GalleryImage {
  src: string;
  caption: string;
  credit: string;
  alt: string;
  filename: string;
}

function resolvePath(key: string): string {
  return key.replace("/src/", "/");
}

function buildPathToUrlMap(
  allImages: Record<string, unknown>,
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const [key, url] of Object.entries(allImages)) {
    const assetPath = resolvePath(key);
    map[assetPath] = url as string;
  }
  return map;
}

function resolveRelativePath(galleryDir: string, file: string): string | null {
  const normalizedFile = file.replace(/\\/g, "/");
  const cleanFile = normalizedFile.startsWith("./") ? normalizedFile.slice(2) : normalizedFile;

  let parts: string[];
  if (cleanFile.startsWith("../")) {
    parts = galleryDir.split("/").filter(Boolean).concat(cleanFile.split("/"));
  } else {
    parts = galleryDir.split("/").filter(Boolean).concat([cleanFile]);
  }

  const stack: string[] = [];
  for (const part of parts) {
    if (part === "..") {
      stack.pop();
    } else if (part !== "." && part !== "") {
      stack.push(part);
    }
  }

  return "/" + stack.join("/");
}

export function createGalleryLoader(
  allImages: Record<string, unknown>,
  allGalleryConfigs: Record<string, unknown>,
) {
  const pathToUrlMap = buildPathToUrlMap(allImages);

  async function getImages(slug: string): Promise<GalleryImage[]> {
    let galleryConfig: GalleryEntry[] = [];
    let galleryDir = "";
    for (const [key, module] of Object.entries(allGalleryConfigs)) {
      if (key.includes(`/${slug}/gallery.json`)) {
        galleryConfig = (module as { default: GalleryEntry[] }).default || [];
        const pathParts = key.split("/");
        pathParts.pop();
        galleryDir = resolvePath(pathParts.join("/"));
        break;
      }
    }

    const entries: GalleryImage[] = [];

    for (const jsonEntry of galleryConfig) {
      const resolvedPath = resolveRelativePath(galleryDir, jsonEntry.file);

      if (resolvedPath && pathToUrlMap[resolvedPath]) {
        const filename = resolvedPath.split("/").pop() || "";
        entries.push({
          src: pathToUrlMap[resolvedPath],
          caption: jsonEntry.caption || "",
          credit: jsonEntry.credit || "",
          alt: jsonEntry.alt || jsonEntry.caption || "",
          filename,
        });
      } else if (!jsonEntry.file.includes("../")) {
        const matchingImages = Object.entries(allImages).filter(([key]) =>
          key.includes(`/${slug}/`),
        );
        const match = matchingImages.find(
          ([key]) => key.split("/").pop() === jsonEntry.file,
        );
        if (match) {
          entries.push({
            src: match[1] as string,
            caption: jsonEntry.caption || "",
            credit: jsonEntry.credit || "",
            alt: jsonEntry.alt || jsonEntry.caption || "",
            filename: jsonEntry.file,
          });
        }
      }
    }

    return entries;
  }

  return { getImages };
}
