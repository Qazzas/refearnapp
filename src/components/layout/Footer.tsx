import React from "react"
import Link from "next/link"
import { OrgHeader } from "@/components/ui-custom/OrgHeader"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary py-16 px-3">
      {/* Matches header width + padding exactly */}
      <div className="max-w-5xl mx-auto px-4">
        {/* Top: Branding left + Explore right */}
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* Org Section */}
          <div className="max-w-sm space-y-4">
            <OrgHeader affiliate={false} isPreview={false} />
            <p className="text-muted-foreground">
              The most elegant way to build your affiliate marketing program for
              your SaaS business.
            </p>
          </div>

          {/* Explore Section */}
          <div>
            <h4 className="font-medium mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} RefearnApp. All rights reserved.
          </p>

          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>

            <Link
              href="/privacy-policy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>

            <Link
              href="/refund-policy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
