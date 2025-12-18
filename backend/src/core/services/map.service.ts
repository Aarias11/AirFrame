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
export async function getMapLocations(userId: string) {
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
