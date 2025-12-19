import { useEffect, useState } from "react"

export type MapMarker = {
  locationId: string
  latitude: number
  longitude: number
  mediaCount: number
  capturedAt: string
}

type UseMapMarkersState = {
  data: MapMarker[] | null
  isLoading: boolean
  error: string | null
}

/**
 * useMapMarkers
 *
 * Fetches lightweight marker data for the map.
 * This hook is intentionally minimal and fast:
 * - no media payloads
 * - no thumbnails
 * - no heavy joins
 *
 * Backend endpoint:
 * GET /map/markers
 */
export function useMapMarkers() {
  const [state, setState] = useState<UseMapMarkersState>({
    data: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    let isMounted = true

    async function fetchMarkers() {
      try {
        const res = await fetch("http://localhost:4000/map/markers", {
          credentials: "include",
        })

        if (!res.ok) {
          throw new Error("Failed to fetch map markers")
        }

        const data: MapMarker[] = await res.json()

        if (isMounted) {
          setState({
            data,
            isLoading: false,
            error: null,
          })
        }
      } catch (err) {
        if (isMounted) {
          setState({
            data: null,
            isLoading: false,
            error: err instanceof Error ? err.message : "Unknown error",
          })
        }
      }
    }

    fetchMarkers()

    return () => {
      isMounted = false
    }
  }, [])

  return state
}
