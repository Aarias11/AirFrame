

import type { Request, Response } from "express"
import { getLocationPreview } from "../core/services/locationPreview.service.js"

/**
 * Map Preview Controller
 *
 * Responsibilities:
 * - Authenticate user
 * - Validate locationId param
 * - Delegate preview reads to locationPreview service
 *
 * This controller does NOT:
 * - Perform mutations
 * - Fetch full media collections
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