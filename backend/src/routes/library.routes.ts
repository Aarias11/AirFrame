import { Router } from "express"
import { getLibraryMediaController } from "../controllers/library.controller.js"

/**
 * Library Routes
 *
 * Purpose:
 * - Expose private library browsing endpoints
 * - Grouped-by-location media reads
 */
const router = Router()

/**
 * GET /library/media
 * Returns media grouped by location for the authenticated user.
 *
 * Query params:
 * - locationId (optional)
 * - type (IMAGE | VIDEO)
 * - page (default: 1)
 * - pageSize (default: 25)
 */
router.get("/media", getLibraryMediaController)

export default router
