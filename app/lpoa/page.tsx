import site from '../../content/site.json';
export const metadata = { title: 'LPOA | Linderhof Country Club', description: 'Information and contact details for the Linderhof Property Owners Association and Mountainside owners.' };

export default function LPOAPage() {
  return (
    <main>
      <section className="pagehero lpoaHero">
        <p className="eyebrow light">LINDERHOF COMMUNITY</p>
        <h1>LPOA</h1>
        <p>Linderhof Property Owners Association</p>
      </section>
      <article className="content lpoaContent">
        <h2>About the LPOA</h2>
        <p>{site.lpoaAbout}</p>
        <p>{site.lpoaArea}</p>
        <h2>Contact Information</h2>
        <p><strong>Linderhof Property Owners Association (LPOA)</strong><br />The LPOA can be reached at <a href={"tel:"+site.lpoaPhone.replace(/[^+0-9]/g,"")}>{site.lpoaPhone}</a>.</p>
        <p><strong>Linderhof Mountainside Property Owners Association</strong><br />Mountainside owners, you can reach your association at <a href={"tel:"+site.mountainsidePhone.replace(/[^+0-9]/g,"")}>{site.mountainsidePhone}</a>.</p>
      </article>
    </main>
  );
}
