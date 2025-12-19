"use client"

import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useMap } from "@/hooks/useMap"

export default function MapPage() {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const markerRefs = useRef<mapboxgl.Marker[]>([])

  const { markers, selectLocation } = useMap()

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
      el.style.width = "10px"
      el.style.height = "10px"
      el.style.borderRadius = "50%"
      el.style.background = "#000"
      el.style.cursor = "pointer"

      el.addEventListener("click", () => {
        selectLocation(marker.locationId)
      })

      const mapMarker = new mapboxgl.Marker(el)
        .setLngLat([marker.longitude, marker.latitude])
        .addTo(mapRef.current!)

      markerRefs.current.push(mapMarker)
    })
  }, [markers, selectLocation])

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
      }}
    />
  )
}