import express from "express"
import cors from "cors"
import passport from "passport"
import "./lib/googleAuth.js"
import authRoutes from "./routes/auth.routes.js"
import mediaRoutes from "./routes/media.routes.js"
import locationRoutes from "./routes/locations.routes.js"
import mapRoutes from "./routes/map.routes.js"
import mapPreviewRoutes from "./routes/mapPreview.routes.js"
import libraryRoutes from "./routes/library.routes.js"
import uploadRoutes from "./routes/upload.routes.js"
export const app = express()

app.use(cors())
app.use(express.json())
app.use(passport.initialize())

// Endpoints
app.use("/auth", authRoutes)
app.use("/media", mediaRoutes)
app.use("/locations", locationRoutes)
app.use("/map", mapRoutes)
app.use("/map", mapPreviewRoutes)
app.use("/library", libraryRoutes)
app.use("/upload", uploadRoutes)