import React from 'react'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  reference?: string
  contactName?: string
  businessName?: string
  phone?: string
  monthlyVolume?: string
  totalUnits?: number
  paymentUrl?: string
  trackingUrl?: string
  items?: Array<{ name?: string; quantity?: number }>
}

const Email = (p: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`Your Noqoody POS order ${p.reference ?? ''} is confirmed`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Thank you for your order</Heading>
        <Text style={muted}>
          Hi {p.contactName ?? 'there'}, we received your Noqoody POS order. Our team will be in
          touch within one business day.
        </Text>
        <Text style={refBox}>Order reference: <span style={key}>{p.reference ?? '—'}</span></Text>
        <Hr style={hr} />
        <Text style={key}>Your devices</Text>
        {(p.items ?? []).map((item, i) => (
          <Text key={i} style={row}>{item.quantity ?? 1} × {item.name ?? 'Device'}</Text>
        ))}
        <Text style={row}><span style={key}>Total units: </span>{p.totalUnits ?? 0}</Text>
        <Hr style={hr} />
        <Section>
          <Text style={row}><span style={key}>Business: </span>{p.businessName ?? ''}</Text>
          <Text style={row}><span style={key}>Phone: </span>{p.phone ?? ''}</Text>
          <Text style={row}><span style={key}>Monthly volume: </span>{p.monthlyVolume ?? ''}</Text>
        </Section>
        {p.paymentUrl ? (
          <>
            <Hr style={hr} />
            <Text style={row}>
              Complete your setup payment with the secure Noqoody payment link below.
            </Text>
            <Button href={p.paymentUrl} style={button}>Pay securely</Button>
            <Text style={muted}>{p.paymentUrl}</Text>
          </>
        ) : null}
        {p.trackingUrl ? (
          <>
            <Hr style={hr} />
            <Text style={row}>
              Track your order any time with your reference and this email address:
            </Text>
            <Text style={muted}>{p.trackingUrl}</Text>
          </>
        ) : null}
        <Hr style={hr} />
        <Text style={muted}>Noqoody Payment Services Co., w.l.l — Doha, Qatar</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    `Your Noqoody POS order ${data['reference'] ?? ''} is confirmed`,
  displayName: 'POS order confirmation (customer)',
  previewData: {
    reference: 'NQ-2026-000123',
    contactName: 'Aisha Al-Thani',
    businessName: 'Doha Trading W.L.L.',
    phone: '+974 5555 1234',
    monthlyVolume: 'QAR 100k - 500k',
    totalUnits: 2,
    paymentUrl: 'https://noqoody.lovable.app/pay/ABCD2345',
    trackingUrl: 'https://noqoody.lovable.app/order-tracking',
    items: [{ name: 'Noqoody Smart POS', quantity: 2 }],
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '600px' }
const h1 = { fontSize: '22px', color: '#b0161c', margin: '0 0 6px' }
const muted = { fontSize: '13px', color: '#6b6b6b', margin: '6px 0 0' }
const refBox = { fontSize: '14px', margin: '12px 0 0', color: '#222222' }
const hr = { borderColor: '#f0e3d6', margin: '18px 0' }
const row = { fontSize: '14px', margin: '0 0 8px', color: '#222222' }
const key = { fontWeight: 'bold' as const, color: '#dd8127' }
const button = {
  backgroundColor: '#dd8127', color: '#ffffff', fontSize: '15px', fontWeight: 'bold' as const,
  padding: '12px 22px', borderRadius: '8px', textDecoration: 'none', display: 'inline-block',
}
