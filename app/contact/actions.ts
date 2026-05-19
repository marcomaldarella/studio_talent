'use server'

import { Resend } from 'resend'

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

  if (!process.env.RESEND_API_KEY) {
    console.log('[Contact Form]', { nome, azienda, email, messaggio })
    return { success: true }
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'Studio Talent <info@studiotalent.it>',
      to: 'info@studiotalent.it',
      replyTo: email,
      subject: `Nuovo messaggio da ${nome}${azienda ? ` · ${azienda}` : ''}`,
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
    console.error('[Contact Form] Resend error:', err)
    return { success: false, error: "Errore nell'invio. Riprova più tardi." }
  }
}
