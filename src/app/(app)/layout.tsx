"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

type AppShellProps = {
  children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  // Redirect unauthenticated users once auth state resolves
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth")
    }
  }, [isLoading, isAuthenticated, router])

  // While checking auth, show a minimal shell (no route flash)
  if (isLoading) {
    return (
      <div className="min-h-screen w-full animate-pulse bg-neutral-50" />
    )
  }

  // If not authenticated, we redirect — render nothing here
  if (!isAuthenticated) {
    return null
  }

  // Authenticated app shell
  return (
    <div className="min-h-screen w-full">
      {children}
    </div>
  )
}