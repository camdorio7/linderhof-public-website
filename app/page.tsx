import MembershipInquiry from './MembershipInquiry';
import SocialMembershipCard from './SocialMembershipCard';
import ClubhouseHours from './ClubhouseHours';
import site from '../content/site.json';
import Link from 'next/link';
import { getLindexEvents } from '../lib/lindex-events';
import styles from './HomeSpecials.module.css';
import { readMembership } from '../lib/public-membership';
import EventTile from './EventTile';

export const dynamic = 'force-dynamic';

const features = [
  { title: 'The Golf Course', description: 'Discover the course, golf traditions and policies.', url: '/golf', img: site.golfImage },
  { title: 'Pool & Amenities', description: 'Make the most of your time at Linderhof.', url: '/amenities', img: site.poolImage },
  { title: 'Membership', description: 'A welcoming community in the heart of the White Mountains.', url: '/membership', img: '/images/golf-fairway.jpg' },
];

export default async function Home() {
  const [lindex, membership] = await Promise.all([getLindexEvents(), readMembership()]);
  const offer = membership.announcement;
  const specialTitle = /^(membership special|special):\s*(.+)$/i;
  const featuredEvents = lindex.events.filter((event) => !specialTitle.test(event.title.trim())).slice(0, 3);
  const posts = [
    ...lindex.announcements.map((item) => ({ key: `announcement-${item.id}`, title: item.title, message: item.message, flyer: null })),
    ...lindex.events.map((item) => ({ key: `event-${item.id}`, title: item.title, message: item.description, flyer: item.image_url })),
  ];
  const legacy = posts.flatMap((post) => {
    const match = specialTitle.exec(post.title.trim());
    return match ? [{ ...post, headline: match[2], membership: match[1].toLowerCase() === 'membership special' }] : [];
  });

  const specials = offer?.enabled && offer.title
    ? [{ key:'membership-offer', headline:offer.title, message:offer.details, flyer:offer.flyer, membership:true },
       ...legacy.filter(item => !item.membership || item.headline.trim().toLowerCase() !== offer.title.trim().toLowerCase())]
    : legacy;

  return (
    <main>
      <section className="hero" style={{ backgroundImage: `linear-gradient(90deg,rgba(0,0,0,.44),rgba(0,0,0,.12)),url(${site.heroImage})` }}>
        <div className="heroInner">
          <p className="eyebrow light">GLEN, NEW HAMPSHIRE</p>
          <h1>{site.homeHeadline}</h1>
          <div className="fineLine" />
          <p>{site.homeSubtitle}</p>
        </div>
        <a className="heroScrollCue" href="#welcome" aria-label="Scroll down to learn more">
          <span className="heroScrollArrow" aria-hidden="true">↓</span>
          <span>scroll for more</span>
        </a>
      </section>

      <section id="welcome" className="intro">
        <p className="eyebrow">WELCOME TO LINDERHOF</p>
        <h2>{site.welcomeTitle}</h2>
        <p>{site.welcomeText}</p>
      </section>

      <section className="featureSection">
        <div className="sectionHead">
          <div>
            <p className="eyebrow">THE LINDERHOF EXPERIENCE</p>
            <h2>Find Your Place Here</h2>
          </div>
          <p>From time on the fairways to afternoons by the pool, discover what makes the club special.</p>
        </div>
        <div className="featureGrid">
          {features.map((feature) => (
            <Link href={feature.url} className="feature" key={feature.title}>
              <div className="featureImg">
                <img src={feature.img} alt={`${feature.title} at Linderhof Country Club`} loading="lazy" decoding="async" />
              </div>
              <div className="featureBody">
                <h3>{feature.title}</h3>
                <span>EXPLORE <b>↗</b></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Membership already appears in the three feature cards; no duplicate split section. */}
      <section className="homeEventsSection" aria-labelledby="home-events-heading">
        <div className="announcementsInner">
          <p className="eyebrow">UPCOMING AT LINDERHOF</p>
          <h2 id="home-events-heading">Club Events and Announcements</h2>
          {specials.map((special) => {
            const checkout = (special.key === 'membership-offer' && offer?.checkout) || membership.checkout;
            const hasFlyer = special.flyer && /^https:\/\//i.test(special.flyer);
            return <article key={special.key} className={styles.card}>
              {hasFlyer && <a className={styles.flyer} href={special.flyer!} target="_blank" rel="noopener noreferrer" aria-label={`Open flyer for ${special.headline}`}>
                <img src={special.flyer!} alt={`${special.headline} flyer`}/>
              </a>}
              <div className={styles.copy}>
                <p className="eyebrow">{special.membership ? 'MEMBERSHIP ANNOUNCEMENT' : 'CLUB SPECIAL'}</p>
                <h3>{special.headline}</h3>
                {special.message && <p className={styles.details}>{special.message}</p>}
                <div className={styles.actions}>
                  {special.membership && /^https:\/\/(?:[a-z0-9-]+\.)*(?:square\.link|square\.site|squareup\.com|square\.online)\//i.test(checkout) &&
                    <a className="button dark" href={checkout} target="_blank" rel="noopener noreferrer">Pay on Square ↗</a>}
                  <a href={`mailto:linderhofclubhouse@gmail.com?subject=${encodeURIComponent(special.headline)}`}>Email the clubhouse ↗</a>
                </div>
              </div>
            </article>;
          })}
          <div className={`eventShowcase eventShowcase--${featuredEvents.length === 1 ? 'single' : featuredEvents.length === 2 ? 'pair' : featuredEvents.length === 3 ? 'trio' : 'empty'}`}>
            {featuredEvents.length ? (
              featuredEvents.map((item) => <EventTile key={item.id} item={item} />)
            ) : (
              <div className="eventShowcaseEmpty">
                <p>{lindex.connected ? 'No upcoming public events are scheduled.' : 'Visit News & Events for the latest club activities.'}</p>
              </div>
            )}
            <SocialMembershipCard />
          </div>
          <div className="homeEventsMore">
            <Link className="button dark" href="/events">VIEW MORE EVENTS ↗</Link>
          </div>
        </div>
      </section>

      <div className="homeHoursBand">
        <ClubhouseHours hours={lindex.clubhouseHours} />
      </div>

      <section className="closing">
        <p className="eyebrow light">STAY CONNECTED</p>
        <h2>There's Always Something Happening.</h2>
        <p>Discover club news, tournaments, gatherings and upcoming events.</p>
        <Link className="button cream" href="/events">NEWS & EVENTS ↗</Link>
      </section>

      <section className="homeContactPanel" aria-label="Contact Linderhof Country Club">
        <div className="homeContactDetails">
          <img src="/images/linderhof-crest.png" alt="Linderhof Country Club crest" loading="lazy" />
          <h2>Linderhof Country Club</h2>
          <p>10 Clubhouse Road<br />Glen, NH 03838</p>
          <a href="https://www.google.com/maps/search/?api=1&query=10+Clubhouse+Road+Glen+NH+03838" target="_blank" rel="noopener noreferrer">DIRECTIONS ↗</a>
          <Link href="/contact">CONTACT &amp; CLUB INFORMATION ↗</Link>
        </div>
        <div className="homeContactForm">
          <h2>Request Information</h2>
          <p>Looking for more information about becoming a member or visiting Linderhof Country Club?</p>
          <MembershipInquiry kind="contact" />
        </div>
      </section>
    </main>
  );
}
