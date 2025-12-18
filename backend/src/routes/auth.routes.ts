import express from "express"
import passport from "passport"

const router = express.Router()

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
)

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/failure",
  }),
  (req, res) => {
    // For now, just return the user
    res.json({ user: req.user })
  }
)

export default router