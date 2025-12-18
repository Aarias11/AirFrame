import prisma from "../../data/db/prisma.js"

/**
 * Location Preview Read Model
 *
 * Purpose:
 * - Fetch lightweight preview data for a single location
 * - Used exclusively for map tooltips
 *
 * Guarantees:
 * - Max 4 media items
 * - Thumbnail-only payloads
 * - User-scoped access
 *
 * This service must NEVER:
 * - Return full media collections
 * - Perform mutations
 */
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
