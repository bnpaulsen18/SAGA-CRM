/**
 * DASHBOARD VARIATION 2: "Light Studio"
 * Clean, professional white design
 * Preview at: /preview/dashboard-2
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
  CaretDown,
} from '@phosphor-icons/react/dist/ssr'

export const metadata = {
  title: 'Dashboard - Light Studio | Preview',
  description: 'Clean professional white dashboard',
}

export default function DashboardLight() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Version Switcher */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 bg-white/90 backdrop-blur-md p-2 rounded-xl border border-gray-200 shadow-lg">
        <Link href="/preview/dashboard-1" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">
          Dark
        </Link>
        <Link href="/preview/dashboard-2" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">
          Light
        </Link>
        <Link href="/preview/dashboard-3" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">
          Glass
        </Link>
      </div>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-30 hidden lg:block">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-xl text-gray-900">SAGA CRM</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4 px-3">Main Menu</p>
          {[
            { icon: ChartBar, label: 'Dashboard', active: true },
            { icon: Users, label: 'Contacts' },
            { icon: CurrencyDollar, label: 'Donations' },
            { icon: EnvelopeSimple, label: 'Campaigns' },
            { icon: TrendUp, label: 'Reports' },
            { icon: Gear, label: 'Settings' },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition-all ${
                item.active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={20} weight={item.active ? 'fill' : 'regular'} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom Card */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl text-white">
            <h4 className="font-semibold mb-2">Upgrade to Pro</h4>
            <p className="text-sm text-blue-100 mb-3">Unlock advanced analytics and automation.</p>
            <button className="w-full py-2 bg-white text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Search */}
            <div className="relative w-80 hidden md:block">
              <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search donors, donations..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 transition-all">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              <div className="h-8 w-px bg-gray-200" />

              <button className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-all">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">JD</span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
                <CaretDown size={14} className="text-gray-400 hidden md:block" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Welcome & Quick Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back! Here&apos;s an overview of your nonprofit.</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium shadow-sm">
                <Calendar size={18} />
                Last 30 Days
                <CaretDown size={14} />
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 rounded-lg text-white text-sm font-semibold shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all">
                <Plus size={18} weight="bold" />
                Add Donation
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Raised', value: '$48,250', change: '+12.5%', up: true, icon: CurrencyDollar, color: 'blue' },
              { label: 'Active Donors', value: '1,284', change: '+8.2%', up: true, icon: Users, color: 'indigo' },
              { label: 'Avg. Gift Size', value: '$125', change: '-2.1%', up: false, icon: Heart, color: 'rose' },
              { label: 'Donor Retention', value: '78%', change: '+5.4%', up: true, icon: TrendUp, color: 'emerald' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:shadow-gray-200/50 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <stat.icon size={24} weight="duotone" className={`text-${stat.color}-600`} />
                  </div>
                  <span className={`flex items-center gap-1 text-sm font-medium ${stat.up ? 'text-emerald-600' : 'text-red-600'}`}>
                    {stat.up ? <ArrowUp size={14} weight="bold" /> : <ArrowDown size={14} weight="bold" />}
                    {stat.change}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Charts & Activity */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Donations Chart */}
            <div className="lg:col-span-2 p-6 bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Donation Overview</h2>
                  <p className="text-sm text-gray-500 mt-1">Monthly donation trends</p>
                </div>
                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all">
                  <DotsThree size={20} weight="bold" />
                </button>
              </div>
              {/* Chart placeholder */}
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                <div className="text-center">
                  <ChartBar size={48} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Chart visualization</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="p-6 bg-white rounded-xl border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { icon: CurrencyDollar, text: 'Sarah Chen donated $500', time: '2 min ago', color: 'emerald' },
                  { icon: Users, text: 'New donor: Michael Brown', time: '15 min ago', color: 'blue' },
                  { icon: EnvelopeSimple, text: 'Campaign email sent', time: '1 hour ago', color: 'indigo' },
                  { icon: Star, text: 'Monthly goal reached!', time: '3 hours ago', color: 'amber' },
                  { icon: Lightning, text: 'Automation triggered', time: '5 hours ago', color: 'purple' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all cursor-pointer">
                    <div className={`w-9 h-9 rounded-lg bg-${activity.color}-100 flex items-center justify-center flex-shrink-0`}>
                      <activity.icon size={18} className={`text-${activity.color}-600`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 text-sm">{activity.text}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2.5 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors">
                View All Activity
              </button>
            </div>
          </div>

          {/* Top Donors Table */}
          <div className="p-6 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Top Donors</h2>
                <p className="text-sm text-gray-500 mt-1">Your highest contributing supporters</p>
              </div>
              <Link href="/contacts" className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-gray-500 text-xs font-medium uppercase tracking-wider pb-4">Donor</th>
                    <th className="text-left text-gray-500 text-xs font-medium uppercase tracking-wider pb-4">Total Given</th>
                    <th className="text-left text-gray-500 text-xs font-medium uppercase tracking-wider pb-4">Last Gift</th>
                    <th className="text-left text-gray-500 text-xs font-medium uppercase tracking-wider pb-4">Status</th>
                    <th className="text-right text-gray-500 text-xs font-medium uppercase tracking-wider pb-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { name: 'Sarah Chen', email: 'sarah@example.com', total: '$12,500', last: 'Dec 15, 2025', status: 'Active' },
                    { name: 'Michael Johnson', email: 'michael@example.com', total: '$8,750', last: 'Dec 10, 2025', status: 'Active' },
                    { name: 'Emily Rodriguez', email: 'emily@example.com', total: '$6,200', last: 'Dec 5, 2025', status: 'Active' },
                    { name: 'David Kim', email: 'david@example.com', total: '$4,800', last: 'Nov 28, 2025', status: 'Lapsed' },
                  ].map((donor, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-700 font-medium text-sm">{donor.name.split(' ').map(n => n[0]).join('')}</span>
                          </div>
                          <div>
                            <p className="text-gray-900 font-medium">{donor.name}</p>
                            <p className="text-gray-500 text-sm">{donor.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-gray-900 font-semibold">{donor.total}</td>
                      <td className="py-4 text-gray-600">{donor.last}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          donor.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {donor.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all">
                          <DotsThree size={18} weight="bold" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
