import '../styles/footer.css'

export default function Footer() {
  return (
    <footer className="st-footer">
      <div className="st-footer-links">
        <a
          href="https://instagram.com/studiotalent"
          target="_blank"
          rel="noopener noreferrer"
          className="st-footer-link"
        >
          Follow me
        </a>
        <a href="/contact" className="st-footer-link">
          Write me
        </a>
        <a href="/privacy" className="st-footer-link">
          Privacy policy
        </a>
      </div>
    </footer>
  )
}
