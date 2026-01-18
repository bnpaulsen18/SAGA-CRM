/**
 * Smooth Scroll Component
 * Handles smooth scrolling to hash link targets on the page
 */

'use client'

import { useEffect } from 'react'

export default function SmoothScroll() {
  useEffect(() => {
    // Handle smooth scrolling for hash links
    const handleHashClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a')

      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href || !href.startsWith('#')) return

      // Prevent default anchor behavior
      e.preventDefault()

      const targetId = href.substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        // Calculate offset for sticky navigation
        const navHeight = 80 // Approximate height of sticky nav
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight

        // Smooth scroll to target
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        })

        // Update URL without triggering a page jump
        if (history.pushState) {
          history.pushState(null, '', href)
        } else {
          window.location.hash = href
        }
      }
    }

    // Add click listener to document
    document.addEventListener('click', handleHashClick)

    // Handle initial hash on page load
    if (window.location.hash) {
      const hash = window.location.hash
      const targetId = hash.substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        // Delay to ensure page is fully loaded
        setTimeout(() => {
          const navHeight = 80
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
          })
        }, 100)
      }
    }

    // Cleanup
    return () => {
      document.removeEventListener('click', handleHashClick)
    }
  }, [])

  // This component doesn't render anything
  return null
}
