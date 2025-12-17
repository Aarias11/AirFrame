import express from "express"
import multer from "multer"
import { uploadMediaController } from "../controllers/media.controller.js"

const router = express.Router()
const upload = multer({ dest: "tmp/" })

router.post("/upload", upload.single("file"), uploadMediaController)

export default router