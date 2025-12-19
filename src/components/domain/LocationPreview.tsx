import React from "react"

export type PreviewMediaItem = {
  id: string
  thumbnailUrl: string
  type: "IMAGE" | "VIDEO"
}

export type LocationPreviewData = {
  locationId: string
  name?: string | null
  capturedAt: string
  latitude: number
  longitude: number
  media: PreviewMediaItem[]
}

type LocationPreviewProps = {
  data: LocationPreviewData
  isLoading?: boolean
  error?: string | null
  onClose: () => void
  onOpenLibrary: (locationId: string) => void
}

/**
 * LocationPreview
 *
 * UX principles:
 * - Never blocks the map
 * - Communicates loading vs empty vs ready
 * - Safe actions only when data is usable
 */
export default function LocationPreview({
  data,
  isLoading = false,
  error = null,
  onClose,
  onOpenLibrary,
}: LocationPreviewProps) {
  const hasMedia = data.media.length > 0

  return (
    <aside className="absolute bottom-6 left-6 z-20 w-[360px] rounded-xl border border-neutral-200 bg-white shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between border-b px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">
            {data.name ?? "Unnamed Location"}
          </h3>
          <p className="text-xs text-neutral-500">
            {new Date(data.capturedAt).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-xs text-neutral-400 hover:text-neutral-600"
          aria-label="Close preview"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-md bg-neutral-200"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <p className="text-sm text-red-600">
            Failed to load preview.
          </p>
        )}

        {/* Empty */}
        {!isLoading && !error && !hasMedia && (
          <p className="text-sm text-neutral-500">
            No media captured at this location yet.
          </p>
        )}

        {/* Media grid */}
        {!isLoading && !error && hasMedia && (
          <div className="grid grid-cols-4 gap-2">
            {data.media.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="aspect-square overflow-hidden rounded-md bg-neutral-100"
              >
                <img
                  src={item.thumbnailUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t px-4 py-3">
        <span className="text-xs text-neutral-500">
          {data.media.length} item{data.media.length !== 1 ? "s" : ""}
        </span>

        <button
          disabled={isLoading || !!error || !hasMedia}
          onClick={() => onOpenLibrary(data.locationId)}
          className="text-xs font-medium text-blue-600 hover:underline disabled:cursor-not-allowed disabled:text-neutral-400"
        >
          View in Library →
        </button>
      </div>
    </aside>
  )
}
