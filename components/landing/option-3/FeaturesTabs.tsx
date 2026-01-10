/**
 * OPTION 3: Enterprise Data-Driven Features Section
 * Tab-based interface with data visualizations
 */

'use client'

import { useState } from 'react'
import {
  Database,
  ChartBar,
  Users,
  Lock,
  Lightning,
  Pulse
} from '@phosphor-icons/react'

const features = [
  {
    id: 'analytics',
    icon: ChartBar,
    label: 'Analytics & Reporting',
    title: 'Real-time insights that drive decisions',
    description: 'Comprehensive analytics dashboards with customizable reports, donor cohort analysis, and predictive giving models. Export to Excel, PDF, or integrate with your BI tools.',
    capabilities: [
      'Custom dashboard builder',
      'Automated scheduled reports',
      'Cohort analysis and segmentation',
      'Predictive donation forecasting',
      'Export to Excel, PDF, CSV',
      'API access for BI integration'
    ],
    imagePlaceholder: 'Analytics Dashboard',
  },
  {
    id: 'database',
    icon: Database,
    label: 'Data Management',
    title: 'Enterprise-grade database architecture',
    description: 'Scalable PostgreSQL database with row-level security, automated backups, and ACID compliance. Handle millions of records with sub-second query performance.',
    capabilities: [
      'Multi-tenant architecture',
      'Row-level security (RLS)',
      'Automated daily backups',
      'Point-in-time recovery',
      'Data encryption at rest',
      'Audit logging for compliance'
    ],
    imagePlaceholder: 'Database Schema',
  },
  {
    id: 'automation',
    icon: Lightning,
    label: 'Workflow Automation',
    title: 'Automate repetitive tasks at scale',
    description: 'Build custom workflows with our visual automation builder. Trigger actions based on donor behavior, giving patterns, or custom events.',
    capabilities: [
      'Visual workflow builder',
      'Email automation sequences',
      'Donor engagement scoring',
      'Task assignment and routing',
      'Integration webhooks',
      'Custom trigger conditions'
    ],
    imagePlaceholder: 'Workflow Builder',
  },
  {
    id: 'security',
    icon: Lock,
    label: 'Security & Compliance',
    title: 'Enterprise security built-in',
    description: 'SOC 2 Type II certified with bank-level encryption, GDPR compliance, and role-based access control. Your donor data is protected at every layer.',
    capabilities: [
      'SOC 2 Type II certification',
      'GDPR & CCPA compliant',
      'AES-256 encryption',
      'Role-based access control',
      'Two-factor authentication',
      'IP whitelisting & SSO'
    ],
    imagePlaceholder: 'Security Dashboard',
  },
  {
    id: 'integrations',
    icon: Pulse,
    label: 'Integrations',
    title: 'Connect your entire tech stack',
    description: 'Native integrations with QuickBooks, Mailchimp, Stripe, and more. Use our REST API or webhooks for custom integrations.',
    capabilities: [
      'QuickBooks Online sync',
      'Mailchimp email marketing',
      'Stripe payment processing',
      'Zapier automation',
      'REST API with documentation',
      'Webhook event triggers'
    ],
    imagePlaceholder: 'Integration Map',
  },
  {
    id: 'team',
    icon: Users,
    label: 'Team Collaboration',
    title: 'Built for teams of all sizes',
    description: 'Unlimited users with granular permissions. Assign tasks, share notes, and collaborate on donor outreach with your entire development team.',
    capabilities: [
      'Unlimited user seats',
      'Granular permission controls',
      'Shared donor notes',
      'Task management system',
      'Activity feed & notifications',
      'Team performance metrics'
    ],
    imagePlaceholder: 'Team Dashboard',
  },
]

export default function FeaturesTabs() {
  const [activeTab, setActiveTab] = useState('analytics')

  const activeFeature = features.find(f => f.id === activeTab) || features[0]
  const Icon = activeFeature.icon

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold text-[#2C3E50] leading-tight mb-6"
            style={{ letterSpacing: '-0.01em' }}
          >
            Enterprise features. Nonprofit pricing.
          </h2>
          <p className="text-lg text-[#566573] leading-relaxed">
            Every tool your development team needs to scale fundraising operations efficiently.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-12 justify-center">
          {features.map((feature) => {
            const TabIcon = feature.icon
            return (
              <button
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-250 ${
                  activeTab === feature.id
                    ? 'bg-gradient-to-r from-[#764ba2] to-[#FF6B35] text-white shadow-lg'
                    : 'bg-[#F4F6F8] text-[#566573] hover:bg-[#EBF5FB]'
                }`}
              >
                <TabIcon size={18} weight="bold" />
                {feature.label}
              </button>
            )
          })}
        </div>

        {/* Active tab content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Details */}
          <div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#764ba2]/10 to-[#FF6B35]/10 flex items-center justify-center mb-6">
              <Icon size={28} weight="bold" className="text-[#764ba2]" />
            </div>

            <h3 className="text-3xl font-bold text-[#2C3E50] mb-4"
                style={{ letterSpacing: '-0.01em' }}>
              {activeFeature.title}
            </h3>

            <p className="text-lg text-[#566573] leading-relaxed mb-8">
              {activeFeature.description}
            </p>

            {/* Capabilities grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeFeature.capabilities.map((capability, index) => (
                <div key={index} className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-[#2C3E50]">{capability}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual/Screenshot */}
          <div>
            <div
              className="aspect-video rounded-xl overflow-hidden shadow-xl border border-[#D5DBDB] bg-gradient-to-br from-[#F4F6F8] to-[#EBF5FB] flex items-center justify-center"
            >
              <p className="text-[#95A5A6]">{activeFeature.imagePlaceholder}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
