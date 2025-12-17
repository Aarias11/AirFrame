import express from "express"
import cors from "cors"
import mediaRoutes from "./routes/media.routes.js"

export const app = express()

app.use(cors())
app.use(express.json())

// Endpoints
app.use("/media", mediaRoutes)