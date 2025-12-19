/****
 * Map API
 * -------------------------
 * Frontend contract for Map-related backend endpoints.
 * This layer:
 * - Knows backend URLs
 * - Handles HTTP + errors
 * - Returns typed data
 * - Does NOT contain UI or state logic
 */

import { apiClient } from "./client"

export type MapMarker = {
  locationId: string
  latitude: number
  longitude: number
  mediaCount: number
}

export type LocationPreviewMedia = {
  id: string
  type: "IMAGE" | "VIDEO"
  thumbnailUrl: string
}

export type LocationPreview = {
  locationId: string
  name: string | null
  latitude: number
  longitude: number
  capturedAt: string
  media: LocationPreviewMedia[]
}

/**
 * Fetch lightweight marker data for the map.
 * GET /map/markers
 */
export async function fetchMapMarkers(): Promise<MapMarker[]> {
  return apiClient<MapMarker[]>("/map/markers")
}

/**
 * Fetch preview data for a single location tooltip.
 * GET /map/location/:locationId
 */
export async function fetchLocationPreview(
  locationId: string
): Promise<LocationPreview> {
  return apiClient<LocationPreview>(`/map/location/${locationId}`)
}