import MembershipInquiry from '../MembershipInquiry';
import ClubhouseHours from '../ClubhouseHours';
import { InteriorLayout, InteriorSplit } from '../InteriorLayout';
import { getLindexEvents } from '../../lib/lindex-events';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Contact & Directions | Linderhof Country Club' };

export default async function Contact() {
  const { clubhouseHours } = await getLindexEvents();
  return (
    <main>
      <section className="pagehero contactHero">
        <p className="eyebrow light">VISIT LINDERHOF</p>
        <h1>Contact &amp; Directions</h1>
      </section>
      <InteriorLayout title="Contact & Directions" eyebrow="WE LOOK FORWARD TO SEEING YOU">
        <p className="interiorLead">Find us in the heart of the White Mountains, surrounded by the beauty of Mount Washington Valley.</p>
        <h3 id="directions">Linderhof Country Club</h3>
        <p>10 Clubhouse Road<br />Glen, NH 03838</p>
        <p>
          <a className="button dark" href="https://www.google.com/maps/search/?api=1&query=10+Clubhouse+Road+Glen+NH+03838" target="_blank" rel="noopener noreferrer">GET DIRECTIONS ↗</a>
        </p>
        <ClubhouseHours hours={clubhouseHours} />
        <p>For membership information, please use the inquiry section below.</p>
      </InteriorLayout>
      <InteriorSplit image="/images/entrance.jpg" alt="Linderhof Country Club entrance sign" eyebrow="WELCOME TO LINDERHOF" title="A Place to Gather">
        <p>Whether you're visiting the course or learning more about membership, we look forward to welcoming you to the valley.</p>
      </InteriorSplit>
      <MembershipInquiry kind="contact" />
    </main>
  );
}
