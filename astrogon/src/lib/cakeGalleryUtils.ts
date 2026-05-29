// Cake Gallery Utilities
import { createGalleryLoader } from "./galleryLoader";

const cakeImages = import.meta.glob(
  "@/assets/cake-gallery/**/*.{jpg,jpeg,webp}",
  {
    eager: true,
    query: "?url",
    import: "default",
  },
);

const howToImages = import.meta.glob(
  "@/assets/how-tos/**/*.{jpg,jpeg,webp}",
  {
    eager: true,
    query: "?url",
    import: "default",
  },
);

const allImages = { ...cakeImages, ...howToImages };

const allGalleryConfigs = import.meta.glob(
  "@/assets/cake-gallery/**/gallery.json",
  { eager: true },
);

const { getImages } = createGalleryLoader(allImages, allGalleryConfigs);
export { getImages as getImagesForCake };
