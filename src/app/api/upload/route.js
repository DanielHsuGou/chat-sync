import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { Readable } from "stream";
import path from "path";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      console.error("No file found in the request");
      return NextResponse.json({ success: false, error: "No file found" });
    }

    console.log("File details:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (buffer.length === 0) {
      console.error("File buffer is empty");
      return NextResponse.json({ success: false, error: "Empty file buffer" });
    }

    // Convert buffer to stream
    const stream = Readable.from(buffer);

    // Determine the resource type based on the file type
    const resourceType = file.type.startsWith("image/")
      ? "image"
      : file.type.startsWith("video/")
      ? "video"
      : "auto";

    // Extract the file name without extension
    const fileName = path.parse(file.name).name;

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: resourceType, type: "upload", public_id: fileName },
        (error, result) => {
          if (error) {
            console.error("Error uploading to Cloudinary:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      stream.pipe(uploadStream);
    });

    console.log(`File uploaded to Cloudinary: ${uploadResult.secure_url}`);

    return NextResponse.json({ success: true, url: uploadResult.secure_url });
  } catch (error) {
    console.error("Error processing upload:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
