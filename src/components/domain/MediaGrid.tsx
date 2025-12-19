import React from "react"

export type MediaGridItem = {
  id: string
  type: "IMAGE" | "VIDEO"
  thumbnailUrl: string
  capturedAt?: string
}

type MediaGridProps = {
  items: MediaGridItem[]
  onSelect?: (id: string) => void
}

/**
 * MediaGrid
 *
 * Pure domain UI component.
 *
 * Responsibilities:
 * - Render a grid of media thumbnails
 * - Emit selection events (optional)
 *
 * Does NOT:
 * - Fetch data
 * - Filter data
 * - Know about routing or locations
 */
export default function MediaGrid({ items, onSelect }: MediaGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-neutral-500">
        No media to display
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect?.(item.id)}
          className="group relative aspect-square overflow-hidden rounded-md bg-neutral-100"
        >
          <img
            src={item.thumbnailUrl}
            alt=""
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />

          {item.type === "VIDEO" && (
            <div className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white">
              VIDEO
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
