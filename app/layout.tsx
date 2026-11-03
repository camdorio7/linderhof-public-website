import './globals.css';
import Link from 'next/link';
import MobileNavigation from './MobileNavigation';
export const metadata = {title:'Linderhof Country Club | Glen, New Hampshire',description:'Golf, membership, pool, recreation and community in the White Mountains.'};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body><a className="skipToContent" href="#main-content">Skip to main content</a><MobileNavigation /><header className="kernHeader"><div className="utilityNav"><div><Link href="/sponsors">Our Sponsors</Link><span className="separator">|</span><Link href="/passes">Guest &amp; Renter Passes</Link><span className="separator">|</span><Link href="/contact">Contact & Directions</Link></div><div><a href="/membership#membership-inquiry">Membership Inquiries</a><span className="separator">|</span><a href="https://linderhofmembers.com" rel="noopener noreferrer">Login ↗</a></div></div><nav className="mainNav" aria-label="Main navigation"><div className="navHalf leftNav"><Link href="/contact">ABOUT US</Link><Link href="/golf">GOLF</Link><Link href="/membership">MEMBERSHIP</Link></div><Link className="centerLogo" href="/" aria-label="Linderhof Country Club home"><img className="crestLogo" src="/images/linderhof-crest.png" alt="Linderhof Country Club crest" /></Link><div className="navHalf rightNav"><Link href="/amenities">AMENITIES</Link><Link href="/events">NEWS & EVENTS</Link><Link href="/shop">PRO SHOP</Link><Link href="/lpoa">LPOA</Link></div></nav></header><div id="main-content">{children}</div>
  <footer className="footer">
    <div className="footerMain">
      <div className="footerIdentity">
        <Link href="/" className="footerBrandLink">
          <img className="footerCrest" src="/images/linderhof-crest.png" alt="" />
          <span><span className="footerbrand">Linderhof Country Club</span><span className="footerTagline">Glen, New Hampshire</span></span>
        </Link>
        <p>Golf, recreation, and community in the White Mountains.</p>
        <Link className="footerAddress" href="/contact">10 Clubhouse Road · Glen, NH 03838</Link>
      </div>
      <nav className="footerLinkColumn" aria-label="Explore the club">
        <h2>Explore the club</h2>
        <Link href="/golf">Golf</Link>
        <Link href="/amenities">Pool &amp; Amenities</Link>
        <Link href="/events">News &amp; Events</Link>
        <Link href="/shop">Pro Shop</Link>
      </nav>
      <nav className="footerLinkColumn" aria-label="Club information">
        <h2>Club information</h2>
        <Link href="/membership">Membership</Link>
        <Link href="/lpoa">LPOA</Link>
        <Link href="/passes">Guest &amp; Renter Passes</Link>
        <Link href="/contact">Contact &amp; Directions</Link>
      </nav>
      <div className="footerMember">
        <h2>Member access</h2>
        <p>Visit LINDEX for event sign-ups and member services.</p>
        <a className="footerMemberButton" href="https://linderhofmembers.com">Member Sign In ↗</a>
      </div>
    </div>
    <section className="footerBottom" aria-label="Website credits">
      <span>© {new Date().getFullYear()} Linderhof Country Club</span>
      <a className="footerPowered" href="https://cd7technologies.com">Powered by <strong>CD7 Technologies LLC</strong></a>
    </section>
  </footer></body></html>}
