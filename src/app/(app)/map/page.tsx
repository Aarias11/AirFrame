"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import LocationPreview from "@/components/domain/LocationPreview"

type PreviewMediaType = "IMAGE" | "VIDEO"

type PreviewMediaItem = {
  id: string
  thumbnailUrl: string
  type: PreviewMediaType
}

export default function MapPage() {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const markerRefs = useRef<mapboxgl.Marker[]>([])

  const [selectedMarker, setSelectedMarker] = useState<{
    locationId: string
    latitude: number
    longitude: number
    media: PreviewMediaItem[]
  } | null>(null)

  const markers = [
    {
      locationId: "loc_sf",
      latitude: 37.7749,
      longitude: -122.4194,
      media: [] as PreviewMediaItem[],
    },
    {
      locationId: "loc_ny",
      latitude: 40.7128,
      longitude: -74.006,
      media: [
        {
          id: "1",
          thumbnailUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
          type: "IMAGE",
        },
        {
          id: "2",
          thumbnailUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
          type: "IMAGE",
        },
        {
          id: "3",
          thumbnailUrl: "https://images.unsplash.com/photo-1494526585095-c41746248156",
          type: "IMAGE",
        },
        {
          id: "4",
          thumbnailUrl: "https://images.unsplash.com/photo-1500534623283-312aade485b7",
          type: "IMAGE",
        },
      ] as PreviewMediaItem[],
    },
    {
      locationId: "loc_barcelona",
      latitude: 41.3851,
      longitude: 2.1734,
      media: [] as PreviewMediaItem[],
    },
  ]

  const DEFAULT_VIEW = {
    center: [-98.5795, 39.8283] as [number, number],
    zoom: 4,
  }

  function selectLocation(marker: {
    locationId: string
    latitude: number
    longitude: number
    media: PreviewMediaItem[]
  }) {
    setSelectedMarker(marker)
  }

  function zoomIn() {
    mapRef.current?.zoomIn({ duration: 300 })
  }

  function zoomOut() {
    mapRef.current?.zoomOut({ duration: 300 })
  }

  function resetView() {
    mapRef.current?.flyTo({
      center: DEFAULT_VIEW.center,
      zoom: DEFAULT_VIEW.zoom,
      pitch: 0,
      bearing: 0,
      essential: true,
    })
  }

  // Initialize map ONCE
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    mapboxgl.accessToken =
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
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

      <div className="absolute right-4 top-32 z-20 flex flex-col gap-2">
        <button
          onClick={zoomIn}
          className="rounded-md bg-[#131313] px-3 py-2 text-sm shadow hover:bg-[#131313]/90"
        >
          +
        </button>

        <button
          onClick={zoomOut}
          className="rounded-md bg-[#131313] px-3 py-2 text-sm shadow hover:bg-[#131313]/80"
        >
          −
        </button>

        <button
          onClick={resetView}
          className="rounded-md bg-[#131313] px-3 py-2 text-xs shadow hover:bg-[#131313]/80"
        >
          Reset
        </button>
      </div>

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
                media: selectedMarker.media,
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