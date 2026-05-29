// Food Art Gallery Utilities — loaded separately from cake gallery
import { createGalleryLoader } from "./galleryLoader";

const foodArtImages = import.meta.glob(
  "@/assets/food-art/**/*.{jpg,jpeg,webp}",
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

const allImages = { ...foodArtImages, ...howToImages };

const allGalleryConfigs = import.meta.glob(
  "@/assets/food-art/**/gallery.json",
  { eager: true },
);

const { getImages } = createGalleryLoader(allImages, allGalleryConfigs);
export { getImages as getImagesForFoodArt };
