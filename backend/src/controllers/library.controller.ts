import type { Request, Response } from "express"
import { getLibraryMedia } from "../core/services/library.service.js"

/**
 * Library Controller
 *
 * Responsibilities:
 * - Enforce authentication
 * - Parse and validate query params
 * - Delegate reads to library service
 *
 * This controller does NOT:
 * - Perform mutations
 * - Contain business logic
 */
export async function getLibraryMediaController(
  req: Request,
  res: Response
) {
  try {
    const user = req.user as { id: string } | undefined

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const {
      locationId,
      type,
      page = "1",
      pageSize = "25",
    } = req.query as {
      locationId?: string
      type?: "IMAGE" | "VIDEO"
      page?: string
      pageSize?: string
    }

    const data = await getLibraryMedia({
      userId: user.id,
      page: Number(page),
      pageSize: Number(pageSize),
      ...(locationId ? { locationId } : {}),
      ...(type ? { type } : {}),
    })

    return res.json(data)
  } catch (error) {
    console.error("Failed to fetch library media:", error)
    return res.status(500).json({ error: "Failed to fetch library media" })
  }
}