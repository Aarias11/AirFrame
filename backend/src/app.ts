import express from "express"
import cors from "cors"
import passport from "passport"
import session from "express-session"
import "./lib/googleAuth.js"
import authRoutes from "./routes/auth.routes.js"
import mediaRoutes from "./routes/media.routes.js"
import locationRoutes from "./routes/locations.routes.js"
import mapRoutes from "./routes/map.routes.js"
import libraryRoutes from "./routes/library.routes.js"
import uploadRoutes from "./routes/upload.routes.js"
export const app = express()

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
)
app.use(express.json())
app.use(
  session({
    name: "airframe.sid",
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    },
  })
)
app.use(passport.initialize())
app.use(passport.session())

// Endpoints
app.use("/auth", authRoutes)
app.use("/media", mediaRoutes)
app.use("/locations", locationRoutes)
app.use("/map", mapRoutes)
app.use("/library", libraryRoutes)
app.use("/upload", uploadRoutes)