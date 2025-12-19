import express from "express"
import passport from "passport"
import {
  getSessionController,
  logoutController,
} from "../controllers/auth.controller.js"

const router = express.Router()

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
)

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: true,
    failureRedirect: "/auth/failure",
  }),
  (req, res) => {
    // Successful login or signup → redirect to frontend Map page
    res.redirect(`${process.env.FRONTEND_URL}/map`)
  }
)

router.get("/session", getSessionController)
router.post("/logout", logoutController)

export default router