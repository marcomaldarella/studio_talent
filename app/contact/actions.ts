'use server'

import nodemailer from 'nodemailer'

export interface ContactResult {
  success: boolean
  error?: string
}

export async function sendContactEmail(_: ContactResult | null, formData: FormData): Promise<ContactResult> {
  const nome = (formData.get('nome') as string)?.trim()
  const azienda = (formData.get('azienda') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const messaggio = (formData.get('messaggio') as string)?.trim()

  if (!nome || !email || !messaggio) {
    return { success: false, error: 'Compila tutti i campi obbligatori.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { success: false, error: 'Inserisci un indirizzo email valido.' }
  }

  // If SMTP not configured, log and return success (dev mode)
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.log('[Contact Form]', { nome, azienda, email, messaggio })
    return { success: true }
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: `"Studio Talent — Form" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL ?? 'info@studiotalent.com',
      replyTo: email,
      subject: `Nuovo messaggio da ${nome}${azienda ? ` · ${azienda}` : ''}`,
      text: `Nome: ${nome}\nAzienda: ${azienda || '—'}\nEmail: ${email}\n\n${messaggio}`,
      html: `
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Azienda:</strong> ${azienda || '—'}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <hr/>
        <p style="white-space:pre-wrap">${messaggio}</p>
      `,
    })

    return { success: true }
  } catch (err) {
    console.error('[Contact Form] Email error:', err)
    return { success: false, error: 'Errore nell\'invio. Riprova più tardi.' }
  }
}
