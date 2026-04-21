import type { Metadata } from 'next'
import ContactForm from './ContactForm'
import ContactAddress from './ContactAddress'
import '../../styles/contact.css'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Onira for collaborations, press inquiries, and film submissions.',
}

export default function ContactPage() {
  return (
    <main className="st-contact">
      <div className="st-contact-body">
        {/* LEFT: form */}
        <ContactForm />

        {/* RIGHT: address */}
        <div className="st-contact-info-col">
          <ContactAddress />
        </div>
      </div>
    </main>
  )
}
