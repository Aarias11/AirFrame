import prisma from "../../data/db/prisma.js"

export async function getMapMarkers(userId: string) {
  return prisma.location.findMany({
    where: { userId },
    select: {
      id: true,
      latitude: true,
      longitude: true,
      _count: {
        select: { media: true },
      },
    },
  })
}




export async function getLocationPreview(
  userId: string,
  locationId: string
) {
  return prisma.location.findFirst({
    where: {
      id: locationId,
      userId,
    },
    select: {
      id: true,
      latitude: true,
      longitude: true,
      media: {
        take: 4,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          url: true,
          metadata: {
            select: {
              capturedAt: true,
            },
          },
        },
      },
    },
  })
}