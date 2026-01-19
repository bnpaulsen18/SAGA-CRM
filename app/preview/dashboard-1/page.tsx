/**
 * DASHBOARD VARIATION 1: "Dark Command"
 * Dark theme with neon accents and glassmorphism
 * Preview at: /preview/dashboard-1
 */

import Link from 'next/link'
import {
  ChartBar,
  Users,
  CurrencyDollar,
  TrendUp,
  ArrowUp,
  ArrowDown,
  Bell,
  Gear,
  MagnifyingGlass,
  Plus,
  DotsThree,
  EnvelopeSimple,
  Calendar,
  Heart,
  Lightning,
  Star,
} from '@phosphor-icons/react/dist/ssr'

export const metadata = {
  title: 'Dashboard - Dark Command | Preview',
  description: 'Dark theme dashboard with neon accents',
}

export default function DashboardDark() {
  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Version Switcher */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/10">
        <Link href="/preview/dashboard-1" className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-bold">
          Dark
        </Link>
        <Link href="/preview/dashboard-2" className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition">
          Light
        </Link>
        <Link href="/preview/dashboard-3" className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition">
          Glass
        </Link>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo & Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="font-bold text-xl text-white">SAGA</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {[
                { icon: ChartBar, label: 'Dashboard', active: true },
                { icon: Users, label: 'Contacts' },
                { icon: CurrencyDollar, label: 'Donations' },
                { icon: EnvelopeSimple, label: 'Campaigns' },
                { icon: TrendUp, label: 'Reports' },
              ].map((item) => (
                <button
                  key={item.label}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    item.active
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={18} weight={item.active ? 'fill' : 'regular'} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="search"
                placeholder="Search..."
                className="w-64 pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full" />
            </button>

            {/* Profile */}
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">JD</span>
              </div>
              <span className="text-white text-sm font-medium hidden md:block">John Doe</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-[1600px] mx-auto">
        {/* Welcome & Quick Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Good morning, John</h1>
            <p className="text-white/50 mt-1">Here&apos;s what&apos;s happening with your nonprofit today.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white/80 hover:bg-white/10 transition-all text-sm font-medium">
              <Calendar size={18} />
              Last 30 Days
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg text-white text-sm font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all">
              <Plus size={18} weight="bold" />
              Add Donation
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Raised', value: '$48,250', change: '+12.5%', up: true, icon: CurrencyDollar, color: 'purple' },
            { label: 'Active Donors', value: '1,284', change: '+8.2%', up: true, icon: Users, color: 'pink' },
            { label: 'Avg. Gift Size', value: '$125', change: '-2.1%', up: false, icon: Heart, color: 'orange' },
            { label: 'Donor Retention', value: '78%', change: '+5.4%', up: true, icon: TrendUp, color: 'cyan' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/[0.07] transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} weight="fill" className={`text-${stat.color}-400`} />
                </div>
                <span className={`flex items-center gap-1 text-sm font-medium ${stat.up ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.up ? <ArrowUp size={14} weight="bold" /> : <ArrowDown size={14} weight="bold" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-white/50 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts & Activity */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Donations Chart */}
          <div className="lg:col-span-2 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Donation Trends</h2>
              <button className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all">
                <DotsThree size={20} weight="bold" />
              </button>
            </div>
            {/* Chart placeholder */}
            <div className="h-64 flex items-center justify-center border border-dashed border-white/10 rounded-xl">
              <div className="text-center">
                <ChartBar size={48} className="text-white/20 mx-auto mb-2" />
                <p className="text-white/40 text-sm">Chart visualization</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { icon: CurrencyDollar, text: 'Sarah Chen donated $500', time: '2 min ago', color: 'green' },
                { icon: Users, text: 'New donor: Michael Brown', time: '15 min ago', color: 'purple' },
                { icon: EnvelopeSimple, text: 'Campaign email sent', time: '1 hour ago', color: 'blue' },
                { icon: Star, text: 'Monthly goal reached!', time: '3 hours ago', color: 'yellow' },
                { icon: Lightning, text: 'Automation triggered', time: '5 hours ago', color: 'pink' },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-all">
                  <div className={`w-8 h-8 rounded-lg bg-${activity.color}-500/20 flex items-center justify-center flex-shrink-0`}>
                    <activity.icon size={16} className={`text-${activity.color}-400`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{activity.text}</p>
                    <p className="text-white/40 text-xs mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Donors Table */}
        <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Top Donors</h2>
            <Link href="/contacts" className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-white/50 text-xs font-medium uppercase tracking-wider pb-4">Donor</th>
                  <th className="text-left text-white/50 text-xs font-medium uppercase tracking-wider pb-4">Total Given</th>
                  <th className="text-left text-white/50 text-xs font-medium uppercase tracking-wider pb-4">Last Gift</th>
                  <th className="text-left text-white/50 text-xs font-medium uppercase tracking-wider pb-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { name: 'Sarah Chen', email: 'sarah@example.com', total: '$12,500', last: 'Dec 15, 2025', status: 'Active' },
                  { name: 'Michael Johnson', email: 'michael@example.com', total: '$8,750', last: 'Dec 10, 2025', status: 'Active' },
                  { name: 'Emily Rodriguez', email: 'emily@example.com', total: '$6,200', last: 'Dec 5, 2025', status: 'Active' },
                  { name: 'David Kim', email: 'david@example.com', total: '$4,800', last: 'Nov 28, 2025', status: 'Lapsed' },
                ].map((donor, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center border border-white/10">
                          <span className="text-white font-medium text-sm">{donor.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{donor.name}</p>
                          <p className="text-white/40 text-sm">{donor.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-white font-medium">{donor.total}</td>
                    <td className="py-4 text-white/60">{donor.last}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        donor.status === 'Active'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {donor.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
