"use client"

import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

/**
 * MapCanvas
 * -----------------------------------
 * Low-level Mapbox GL JS canvas.
 *
 * Responsibilities:
 * - Initialize Mapbox map
 * - Own Mapbox lifecycle (mount / unmount)
 *
 * Explicitly does NOT:
 * - Fetch data
 * - Manage markers
 * - Handle UI overlays
 */

export type MapMarker = {
  locationId: string
  latitude: number
  longitude: number
}

const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

if (!token) {
  console.error("❌ Mapbox token is missing. Check NEXT_PUBLIC_MAPBOX_TOKEN.")
}

mapboxgl.accessToken = token as string

type MapCanvasProps = {
  markers: MapMarker[]
  onSelectLocation: (locationId: string) => void
}

export default function MapCanvas({ markers, onSelectLocation }: MapCanvasProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markerRefs = useRef<mapboxgl.Marker[]>([])
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!mapContainerRef.current || initializedRef.current) return

    initializedRef.current = true

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-98.5795, 39.8283], // USA center
      zoom: 5, // zoomed in more by default

      pitch: 0,   // force flat 2D
      bearing: 0, // north-up, no rotation
    })

    // Disable any rotation / tilt gestures
    mapRef.current.dragRotate.disable()
    mapRef.current.touchZoomRotate.disableRotation()

    return () => {
      // IMPORTANT:
      // Do not remove the map here.
      // React StrictMode mounts/unmounts once in dev,
      // which would destroy the map immediately.
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return

    // Clear existing markers
    markerRefs.current.forEach((marker) => marker.remove())
    markerRefs.current = []

    markers.forEach((marker) => {
      const el = document.createElement("div")
      el.className = "h-3 w-3 rounded-full bg-black cursor-pointer"

      el.addEventListener("click", () => {
        onSelectLocation(marker.locationId)
      })

      const mapboxMarker = new mapboxgl.Marker(el)
        .setLngLat([marker.longitude, marker.latitude])
        .addTo(mapRef.current!)

      markerRefs.current.push(mapboxMarker)
    })
  }, [markers, onSelectLocation])

  return (
    <div
    ref={mapContainerRef}
    id="map-canvas"
    className="absolute inset-0"
  />
  )
}
