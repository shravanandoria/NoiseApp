/**
 * DiceBear (https://dicebear.com) serves generated avatars over HTTP —
 * there's no npm package involved, just a seeded image URL rendered
 * through expo-image.
 */

const DICEBEAR_STYLE = "thumbs";
const DICEBEAR_BASE_URL = `https://api.dicebear.com/9.x/${DICEBEAR_STYLE}/png`;

export function getAvatarUrl(seed: string, size = 128): string {
  return `${DICEBEAR_BASE_URL}?seed=${encodeURIComponent(seed)}&size=${size}&backgroundType=gradientLinear`;
}
