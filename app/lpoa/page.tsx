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
        <p>Chartered in 1978, the Linderhof Property Owners Association (LPOA) is a domestic non-profit corporation comprised of the owners of condominiums in the Linderhof Country Club area.</p>
        <p>The area is located in the heart of the White Mountains in Mount Washington Valley. It is a most sought after location for year round vacationing and relaxation offering first class skiing, golfing, hiking, mountain climbing, water kayaking and rafting, and shopping.</p>
        <h2>Contact Information</h2>
        <p><strong>Linderhof Property Owners Association (LPOA)</strong><br />The LPOA can be reached at <a href="tel:+16033834238">603-383-4238</a>.</p>
        <p><strong>Linderhof Mountainside Property Owners Association</strong><br />Mountainside owners, you can reach your association at <a href="tel:+16033839442">603-383-9442</a>.</p>
      </article>
    </main>
  );
}
