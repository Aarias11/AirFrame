import { prisma } from "../../data/db/prisma.js"
import type { Prisma } from "@prisma/client"

interface CreateMediaInput {
  userId: string
  locationId: string
  media: {
    type: "IMAGE" | "VIDEO"
    url: string
  }
  metadata?: {
    capturedAt?: Date | undefined
    altitude?: number | undefined
    camera?: string | undefined
  }
}

/**
 * Persists Media and optional Metadata in a single transaction.
 * Guarantees consistency across related tables.
 */
export async function createMediaRecords(
  input: CreateMediaInput
) {
  const { userId, locationId, media, metadata } = input

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const createdMedia = await tx.media.create({
      data: {
        userId,
        locationId,
        type: media.type,
        url: media.url,
      },
    })

    if (metadata) {
      await tx.mediaMetadata.create({
        data: {
          mediaId: createdMedia.id,
          capturedAt: metadata.capturedAt,
          altitude: metadata.altitude,
          camera: metadata.camera,
        },
      })
    }

    return createdMedia
  })
}