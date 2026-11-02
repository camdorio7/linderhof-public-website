import Link from 'next/link';
import { readMembership } from '../lib/public-membership';

/** Membership checkout is intentionally separate from event flyers and event registration. */
export default async function SocialMembershipCard() {
  const membership = await readMembership();
  const social = membership.plans.find(option => /^social(?: membership)?$/i.test(option.name.trim()));
  if (!social) return null;
  const price = social.price;

  return (
    <aside className="socialMembershipCard" aria-labelledby="social-membership-heading">
      <div className="socialMembershipCardTop">
        <p className="eyebrow">MORE WAYS TO BELONG</p>
        <h3 id="social-membership-heading">Come for the events. Stay for the community.</h3>
        <p>Enjoy clubhouse gatherings and more with a Social Membership at Linderhof.</p>
      </div>
      <div className="socialMembershipCardBottom">
        <div className="socialMembershipPrice">
          <span>Social Membership</span>
          {price && <strong>{price}</strong>}
        </div>
        <p className="socialMembershipNote">{social.access}</p>
        {membership.checkout && <><a className="socialMembershipCheckout" href={membership.checkout} target="_blank" rel="noopener noreferrer">
          EXPLORE MEMBERSHIP OPTIONS <span aria-hidden="true">↗</span>
        </a>
        <p className="socialMembershipCheckoutNote">Choose Social Membership at Square checkout. <strong>This is not an event ticket.</strong></p></>}
        <Link className="socialMembershipLearn" href="/membership">Compare membership benefits ↗</Link>
      </div>
    </aside>
  );
}
