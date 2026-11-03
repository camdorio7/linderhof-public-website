import styles from './HomeSpecials.module.css';
import type { getLindexEvents } from '../lib/lindex-events';
import type { readMembership } from '../lib/public-membership';

const specialTitle = /^(membership special|special):\s*(.+)$/i;
export function isClubSpecial(title: string) {
  return specialTitle.test(title.trim());
}

export default function ClubSpecials({ lindex, membership, membershipOnly = false }: {
  membershipOnly?: boolean;
  lindex: Awaited<ReturnType<typeof getLindexEvents>>;
  membership: Awaited<ReturnType<typeof readMembership>>;
}) {
  const offer = membership.announcement;

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

  const visible = membershipOnly ? specials.filter(item => item.membership) : specials;
  if (!visible.length) return null;
  return <>
  {visible.map((special) => {
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
  </>;
}
