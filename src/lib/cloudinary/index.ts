import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export interface UploadOptions {
  folder?: string;
  publicId?: string;
  resourceType?: "image" | "video" | "raw" | "auto";
  tags?: string[];
}

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  resourceType: string;
}

/**
 * Upload a file (Buffer or base64 data URI) to Cloudinary.
 * Throws if Cloudinary is not configured.
 */
export async function uploadToCloudinary(
  file: Buffer | string,
  options: UploadOptions = {},
): Promise<UploadResult> {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.",
    );
  }

  const payload: string =
    typeof file === "string"
      ? file
      : `data:application/octet-stream;base64,${file.toString("base64")}`;

  const result = await cloudinary.uploader.upload(payload, {
    folder: options.folder ?? "niyamah",
    public_id: options.publicId,
    resource_type: options.resourceType ?? "auto",
    tags: options.tags,
    overwrite: false,
    unique_filename: true,
    use_filename: true,
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
    resourceType: result.resource_type,
  };
}

/**
 * Delete an asset from Cloudinary by its public ID.
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image",
): Promise<void> {
  if (!cloudName || !apiKey || !apiSecret) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

export { cloudinary };
