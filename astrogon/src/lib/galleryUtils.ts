// Cake Gallery Utilities

interface GalleryEntry {
  file: string;
  caption: string;
}

export interface CakeImage {
  src: string;
  caption: string;
  filename: string;
}

const allImages = import.meta.glob('@/assets/cake-gallery/**/*.{jpg,jpeg}', { eager: true, query: '?url', import: 'default' });

// Glob all gallery.json files at build time
const allGalleryConfigs = import.meta.glob('@/assets/cake-gallery/**/gallery.json', { eager: true });

function resolvePath(key: string): string {
  // Convert Vite import key to a filesystem-relative path
  return key.replace('/src/', '/');
}

// Build a flat map from resolved asset path -> URL
function buildPathToUrlMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const [key, url] of Object.entries(allImages)) {
    const assetPath = resolvePath(key);
    map[assetPath] = url as string;
  }
  return map;
}

// Resolve a relative file path from a gallery.json's directory to an absolute asset path
function resolveRelativePath(galleryDir: string, file: string): string | null {
  const normalizedFile = file.replace(/\\/g, '/');
  
  // Remove leading './' if present
  const cleanFile = normalizedFile.startsWith('./') ? normalizedFile.slice(2) : normalizedFile;
  
  // Build the full path and normalize (resolve .. segments)
  let parts: string[];
  if (cleanFile.startsWith('../')) {
    parts = galleryDir.split('/').filter(Boolean).concat(cleanFile.split('/'));
  } else {
    parts = galleryDir.split('/').filter(Boolean).concat([cleanFile]);
  }
  
  const stack: string[] = [];
  for (const part of parts) {
    if (part === '..') {
      stack.pop();
    } else if (part !== '.' && part !== '') {
      stack.push(part);
    }
  }
  
  return '/' + stack.join('/');
}

const pathToUrlMap = buildPathToUrlMap();

export async function getImagesForCake(cakeSlug: string): Promise<CakeImage[]> {
  // Find the matching gallery config by slug
  let galleryConfig: GalleryEntry[] = [];
  let galleryDir = '';
  for (const [key, module] of Object.entries(allGalleryConfigs)) {
    if (key.includes(`/${cakeSlug}/gallery.json`)) {
      galleryConfig = (module as { default: GalleryEntry[] }).default || [];
      // Extract the directory containing this gallery.json
      const pathParts = key.split('/');
      pathParts.pop(); // remove gallery.json
      galleryDir = resolvePath(pathParts.join('/'));
      break;
    }
  }

  // Build entries from gallery.json, resolving relative paths
  const entries: CakeImage[] = [];
  
  for (const jsonEntry of galleryConfig) {
    const resolvedPath = resolveRelativePath(galleryDir, jsonEntry.file);
    
    if (resolvedPath && pathToUrlMap[resolvedPath]) {
      const filename = resolvedPath.split('/').pop() || '';
      entries.push({
        src: pathToUrlMap[resolvedPath],
        caption: jsonEntry.caption || '',
        filename,
      });
    } else if (!jsonEntry.file.includes('../')) {
      // Fallback to old behavior for same-directory files (backward compatibility)
      const matchingImages = Object.entries(allImages).filter(([key]) => key.includes(`/${cakeSlug}/`));
      const match = matchingImages.find(([key]) => key.split('/').pop() === jsonEntry.file);
      if (match) {
        entries.push({
          src: match[1] as string,
          caption: jsonEntry.caption || '',
          filename: jsonEntry.file,
        });
      }
    }
  }

  return entries;
}

export async function loadGalleryConfig(cakeSlug: string): Promise<GalleryEntry[]> {
  for (const [key, module] of Object.entries(allGalleryConfigs)) {
    if (key.includes(`/${cakeSlug}/gallery.json`)) {
      return (module as { default: GalleryEntry[] }).default || [];
    }
  }
  console.warn(`No gallery config found for cake: ${cakeSlug}`);
  return [];
}
