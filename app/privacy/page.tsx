import SiteNav from '@/components/marketing/SiteNav'
import SiteFooter from '@/components/marketing/SiteFooter'

export const metadata = {
  title: 'Privacy Policy',
  description: 'How SAGA CRM collects, uses, shares, and protects personal information — yours and your donors’.',
  alternates: { canonical: 'https://sagacrm.io/privacy' },
}

const LAST_UPDATED = 'June 22, 2026'

const sections: { heading: string; body: string[] }[] = [
  {
    heading: '1. Introduction',
    body: [
      'SAGA CRM ("SAGA," "we," "us," or "our") provides donor-management and fundraising software for nonprofit organizations. This Privacy Policy explains how we collect, use, share, and protect personal information when you visit our website or use our platform (collectively, the "Service").',
      'We act in two roles. For information about our own account holders, we are a data controller. For the donor and contact data that an organization uploads or collects through the Service, we act as a data processor on that organization\'s behalf — the organization is the controller of that data and is responsible for how it is collected and used.',
    ],
  },
  {
    heading: '2. Information We Collect',
    body: [
      'Account information: when you create an account we collect your name, email address, organization name, role, and login credentials.',
      'Organization and donor data: the Service lets you store information about your contacts and donors — such as names, contact details, giving history, and notes — which you and your team enter or import. You control this data.',
      'Payment information: when you subscribe to a paid plan or process donations, payments are handled by our payment processor, Stripe. We do not collect or store full card numbers; we receive limited information such as the last four digits, card brand, and transaction status.',
      'Usage and device data: we automatically collect information about how you use the Service, including IP address, browser type, pages viewed, and timestamps, to operate, secure, and improve the Service.',
      'Cookies: we use cookies and similar technologies as described in the "Cookies and Tracking" section below.',
    ],
  },
  {
    heading: '3. How We Use Information',
    body: [
      'We use personal information to: provide, maintain, and improve the Service; create and manage accounts; process subscriptions and donation transactions; respond to support requests; send service-related and, where permitted, marketing communications; detect and prevent fraud and abuse; and comply with our legal obligations.',
      'We do not sell personal information, and we do not use the donor data you store in SAGA for our own marketing.',
    ],
  },
  {
    heading: '4. Your Donors’ Data',
    body: [
      'The contacts and donors you manage in SAGA belong to your organization. We process that data only to provide the Service to you and according to your instructions. Your organization is responsible for having an appropriate legal basis and any required consents for the data it collects, and for honoring the privacy rights of its own donors.',
    ],
  },
  {
    heading: '5. How We Share Information',
    body: [
      'Service providers: we share information with vendors who help us run the Service — for example Stripe (payment processing), our cloud hosting and database provider, email-delivery providers, and analytics providers — under contracts that require them to protect the data.',
      'Legal and safety: we may disclose information if required by law, regulation, legal process, or to protect the rights, property, or safety of SAGA, our users, or others.',
      'Business transfers: if SAGA is involved in a merger, acquisition, or sale of assets, information may be transferred as part of that transaction, subject to this Policy.',
      'We never sell your personal information or your donors’ personal information.',
    ],
  },
  {
    heading: '6. Cookies and Tracking',
    body: [
      'We use strictly necessary cookies to operate the Service (for example, to keep you signed in) and, with your consent where required, analytics cookies to understand usage. You can manage non-essential cookies through our consent banner and your browser settings.',
    ],
  },
  {
    heading: '7. Data Retention',
    body: [
      'We retain personal information for as long as your account is active or as needed to provide the Service, and afterward only as required to comply with legal obligations, resolve disputes, and enforce our agreements. You may request deletion of your account data as described below.',
    ],
  },
  {
    heading: '8. Data Security',
    body: [
      'We protect personal information using encryption in transit and at rest, access controls, and trusted infrastructure providers. No method of transmission or storage is completely secure, but we work to safeguard your information and to promptly address issues. Learn more on our Security page.',
    ],
  },
  {
    heading: '9. Your Privacy Rights',
    body: [
      'Depending on where you live, you may have the right to access, correct, delete, or export your personal information, and to object to or restrict certain processing. To exercise these rights, contact us at privacy@sagacrm.io.',
      'If you are in the European Economic Area or the United Kingdom (GDPR), you may also have the right to lodge a complaint with your local data-protection authority. If you are a California resident (CCPA/CPRA), you have the right to know what personal information we collect, to request deletion, and not to be discriminated against for exercising your rights; we do not sell personal information.',
    ],
  },
  {
    heading: '10. International Data Transfers',
    body: [
      'We are based in the United States and may process information in the United States and other countries. Where required, we use appropriate safeguards for international transfers of personal information.',
    ],
  },
  {
    heading: '11. Children’s Privacy',
    body: [
      'The Service is intended for organizations and adults. It is not directed to children, and we do not knowingly collect personal information directly from children. If you believe a child has provided us personal information, please contact us so we can remove it.',
    ],
  },
  {
    heading: '12. Changes to This Policy',
    body: [
      'We may update this Privacy Policy from time to time. When we make material changes, we will update the "Last updated" date above and, where appropriate, notify you. Your continued use of the Service after an update means you accept the revised Policy.',
    ],
  },
  {
    heading: '13. Contact Us',
    body: [
      'If you have questions about this Privacy Policy or how we handle personal information, contact us at privacy@sagacrm.io.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAF6EF] text-[#2A2433]">
      <SiteNav />

      <section className="max-w-3xl mx-auto px-6 pt-20 pb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">Privacy Policy</h1>
        <p className="text-[#9A93A3]">Last updated: {LAST_UPDATED}</p>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-24 space-y-10">
        {sections.map((s) => (
          <div key={s.heading}>
            <h2 className="text-2xl font-bold mb-4">{s.heading}</h2>
            <div className="space-y-4 text-[#6B6475] leading-relaxed">
              {s.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        ))}
      </section>

      <SiteFooter />
    </div>
  )
}
