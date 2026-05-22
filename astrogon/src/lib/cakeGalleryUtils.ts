// Cake Gallery Utilities
import { createGalleryLoader } from "./galleryLoader";

const allImages = import.meta.glob(
  "@/assets/cake-gallery/**/*.{jpg,jpeg,webp}",
  {
    eager: true,
    query: "?url",
    import: "default",
  },
);

const allGalleryConfigs = import.meta.glob(
  "@/assets/cake-gallery/**/gallery.json",
  { eager: true },
);

const { getImages } = createGalleryLoader(allImages, allGalleryConfigs);
export { getImages as getImagesForCake };
