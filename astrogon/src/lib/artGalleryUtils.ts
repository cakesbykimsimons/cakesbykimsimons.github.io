// Art Gallery Utilities — loaded separately from cake gallery
import { createGalleryLoader } from "./galleryLoader";

const artImages = import.meta.glob("@/assets/art/**/*.{jpg,jpeg,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

const howToImages = import.meta.glob(
  "@/assets/how-tos/**/*.{jpg,jpeg,webp}",
  {
    eager: true,
    query: "?url",
    import: "default",
  },
);

const allImages = { ...artImages, ...howToImages };

const allGalleryConfigs = import.meta.glob("@/assets/art/**/gallery.json", {
  eager: true,
});

const { getImages } = createGalleryLoader(allImages, allGalleryConfigs);
export { getImages as getImagesForArt };
