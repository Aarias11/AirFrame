"use client"

import React, { useRef } from "react"
import { useUpload } from "@/hooks/useUpload"

/**
 * UploadPanel
 * -----------------------------------
 * UI surface for uploading media.
 *
 * Responsibilities:
 * - File selection
 * - Display upload progress + status
 * - Trigger upload lifecycle
 *
 * This component does NOT:
 * - Fetch map or library data
 * - Perform navigation
 * - Contain backend logic
 */
export default function UploadPanel() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { status, progress, error, upload, reset } = useUpload()

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0]
    if (!file) return

    await upload(file)
  }

  function handleReset() {
    reset()
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="w-full max-w-md rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-sm font-medium">Upload Media</h2>

      {/* Idle */}
      {status === "idle" && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="mb-3 block w-full text-sm"
          />
          <p className="text-xs text-neutral-500">
            Upload photos or videos from your drone.
          </p>
        </>
      )}

      {/* Uploading */}
      {status === "uploading" && (
        <div className="space-y-2">
          <div className="h-2 w-full overflow-hidden rounded bg-neutral-200">
            <div
              className="h-full bg-black transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-neutral-600">
            Uploading… {progress}%
          </p>
        </div>
      )}

      {/* Success */}
      {status === "success" && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-green-600">
            Upload complete
          </p>
          <button
            onClick={handleReset}
            className="rounded-md border px-3 py-1 text-xs hover:bg-neutral-100"
          >
            Upload another
          </button>
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div className="space-y-2">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={handleReset}
            className="rounded-md border px-3 py-1 text-xs hover:bg-neutral-100"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  )
}
