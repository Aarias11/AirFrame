"use client"

import { useState } from "react"
import { uploadMedia } from "@/lib/api/upload"

export type UploadStatus = "idle" | "uploading" | "success" | "error"

type UploadResult = {
  locationId: string
}

type UseUploadReturn = {
  status: UploadStatus
  progress: number
  error: string | null
  upload: (file: File) => Promise<UploadResult | null>
  reset: () => void
}

/**
 * useUpload
 * -----------------------------------
 * Owns upload UX state.
 *
 * Responsibilities:
 * - Track upload lifecycle
 * - Expose progress + error state
 * - Provide a single `upload()` action
 *
 * This hook intentionally does NOT:
 * - Mutate map or library state
 * - Perform navigation
 * - Handle file picking UI
 */
export function useUpload(): UseUploadReturn {
  const [status, setStatus] = useState<UploadStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  async function upload(file: File): Promise<UploadResult | null> {
    try {
      setStatus("uploading")
      setProgress(0)
      setError(null)

      const result = await uploadMedia(file, (p) => {
        setProgress(p)
      })

      setStatus("success")
      setProgress(100)

      return result
    } catch (err) {
      console.error("Upload failed", err)
      setStatus("error")
      setError("Upload failed. Please try again.")
      return null
    }
  }

  function reset() {
    setStatus("idle")
    setProgress(0)
    setError(null)
  }

  return {
    status,
    progress,
    error,
    upload,
    reset,
  }
}
