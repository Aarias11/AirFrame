"use client"

import { useEffect, useState } from "react"
import {
  fetchLibraryMedia,
  type LibraryMediaItem,
} from "@/lib/api/library"

/**
 * useLibrary
 * -----------------------------------
 * Owns all Library data + state:
 * - media items
 * - pagination
 * - filtering by location
 * - loading + error states
 *
 * UI layers subscribe to this hook.
 */
export function useLibrary(params: {
  locationId?: string
  pageSize?: number
}) {
  const { locationId, pageSize = 24 } = params

  const [media, setMedia] = useState<LibraryMediaItem[]>([])
  const [page, setPage] = useState(1)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch media when page or filters change
   */
  useEffect(() => {
    let isMounted = true

    async function loadMedia() {
      try {
        setIsLoading(true)

        const data = await fetchLibraryMedia({
          page,
          pageSize,
          locationId,
        })

        if (isMounted) {
          setMedia(data)
        }
      } catch (err) {
        console.error(err)
        if (isMounted) {
          setError("Failed to load library media")
          setMedia([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadMedia()

    return () => {
      isMounted = false
    }
  }, [page, pageSize, locationId])

  /**
   * Reset pagination when filter changes
   */
  useEffect(() => {
    setPage(1)
  }, [locationId])

  /**
   * Public API exposed to UI
   */
  return {
    media,
    page,
    setPage,

    isLoading,
    error,
  }
}
