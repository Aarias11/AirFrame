import type { Request, Response } from "express"
import {
  getMapMarkers,
  getLocationPreview,
} from "../core/services/map.service.js"

/**
 * GET /map/markers
 * Lightweight marker data for map rendering
 */
export async function getMapMarkersController(
  req: Request,
  res: Response
) {
  try {
    const user = req.user as { id: string } | undefined

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const markers = await getMapMarkers(user.id)
    return res.json(markers)
  } catch (error) {
    console.error("Failed to fetch map markers:", error)
    return res.status(500).json({ error: "Failed to fetch map markers" })
  }
}

/**
 * GET /map/location/:locationId
 * Preview data for a single location tooltip
 */
export async function getLocationPreviewController(
  req: Request,
  res: Response
) {
  try {
    const user = req.user as { id: string } | undefined
    const { locationId } = req.params

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    if (!locationId) {
      return res.status(400).json({ error: "locationId is required" })
    }

    const preview = await getLocationPreview(user.id, locationId)

    if (!preview) {
      return res.status(404).json({ error: "Location not found" })
    }

    return res.json(preview)
  } catch (error) {
    console.error("Failed to fetch location preview:", error)
    return res.status(500).json({ error: "Failed to fetch location preview" })
  }
}