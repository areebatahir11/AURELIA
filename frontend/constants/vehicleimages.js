// constants/vehicleImages.js

export const BRAND_IMAGES = {
  audi: [
    "/audi/audi.jpg",
    "/audi/audi1.jpg",
    "/audi/audi2.jpg",
    "/audi/audi3.jpg",
    "/audi/audi4.jpg",
    "/audi/audi5.jpg",
    "/audi/audi6.jpg",
  ],
  bmw: [
    "/bmw/bmw.jpg",
    "/bmw/bmw1.jpg",
    "/bmw/bmw2.jpg",
    "/bmw/bmw3.jpg",
    "/bmw/bmw4.jpg",
    "/bmw/bmw5.jpg",
    "/bmw/bmw6.jpg",
  ],
  ferrari: [
    "/ferrari/ferarri.jpg",
    "/ferrari/ferarri1.jpg",
    "/ferrari/ferarri2.jpg",
    "/ferrari/ferarri3.jpg",
    "/ferrari/ferarri4.jpg",
    "/ferrari/ferarri5.jpg",
  ],
  lamborghini: [
    "/lambourghini/lambourghini.jpg",
    "/lambourghini/lambourghini1.jpg",
    "/lambourghini/lamborghini2.jpg",
    "/lambourghini/lambhourghini3.jpg",
    "/lambourghini/lambourghini4.jpg",
    "/lambourghini/lambourghini5.jpg",
  ],
  mercedes: [
    "/mercedes/mercedes1.jpg",
    "/mercedes/mercedes2.jpg",
    "/mercedes/mercedes3.jpg",
    "/mercedes/mercedes4.jpg",
    "/mercedes/mercedes5.jpg",
    "/mercedes/mercedesJeep.jpg",
    "/mercedes/mercedesjeep1.jpg",
    "/mercedes/starring.jpg",
  ],
  rollsroyce: [
    "/rollsroyce/rollsroyce.jpg",
    "/rollsroyce/rollsroyce1.jpg",
    "/rollsroyce/rollsroyce2.jpg",
    "/rollsroyce/rollroyce3.jpg",
    "/rollsroyce/rollroyce4.jpg",
    "/rollsroyce/rollroyce5.jpg",
    "/rollsroyce/rollroyce6.jpg",
  ],
  tesla: [
    "/tesla/tesla1.jpg",
    "/tesla/tesla2.jpg",
    "/tesla/tesla3.jpg",
    "/tesla/tesla4.jpg",
    "/tesla/tesla5.jpg",
    "/tesla/teslastarring.jpg",
  ],
};

/**
 * Returns a fallback image for a brand when a vehicle doesn't have its own
 * `image` field set yet — cycles through that brand's folder by index so
 * multiple vehicles of the same brand don't all show the identical photo.
 */
export function getFallbackImage(brand, index = 0) {
  const key = brand?.toLowerCase().replace(/\s+/g, "");
  const images = BRAND_IMAGES[key];
  if (!images || images.length === 0) return null;
  return images[index % images.length];
}