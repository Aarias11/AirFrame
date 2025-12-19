import type { Request, Response } from "express"

/**
 * GET /auth/session
 * Returns the currently authenticated user, if any.
 */
export function getSessionController(req: Request, res: Response) {
  if (!req.user) {
    return res.status(200).json({ user: null })
  }

  const user = req.user as {
    id: string
    email?: string
  }

  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
    },
  })
}

/**
 * POST /auth/logout
 * Destroys the current session.
 */
export function logoutController(req: Request, res: Response) {
  req.logout(() => {
    req.session?.destroy(() => {
      res.status(200).json({ success: true })
    })
  })
}
