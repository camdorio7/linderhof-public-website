import Link from 'next/link';
import site from '../content/site.json';
import { MEMBERSHIP_CHECKOUT_URL } from '../lib/membership-links';

/** Membership checkout is intentionally separate from event flyers and event registration. */
export default function SocialMembershipCard() {
  const price = site.membershipRates.find((option) => option.name === 'Social')?.price;

  return (
    <aside className="socialMembershipCard" aria-labelledby="social-membership-heading">
      <div className="socialMembershipCardTop">
        <p className="eyebrow">MORE WAYS TO BELONG</p>
        <h3 id="social-membership-heading">Come for the events. Stay for the community.</h3>
        <p>Enjoy clubhouse gatherings and more with a Social Membership at Linderhof.</p>
      </div>
      <div className="socialMembershipCardBottom">
        <div className="socialMembershipPrice">
          <span>2027 Social Membership</span>
          {price && <strong>{price}</strong>}
        </div>
        <p className="socialMembershipNote">Clubhouse access during opening hours. Golf and pool access are not included.</p>
        <a className="socialMembershipCheckout" href={MEMBERSHIP_CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
          EXPLORE MEMBERSHIP OPTIONS <span aria-hidden="true">↗</span>
        </a>
        <p className="socialMembershipCheckoutNote">Choose Social Membership at Square checkout. <strong>This is not an event ticket.</strong></p>
        <Link className="socialMembershipLearn" href="/membership">Compare membership benefits ↗</Link>
      </div>
    </aside>
  );
}
