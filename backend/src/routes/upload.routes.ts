import { Router } from "express"
import multer from "multer"
import { uploadMediaController } from "../controllers/upload.controller.js"

/**
 * Upload Routes
 *
 * Purpose:
 * - Handle authenticated media uploads
 * - Delegate all write logic to the upload controller
 */
const router = Router()

// Use disk storage for v1 (Cloudinary handled earlier in middleware if present)
const upload = multer({ dest: "uploads/" })

/**
 * POST /upload
 * Accepts a single media file and optional manual location data.
 */
router.post("/", upload.single("file"), uploadMediaController)

export default router
