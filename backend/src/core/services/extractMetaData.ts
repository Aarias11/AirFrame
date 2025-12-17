import exifr from "exifr"

export interface ExtractedMetadata {
  latitude?: number | undefined
  longitude?: number | undefined
  altitude?: number | undefined
  capturedAt?: Date | undefined
  camera?: string | undefined
}

/**
 * Extracts EXIF metadata from an uploaded media file.
 * This function does NOT assume GPS data exists.
 */
export async function extractMetadata(
  filePath: string
): Promise<ExtractedMetadata> {
  try {
    const data = await exifr.parse(filePath, {
      gps: true,
      exif: true,
    })

    if (!data) return {}

    return {
      latitude: data.latitude,
      longitude: data.longitude,
      altitude: data.altitude,
      capturedAt: data.DateTimeOriginal
        ? new Date(data.DateTimeOriginal)
        : undefined,
      camera: data.Model,
    }
  } catch (error) {
    // Metadata failure should not crash upload
    console.warn("Metadata extraction failed:", error)
    return {}
  }
}