import React, { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

const shimmer =
  "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent"

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
  city?: string | null
  accuracyMeters?: number | null
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
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose()
      }
    }

    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("mousedown", handleClickOutside)

    containerRef.current?.focus()

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  const hasMedia = data.media.length > 0


  return (
    <AnimatePresence>
      <motion.aside
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-preview-title"
        tabIndex={-1}
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="absolute bottom-6  z-20 w-[420px]  overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
      >
        {/* Hero Section */}
        {isLoading ? (
          <div className={`h-48 w-full bg-neutral-100 ${shimmer}`} />
        ) : !error && hasMedia ? (
          <div className="relative h-48 w-full overflow-hidden">
            <div className="h-full w-full">
              <img
                src={data.media[0].thumbnailUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        ) : null}

        {/* Header */}
        <div className="relative px-5 pt-5 py-4">
          <div className="space-y-1">
            <h3
              id="location-preview-title"
              className="text-lg font-semibold tracking-tight text-neutral-900"
            >
              {data.name ?? "Unnamed Location"}
            </h3>
            <p className="text-xs text-neutral-500">
              {new Date(data.capturedAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close location preview"
            className="absolute right-4 top-4 rounded-full p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-300"
          >
            ✕
          </button>
        </div>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-5 pb-3 text-xs">
          <span className="font-medium text-neutral-700">
            {data.city ?? "Unknown location"}
          </span>

          {data.accuracyMeters != null && (
            <span className="rounded-full border border-neutral-200 bg-white px-2 py-[2px] text-[11px] text-neutral-500">
              ±{data.accuracyMeters}m accuracy
            </span>
          )}

          <span className="text-neutral-400">
            {data.latitude.toFixed(4)}, {data.longitude.toFixed(4)}
          </span>

          <span className="text-neutral-400">•</span>

          <span className="text-neutral-500">
            {data.media.length} media
          </span>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-neutral-200" />

        {/* Body */}
        <div className="px-5 py-4">
          {/* Loading */}
          {isLoading && (
            <div className="space-y-4">
              {/* Title skeleton */}
              <div className={`h-4 w-1/2 rounded-md bg-neutral-100 ${shimmer}`} />

              {/* Date skeleton */}
              <div className={`h-3 w-1/3 rounded-md bg-neutral-100 ${shimmer}`} />

              {/* Media grid skeleton */}
              <div className="grid grid-cols-4 gap-3 pt-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg bg-neutral-100 ${shimmer}`}
                  />
                ))}
              </div>
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
            <div className="grid grid-cols-4 grid-rows-2 gap-2">
              {data.media.slice(1, 5).map((item, i) => (
                <div
                  key={item.id}
                  className={`overflow-hidden rounded-xl bg-neutral-100 ${
                    i === 0 ? "col-span-2 row-span-2" : "aspect-square"
                  }`}
                >
                  <img
                    src={item.thumbnailUrl}
                    alt=""
                    className="h-full w-full object-cover transition hover:scale-[1.03]"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50/60 px-5 py-4 backdrop-blur-sm">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-neutral-700">
              {data.media.length} item{data.media.length !== 1 ? "s" : ""}
            </span>
            <span className="text-[11px] text-neutral-400">
              Captured media at this location
            </span>
          </div>

          <button
            disabled={isLoading || !!error || !hasMedia}
            aria-disabled={isLoading || !!error || !hasMedia}
            onClick={() => onOpenLibrary(data.locationId)}
            className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            Open Library
            <span aria-hidden className="text-sm">→</span>
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  )
}
