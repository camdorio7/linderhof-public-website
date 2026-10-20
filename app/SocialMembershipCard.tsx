import Link from 'next/link';
import site from '../content/site.json';
import { MEMBERSHIP_CHECKOUT_URL } from '../lib/membership-links';

/** Separate from event flyers and event registration to avoid checkout confusion. */
export default function SocialMembershipCard() {
  const price = site.membershipRates.find((option) => option.name === 'Social')?.price;
  return (
    <aside className="socialMembershipCard" aria-labelledby="social-membership-heading">
      <div className="socialMembershipCardTop">
        <p className="eyebrow">MORE WAYS TO BELONG</p>
        <h3 id="social-membership-heading">Come for the events. Stay for the community.</h3>
        <p>Enjoy clubhouse gatherings and a welcoming community with a Social Membership.</p>
      </div>
      <div className="socialMembershipCardBottom">
        <p className="socialMembershipPrice">2027 Social Membership {price && <strong>{price}</strong>}</p>
        <p className="socialMembershipNote">Clubhouse access during opening hours. Golf and pool access are not included.</p>
        <a className="socialMembershipCheckout" href={MEMBERSHIP_CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
          VIEW MEMBERSHIP CHECKOUT <span aria-hidden="true">↗</span>
        </a>
        <p className="socialMembershipCheckoutNote">Select Social Membership from the available options on Square. This is <strong>not</strong> an event registration or ticket payment.</p>
        <Link className="socialMembershipLearn" href="/membership">Compare all memberships ↗</Link>
      </div>
    </aside>
  );
}
