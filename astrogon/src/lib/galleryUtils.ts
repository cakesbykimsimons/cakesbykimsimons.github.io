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

const allImages = import.meta.glob('@/assets/cake-gallery/**/*.{jpg,jpeg}', { eager: true, as: 'url' });

// Glob all gallery.json files at build time
const allGalleryConfigs = import.meta.glob('@/assets/cake-gallery/**/gallery.json', { eager: true });

function resolvePath(key: string): string {
  // Convert Vite import key to a filesystem-relative path
  return key.replace('/src/', '/');
}

export async function getImagesForCake(cakeSlug: string): Promise<CakeImage[]> {
  const prefix = `/${cakeSlug}/`;
  
  // Find the matching gallery config by slug
  let galleryConfig: GalleryEntry[] = [];
  for (const [key, module] of Object.entries(allGalleryConfigs)) {
    if (key.includes(`/${cakeSlug}/gallery.json`)) {
      galleryConfig = (module as { default: GalleryEntry[] }).default || [];
      break;
    }
  }

  return Object.entries(allImages)
    .filter(([key]) => key.includes(prefix))
    .map(([key, src]) => {
      const filename = key.split('/').pop() || '';
      const jsonEntry = galleryConfig.find((e: GalleryEntry) => e.file === filename);
      return { src, caption: jsonEntry?.caption || '', filename };
    });
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
