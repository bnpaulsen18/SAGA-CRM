'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

interface NavItem {
  label: string
  href: string
  icon?: string
  badge?: string
  dropdown?: {
    label: string
    href: string
  }[]
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  {
    label: 'Contacts',
    href: '/contacts',
    icon: '👥',
    dropdown: [
      { label: 'All Contacts', href: '/contacts' },
      { label: 'Segments', href: '/contacts/segments' },
      { label: 'Import CSV', href: '/contacts/import' }
    ]
  },
  {
    label: 'Donations',
    href: '/donations',
    icon: '💰',
    dropdown: [
      { label: 'All Donations', href: '/donations' },
      { label: 'Recurring', href: '/donations/recurring' },
      { label: 'Tax Receipts', href: '/donations/receipts' }
    ]
  },
  { label: 'Campaigns', href: '/campaigns', icon: '📊' },
  { label: 'Communications', href: '/communications', icon: '📧', badge: 'Coming Soon' },
  { label: 'Reports', href: '/reports', icon: '📈' },
  { label: 'Settings', href: '/settings', icon: '⚙️' }
]

export default function DashboardNavNew() {
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav
      className="sticky z-[999] border-b"
      style={{
        top: '75px',
        background: 'rgba(26, 10, 46, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottomColor: 'rgba(255, 107, 53, 0.2)'
      }}
    >
      <div className="max-w-[1600px] mx-auto px-10">
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const active = isActive(item.href)
            const hovered = hoveredItem === item.href

            if (item.dropdown) {
              return (
                <DropdownMenu key={item.href}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="relative px-5 py-4 text-[0.95rem] font-medium transition-all duration-200 flex items-center gap-2"
                      style={{
                        color: active ? '#ffa07a' : '#ffffff',
                        background: hovered || active ? 'rgba(255, 107, 107, 0.08)' : 'transparent',
                        borderBottom: active ? '3px solid #ffa07a' : '3px solid transparent'
                      }}
                      onMouseEnter={() => setHoveredItem(item.href)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      {item.icon && <span>{item.icon}</span>}
                      <span>{item.label}</span>
                      <span className="text-xs">▼</span>
                      {item.badge && (
                        <Badge
                          variant="outline"
                          className="ml-1 text-xs"
                          style={{
                            borderColor: 'rgba(255, 193, 7, 0.5)',
                            background: 'rgba(255, 193, 7, 0.1)',
                            color: '#ffc107'
                          }}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="min-w-[200px]"
                    style={{
                      background: 'rgba(26, 10, 46, 0.98)',
                      border: '1px solid rgba(255, 107, 53, 0.3)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    {item.dropdown.map((subItem) => (
                      <DropdownMenuItem key={subItem.href} asChild>
                        <Link
                          href={subItem.href}
                          className="text-white hover:text-orange-400 hover:bg-white/10 cursor-pointer px-4 py-2.5 transition-colors"
                        >
                          {subItem.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-5 py-4 text-[0.95rem] font-medium transition-all duration-200 flex items-center gap-2"
                style={{
                  color: active ? '#ffa07a' : '#ffffff',
                  background: hovered || active ? 'rgba(255, 107, 107, 0.08)' : 'transparent',
                  borderBottom: active ? '3px solid #ffa07a' : '3px solid transparent'
                }}
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
                {item.badge && (
                  <Badge
                    variant="outline"
                    className="ml-1 text-xs"
                    style={{
                      borderColor: 'rgba(255, 193, 7, 0.5)',
                      background: 'rgba(255, 193, 7, 0.1)',
                      color: '#ffc107'
                    }}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
