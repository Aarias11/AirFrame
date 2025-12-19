import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import prisma from "../data/db/prisma.js"

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value
        if (!email) {
          return done(new Error("No email from Google"), undefined)
        }

        const user = await prisma.user.upsert({
          where: { email },
          update: {},
          create: { email },
        })

        return done(null, user)
      } catch (error) {
        return done(error, undefined)
      }
    }
  )
)

passport.serializeUser((user: any, done) => {
  // Store only the user ID in the session
  done(null, user.id)
})

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    })
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})