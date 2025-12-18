import type { Request, Response } from "express"
import { getMapLocations } from "../core/services/map.service.js"

/**
 * Map controller
 *
 * Responsibilities:
 * - Authenticate user
 * - Delegate map reads to map service
 * - Return marker-ready data
 *
 * This controller does NOT:
 * - Perform mutations
 * - Fetch media payloads
 */
export async function getMapLocationsController(
  req: Request,
  res: Response
) {
  try {
    const user = req.user as { id: string } | undefined

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const locations = await getMapLocations(user.id)
    return res.json(locations)
  } catch (error) {
    console.error("Failed to fetch map locations:", error)
    return res.status(500).json({ error: "Failed to fetch map locations" })
  }
}
