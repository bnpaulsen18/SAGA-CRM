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
import {
  ChartBar,
  Users,
  CurrencyDollar,
  EnvelopeSimple,
  TrendUp,
  Gear,
  CaretDown
} from '@phosphor-icons/react/dist/ssr'

interface NavItem {
  label: string
  href: string
  icon?: string
  dropdown?: {
    label: string
    href: string
  }[]
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'ChartBar' },
  {
    label: 'Contacts',
    href: '/contacts',
    icon: 'Users',
    dropdown: [
      { label: 'All Contacts', href: '/contacts' },
      { label: 'Segments', href: '/contacts/segments' },
      { label: 'Import CSV', href: '/contacts/import' }
    ]
  },
  {
    label: 'Donations',
    href: '/donations',
    icon: 'CurrencyDollar',
    dropdown: [
      { label: 'All Donations', href: '/donations' },
      { label: 'Recurring', href: '/donations/recurring' },
      { label: 'Tax Receipts', href: '/donations/receipts' }
    ]
  },
  { label: 'Campaigns', href: '/campaigns', icon: 'ChartBar' },
  {
    label: 'Communications',
    href: '/emails',
    icon: 'EnvelopeSimple',
    dropdown: [
      { label: 'Compose Campaign', href: '/emails/compose' },
      { label: 'Email History', href: '/emails/history' }
    ]
  },
  { label: 'Reports', href: '/reports', icon: 'TrendUp' },
  { label: 'Settings', href: '/settings', icon: 'Gear' }
]

// Icon component mapping
const iconComponents = {
  ChartBar: ChartBar,
  Users: Users,
  CurrencyDollar: CurrencyDollar,
  EnvelopeSimple: EnvelopeSimple,
  TrendUp: TrendUp,
  Gear: Gear
}

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
    <nav className="sticky z-[999] border-b border-white/5 bg-[#0a0a1a]/60 backdrop-blur-xl" style={{ top: '70px' }}>
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const active = isActive(item.href)
            const hovered = hoveredItem === item.href

            if (item.dropdown) {
              return (
                <DropdownMenu key={item.href}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`relative px-4 py-3.5 text-sm font-medium transition-all duration-200 flex items-center gap-2 rounded-lg ${
                        active
                          ? 'text-white bg-white/10'
                          : hovered
                          ? 'text-white bg-white/5'
                          : 'text-white/60 hover:text-white'
                      }`}
                      onMouseEnter={() => setHoveredItem(item.href)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      {item.icon && (() => {
                        const Icon = iconComponents[item.icon as keyof typeof iconComponents]
                        return Icon ? <Icon size={18} weight={active ? 'fill' : 'regular'} /> : null
                      })()}
                      <span>{item.label}</span>
                      <CaretDown size={12} className="text-white/40" />
                      {active && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="min-w-[200px] bg-[#0a0a1a]/98 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-1"
                  >
                    {item.dropdown.map((subItem) => (
                      <DropdownMenuItem key={subItem.href} asChild>
                        <Link
                          href={subItem.href}
                          className="text-white/80 hover:text-white hover:bg-white/10 cursor-pointer px-4 py-2.5 rounded-lg transition-colors text-sm"
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
                className={`relative px-4 py-3.5 text-sm font-medium transition-all duration-200 flex items-center gap-2 rounded-lg ${
                  active
                    ? 'text-white bg-white/10'
                    : hovered
                    ? 'text-white bg-white/5'
                    : 'text-white/60 hover:text-white'
                }`}
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {item.icon && (() => {
                  const Icon = iconComponents[item.icon as keyof typeof iconComponents]
                  return Icon ? <Icon size={18} weight={active ? 'fill' : 'regular'} /> : null
                })()}
                <span>{item.label}</span>
                {active && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
