"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

/**
 * Auth Page
 * -----------------------------------
 * Entry point for authentication.
 *
 * Behavior:
 * - If user is already authenticated → redirect to /map
 * - Otherwise → show login UI
 */
export default function AuthPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/map")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen w-full animate-pulse bg-neutral-50" />
    )
  }

  if (isAuthenticated) {
    return null
  }

  console.log("BACKEND URL:", process.env.NEXT_PUBLIC_BACKEND_URL)

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50">
      <div className="rounded-lg border bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-lg font-medium">Welcome to AirFrame</h1>
        <p className="mb-6 text-sm text-neutral-600">
          Sign in to access your flight library.
        </p>

        <a
          href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`}
          className="block rounded-md bg-black px-4 py-2 text-center text-sm text-white hover:bg-neutral-800"
        >
          Continue with Google
        </a>
      </div>
    </main>
  )
}
