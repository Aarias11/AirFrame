"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

type MobileMenuProps = {
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
  onLogout: () => void
}

export default function MobileMenu({
  mobileOpen,
  setMobileOpen,
  onLogout,
}: MobileMenuProps) {
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement | null>(null)
  const backdropRef = useRef<HTMLDivElement | null>(null)

  // Close menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname, setMobileOpen])

  // Escape key + focus handling
  useEffect(() => {
    if (!mobileOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    menuRef.current?.focus()

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [mobileOpen, setMobileOpen])

  // Outside click / backdrop tap
  useEffect(() => {
    if (!mobileOpen) return

    const handleClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setMobileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClick)
    return () => {
      document.removeEventListener("mousedown", handleClick)
    }
  }, [mobileOpen, setMobileOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        aria-hidden="true"
        className={`fixed inset-0 z-30 bg-black/20 backdrop-blur-sm transition-opacity duration-200 md:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Menu */}
      <div
        ref={menuRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-hidden={!mobileOpen}
        aria-labelledby="mobile-menu-title"
        className={`absolute top-13 left-0 right-0 z-40 origin-top rounded-b-xl bg-[#131313]/80 backdrop-blur-xl transition-all duration-200 ease-out md:hidden
          ${
            mobileOpen
              ? "scale-y-100 opacity-100"
              : "pointer-events-none scale-y-95 opacity-0"
          }`}
      >
        <nav
          className="flex flex-col gap-2 px-5 py-5 text-sm"
          aria-label="Mobile navigation"
        >
          <h2 id="mobile-menu-title" className="sr-only">
            Navigation menu
          </h2>

          <Link
            href="/map"
            onClick={() => setMobileOpen(false)}
            className={`rounded-lg px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              pathname.startsWith("/map")
                ? "bg-glass-surface text-text-primary"
                : "text-text-secondary hover:bg-glass-surface hover:text-text-primary"
            }`}
          >
            Map
          </Link>

          <Link
            href="/library"
            onClick={() => setMobileOpen(false)}
            className={`rounded-lg px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              pathname.startsWith("/library")
                ? "bg-glass-surface text-text-primary"
                : "text-text-secondary hover:bg-glass-surface hover:text-text-primary"
            }`}
          >
            Library
          </Link>

          <div className="my-2 h-px w-full bg-border-divider" />

          <button
            onClick={() => {
              setMobileOpen(false)
              onLogout()
            }}
            className="rounded-lg px-4 py-3 text-left text-sm text-red-600 hover:bg-glass-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            Logout
          </button>
        </nav>
      </div>
    </>
  )
}
