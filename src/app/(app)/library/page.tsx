"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import MediaGrid from "@/components/domain/MediaGrid"
import MediaViewer, {
  MediaViewerItem,
} from "@/components/domain/MediaViewer"
import { useLibrary } from "@/hooks/useLibrary"

/**
 * Library Page
 *
 * Responsibilities:
 * - Read routing state (locationId)
 * - Orchestrate Library UI
 * - Delegate all data + pagination to useLibrary
 */
export default function LibraryPage() {
  const searchParams = useSearchParams()
  const locationId = searchParams.get("locationId") ?? undefined

  const pageSize = 24
  const { media, page, setPage, isLoading, error } = useLibrary({
    locationId,
    pageSize,
  })

  // UX: can go to next page if we filled this page
  const canNext = media.length === pageSize

  const [selectedMedia, setSelectedMedia] =
    useState<MediaViewerItem | null>(null)

  const hasAnyMedia = media.length > 0

  // Client-side grouping / filtering (presentation only)
  const filteredMedia = useMemo(() => {
    if (!locationId) return media
    return media.filter((item) => item.locationId === locationId)
  }, [media, locationId])

  const hasFilteredMedia = filteredMedia.length > 0

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      {/* Header */}
      <header>
        <h1 className="text-lg font-semibold text-neutral-900">
          Library
        </h1>
        {locationId && (
          <p className="text-sm text-neutral-500">
            Showing media for location:{" "}
            <span className="font-mono">{locationId}</span>
          </p>
        )}
      </header>

      {/* Content */}
      <section className="flex-1 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-6">
        {isLoading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-md bg-neutral-200"
              />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded p-2">
            <span className="text-sm text-red-600">{error}</span>
            <button
              className="ml-2 rounded border px-2 py-1 text-xs bg-white hover:bg-red-100 border-red-300 text-red-700"
              onClick={() => setPage((p) => p)}
              type="button"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !hasAnyMedia && (
          <p className="text-sm text-neutral-500">
            No media yet. Upload your first flight to see it here.
          </p>
        )}

        {!isLoading &&
          hasAnyMedia &&
          locationId &&
          !hasFilteredMedia && (
            <p className="text-sm text-neutral-500">
              No media for this location yet.
            </p>
          )}

        {!isLoading && hasFilteredMedia && (
          <>
            <MediaGrid
              items={filteredMedia}
              onSelect={(id) => {
                const item = filteredMedia.find(
                  (m) => m.id === id
                )
                if (item) {
                  setSelectedMedia({
                    id: item.id,
                    type: item.type,
                    url: item.thumbnailUrl,
                  })
                }
              }}
            />

            <div className="mt-6 flex items-center justify-between">
              <button
                disabled={isLoading || page === 1}
                onClick={() =>
                  setPage((p) => Math.max(1, p - 1))
                }
                className="rounded border px-3 py-1 text-sm disabled:opacity-40"
                type="button"
              >
                Previous
              </button>

              <span className="text-sm text-neutral-500">
                Page {page}
              </span>

              <button
                disabled={isLoading || !canNext}
                onClick={() => setPage((p) => p + 1)}
                className="rounded border px-3 py-1 text-sm disabled:opacity-40"
                type="button"
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>

      {selectedMedia && (
        <MediaViewer
          item={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </div>
  )
}