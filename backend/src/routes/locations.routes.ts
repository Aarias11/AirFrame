import { Router } from "express"
import {
  getLocations,
  patchLocation,
} from "../controllers/locations.controller.js"

const router = Router()

/**
 * GET /locations
 * Fetch all locations for the authenticated user (map layer).
 */
router.get("/", getLocations)

/**
 * PATCH /locations/:id
 * Update an existing location owned by the user.
 */
router.patch("/:id", patchLocation)

export default router
