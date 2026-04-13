import type { Metadata } from 'next'
import ContactForm from './ContactForm'
import '../../styles/contact.css'

export const metadata: Metadata = { title: 'Contact' }

export default function ContactPage() {
  return (
    <main className="st-contact">
      <div className="st-contact-body">
        {/* LEFT: form */}
        <ContactForm />

        {/* RIGHT: address */}
        <div className="st-contact-info-col">
          <address className="st-contact-address" style={{ fontStyle: 'normal' }}>
            <span className="st-contact-address-bold">Studio Talent SRL</span>
            <span className="st-contact-address-light">Via Francesco De Santis, 86</span>
            <span className="st-contact-address-bold">72017 Ostuni [BR]</span>
            <span className="st-contact-address-light">P.IVA 02645640745</span>
          </address>
        </div>
      </div>
    </main>
  )
}
