'use client'

import AnimatedChars from '../../components/AnimatedChars'

const lines: { text: string; bold: boolean; letterSpacing?: string }[] = [
  { text: 'Studio Talent SRL', bold: true },
  { text: 'Via Francesco De Santis, 86', bold: false, letterSpacing: '-0.05em' },
  { text: '72017 Ostuni [BR]', bold: true },
  { text: 'P.IVA 02645640745', bold: false },
]

export default function ContactAddress() {
  return (
    <address className="st-contact-address" style={{ fontStyle: 'normal' }}>
      {lines.map(({ text, bold }, i) => (
        <span
          key={i}
          className={bold ? 'st-contact-address-bold' : 'st-contact-address-light'}
        >
          <AnimatedChars text={text} delay={i * 0.08} letterSpacing={lines[i].letterSpacing} />
        </span>
      ))}
    </address>
  )
}
