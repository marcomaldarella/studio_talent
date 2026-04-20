'use client'

import { useActionState, useRef } from 'react'
import { sendContactEmail, type ContactResult } from './actions'
import '../../styles/contact.css'

const initial: ContactResult | null = null

export default function ContactForm() {
  const [state, action, pending] = useActionState(sendContactEmail, initial)
  const formRef = useRef<HTMLFormElement>(null)

  // Reset form on success
  if (state?.success && formRef.current) {
    formRef.current.reset()
  }

  return (
    <div className="st-contact-form-col">
      <div className="st-contact-form-label">
        <span className="st-contact-dot" aria-hidden="true" />
        Form
      </div>

      {state?.success ? (
        <div className="st-contact-success">
          <p>Messaggio inviato.</p>
          <p>Ti risponderemo al più presto.</p>
        </div>
      ) : (
        <form ref={formRef} action={action}>
          <div className="st-contact-field">
            <label htmlFor="nome">Nome *</label>
            <input type="text" id="nome" name="nome" autoComplete="name" required />
          </div>
          <div className="st-contact-field">
            <label htmlFor="azienda">Azienda</label>
            <input type="text" id="azienda" name="azienda" autoComplete="organization" />
          </div>
          <div className="st-contact-field">
            <label htmlFor="email">Email *</label>
            <input type="email" id="email" name="email" autoComplete="email" required />
          </div>
          <div className="st-contact-field">
            <label htmlFor="messaggio">Messaggio *</label>
            <textarea id="messaggio" name="messaggio" rows={5} required />
          </div>

          {state?.error && (
            <p className="st-contact-error">{state.error}</p>
          )}

          <div className="st-contact-submit-row">
            <button type="submit" className="st-contact-submit" disabled={pending}>
              {pending ? 'Invio...' : 'Invia'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
