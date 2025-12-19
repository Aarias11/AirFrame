import express from "express"
import {
  getMapMarkersController,
  getLocationPreviewController,
} from "../controllers/map.controller.js"

const router = express.Router()

/**
 * GET /map/markers
 * Lightweight marker data for map rendering
 */
router.get("/markers", getMapMarkersController)

/**
 * GET /map/location/:locationId
 * Preview data for a single map location
 */
router.get("/location/:locationId", getLocationPreviewController)

export default router