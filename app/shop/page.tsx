import ShopClient, {type Product} from './ShopClient';

export const metadata={title:'Pro Shop | Linderhof Country Club',description:'Linderhof merchandise, secure on-site Square checkout, clubhouse pickup only.'};
export const dynamic='force-dynamic';

async function getProducts():Promise<{products:Product[],error:string}>{
 const url=(process.env.LINDEX_SUPABASE_URL||'').replace(/\/$/,'');
 const key=process.env.LINDEX_SUPABASE_PUBLISHABLE_KEY||'';
 if(!url||!key)return {products:[],error:'The online Pro Shop is not connected yet.'};
 try{
  const res=await fetch(`${url}/rest/v1/shop_products?select=id,name,description,price_cents,image_url,stock_quantity&active=eq.true&stock_quantity=gt.0&order=name.asc`,{headers:{apikey:key},cache:'no-store'});
  if(!res.ok)throw new Error('Catalog is unavailable');
  const data=await res.json();
  if(!Array.isArray(data))throw new Error('Invalid catalog response');
  return {products:data.filter((p:Product)=>p.price_cents>0),error:''};
 }catch(e){console.error('LINDEX Pro Shop catalog fetch failed',e);return {products:[],error:'The Pro Shop is temporarily unavailable. Please try again later.'}}
}
export default async function ShopPage(){
 const {products,error}=await getProducts();
 const enabled=process.env.NEXT_PUBLIC_LINDEX_SQUARE_EMBEDDED_ENABLED==='true';
 const endpoint=(process.env.NEXT_PUBLIC_LINDEX_SUPABASE_URL||'').replace(/\/$/,'')+'/functions/v1/square-embedded-payment';
 return <main className="pro-shop-page"><section className="pagehero"><div className="eyebrow">LINDERHOF COUNTRY CLUB</div><h1>The Pro Shop</h1><p>Club favorites for life in the mountains.</p></section><section className="section pro-shop-content"><div className="pro-shop-intro"><div><div className="eyebrow">LINDERHOF COLLECTION</div><h2>Wear the club. Love the valley.</h2><p>Browse currently stocked merchandise and purchase securely without leaving our website.</p></div><aside className="pro-shop-pickup"><strong>Clubhouse pickup only</strong><p>10 Clubhouse Road · Glen, NH</p><small>Shipping is not available.</small></aside></div><ShopClient products={products} unavailable={error} enabled={enabled} endpoint={endpoint}/></section></main>;
}
