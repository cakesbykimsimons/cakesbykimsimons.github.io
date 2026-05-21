// Art Gallery Utilities — loaded separately from cake gallery
import { createGalleryLoader } from "./galleryLoader";

const allImages = import.meta.glob("@/assets/art/**/*.{jpg,jpeg}", {
  eager: true,
  query: "?url",
  import: "default",
});

const allGalleryConfigs = import.meta.glob(
  "@/assets/art/**/gallery.json",
  { eager: true },
);

const { getImages } = createGalleryLoader(allImages, allGalleryConfigs);
export { getImages as getImagesForArt };
