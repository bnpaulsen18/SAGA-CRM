import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components'

interface DonationReceiptEmailProps {
  donorName: string
  amount: number
  date: string
  organizationName: string
  taxId: string
  receiptNumber: string
  method: string
  fundRestriction: string
  campaign?: string
  aiThankYouMessage?: string
}

export default function DonationReceiptEmail({
  donorName,
  amount,
  date,
  organizationName,
  taxId,
  receiptNumber,
  method,
  fundRestriction,
  campaign,
  aiThankYouMessage
}: DonationReceiptEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Thank you for your generous donation of ${amount.toLocaleString()}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>Thank You for Your Generous Gift!</Heading>
            <Text style={subtitle}>Your donation receipt from {organizationName}</Text>
          </Section>

          {/* Greeting */}
          <Section style={section}>
            <Text style={text}>Dear {donorName},</Text>
            <Text style={text}>
              Thank you for your generous donation of <strong>${amount.toLocaleString()}</strong>{' '}
              to {organizationName}. Your support makes a real difference in our mission.
            </Text>
          </Section>

          {/* AI-Generated Thank You Message */}
          {aiThankYouMessage && (
            <Section style={aiMessageSection}>
              <div style={aiMessageBox}>
                <Text style={aiMessage}>{aiThankYouMessage}</Text>
              </div>
            </Section>
          )}

          {/* Receipt Details */}
          <Section style={receiptBox}>
            <Heading style={h2}>Official Tax Receipt</Heading>
            <Hr style={hr} />

            <div style={detailRow}>
              <Text style={detailLabel}>Receipt Number:</Text>
              <Text style={detailValue}>{receiptNumber}</Text>
            </div>

            <div style={detailRow}>
              <Text style={detailLabel}>Donation Amount:</Text>
              <Text style={detailValue}>${amount.toLocaleString()}</Text>
            </div>

            <div style={detailRow}>
              <Text style={detailLabel}>Date:</Text>
              <Text style={detailValue}>{date}</Text>
            </div>

            <div style={detailRow}>
              <Text style={detailLabel}>Payment Method:</Text>
              <Text style={detailValue}>{method}</Text>
            </div>

            {campaign && (
              <div style={detailRow}>
                <Text style={detailLabel}>Campaign:</Text>
                <Text style={detailValue}>{campaign}</Text>
              </div>
            )}

            <Hr style={hr} />

            <Text style={taxInfo}>
              {organizationName} is a registered 501(c)(3) nonprofit organization.
            </Text>
            <Text style={taxInfo}>
              Tax ID: {taxId}
            </Text>
            <Text style={taxInfo}>
              No goods or services were provided in exchange for this donation.
            </Text>
          </Section>

          {/* Impact Message */}
          <Section style={section}>
            <Heading style={h3}>Your Impact</Heading>
            <Text style={text}>
              Your generosity helps us continue our vital work serving our community.
              Thanks to donors like you, we can make a lasting difference in the lives
              of those we serve.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              If you have any questions about your donation or this receipt,
              please don't hesitate to contact us.
            </Text>
            <Text style={footerText}>
              With gratitude,
              <br />
              The {organizationName} Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '600px',
}

const header = {
  padding: '30px 40px',
  background: 'linear-gradient(135deg, #764ba2 0%, #ff6b35 100%)',
  textAlign: 'center' as const,
}

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
}

const subtitle = {
  color: '#ffffff',
  fontSize: '16px',
  margin: '0',
  opacity: 0.9,
}

const section = {
  padding: '30px 40px',
}

const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 16px 0',
}

const aiMessageSection = {
  padding: '20px 40px',
}

const aiMessageBox = {
  backgroundColor: '#f0e7f7',
  border: '2px solid #764ba2',
  borderRadius: '8px',
  padding: '24px',
  borderLeft: '4px solid #764ba2',
}

const aiMessage = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0',
  fontStyle: 'italic' as const,
}

const receiptBox = {
  backgroundColor: '#f8f9fa',
  border: '2px solid #764ba2',
  borderRadius: '8px',
  margin: '20px 40px',
  padding: '30px',
}

const h2 = {
  color: '#764ba2',
  fontSize: '22px',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
  textAlign: 'center' as const,
}

const h3 = {
  color: '#764ba2',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
}

const hr = {
  borderColor: '#e0e0e0',
  margin: '20px 0',
}

const detailRow = {
  display: 'flex' as const,
  justifyContent: 'space-between' as const,
  marginBottom: '12px',
}

const detailLabel = {
  color: '#666666',
  fontSize: '14px',
  margin: '0',
  fontWeight: '500',
}

const detailValue = {
  color: '#333333',
  fontSize: '14px',
  margin: '0',
  fontWeight: 'bold',
}

const taxInfo = {
  color: '#666666',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '8px 0',
  textAlign: 'center' as const,
}

const footer = {
  backgroundColor: '#f8f9fa',
  padding: '30px 40px',
  borderTop: '1px solid #e0e0e0',
}

const footerText = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 16px 0',
}
