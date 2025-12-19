"use client"

import { useEffect, useState } from "react"
import {
  fetchMapMarkers,
  fetchLocationPreview,
  type MapMarker,
  type LocationPreview,
} from "@/lib/api/map"

/**
 * useMap
 * -----------------------------------
 * Owns all Map data + state:
 * - markers
 * - selected location
 * - preview data
 * - loading + error states
 *
 * UI components subscribe to this hook.
 */
export function useMap() {
  const [markers, setMarkers] = useState<MapMarker[]>([])
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  )
  const [preview, setPreview] = useState<LocationPreview | null>(null)

  const [isLoadingMarkers, setIsLoadingMarkers] = useState(true)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Load map markers on mount
   */
  useEffect(() => {
    let isMounted = true

    async function loadMarkers() {
      try {
        setIsLoadingMarkers(true)
        const data = await fetchMapMarkers()
        if (isMounted) {
          setMarkers(data)
          setError(null)
        }
      } catch (err) {
        console.error(err)
        if (isMounted) {
          setError("Failed to load map markers")
        }
      } finally {
        if (isMounted) {
          setIsLoadingMarkers(false)
        }
      }
    }

    loadMarkers()

    return () => {
      isMounted = false
    }
  }, [])

  /**
   * Load preview data when a location is selected
   */
  useEffect(() => {
    setPreview(null)

    if (!selectedLocationId) {
      return
    }

    let isMounted = true

    async function loadPreview() {
      try {
        setIsLoadingPreview(true)
        const data = await fetchLocationPreview(selectedLocationId)
        if (isMounted) {
          setPreview(data)
          setError(null)
        }
      } catch (err) {
        console.error(err)
        if (isMounted) {
          setError("Failed to load location preview")
        }
      } finally {
        if (isMounted) {
          setIsLoadingPreview(false)
        }
      }
    }

    loadPreview()

    return () => {
      isMounted = false
    }
  }, [selectedLocationId])

  async function retryMarkers() {
    try {
      setError(null)
      setIsLoadingMarkers(true)
      const data = await fetchMapMarkers()
      setMarkers(data)
    } catch (err) {
      console.error(err)
      setError("Failed to load map markers")
    } finally {
      setIsLoadingMarkers(false)
    }
  }

  async function refreshMarkers() {
    await retryMarkers()
  }

  async function refreshPreview(locationId: string) {
    try {
      setIsLoadingPreview(true)
      const data = await fetchLocationPreview(locationId)
      setPreview(data)
      setError(null)
    } catch (err) {
      console.error(err)
      setError("Failed to refresh location preview")
    } finally {
      setIsLoadingPreview(false)
    }
  }

  /**
   * Public API exposed to UI
   */
  return {
    markers,
    preview,

    isLoadingMarkers,
    isLoadingPreview,
    error,

    selectLocation: setSelectedLocationId,
    clearSelection: () => setSelectedLocationId(null),
    retryMarkers,
    refreshMarkers,
    refreshPreview,
  }
}


