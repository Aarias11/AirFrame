import prisma from "../../data/db/prisma.js"

interface ResolveLocationInput {
  userId: string
  latitude?: number
  longitude?: number
  manualLocation?: {
    latitude: number
    longitude: number
    name?: string
  }
}

/**
 * Resolve and create a Location for a media upload.
 * v1 rule: every upload creates its own Location (no deduplication).
 */
export async function resolveLocation(input: ResolveLocationInput) {
  const { userId, latitude, longitude, manualLocation } = input

  const resolvedLat = latitude ?? manualLocation?.latitude
  const resolvedLng = longitude ?? manualLocation?.longitude

  if (resolvedLat == null || resolvedLng == null) {
    throw new Error("Location data missing")
  }

  return prisma.location.create({
    data: {
      userId,
      latitude: resolvedLat,
      longitude: resolvedLng,
      name: manualLocation?.name ?? null,
    },
  })
}

/**
 * Fetch lightweight location summaries for the map layer.
 * Explicitly excludes media to keep map rendering fast.
 */
export async function getUserLocations(userId: string) {
  return prisma.location.findMany({
    where: { userId },
    select: {
      id: true,
      latitude: true,
      longitude: true,
      name: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  })
}

/**
 * Update an existing location owned by the user.
 * Confirmed update model: DB write must succeed before UI updates.
 */
export async function updateLocation(params: {
  userId: string
  locationId: string
  latitude?: number
  longitude?: number
  name?: string | null
}) {
  const { userId, locationId, latitude, longitude, name } = params

  const existing = await prisma.location.findFirst({
    where: { id: locationId, userId },
  })

  if (!existing) {
    throw new Error("Location not found or not owned by user")
  }

  return prisma.location.update({
    where: { id: locationId },
    data: {
      latitude: latitude ?? existing.latitude,
      longitude: longitude ?? existing.longitude,
      name: name ?? existing.name,
    },
  })
}