import express from "express"
import { getMapLocationsController } from "../controllers/map.controller.js"

const router = express.Router()

/**
 * GET /map/locations
 * Returns lightweight marker data for the map view.
 */
router.get("/locations", getMapLocationsController)

export default router
