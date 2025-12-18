import prisma from "../../data/db/prisma.js"

/**
 * Library Read Model
 *
 * Purpose:
 * - Fetch all user media grouped by location (event-centric)
 * - Support filtering without impacting map or preview performance
 *
 * This service is intentionally heavier than map reads.
 */
export async function getLibraryMedia({
  userId,
  locationId,
  type,
  page = 1,
  pageSize = 25,
}: {
  userId: string
  locationId?: string
  type?: "IMAGE" | "VIDEO"
  page?: number
  pageSize?: number
}) {
  const skip = (page - 1) * pageSize

  const locations = await prisma.location.findMany({
    where: {
      userId,
      ...(locationId ? { id: locationId } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      latitude: true,
      longitude: true,
      createdAt: true,
      media: {
        where: {
          ...(type ? { type } : {}),
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: pageSize,
        select: {
          id: true,
          type: true,
          url: true,
          createdAt: true,
        },
      },
    },
  })

  return locations.map((location) => ({
    location: {
      id: location.id,
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      createdAt: location.createdAt,
    },
    media: location.media.map((media) => ({
      id: media.id,
      type: media.type,
      url: media.url,
      capturedAt: media.createdAt,
    })),
  }))
}
