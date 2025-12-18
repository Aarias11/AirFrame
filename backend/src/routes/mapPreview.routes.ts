import { Router } from "express"
import { getLocationPreviewController } from "../controllers/mapPreview.controller.js"

/**
 * Map Preview Routes
 *
 * Purpose:
 * - Serve lightweight preview data for map tooltips
 * - Separate from marker routes to keep responsibilities clear
 */
const router = Router()

/**
 * GET /map/location/:locationId
 * Returns preview data (thumbnails + minimal metadata) for a single location.
 */
router.get("/location/:locationId", getLocationPreviewController)

export default router
