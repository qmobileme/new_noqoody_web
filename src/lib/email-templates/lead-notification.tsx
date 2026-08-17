import React from 'react'
import {
  Body, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  formType?: string
  fullName?: string
  email?: string
  phone?: string
  company?: string
  industry?: string
  monthlyVolume?: string
  message?: string
}

const rows = (p: Props): Array<[string, string]> =>
  (
    [
      ['Form', p.formType ?? 'contact'],
      ['Name', p.fullName ?? ''],
      ['Email', p.email ?? ''],
      ['Phone', p.phone ?? ''],
      ['Company', p.company ?? ''],
      ['Industry', p.industry ?? ''],
      ['Expected monthly volume', p.monthlyVolume ?? ''],
    ] as Array<[string, string]>
  ).filter(([, v]) => v)

const Email = (p: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`New ${p.formType ?? 'contact'} submission from ${p.fullName ?? 'a visitor'}`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New website submission</Heading>
        <Text style={muted}>Someone submitted a form on noqoody.com.</Text>
        <Hr style={hr} />
        <Section>
          {rows(p).map(([label, value]) => (
            <Text key={label} style={row}>
              <span style={key}>{label}: </span>
              <span style={val}>{value}</span>
            </Text>
          ))}
        </Section>
        {p.message ? (
          <>
            <Hr style={hr} />
            <Text style={key}>Message</Text>
            <Text style={val}>{p.message}</Text>
          </>
        ) : null}
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    `New ${data['formType'] ?? 'contact'} submission — ${data['fullName'] ?? 'Website'}`,
  displayName: 'Lead notification (internal)',
  to: 'info@noqoody.com',
  previewData: {
    formType: 'contact',
    fullName: 'Aisha Al-Thani',
    email: 'aisha@dohatrading.qa',
    phone: '+974 5555 1234',
    company: 'Doha Trading W.L.L.',
    message: 'We would like a quote for 10 smart POS terminals.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '600px' }
const h1 = { fontSize: '22px', color: '#b0161c', margin: '0 0 6px' }
const muted = { fontSize: '14px', color: '#6b6b6b', margin: '0' }
const hr = { borderColor: '#f0e3d6', margin: '18px 0' }
const row = { fontSize: '14px', margin: '0 0 8px', color: '#222222' }
const key = { fontWeight: 'bold' as const, color: '#dd8127' }
const val = { color: '#222222' }
