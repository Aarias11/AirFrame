"use client"

import { useEffect, useState } from "react"
import { getSession, type SessionUser } from "@/lib/api/auth"

/**
 * useAuth
 * -----------------------------------
 * Owns authentication state for the app.
 *
 * Responsibilities:
 * - Determine if a user is authenticated
 * - Expose loading + auth status
 * - Provide the current user identity
 *
 * This hook intentionally does NOT:
 * - Perform redirects
 * - Handle login/logout UI
 * - Manage permissions or roles
 */
export function useAuth() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  async function loadSession(isMountedRef?: { current: boolean }) {
    try {
      setIsLoading(true)
      const session = await getSession()

      if (isMountedRef && !isMountedRef.current) return
      setUser(session?.user ?? null)
    } catch (error) {
      console.error("Failed to load session", error)
      if (!isMountedRef || isMountedRef.current) {
        setUser(null)
      }
    } finally {
      if (!isMountedRef || isMountedRef.current) {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    const isMountedRef = { current: true }
    loadSession(isMountedRef)
    return () => {
      isMountedRef.current = false
    }
  }, [])

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    refreshSession: () => loadSession(),
  }
}
  
