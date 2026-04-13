import Footer from '../components/Footer'
import '../styles/home.css'

export default function HomePage() {
  return (
    <main className="st-home">
      <div className="st-home-body">
        <div className="st-home-left" />
        <div className="st-home-text">
          <p className="st-home-intro">
            <span className="st-home-intro-light">Lorem ipsum dolor sit</span>
            <span>
              <span className="st-home-intro-bold">L&rsquo;architettura diventa interior design.</span>
              {' '}
              <span className="st-home-intro-reg">Studiamo e progettiamo lo spazio su misura per te.</span>
            </span>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
