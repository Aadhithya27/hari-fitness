const CLOUDINARY_MAPPING: Record<string, string> = {
  "trainer-before.jpg": "v1784462641/trainer-before_i4ulc7.jpg",
  "trainer-after.jpg": "v1784462640/trainer-after_jqcay6.jpg",
  "client-1-before.jpg": "v1784462639/client-1-before_emucfi.jpg",
  "client-1-before_emucfi.jpg": "v1784462639/client-1-before_emucfi.jpg",
  "client-1-after.jpg": "v1784462639/client-1-after_vc6svo.jpg",
  "client-2-before.jpg": "v1784462639/client-2-before_ozy0bh.jpg",
  "client-2-after.jpg": "v1784462639/client-2-after_nhi8wc.jpg",
  "client-3-before-new.jpg": "v1784462640/client-3-before-new_plsohe.jpg",
  "client-3-before.jpg": "v1784462640/client-3-before_uxount.jpg",
  "client-3-after.jpg": "v1784462640/client-3-after_sxbbmv.jpg"
};

/**
 * Generates a Cloudinary URL for a given image path.
 * If the Cloudinary cloud name environment variable is not configured,
 * it returns the local fallback path.
 * 
 * @param imagePath - The path/public ID of the image in Cloudinary (e.g., 'transformations/trainer-before.jpg')
 * @param fallbackPath - The local relative fallback path (e.g., '/images/transformations/trainer-before.jpg')
 */
export function getCloudinaryImageUrl(imagePath: string, fallbackPath: string): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  if (cloudName && cloudName.trim() !== "") {
    // Standard Cloudinary URL structure: https://res.cloudinary.com/<cloud_name>/image/upload/<public_id>
    
    // Resolve versioned/public ID using the mapping
    const fileName = imagePath.split("/").pop() || "";
    const mappedPath = CLOUDINARY_MAPPING[fileName] || imagePath;
    
    const cleanPath = mappedPath.startsWith("/") ? mappedPath.slice(1) : mappedPath;
    return `https://res.cloudinary.com/${cloudName.trim()}/image/upload/${cleanPath}`;
  }
  
  return fallbackPath;
}
