// src/lib/api/auth.ts

export type SessionUser = {
  id: string
  email: string
}

export async function getSession(): Promise<{ user: SessionUser } | null> {
  const res = await fetch("http://localhost:4000/auth/session", {
    credentials: "include",
  })

  if (!res.ok) {
    return null
  }

  return res.json()
}