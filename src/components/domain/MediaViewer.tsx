import React from "react"

export type MediaViewerItem = {
  id: string
  type: "IMAGE" | "VIDEO"
  url: string
  capturedAt?: string
}

type MediaViewerProps = {
  item: MediaViewerItem
  onClose: () => void
}

/**
 * MediaViewer
 *
 * Pure domain UI component.
 *
 * Responsibilities:
 * - Display a single media item at full resolution
 * - Provide a clear exit action
 *
 * Does NOT:
 * - Fetch data
 * - Handle routing
 * - Know about collections or locations
 */
export default function MediaViewer({ item, onClose }: MediaViewerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      {/* Overlay */}
      <button
        className="absolute inset-0 cursor-default"
        aria-label="Close media viewer"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative z-10 max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg bg-black">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-20 rounded-full bg-black/70 px-2 py-1 text-xs text-white hover:bg-black"
        >
          ✕
        </button>

        {/* Media */}
        {item.type === "IMAGE" ? (
          <img
            src={item.url}
            alt=""
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        ) : (
          <video
            src={item.url}
            controls
            autoPlay
            className="max-h-[90vh] max-w-[90vw]"
          />
        )}

        {/* Metadata */}
        {item.capturedAt && (
          <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-[10px] text-white">
            {new Date(item.capturedAt).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  )
}
