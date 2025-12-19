"use server";

import cloudinary from "@/lib/cloudinary";

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file provided");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise<{ url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "arenas", // Optional: organize in a folder
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(new Error("Failed to upload image"));
            } else if (result) {
              resolve({ url: result.secure_url });
            } else {
              reject(new Error("Unknown upload error"));
            }
          }
        )
        .end(buffer);
    });
  } catch (error) {
    console.error("Upload action error:", error);
    throw new Error("Failed to upload image");
  }
}
