import type { ReactNode } from "react"
import MapCanvas from "@/components/map/MapCanvas"

/**
 * MapLayout
 *
 * Structural layout for the primary map experience.
 * - Owns spatial canvas boundaries
 * - Provides anchor points for floating UI (previews, controls)
 * - Does NOT fetch data
 * - Does NOT render markers directly
 */
type MapLayoutProps = {
  children?: ReactNode
  markers: any[]
  onSelectLocation: (locationId: string) => void
}

export default function MapLayout({
  children,
  markers = [],
  onSelectLocation,
}: MapLayoutProps) {
  return (
    <div className="relative h-screen w-full">
      {/* Map Canvas */}
      <MapCanvas
        markers={markers}
        onSelectLocation={onSelectLocation}
      />

      {/* Floating UI Layer */}
      <div className="pointer-events-none absolute inset-0">
        <div className="pointer-events-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
