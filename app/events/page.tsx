export const dynamic = 'force-dynamic';
import {InteriorLayout} from '../InteriorLayout';
import { getLindexEvents } from '../../lib/lindex-events';
import site from '../../content/site.json';
import EventTile from '../EventTile';
import SocialMembershipCard from '../SocialMembershipCard';
import Link from 'next/link';

export const metadata = {
  title: 'News & Events | Linderhof Country Club',
  description: 'See Linderhof Country Club announcements, tournaments, photographs and community events on our official Facebook page.',
};

const FACEBOOK_URL = site.facebookUrl;
const FACEBOOK_EMBED = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(FACEBOOK_URL)}&tabs=timeline&width=500&height=650&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false`;

export default async function Page() {
  const lindex = await getLindexEvents();

  return <main>
    <section className="pagehero eventsHero">
      <p className="eyebrow light">STAY CONNECTED</p>
      <h1>News &amp; Events</h1>
      <p>Stay up to date with club news, tournaments, gatherings and announcements.</p>
    </section>
    <InteriorLayout title="What’s Happening at Linderhof" eyebrow="FROM AROUND THE CLUB">
      <p>Follow our official Facebook page for news, event photos and updates from the clubhouse and course. For member services and available event registrations, visit LINDEX.</p>
    </InteriorLayout>
    <section id="club-events" className="announcementsSection">
      <div className="announcementsInner">
        <p className="eyebrow">UPCOMING &amp; RECENT</p>
        <h2>Club Events</h2>
        <div className={`eventShowcase eventShowcase--${lindex.events.length === 1 ? 'single' : lindex.events.length === 2 ? 'pair' : lindex.events.length === 3 ? 'trio' : lindex.events.length > 3 ? 'many' : 'empty'}`}>
          {lindex.events.length === 0 ? (
            <div className="eventShowcaseEmpty">
              <p>{lindex.connected ? 'No public events are currently scheduled. Check back soon or visit LINDEX for member events.' : 'For the latest event details, visit LINDEX or our Facebook page.'}</p>
            </div>
          ) : (
            lindex.events.map((item) => <EventTile item={item} key={item.id} />)
          )}
          <SocialMembershipCard />
        </div>
      </div>
    </section>
    <section id="club-announcements" className="announcementsSection"><div className="announcementsInner"><p className="eyebrow">CLUB BULLETIN</p><h2>Latest Announcements</h2>{lindex.announcements.length ? <div className="announcementGrid">{lindex.announcements.map(item=><article className="announcementCard" key={item.id}><time dateTime={item.created_at}>{new Date(item.created_at).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'America/New_York'})}</time><h3>{item.title}</h3><p>{item.message}</p></article>)}</div> : <p>{lindex.connected?'No public announcements at the moment.':'Club announcements are temporarily unavailable. Please check LINDEX for updates.'}</p>}</div></section>
    <section className="socialSection" aria-labelledby="facebook-heading">
      <div className="facebookFeature">
        <div className="facebookFeatureCopy">
          <p className="eyebrow">OFFICIAL CLUB UPDATES</p>
          <h2 id="facebook-heading">Follow Us on Facebook</h2>
          <p>Our Facebook timeline brings together tournament news, upcoming activities, course updates and photos from around Linderhof.</p>
          <p className="socialSmall">Facebook controls which public posts are shown in embedded timelines. If the feed does not load in your browser, you can always open our official page directly.</p>
          <a className="button dark" href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">VISIT OUR FACEBOOK PAGE ↗</a>
          <div className="facebookMemberLink"><Link href="https://linderhofmembers.com">MEMBER SIGN IN / LINDEX ↗</Link></div>
        </div>
        <div className="facebookFeatureFeed">
          <iframe
            title="Linderhof Country Club official Facebook timeline"
            src={FACEBOOK_EMBED}
            width="500"
            height="650"
            loading="lazy"
            style={{ border: 'none', overflow: 'hidden', width: '100%', maxWidth: 500, display: 'block', margin: '0 auto' }}
            allow="encrypted-media"
            referrerPolicy="strict-origin-when-cross-origin"
          />
          <p className="facebookFeedFallback"><a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">See all posts on Facebook ↗</a></p>
        </div>
      </div>
    </section>
    <section className="editorial">
      <div className="editorialPhoto golfPhoto" />
      <div className="editorialCopy">
        <p className="eyebrow">MEMBER EVENTS</p>
        <h2>Plan Your Next Visit.</h2>
        <p>Visit the LINDEX member portal for club services and event registration where available.</p>
        <a className="button dark" href="https://linderhofmembers.com">OPEN LINDEX ↗</a>
      </div>
    </section>
  </main>;
}
