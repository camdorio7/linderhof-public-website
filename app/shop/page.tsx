import Link from 'next/link';

export const metadata = {
  title: 'Linderhof Pro Shop | Linderhof Country Club',
  description: 'Explore official Linderhof Country Club merchandise and visit our existing Wix store for secure checkout.',
};

export default function Shop() {
  // Set WIX_SHOP_URL to a permanent Wix-hosted store URL BEFORE switching
  // linderhofcountryclub.com DNS from Wix to Vercel.
  const wixShopUrl = process.env.WIX_SHOP_URL?.trim();
  const validUrl = wixShopUrl && /^https:\/\//i.test(wixShopUrl) ? wixShopUrl : null;
  return <main>
    <section className="pagehero"><div className="eyebrow">Official Club Merchandise</div><h1>The Linderhof Pro Shop</h1><p>Show your Linderhof pride, on and off the course.</p></section>
    <section className="section shop-intro">
      <div className="eyebrow">Shop Linderhof</div>
      <h2>Club Apparel & Accessories</h2>
      <p>Discover merchandise from the Linderhof Country Club Pro Shop. Our existing Wix store manages product availability, orders, and secure checkout.</p>
      <div className="shop-highlights"><div><span>01</span><h3>Club Apparel</h3><p>Explore clothing and Linderhof-branded favorites.</p></div><div><span>02</span><h3>Hats & Accessories</h3><p>Browse accessories and club merchandise.</p></div><div><span>03</span><h3>Secure Checkout</h3><p>Complete your purchase through our existing Wix store.</p></div></div>
      {validUrl ? <a className="button shop-cta" href={validUrl} target="_blank" rel="noopener noreferrer">Shop Merchandise ↗</a> : <div className="note"><strong>Store link coming soon.</strong><p>We're preparing a permanent link to our existing Wix shop. Please check back shortly.</p></div>}
      <p className="shop-small">Product selection, pricing, shipping, and returns are handled by the Wix shop. The store opens in a new tab.</p>
    </section>
    <section className="banner"><div className="eyebrow">Already a Member?</div><h2>Visit Your Member Portal</h2><p>Sign in to LINDEX using your existing account.</p><a className="button" href="https://linderhofmembers.com">Member Sign In ↗</a></section>
  </main>;
}
