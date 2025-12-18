import type { Request, Response } from "express"
import {
  getUserLocations,
  updateLocation,
} from "../core/services/resolveLocation.js"

interface AuthenticatedRequest extends Request {
  user?: {
    id: string
  }
}

/**
 * GET /locations
 * Used by the map layer to fetch all locations for the authenticated user.
 * Returns lightweight data only (no media).
 */
export async function getLocations(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const locations = await getUserLocations(userId)
    return res.status(200).json(locations)
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch locations" })
  }
}

/**
 * PATCH /locations/:id
 * Allows a user to edit an existing location.
 * Confirmed update model: UI should update only after this succeeds.
 */
export async function patchLocation(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const locationId = req.params.id

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    if (!locationId) {
      return res.status(400).json({ error: "locationId is required" })
    }

    const { latitude, longitude, name } = req.body

    const updatedLocation = await updateLocation({
      userId,
      locationId,
      latitude,
      longitude,
      name,
    })

    return res.status(200).json(updatedLocation)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}
