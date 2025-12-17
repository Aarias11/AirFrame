import { prisma } from "../../data/db/prisma.js"

interface ResolveLocationInput {
  userId: string
  latitude?: number | undefined
  longitude?: number | undefined
  manualLocation?: {
    latitude: number
    longitude: number
    name?: string
  }
}

/**
 * Determines which Location to associate with media.
 * Prefers GPS metadata, falls back to manual input.
 */
export async function resolveLocation(
  input: ResolveLocationInput
) {
  const { userId, latitude, longitude, manualLocation } = input

  const resolvedLat = latitude ?? manualLocation?.latitude
  const resolvedLng = longitude ?? manualLocation?.longitude

  if (resolvedLat == null || resolvedLng == null) {
    throw new Error("Location data missing")
  }

  // For v1: always create a new location
  // (deduplication can come later)
  return prisma.location.create({
    data: {
      userId,
      latitude: resolvedLat,
      longitude: resolvedLng,
      name: manualLocation?.name,
    },
  })
}