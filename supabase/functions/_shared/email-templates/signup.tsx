/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head>
      <style>{darkModeCss}</style>
    </Head>
    <Preview>Confirm your email for {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Confirm your email</Heading>
        <Text style={text}>
          Thank you for creating your free Empowered DLD Resource Library account!
        </Text>
        <Text style={text}>
          Please confirm your email address to start exploring our collection of practical tools, educational resources, and materials designed to support people with Developmental Language Disorder (DLD).
        </Text>
        <Section style={buttonSection}>
          <Button className="dm-btn" style={button} href={confirmationUrl}>
            Verify Email
          </Button>
        </Section>
        <Text style={footer}>
          If you didn't create an account, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'DM Sans, Arial, sans-serif', margin: '0', padding: '24px 0' }
const container = {
  width: '100%',
  maxWidth: '560px',
  margin: '0 auto',
  padding: '24px',
  boxSizing: 'border-box' as const,
  textAlign: 'center' as const,
}
const h1 = {
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: 'hsl(0, 0%, 7%)',
  lineHeight: '1.3',
  margin: '0 0 24px',
}
const text = {
  fontSize: '16px',
  color: 'hsl(0, 0%, 33%)',
  lineHeight: '1.65',
  margin: '0 0 20px',
}
const buttonSection = { padding: '8px 0 0', textAlign: 'center' as const }
const button = {
  backgroundColor: 'hsl(258, 50%, 50%)',
  color: '#ffffff',
  fontSize: '14px',
  border: '1px solid hsl(258, 50%, 50%)',
  borderRadius: '8px',
  padding: '12px 20px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', lineHeight: '1.5', color: 'hsl(0, 0%, 33%)', margin: '28px 0 0' }
// Rendered as a text child, which React may HTML-escape: keep this CSS free of >, &, and quotes.
const darkModeCss = `
  @media (prefers-color-scheme: dark) {
    .dm-btn { background-color: hsl(258, 50%, 50%) !important; color: #ffffff !important; }
  }
  [data-ogsc] .dm-btn { background-color: hsl(258, 50%, 50%) !important; color: #ffffff !important; }
  [data-ogsb] .dm-btn { background-color: hsl(258, 50%, 50%) !important; color: #ffffff !important; }
`
