import 'server-only'

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

type SesEnv = {
  region: string
  fromEmail: string
  replyTo: string | null
  client: SESClient
}

function readSesEnv(): SesEnv | null {
  const region = (process.env.SES_REGION ?? process.env.AWS_REGION)?.trim()
  const fromEmail = process.env.SES_FROM_EMAIL?.trim()
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID?.trim()
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY?.trim()
  const replyTo = process.env.SES_REPLY_TO?.trim() || null

  if (!region || !fromEmail || !accessKeyId || !secretAccessKey) {
    return null
  }

  return {
    region,
    fromEmail,
    replyTo,
    client: new SESClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    }),
  }
}

export function getSesConfigStatus() {
  const env = readSesEnv()
  if (!env) {
    return { configured: false as const, region: null, fromEmail: null }
  }
  return {
    configured: true as const,
    region: env.region,
    fromEmail: env.fromEmail,
  }
}

export async function sendSesEmail(input: {
  to: string
  subject: string
  text: string
  html: string
  fromName?: string
}) {
  const env = readSesEnv()
  if (!env) {
    return { error: 'SES is not configured (check SES_FROM_EMAIL and AWS env vars).' as const }
  }

  const to = input.to.trim().toLowerCase()
  if (!to) {
    return { error: 'Missing recipient email.' as const }
  }

  const fromName = input.fromName?.trim() || 'Kappa Theta Pi'
  const source = `${fromName} <${env.fromEmail}>`

  try {
    await env.client.send(
      new SendEmailCommand({
        Source: source,
        Destination: { ToAddresses: [to] },
        ReplyToAddresses: env.replyTo ? [env.replyTo] : undefined,
        Message: {
          Subject: { Data: input.subject, Charset: 'UTF-8' },
          Body: {
            Text: { Data: input.text, Charset: 'UTF-8' },
            Html: { Data: input.html, Charset: 'UTF-8' },
          },
        },
      })
    )
    return { error: null }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'SES send failed.'
    return { error: message }
  }
}
