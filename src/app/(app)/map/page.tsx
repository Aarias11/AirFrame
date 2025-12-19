"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import LocationPreview from "@/components/domain/LocationPreview"

export default function MapPage() {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const markerRefs = useRef<mapboxgl.Marker[]>([])

  const [selectedMarker, setSelectedMarker] = useState<{
    locationId: string
    latitude: number
    longitude: number
  } | null>(null)

  const markers = [
    {
      locationId: "loc_sf",
      latitude: 37.7749,
      longitude: -122.4194,
    },
    {
      locationId: "loc_ny",
      latitude: 40.7128,
      longitude: -74.006,
    },
  ]

  function selectLocation(marker: {
    locationId: string
    latitude: number
    longitude: number
  }) {
    setSelectedMarker(marker)
  }

  // Initialize map ONCE
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    mapboxgl.accessToken =
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-98.5795, 39.8283],
      zoom: 4,
      pitch: 0,
      bearing: 0,
      antialias: false,
      projection: "mercator",
    })

    mapRef.current.setPitch(0)
    mapRef.current.setBearing(0)

    mapRef.current.dragRotate.disable()
    mapRef.current.touchZoomRotate.disableRotation()

    mapRef.current.on("load", () => {
      mapRef.current?.setPitch(0)
    })
  }, [])

  // Render markers when data changes
  useEffect(() => {
    if (!mapRef.current) return

    // Clear existing markers
    markerRefs.current.forEach((m) => m.remove())
    markerRefs.current = []

    markers.forEach((marker) => {
      const el = document.createElement("div")
      el.style.width = "12px"
      el.style.height = "12px"
      el.style.borderRadius = "50%"
      el.style.background = "#f97316" // orange-500
      el.style.cursor = "pointer"
      el.style.boxShadow = "0 0 8px rgba(249, 115, 22, 0.8), 0 0 16px rgba(249, 115, 22, 0.6)"
      el.style.border = "1px solid rgba(200, 148, 106, 0.6)"

      el.addEventListener("click", () => {
        selectLocation(marker)

        mapRef.current?.flyTo({
          center: [marker.longitude, marker.latitude],
          zoom: 8,
          speed: 1.2,
          curve: 1.4,
          essential: true,
        })
      })

      const mapMarker = new mapboxgl.Marker(el)
        .setLngLat([marker.longitude, marker.latitude])
        .addTo(mapRef.current!)

      markerRefs.current.push(mapMarker)
    })
  }, [markers, selectLocation])

  return (
    <>
      <div
        ref={containerRef}
        style={{
          width: "100vw",
          height: "100vh",
        }}
      />

      {selectedMarker && (
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 w-[90%] max-w-md -translate-x-1/2">
          <div className="pointer-events-auto">
            <LocationPreview
              data={{
                locationId: selectedMarker.locationId,
                name: "Captured Location",
                capturedAt: new Date().toISOString(),
                latitude: selectedMarker.latitude,
                longitude: selectedMarker.longitude,
                media: [],
              }}
              onClose={() => setSelectedMarker(null)}
              onOpenLibrary={() => {}}
            />
          </div>
        </div>
      )}
    </>
  )
}