import type { Metadata } from 'next'
import '../../styles/privacy.css'

export const metadata: Metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <main className="st-privacy">
      <div className="st-privacy-body">
        <div className="st-privacy-left" />
        <div className="st-privacy-right">
          <h1 className="st-privacy-title">Privacy Policy</h1>

          <section className="st-privacy-section">
            <h2 className="st-privacy-heading">Titolare del Trattamento</h2>
            <p>Studio Talent SRL</p>
            <p>Via Francesco De Santis, 86</p>
            <p>72017 Ostuni (BR)</p>
            <p>P.IVA 02645640745</p>
            <p>Email: <a href="mailto:info@studiotalent.it">info@studiotalent.it</a></p>
          </section>

          <section className="st-privacy-section">
            <h2 className="st-privacy-heading">Dati Raccolti</h2>
            <p>
              Il presente sito raccoglie dati personali esclusivamente tramite il
              modulo di contatto (nome, azienda, indirizzo email, messaggio).
              I dati vengono utilizzati unicamente per rispondere alle richieste
              degli utenti e non vengono ceduti a terzi.
            </p>
          </section>

          <section className="st-privacy-section">
            <h2 className="st-privacy-heading">Cookie</h2>
            <p>
              Il sito utilizza esclusivamente cookie tecnici necessari al
              corretto funzionamento della navigazione. Non vengono installati
              cookie di profilazione o di tracciamento di terze parti senza il
              consenso esplicito dell&apos;utente.
            </p>
          </section>

          <section className="st-privacy-section">
            <h2 className="st-privacy-heading">Base Giuridica</h2>
            <p>
              Il trattamento dei dati avviene ai sensi dell&apos;art. 6 lett. b)
              del Regolamento UE 2016/679 (GDPR), ovvero per l&apos;esecuzione di
              misure precontrattuali adottate su richiesta dell&apos;interessato.
            </p>
          </section>

          <section className="st-privacy-section">
            <h2 className="st-privacy-heading">Diritti dell&apos;Interessato</h2>
            <p>
              L&apos;utente ha diritto di accedere ai propri dati personali,
              richiederne la rettifica, la cancellazione, la limitazione del
              trattamento, nonché di opporsi al trattamento e di esercitare il
              diritto alla portabilità dei dati. Le richieste possono essere
              inviate all&apos;indirizzo email del Titolare.
            </p>
          </section>

          <section className="st-privacy-section">
            <h2 className="st-privacy-heading">Conservazione dei Dati</h2>
            <p>
              I dati personali raccolti tramite il modulo di contatto vengono
              conservati per il tempo strettamente necessario a gestire la
              richiesta ricevuta, e comunque non oltre 12 mesi dalla ricezione.
            </p>
          </section>

          <section className="st-privacy-section">
            <h2 className="st-privacy-heading">Aggiornamenti</h2>
            <p>
              La presente informativa può essere aggiornata in qualsiasi momento.
              La data dell&apos;ultima modifica è indicata in calce al documento.
            </p>
            <p className="st-privacy-date">Ultimo aggiornamento: Aprile 2026</p>
          </section>
        </div>
      </div>
    </main>
  )
}
