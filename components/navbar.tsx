"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, Eye, EyeOff, X, User, Settings, LogOut, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LuminexLogo } from "@/components/luminex-logo"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

interface NavbarProps {
  privacyMode?: boolean
  onPrivacyToggle?: () => void
  showPrivacyToggle?: boolean
}

const navLinks = [
  { href: "/dashboard", label: "Home" },
  { href: "/charts", label: "Charts" },
  { href: "/holdings", label: "Holdings" },
  { href: "/positions", label: "Positions" },
  { href: "/fno", label: "F&O" },
  { href: "/watchlist", label: "Watchlist" },
]

export function Navbar({ privacyMode = false, onPrivacyToggle, showPrivacyToggle = true }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const isActive = (href: string) => pathname === href

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  // Get user initials
  const getUserInitials = () => {
    if (!user?.name) return "U"
    const names = user.name.split(" ")
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase()
    }
    return user.name.substring(0, 2).toUpperCase()
  }

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <LuminexLogo className="w-8 h-8" />
            <span className="font-bold text-xl">Luminex</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {showPrivacyToggle && onPrivacyToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onPrivacyToggle}
              className="hidden md:flex"
              title={privacyMode ? "Show values" : "Hide values"}
            >
              {privacyMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          )}
          <Button size="sm" className="hidden md:flex" asChild>
            <Link href="/trade">Trade</Link>
          </Button>
          
          {/* User Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium hover:bg-primary/20 transition-colors">
                  {getUserInitials()}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || ""}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/account" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>My Account</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/trade"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Trade
            </Link>
            {showPrivacyToggle && onPrivacyToggle && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onPrivacyToggle()
                  setMobileMenuOpen(false)
                }}
                className="justify-start"
              >
                {privacyMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {privacyMode ? "Show Values" : "Hide Values"}
              </Button>
            )}
            
            <div className="my-2 border-t border-border" />
            
            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground flex items-center"
            >
              <UserCircle className="w-4 h-4 mr-2" />
              My Account
            </Link>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setMobileMenuOpen(false)
                handleLogout()
              }}
              className="justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
