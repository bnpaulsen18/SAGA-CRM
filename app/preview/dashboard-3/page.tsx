/**
 * DASHBOARD VARIATION 3: "Glass Modern"
 * Glassmorphic translucent design with warm accents
 * Preview at: /preview/dashboard-3
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
  House,
} from '@phosphor-icons/react/dist/ssr'

export const metadata = {
  title: 'Dashboard - Glass Modern | Preview',
  description: 'Glassmorphic translucent dashboard design',
}

export default function DashboardGlass() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #1a1a2e 100%)',
      }}
    >
      {/* Version Switcher */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 bg-white/10 backdrop-blur-xl p-2 rounded-xl border border-white/20">
        <Link href="/preview/dashboard-1" className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition">
          Dark
        </Link>
        <Link href="/preview/dashboard-2" className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition">
          Light
        </Link>
        <Link href="/preview/dashboard-3" className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg text-sm font-bold">
          Glass
        </Link>
      </div>

      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[100px]" />
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/5 backdrop-blur-2xl border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo & Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Heart size={20} weight="fill" className="text-white" />
              </div>
              <span className="font-bold text-xl text-white">SAGA</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-md p-1 rounded-xl border border-white/10">
              {[
                { icon: House, label: 'Home' },
                { icon: ChartBar, label: 'Dashboard', active: true },
                { icon: Users, label: 'Contacts' },
                { icon: CurrencyDollar, label: 'Donations' },
                { icon: EnvelopeSimple, label: 'Campaigns' },
              ].map((item) => (
                <button
                  key={item.label}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    item.active
                      ? 'bg-gradient-to-r from-orange-500/80 to-pink-500/80 text-white shadow-lg'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
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
                className="w-64 pl-10 pr-4 py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            </button>

            {/* Profile */}
            <button className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
                <span className="text-white text-sm font-bold">JD</span>
              </div>
              <span className="text-white text-sm font-medium hidden md:block">John Doe</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative p-6 max-w-[1600px] mx-auto">
        {/* Welcome & Quick Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome back, John</h1>
            <p className="text-white/50 mt-1">Here&apos;s your nonprofit&apos;s performance overview.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white/80 hover:bg-white/10 transition-all text-sm font-medium">
              <Calendar size={18} />
              Last 30 Days
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl text-white text-sm font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all">
              <Plus size={18} weight="bold" />
              Add Donation
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Raised', value: '$48,250', change: '+12.5%', up: true, icon: CurrencyDollar, gradient: 'from-orange-500 to-amber-500' },
            { label: 'Active Donors', value: '1,284', change: '+8.2%', up: true, icon: Users, gradient: 'from-pink-500 to-rose-500' },
            { label: 'Avg. Gift Size', value: '$125', change: '-2.1%', up: false, icon: Heart, gradient: 'from-purple-500 to-violet-500' },
            { label: 'Donor Retention', value: '78%', change: '+5.4%', up: true, icon: TrendUp, gradient: 'from-cyan-500 to-blue-500' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="group p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} weight="fill" className="text-white" />
                </div>
                <span className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
                  stat.up
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {stat.up ? <ArrowUp size={12} weight="bold" /> : <ArrowDown size={12} weight="bold" />}
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
          <div className="lg:col-span-2 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Donation Trends</h2>
                <p className="text-white/40 text-sm mt-1">Monthly giving patterns</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-gradient-to-r from-orange-500/20 to-pink-500/20 text-orange-300 rounded-lg text-xs font-medium border border-orange-500/30">
                  Monthly
                </button>
                <button className="px-3 py-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-lg text-xs font-medium transition-colors">
                  Weekly
                </button>
              </div>
            </div>
            {/* Chart placeholder */}
            <div className="h-64 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/5">
              <div className="text-center">
                <ChartBar size={48} className="text-white/20 mx-auto mb-2" />
                <p className="text-white/30 text-sm">Interactive chart visualization</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-6">Live Activity</h2>
            <div className="space-y-3">
              {[
                { icon: CurrencyDollar, text: 'Sarah Chen donated $500', time: '2 min ago', gradient: 'from-emerald-500 to-teal-500' },
                { icon: Users, text: 'New donor: Michael Brown', time: '15 min ago', gradient: 'from-blue-500 to-cyan-500' },
                { icon: EnvelopeSimple, text: 'Campaign email sent', time: '1 hour ago', gradient: 'from-violet-500 to-purple-500' },
                { icon: Star, text: 'Monthly goal reached!', time: '3 hours ago', gradient: 'from-amber-500 to-orange-500' },
                { icon: Lightning, text: 'Automation triggered', time: '5 hours ago', gradient: 'from-pink-500 to-rose-500' },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all cursor-pointer">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${activity.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <activity.icon size={16} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{activity.text}</p>
                    <p className="text-white/30 text-xs mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Donors Table */}
        <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Top Supporters</h2>
              <p className="text-white/40 text-sm mt-1">Your highest contributing donors</p>
            </div>
            <Link
              href="/contacts"
              className="px-4 py-2 bg-gradient-to-r from-orange-500/20 to-pink-500/20 text-orange-300 rounded-lg text-sm font-medium border border-orange-500/30 hover:bg-orange-500/30 transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider pb-4">Donor</th>
                  <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider pb-4">Total Given</th>
                  <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider pb-4">Last Gift</th>
                  <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider pb-4">Status</th>
                  <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider pb-4">Engagement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { name: 'Sarah Chen', email: 'sarah@example.com', total: '$12,500', last: 'Dec 15, 2025', status: 'Active', engagement: 95 },
                  { name: 'Michael Johnson', email: 'michael@example.com', total: '$8,750', last: 'Dec 10, 2025', status: 'Active', engagement: 88 },
                  { name: 'Emily Rodriguez', email: 'emily@example.com', total: '$6,200', last: 'Dec 5, 2025', status: 'Active', engagement: 76 },
                  { name: 'David Kim', email: 'david@example.com', total: '$4,800', last: 'Nov 28, 2025', status: 'Lapsed', engagement: 45 },
                ].map((donor, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-pink-500/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10">
                          <span className="text-white font-medium text-sm">{donor.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{donor.name}</p>
                          <p className="text-white/40 text-sm">{donor.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-white font-semibold">{donor.total}</span>
                    </td>
                    <td className="py-4 text-white/60">{donor.last}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        donor.status === 'Active'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {donor.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full"
                            style={{ width: `${donor.engagement}%` }}
                          />
                        </div>
                        <span className="text-white/60 text-sm">{donor.engagement}%</span>
                      </div>
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
