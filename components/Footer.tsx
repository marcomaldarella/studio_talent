import '../styles/footer.css'

export default function Footer() {
  return (
    <footer className="st-footer">
      <span className="st-footer-left">
        © {new Date().getFullYear()} Studio Talent
      </span>
      <div className="st-footer-right">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="st-footer-link"
        >
          Instagram
        </a>
        <a href="/contact" className="st-footer-link">
          Contact
        </a>
      </div>
    </footer>
  )
}
