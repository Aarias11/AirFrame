import { apiClient } from "./client"

export type LibraryMediaItem = {
  id: string
  type: "IMAGE" | "VIDEO"
  thumbnailUrl: string
  locationId: string
  capturedAt: string
}

export type FetchLibraryParams = {
  locationId?: string
  type?: "IMAGE" | "VIDEO"
  page?: number
  pageSize?: number
}

/**
 * Fetch paginated library media for the authenticated user.
 *
 * Backend:
 * GET /library
 */
export async function fetchLibraryMedia(
  params: FetchLibraryParams
): Promise<LibraryMediaItem[]> {
  const query = new URLSearchParams()

  if (params.locationId) query.set("locationId", params.locationId)
  if (params.type) query.set("type", params.type)
  if (params.page) query.set("page", String(params.page))
  if (params.pageSize) query.set("pageSize", String(params.pageSize))

  const qs = query.toString()
  const path = qs ? `/library?${qs}` : "/library"

  return apiClient<LibraryMediaItem[]>(path)
}
