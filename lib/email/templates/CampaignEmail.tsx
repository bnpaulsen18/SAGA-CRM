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
  Link,
} from '@react-email/components'

interface CampaignEmailProps {
  subject: string
  previewText?: string
  body: string
  recipientName: string
  organizationName: string
  unsubscribeUrl?: string
}

export default function CampaignEmail({
  subject,
  previewText,
  body,
  recipientName,
  organizationName,
  unsubscribeUrl
}: CampaignEmailProps) {
  // Replace variables in body text
  const processedBody = body
    .replace(/{{firstName}}/g, recipientName.split(' ')[0])
    .replace(/{{lastName}}/g, recipientName.split(' ').slice(1).join(' ') || '')
    .replace(/{{organizationName}}/g, organizationName)

  // Convert line breaks to paragraphs
  const paragraphs = processedBody.split('\n\n').filter(p => p.trim())

  return (
    <Html>
      <Head />
      {previewText && <Preview>{previewText}</Preview>}
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>{organizationName}</Heading>
          </Section>

          {/* Email Content */}
          <Section style={section}>
            {paragraphs.map((paragraph, index) => (
              <Text key={index} style={text}>
                {paragraph.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < paragraph.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </Text>
            ))}
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Hr style={hr} />
            <Text style={footerText}>
              You're receiving this email because you're a valued member of the {organizationName} community.
            </Text>
            {unsubscribeUrl && (
              <Text style={footerText}>
                <Link href={unsubscribeUrl} style={link}>
                  Unsubscribe
                </Link>
                {' | '}
                <Link href={`mailto:${organizationName.toLowerCase().replace(/\s/g, '')}@example.com`} style={link}>
                  Contact Us
                </Link>
              </Text>
            )}
            <Text style={footerText}>
              © {new Date().getFullYear()} {organizationName}. All rights reserved.
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
  margin: '0',
}

const section = {
  padding: '30px 40px',
}

const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 20px 0',
}

const footer = {
  backgroundColor: '#f8f9fa',
  padding: '30px 40px',
  borderTop: '1px solid #e0e0e0',
}

const hr = {
  borderColor: '#e0e0e0',
  margin: '20px 0',
}

const footerText = {
  color: '#666666',
  fontSize: '13px',
  lineHeight: '22px',
  margin: '0 0 10px 0',
  textAlign: 'center' as const,
}

const link = {
  color: '#764ba2',
  textDecoration: 'underline',
}
