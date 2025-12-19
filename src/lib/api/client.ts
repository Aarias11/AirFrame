/**
 * apiClient
 * -----------------------------------
 * Centralized fetch wrapper for AirFrame.
 *
 * Responsibilities:
 * - Always send credentials (cookies)
 * - Normalize errors
 * - Enforce JSON responses
 *
 * This is the ONLY place `fetch` should be used directly.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"

type ApiError = {
  message: string
  status: number
}

export async function apiClient<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  })

  if (!res.ok) {
    let message = "Request failed"

    try {
      const body = await res.json()
      message = body?.error ?? body?.message ?? message
    } catch {
      // ignore JSON parse errors
    }

    const error: ApiError = {
      message,
      status: res.status,
    }

    throw error
  }

  return res.json()
}
