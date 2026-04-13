import type { Metadata } from 'next'
import Footer from '../../components/Footer'
import '../../styles/contact.css'

export const metadata: Metadata = { title: 'Contact' }

export default function ContactPage() {
  return (
    <main className="st-contact">
      <div className="st-contact-body">
        {/* LEFT: form */}
        <div className="st-contact-form-col">
          <div className="st-contact-form-label">
            <span className="st-contact-dot">■</span>
            Contact form
          </div>
          <form action="#" method="POST">
            <div className="st-contact-field">
              <label htmlFor="nome">Nome</label>
              <input type="text" id="nome" name="nome" autoComplete="name" />
            </div>
            <div className="st-contact-field">
              <label htmlFor="azienda">Azienda</label>
              <input type="text" id="azienda" name="azienda" autoComplete="organization" />
            </div>
            <div className="st-contact-field">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" autoComplete="email" />
            </div>
            <div className="st-contact-field">
              <label htmlFor="messaggio">Messaggio</label>
              <textarea id="messaggio" name="messaggio" rows={4} />
            </div>
            <div className="st-contact-submit-row">
              <button type="submit" className="st-contact-submit">Invia</button>
            </div>
          </form>
        </div>

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
      <Footer />
    </main>
  )
}
