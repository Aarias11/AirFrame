import prisma from "../../data/db/prisma.js"

/**
 * Map read model service.
 *
 * Purpose:
 * - Provide marker-ready data for the map
 * - Optimized for read performance
 * - Explicitly avoids heavy joins (media payloads)
 *
 * This service should NEVER be used for mutations.
 */
export async function getMapMarkers(userId: string) {
  return prisma.location.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      latitude: true,
      longitude: true,
      name: true,
      createdAt: true,
      _count: {
        select: {
          media: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function getLocationPreview(
  userId: string,
  locationId: string
) {
  const location = await prisma.location.findFirst({
    where: {
      id: locationId,
      userId,
    },
    select: {
      id: true,
      name: true,
      latitude: true,
      longitude: true,
      createdAt: true,
      media: {
        orderBy: {
          createdAt: "desc",
        },
        take: 4,
        select: {
          id: true,
          type: true,
          url: true,
          createdAt: true,
        },
      },
    },
  })

  if (!location) {
    return null
  }

  return {
    location: {
      id: location.id,
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      createdAt: location.createdAt,
    },
    previewMedia: location.media.map((media) => ({
      id: media.id,
      type: media.type,
      thumbnailUrl: media.url,
      capturedAt: media.createdAt,
    })),
  }
}
