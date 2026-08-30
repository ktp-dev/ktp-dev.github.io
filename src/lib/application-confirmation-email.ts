import 'server-only'

import { applicationTitle, formatApplyDeadline } from '@/lib/apply-steps'
import { sendSesEmail } from '@/lib/ses'

const IMAGE_BASE = 'https://invividl.github.io/test-blast/f26'
const BROWSER_PREVIEW_URL = 'https://ktpmichigan.com/emails/f26-rush/application-received.html'
const BOARD_EMAIL = 'ktp-board@umich.edu'

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function greetingName(input: {
  preferredName?: string | null
  firstName?: string | null
}) {
  const preferred = input.preferredName?.trim()
  if (preferred) return preferred
  const first = input.firstName?.trim()
  if (first) return first
  return null
}

function applySiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (configured) return configured.replace(/\/$/, '')
  if (process.env.VERCEL_ENV === 'production') return 'https://ktpmichigan.com'
  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, '')}`
  return 'http://localhost:3000'
}

function buildConfirmationHtml(input: {
  hello: string
  title: string
  deadline: string | null
  applyUrl: string
}) {
  const safeHello = escapeHtml(input.hello)
  const safeTitle = escapeHtml(input.title)
  const safeDeadline = input.deadline ? escapeHtml(input.deadline) : null
  const safeApplyUrl = escapeHtml(input.applyUrl)
  const safeBoard = escapeHtml(BOARD_EMAIL)
  const topBanner = `${IMAGE_BASE}/top_banner.png`
  const bottomBanner = `${IMAGE_BASE}/bottom_banner.png`

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safeTitle}</title>
    <link rel="icon" type="image/png" href="https://ktpmichigan.com/favicon.png">
</head>
<body style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f0f8ff; line-height: 1.6;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
        <tr>
            <td align="center" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f0f8ff; padding: 0;" bgcolor="#f0f8ff">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; margin: 0 auto; width: 600px; max-width: 600px; background-color: #ffffff;" bgcolor="#ffffff">

                    <tr>
                        <td style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <img src="${topBanner}" alt="Kappa Theta Pi Alpha Chapter" style="-ms-interpolation-mode: bicubic; border: 0; line-height: 100%; outline: none; text-decoration: none; width: 100%; height: auto; display: block;">
                        </td>
                    </tr>

                    <tr>
                        <td style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 30px 40px; background-color: #ffffff;" bgcolor="#ffffff">
                            <p style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">${safeHello}</p>

                            <p style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">Thank you for applying to Kappa Theta Pi at the University of Michigan!</p>

                            <p style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">Your application for <strong style="color: #224C8B;">${safeTitle}</strong> has been successfully received.</p>

                            <p style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">${
                              safeDeadline
                                ? `You may continue editing your responses until <strong style="color: #224C8B;">${safeDeadline}</strong>.`
                                : 'You may continue editing your responses until the application deadline.'
                            }</p>

                            <p style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; margin: 0; font-size: 16px; line-height: 1.6;">View or update your application here:</p>
                        </td>
                    </tr>

                    <tr>
                        <td style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: center; padding: 0 40px 30px 40px;" align="center">
                            <a href="${safeApplyUrl}" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; display: inline-block; background-color: #BAEBBA; color: #224C8B; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 16px; width: 220px; text-align: center;">View Application</a>
                        </td>
                    </tr>

                    <tr>
                        <td style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 40px 30px 40px; background-color: #ffffff;" bgcolor="#ffffff">
                            <p style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">If you have any questions about your application or the rush process, please email <a href="mailto:${safeBoard}" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; color: #224C8B;">${safeBoard}</a>.</p>

                            <p style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; margin: 0; font-size: 16px; line-height: 1.6;">
                                Best,<br>
                                Kappa Theta Pi<br>
                                University of Michigan
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 40px 30px 40px; background-color: #ffffff;" bgcolor="#ffffff">
                            <p style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; margin: 0; font-size: 16px; line-height: 1.6;">Visit <a href="https://ktpmichigan.com" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; color: #224C8B;">ktpmichigan.com</a> and follow <a href="https://instagram.com/ktpumich" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; color: #224C8B;">@ktpumich</a> to learn more.</p>
                        </td>
                    </tr>

                    <tr>
                        <td style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <img src="${bottomBanner}" alt="Kappa Theta Pi" style="-ms-interpolation-mode: bicubic; border: 0; line-height: 100%; outline: none; text-decoration: none; width: 100%; height: auto; display: block;">
                        </td>
                    </tr>

                    <tr>
                        <td style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f0f8ff; padding: 10px 20px; text-align: center;" bgcolor="#f0f8ff" align="center">
                            <p style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; margin: 0; font-size: 12px; color: #666;">
                                Having trouble viewing this email?
                                <a href="${BROWSER_PREVIEW_URL}" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; color: #224C8B; text-decoration: underline;">View in browser</a>
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
}

export async function sendApplicationConfirmation(input: {
  email: string
  preferredName?: string | null
  firstName?: string | null
  cycleName: string
  closesAt: string
}) {
  const name = greetingName(input)
  const title = applicationTitle(input.cycleName)
  const deadline = formatApplyDeadline(input.closesAt)
  const applyUrl = `${applySiteUrl()}/apply`

  const hello = name ? `Hi ${name},` : 'Hi,'
  const subject = `${title} Received`

  const text = [
    hello,
    '',
    'Thank you for applying to Kappa Theta Pi at the University of Michigan!',
    '',
    `Your application for ${title} has been successfully received.`,
    deadline
      ? `You may continue editing your responses until ${deadline}.`
      : 'You may continue editing your responses until the application deadline.',
    '',
    `View or update your application: ${applyUrl}`,
    '',
    `If you have any questions about your application or the rush process, please email ${BOARD_EMAIL}.`,
    '',
    'Best,',
    'Kappa Theta Pi',
    'University of Michigan',
  ].join('\n')

  const html = buildConfirmationHtml({
    hello,
    title,
    deadline,
    applyUrl,
  })

  return sendSesEmail({
    to: input.email,
    subject,
    text,
    html,
  })
}
