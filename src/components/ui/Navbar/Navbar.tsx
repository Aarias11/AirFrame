"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import MobileMenu from "./MobileMenu"

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  function logout() {
    window.location.href = "http://localhost:4000/auth/logout"
  }

  return (
    <header role="navigation" aria-label="Primary navigation" className="absolute top-0 left-0 right-0 z-40 h-14 border-b border-border-divider bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        {/* Brand */}
        <Link
          href="/map"
          aria-label="AirFrame home"
          className="text-sm font-medium tracking-wide text-text-primary"
        >
          AirFrame
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-4 text-sm text-text-secondary">
          <Link
            href="/map"
            aria-current={pathname.startsWith("/map") ? "page" : undefined}
            className={`rounded-md px-2.5 py-1.5 ${
              pathname.startsWith("/map")
                ? "bg-glass-surface text-text-primary"
                : "hover:bg-glass-surface hover:text-text-primary"
            } transition-colors duration-150 ease-out`}
          >
            Map
          </Link>

          <Link
            href="/library"
            aria-current={pathname.startsWith("/library") ? "page" : undefined}
            className={`rounded-md px-2.5 py-1.5 ${
              pathname.startsWith("/library")
                ? "bg-glass-surface text-text-primary"
                : "hover:bg-glass-surface hover:text-text-primary"
            } transition-colors duration-150 ease-out`}
          >
            Library
          </Link>
        </nav>

        {/* User + Mobile Controls */}
        <div className="flex items-center gap-2">
          {/* User Menu */}
          <div className="flex items-center gap-3 rounded-xl bg-glass-surface px-2.5 py-1">
            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-[11px] font-semibold tracking-wide text-primary">
              A
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              aria-label="Log out"
              className="rounded-md px-2 py-1 text-xs text-text-secondary transition-colors duration-150 hover:bg-glass-surface hover:text-red-600"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
            className="md:hidden rounded-md p-2 text-text-secondary hover:bg-glass-surface hover:text-text-primary transition-colors duration-150"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              />
            </svg>
          </button>
        </div>
      </div>

      <MobileMenu
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={logout}
      />
    </header>
  )
}
