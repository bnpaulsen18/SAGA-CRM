import SiteNav from '@/components/marketing/SiteNav'
import SiteFooter from '@/components/marketing/SiteFooter'

export const metadata = {
  title: 'Terms of Service',
  description: 'The terms that govern your use of SAGA CRM, including subscriptions, fees, and donation processing.',
  alternates: { canonical: 'https://sagacrm.io/terms' },
}

const LAST_UPDATED = 'June 22, 2026'

const sections: { heading: string; body: string[] }[] = [
  {
    heading: '1. Agreement to Terms',
    body: [
      'These Terms of Service ("Terms") govern your access to and use of the SAGA CRM website and platform (the "Service") provided by SAGA CRM ("SAGA," "we," "us," or "our"). By creating an account or using the Service, you agree to these Terms. If you do not agree, do not use the Service.',
    ],
  },
  {
    heading: '2. The Service',
    body: [
      'SAGA provides donor-management and fundraising software for nonprofit organizations, including contact and donation management, campaigns, reporting, and online donation processing through our payment partner. We may update, improve, or change the Service over time.',
    ],
  },
  {
    heading: '3. Accounts and Eligibility',
    body: [
      'You must provide accurate information when creating an account and keep it up to date. You are responsible for safeguarding your login credentials and for all activity under your account. If you create an account on behalf of an organization, you represent that you are authorized to bind that organization to these Terms.',
    ],
  },
  {
    heading: '4. Subscriptions and Fees',
    body: [
      'SAGA is offered as a subscription at $100 per month per organization. In addition, a platform fee of 2% applies to donations processed through the Service. Standard payment-processing fees charged by our payment processor (Stripe) are separate and also apply.',
      'Subscription fees are billed in advance on a recurring monthly basis through Stripe and are non-refundable except where required by law. Platform fees are deducted at the time each donation is processed. You authorize us and our payment processor to charge your payment method for all applicable fees.',
      'We may change our pricing or fees. If we do, we will give you reasonable advance notice, and changes will take effect on your next billing cycle. All fees are exclusive of taxes, which you are responsible for where applicable.',
    ],
  },
  {
    heading: '5. Donations and Payment Processing',
    body: [
      'Online donations are processed through Stripe and Stripe Connect. By accepting donations through the Service, your organization agrees to Stripe’s applicable terms. SAGA facilitates these transactions but is not the recipient of the donations and is not a party to the relationship between your organization and its donors.',
      'Your organization is solely responsible for the lawfulness of its fundraising, for issuing tax receipts and acknowledgments, for any donor refunds, and for compliance with all applicable charitable-solicitation, tax, and consumer-protection laws.',
    ],
  },
  {
    heading: '6. Acceptable Use',
    body: [
      'You agree not to misuse the Service. You will not use it for any unlawful purpose; upload malicious code; attempt to gain unauthorized access to the Service or other accounts; scrape or harvest data without permission; infringe others’ intellectual-property or privacy rights; or send unsolicited or deceptive communications through the Service.',
    ],
  },
  {
    heading: '7. Your Data and Ownership',
    body: [
      'As between you and SAGA, you own the data you submit to the Service, including your contact and donor records ("Customer Data"). You grant us a limited license to host, process, and use Customer Data solely to provide and improve the Service and as described in our Privacy Policy.',
      'You are responsible for the accuracy of Customer Data and for having the necessary rights and consents to provide it to us. You can export your Customer Data while your account is active.',
    ],
  },
  {
    heading: '8. Intellectual Property',
    body: [
      'The Service, including its software, design, and content (excluding Customer Data), is owned by SAGA and protected by intellectual-property laws. We grant you a limited, non-exclusive, non-transferable right to use the Service in accordance with these Terms. You may not copy, modify, reverse-engineer, or resell the Service.',
    ],
  },
  {
    heading: '9. Disclaimers',
    body: [
      'The Service is provided "as is" and "as available," without warranties of any kind, whether express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Service will be uninterrupted, error-free, or completely secure.',
    ],
  },
  {
    heading: '10. Limitation of Liability',
    body: [
      'To the maximum extent permitted by law, SAGA will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of data, revenue, or profits, arising out of or related to your use of the Service. Our total liability for any claim relating to the Service will not exceed the amount you paid us in the twelve months before the event giving rise to the claim.',
    ],
  },
  {
    heading: '11. Indemnification',
    body: [
      'You agree to indemnify and hold harmless SAGA from any claims, damages, losses, and expenses (including reasonable legal fees) arising out of your use of the Service, your Customer Data, or your violation of these Terms or applicable law.',
    ],
  },
  {
    heading: '12. Termination',
    body: [
      'You may cancel your subscription at any time; access continues until the end of the current billing period. We may suspend or terminate your access if you violate these Terms or if necessary to protect the Service or other users. Upon termination, your right to use the Service ends, and we may delete Customer Data after a reasonable retention period as described in our Privacy Policy.',
    ],
  },
  {
    heading: '13. Governing Law',
    body: [
      'These Terms are governed by the laws of the State of Delaware, United States, without regard to its conflict-of-laws rules. You agree to the exclusive jurisdiction of the state and federal courts located in Delaware for any dispute that is not subject to arbitration or small-claims resolution.',
    ],
  },
  {
    heading: '14. Changes to These Terms',
    body: [
      'We may update these Terms from time to time. When we make material changes, we will update the "Last updated" date above and, where appropriate, notify you. Your continued use of the Service after an update means you accept the revised Terms.',
    ],
  },
  {
    heading: '15. Contact Us',
    body: ['Questions about these Terms? Contact us at legal@sagacrm.io.'],
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF6EF] text-[#2A2433]">
      <SiteNav />

      <section className="max-w-3xl mx-auto px-6 pt-20 pb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">Terms of Service</h1>
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
