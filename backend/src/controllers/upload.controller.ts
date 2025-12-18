import type { Request, Response } from "express"
import { extractMetadata } from "../core/services/extractMetaData.js"
import { resolveLocation } from "../core/services/resolveLocation.js"
import { createMediaRecords } from "../core/services/createMediaRecords.js"

/**
 * POST /upload
 *
 * This endpoint is the single write entrypoint for user media.
 * It is intentionally authoritative: all downstream systems
 * (map, preview, library) derive state from this write.
 */
export async function uploadMediaController(
  req: Request,
  res: Response
) {
  try {
    const user = req.user as { id: string } | undefined
    const file = req.file

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    /**
     * 1️⃣ Extract metadata from the uploaded file (EXIF when available)
     */
    const metadata = await extractMetadata(file.path)

    /**
     * 2️⃣ Resolve location
     * Priority:
     *  - EXIF GPS (if present)
     *  - Manual user input (if provided)
     */
    const location = await resolveLocation({
      userId: user.id,
      ...(metadata.latitude !== undefined
        ? { latitude: metadata.latitude }
        : {}),
      ...(metadata.longitude !== undefined
        ? { longitude: metadata.longitude }
        : {}),
      ...(req.body?.location ? { manualLocation: req.body.location } : {}),
    })

    /**
     * 3️⃣ Persist media + metadata
     * This is the only place media records are written.
     */
    const media = await createMediaRecords({
      userId: user.id,
      locationId: location.id,
      media: {
        type: file.mimetype.startsWith("video") ? "VIDEO" : "IMAGE",
        url: file.path,
      },
      metadata: {
        ...(metadata.capturedAt ? { capturedAt: metadata.capturedAt } : {}),
        ...(metadata.altitude !== undefined ? { altitude: metadata.altitude } : {}),
        ...(metadata.camera ? { camera: metadata.camera } : {}),
      },
    })

    return res.status(201).json({
      id: media.id,
      locationId: location.id,
    })
  } catch (error) {
    console.error("Upload failed:", error)
    return res.status(500).json({ error: "Upload failed" })
  }
}
