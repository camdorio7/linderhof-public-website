import { getSquareStoreUrl, loadProShopProducts } from '../../lib/square-pro-shop';

export const metadata = {
  title: 'Linderhof Pro Shop | Linderhof Country Club',
  description: 'Shop current Linderhof merchandise. Secure Square checkout with clubhouse pickup only.',
};
export const dynamic = 'force-dynamic';

const dollars = (cents: number) => new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD',
}).format(cents / 100);

export default async function ShopPage() {
  const checkoutUrl = getSquareStoreUrl();
  let products: Awaited<ReturnType<typeof loadProShopProducts>> = [];
  let unavailable = false;
  if (checkoutUrl) {
    try { products = await loadProShopProducts(); }
    catch (error) {
      unavailable = true;
      console.error('Linderhof Square Pro Shop catalog unavailable', error);
    }
  }
  return <main className="proShopPage">
    <section className="pagehero proShopHero">
      <div className="eyebrow">LINDERHOF COUNTRY CLUB</div>
      <h1>The Pro Shop</h1>
      <p>Club favorites, made for life in the mountains.</p>
    </section>
    <section className="proShopIntro" aria-label="How the Pro Shop works">
      <div>
        <span className="eyebrow">THE LINDERHOF COLLECTION</span>
        <h2>Wear the club. Love the valley.</h2>
        <p>Browse currently available club merchandise. Shop securely through Square and pick up your order at the Linderhof clubhouse.</p>
      </div>
      <div className="proShopPickup"><span className="proShopPickupIcon" aria-hidden="true">↗</span><div><strong>Clubhouse pickup only</strong><p>10 Clubhouse Road · Glen, NH</p><small>No shipping. Square will provide pickup details at checkout.</small></div></div>
    </section>
    <section className="proShopCatalog" aria-label="Available merchandise">
      <div className="proShopCatalogHead"><div><span className="eyebrow">PRO SHOP</span><h2>Available merchandise</h2></div>{checkoutUrl && products.length > 0 && <a className="proShopButton" href={checkoutUrl} target="_blank" rel="noopener noreferrer">Visit secure Square checkout ↗</a>}</div>
      {!checkoutUrl ? <div className="proShopEmpty"><span className="proShopEmptyMark">LCC</span><h3>Our online Pro Shop is coming soon.</h3><p>We're adding our current merchandise to Square and setting up clubhouse pickup. Check back for the opening of online ordering.</p><a href="/contact" className="proShopTextLink">Questions? Contact the clubhouse →</a></div> : unavailable ? <div className="proShopEmpty"><h3>Merchandise is temporarily unavailable.</h3><p>Please try again later or contact the clubhouse.</p></div> : products.length === 0 ? <div className="proShopEmpty"><span className="proShopEmptyMark">LCC</span><h3>New merchandise is on its way.</h3><p>There are no confirmed in-stock items online yet. We'll add them as soon as they're ready for pickup.</p></div> : <div className="proShopGrid">{products.map(product => <article className="proShopProduct" key={product.id}>
        <div className="proShopProductImage">{product.imageUrl ? <img src={product.imageUrl} alt={product.name} loading="lazy" /> : <div className="proShopNoImage"><span>LINDERHOF</span><small>COUNTRY CLUB</small></div>}</div>
        <div className="proShopProductDetails"><span className="eyebrow">AVAILABLE FOR PICKUP</span><h3>{product.name}</h3>{product.description && <p>{product.description}</p>}<div className="proShopVariations">{product.variations.map(variation => <span key={variation.id}>{variation.name !== 'Regular' && variation.name !== 'Standard' ? `${variation.name} · ` : ''}{dollars(variation.priceCents)}</span>)}</div><a href={checkoutUrl} className="proShopProductAction" target="_blank" rel="noopener noreferrer" aria-label={`Shop ${product.name} through Square`}>Shop on Square <span aria-hidden="true">↗</span></a></div>
      </article>)}</div>}
      <p className="proShopNote">Merchandise purchases are separate from membership payments and event registration. Availability and pickup options are confirmed at Square checkout.</p>
    </section>
  </main>;
}
