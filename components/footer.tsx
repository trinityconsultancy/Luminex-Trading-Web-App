"use client"

import Link from "next/link"
import { LuminexLogo } from "@/components/luminex-logo"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/50 bg-muted/30 mt-auto backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <LuminexLogo className="w-8 h-8" />
              <span className="font-bold text-xl">Luminex</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Virtual Trading Platform for learning and practicing stock market trading with real-time market data.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:support@luminex.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Trading Links */}
          <div>
            <h3 className="font-semibold mb-4">Trading</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/holdings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Holdings
                </Link>
              </li>
              <li>
                <Link href="/positions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Positions
                </Link>
              </li>
              <li>
                <Link href="/fno" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  F&O
                </Link>
              </li>
              <li>
                <Link href="/watchlist" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Watchlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/charts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Charts
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/funds" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Funds
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Market News
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Learning Center
                </a>
              </li>
            </ul>
          </div>

          {/* Account & Legal */}
          <div>
            <h3 className="font-semibold mb-4">Account & Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/account" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Risk Disclosure
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} Luminex Trading. All rights reserved. Final Year Project - Demo Trading Platform.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Help Center
              </a>
              <span>•</span>
              <a href="#" className="hover:text-foreground transition-colors">
                Contact Us
              </a>
              <span>•</span>
              <a href="#" className="hover:text-foreground transition-colors">
                FAQs
              </a>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4 bg-amber-500/10 border border-amber-500/20 rounded-md py-2 px-4">
            ⚠️ This is a virtual trading platform for educational purposes only. No real money is involved.
          </p>
        </div>
      </div>
    </footer>
  )
}
