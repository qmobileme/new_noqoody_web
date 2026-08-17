import React from 'react'
import {
  Body, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  reference?: string
  businessName?: string
  contactName?: string
  email?: string
  phone?: string
  monthlyVolume?: string
  existingMerchant?: boolean
  items?: Array<{ name?: string; quantity?: number }>
}

const Email = (p: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`New POS order ${p.reference ?? ''} from ${p.businessName ?? 'a merchant'}`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New POS order</Heading>
        <Text style={muted}>Reference: {p.reference ?? '—'}</Text>
        <Hr style={hr} />
        <Section>
          <Text style={row}><span style={key}>Business: </span>{p.businessName ?? ''}</Text>
          <Text style={row}><span style={key}>Contact: </span>{p.contactName ?? ''}</Text>
          <Text style={row}><span style={key}>Email: </span>{p.email ?? ''}</Text>
          <Text style={row}><span style={key}>Phone: </span>{p.phone ?? ''}</Text>
          <Text style={row}><span style={key}>Monthly volume: </span>{p.monthlyVolume ?? ''}</Text>
          <Text style={row}>
            <span style={key}>Existing merchant: </span>{p.existingMerchant ? 'Yes' : 'No'}
          </Text>
        </Section>
        <Hr style={hr} />
        <Text style={key}>Items</Text>
        {(p.items ?? []).map((item, i) => (
          <Text key={i} style={row}>
            {item.quantity ?? 1} × {item.name ?? 'Device'}
          </Text>
        ))}
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Record<string, any>) => `New POS order ${data['reference'] ?? ''}`,
  displayName: 'POS order notification (internal)',
  to: 'info@noqoody.com',
  previewData: {
    reference: 'NQ-2026-000123',
    businessName: 'Doha Trading W.L.L.',
    contactName: 'Aisha Al-Thani',
    email: 'aisha@dohatrading.qa',
    phone: '+974 5555 1234',
    monthlyVolume: 'QAR 100k - 500k',
    existingMerchant: false,
    items: [{ name: 'Noqoody Smart POS', quantity: 2 }],
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '600px' }
const h1 = { fontSize: '22px', color: '#b0161c', margin: '0 0 6px' }
const muted = { fontSize: '14px', color: '#6b6b6b', margin: '0' }
const hr = { borderColor: '#f0e3d6', margin: '18px 0' }
const row = { fontSize: '14px', margin: '0 0 8px', color: '#222222' }
const key = { fontWeight: 'bold' as const, color: '#dd8127' }
