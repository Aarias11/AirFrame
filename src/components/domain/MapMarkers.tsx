"use client"

import type { MapMarker } from "@/types/map"

type MapMarkersProps = {
  markers: MapMarker[]
  selectedLocationId: string | null
  onSelectLocation: (locationId: string) => void
}

/**
 * MapMarkers
 *
 * Domain component responsible for rendering location markers.
 * - Receives lightweight marker read model
 * - Manages visual selection state only
 * - Emits selection events upward
 *
 * Does NOT:
 * - Fetch data
 * - Render previews
 * - Control navigation
 */
export default function MapMarkers({
  markers,
  selectedLocationId,
  onSelectLocation,
}: MapMarkersProps) {
  return (
    <div className="absolute inset-0">
      {markers.map((marker) => {
        const isSelected = marker.locationId === selectedLocationId

        return (
          <button
            key={marker.locationId}
            type="button"
            onClick={() => onSelectLocation(marker.locationId)}
            className={`absolute rounded-full transition-all
              ${isSelected ? "bg-blue-600 scale-110" : "bg-blue-500"}
            `}
            style={{
              left: `${marker.x}px`,
              top: `${marker.y}px`,
              width: 12,
              height: 12,
            }}
            aria-label="Map marker"
          />
        )
      })}
    </div>
  )
}





