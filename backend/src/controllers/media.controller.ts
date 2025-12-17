import type { Request, Response } from "express"
import { uploadMedia } from "../lib/storage.js"
import { extractMetadata } from "../core/services/extractMetaData.js"
import { resolveLocation } from "../core/services/resolveLocation.js"
import { createMediaRecords } from "../core/services/createMediaRecords.js"

export async function uploadMediaController(req: Request, res: Response) {
  try {
    /**
     * STEP 1: Receive and validate file input
     * - Ensure a file was uploaded
     * - Reject request early if missing
     */
    const file = req.file
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    /**
     * STEP 2: Extract metadata from the uploaded file
     * - EXIF data (timestamp, GPS, camera, etc.)
     * - This should be isolated to a helper in the future
     */
    const metadata = await extractMetadata(file.path)

    /**
     * STEP 3: Resolve location
     * - Prefer GPS data from metadata if available
     * - Fallback to user-provided location input
     * - Create or reuse a Location record
     */
    const location = await resolveLocation({
      userId: "stub-user-id",
      latitude: metadata.latitude,
      longitude: metadata.longitude,
      manualLocation: req.body?.location,
    })

    /**
     * STEP 4: Upload media to Cloudinary
     * - Cloudinary returns a secure URL and public ID
     * - Storage concerns stay outside controller logic
     */
    const uploadResult = await uploadMedia(file.path)

    /**
     * STEP 5: Persist database records
     * - Create Media record
     * - Create MediaMetadata record (optional)
     * - Associate Media with Location and User
     */
    await createMediaRecords({
      userId: "stub-user-id",
      locationId: location.id,
      media: {
        type: file.mimetype.startsWith("video") ? "VIDEO" : "IMAGE",
        url: uploadResult.secure_url,
      },
      metadata: {
        capturedAt: metadata.capturedAt,
        altitude: metadata.altitude,
        camera: metadata.camera,
      },
    })

    /**
     * STEP 6: Respond with success payload
     * - Keep response lightweight
     * - Do not return full media collections
     */
    return res.status(201).json({
      success: true,
      mediaUrl: uploadResult.secure_url,
    })
  } catch (error) {
    /**
     * Centralized error handling
     * - Log error for observability
     * - Return safe, generic error to client
     */
    console.error("Media upload failed:", error)

    return res.status(500).json({
      error: "Failed to upload media",
    })
  }
}
