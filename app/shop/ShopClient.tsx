'use client';
import {useEffect,useRef,useState} from 'react';
export type Product={id:string,name:string,description:string,price_cents:number,image_url:string|null,stock_quantity:number};
type Session={intent_id:string,client_secret:string,application_id:string,location_id:string,amount_cents:number,currency:string,buyer_email:string,mode:string};
type Props={products:Product[],unavailable:string,enabled:boolean,endpoint:string};
const money=(n:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n/100);
const scripts=new Map<string,Promise<void>>();
function loadSquare(mode:string):Promise<void>{
 const url=mode==='production'?'https://web.squarecdn.com/v1/square.js':'https://sandbox.web.squarecdn.com/v1/square.js';
 if((window as any).Square)return Promise.resolve();
 if(!scripts.has(url))scripts.set(url,new Promise<void>((resolve,reject)=>{const s=document.createElement('script');s.src=url;s.async=true;s.onload=()=>resolve();s.onerror=()=>reject(new Error('Square payment fields could not load'));document.head.appendChild(s)}));
 return scripts.get(url)!;
}
function SecureCard({session,onCharge,busy}:{session:Session,onCharge:(source:string)=>Promise<void>,busy:boolean}){
 const ref=useRef<any>(null),[ready,setReady]=useState(false),[error,setError]=useState('');
 useEffect(()=>{let dead=false;let card:any;
  async function initialize(){try{await loadSquare(session.mode);if(dead)return;const payments=(window as any).Square.payments(session.application_id,session.location_id);card=await payments.card();if(dead){await card.destroy();return}await card.attach('#pro-shop-square-card');ref.current=card;setReady(true)}catch(e){if(!dead)setError((e as Error).message)}}
  initialize();return()=>{dead=true;ref.current=null;if(card)card.destroy().catch(()=>{})};
 },[session.intent_id,session.application_id,session.location_id,session.mode]);
 async function submit(e:React.FormEvent){e.preventDefault();setError('');try{
  if(!ref.current)throw new Error('Card form is loading');
  const details:any={amount:(session.amount_cents/100).toFixed(2),currencyCode:'USD',intent:'CHARGE',customerInitiated:true,sellerKeyedIn:false};
  if(session.buyer_email)details.billingContact={email:session.buyer_email};
  const result=await ref.current.tokenize(details);
  if(result.status!=='OK'||!result.token)throw new Error(result.errors?.map((x:any)=>x.message).join('; ')||'Card verification failed');
  await onCharge(result.token);
 }catch(e){setError((e as Error).message||'Payment could not be completed')}}
 return <form className="pro-shop-payment" onSubmit={submit}><p>Enter your card below. Square securely handles card details; LINDEX never receives the card number.</p><div id="pro-shop-square-card" className="pro-shop-card-fields"/>{!ready&&!error&&<p>Loading Square card fields…</p>}{error&&<p role="alert" className="pro-shop-error">{error}</p>}<button className="button" disabled={!ready||busy}>{busy?'Processing payment…':`Pay ${money(session.amount_cents)}`}</button></form>;
}
export default function ShopClient({products,unavailable,enabled,endpoint}:Props){
 const [cart,setCart]=useState<Record<string,number>>({}),[email,setEmail]=useState(''),[open,setOpen]=useState(false),[session,setSession]=useState<Session|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[result,setResult]=useState('');
 const chosen=products.filter(p=>cart[p.id]>0);const total=chosen.reduce((sum,p)=>sum+p.price_cents*cart[p.id],0);const count=chosen.reduce((sum,p)=>sum+cart[p.id],0);
 function add(p:Product){setCart(c=>({...c,[p.id]:Math.min(p.stock_quantity,Math.min(20,(c[p.id]||0)+1))}))}
 function quantity(p:Product,n:number){setCart(c=>({...c,[p.id]:Math.max(0,Math.min(20,p.stock_quantity,n))}))}
 async function request(payload:any){const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),cache:'no-store'});const data=await res.json().catch(()=>({}));if(!res.ok||data.error)throw new Error(data.error||'Payment service unavailable');return data}
 async function checkout(){setError('');setResult('');if(!enabled){setError('Online checkout is not enabled yet.');return}if(!/^\S+@\S+\.\S+$/.test(email)){setError('Please enter a valid email for your pickup order.');return}setBusy(true);setOpen(true);try{const data=await request({action:'prepare',kind:'shop',email,items:chosen.map(p=>({product_id:p.id,quantity:cart[p.id]}))});setSession(data)}catch(e){setError((e as Error).message)}finally{setBusy(false)}}
 async function charge(source_id:string){if(!session)return;setBusy(true);setError('');try{const data=await request({action:'charge',intent_id:session.intent_id,client_secret:session.client_secret,source_id});if(data.state==='paid'){setResult('Payment confirmed! Your order has been received for clubhouse pickup.');setCart({})}else if(data.state==='review'){setResult('Payment received. Club staff will review availability and your pickup order.');setCart({})}else setResult('Payment submitted. Confirmation is processing. Do not pay again.')}catch(e){setError((e as Error).message)}finally{setBusy(false)}}
 function close(){if(busy)return;setOpen(false);setSession(null);setError('');setResult('');if(result)window.location.reload()}
 return <>
  {unavailable&&<p className="pro-shop-error" role="status">{unavailable}</p>}
  {!unavailable&&!products.length&&<div className="pro-shop-empty"><h3>Merchandise is coming soon.</h3><p>Check back when the clubhouse publishes currently stocked items.</p></div>}
  <div className="pro-shop-grid">{products.map(p=><article key={p.id} className="pro-shop-product"><div className="pro-shop-image">{p.image_url?<img src={p.image_url} alt={p.name} loading="lazy"/>:<div className="pro-shop-placeholder">LINDERHOF<br/>COUNTRY CLUB</div>}</div><div className="pro-shop-product-body"><h3>{p.name}</h3>{p.description&&<p>{p.description}</p>}<strong>{money(p.price_cents)}</strong><small>{p.stock_quantity} available · clubhouse pickup</small><button className="button" type="button" disabled={!enabled} onClick={()=>add(p)}>{enabled?'Add to bag':'Online checkout coming soon'}</button></div></article>)}</div>
  {enabled&&products.length>0&&<section className="pro-shop-bag" aria-label="Shopping bag"><h2>Your bag ({count})</h2>{!count?<p>Choose an item to begin.</p>:<>{chosen.map(p=><div className="pro-shop-bag-row" key={p.id}><span>{p.name}</span><div><button aria-label={`Remove one ${p.name}`} onClick={()=>quantity(p,cart[p.id]-1)}>−</button><span>{cart[p.id]}</span><button aria-label={`Add one ${p.name}`} onClick={()=>quantity(p,cart[p.id]+1)}>+</button></div><strong>{money(p.price_cents*cart[p.id])}</strong></div>)}<div className="pro-shop-total"><strong>Total</strong><strong>{money(total)}</strong></div><label className="pro-shop-email">Email for order confirmation<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com"/></label>{error&&!open&&<p role="alert" className="pro-shop-error">{error}</p>}<button type="button" className="button" onClick={checkout} disabled={busy}>Secure checkout on this page</button><small>Pickup only. Final amount is verified by LINDEX before Square charges your card.</small></>}</section>}
  {open&&<div className="pro-shop-overlay"><section role="dialog" aria-modal="true" aria-label="Square checkout" className="pro-shop-dialog"><div className="pro-shop-dialog-head"><div><small>LINDERHOF PRO SHOP</small><h2>Secure checkout</h2></div><button type="button" onClick={close} disabled={busy}>Close ×</button></div>{session?.mode==='sandbox'&&<p className="pro-shop-sandbox">Sandbox test mode · no real charges</p>}{busy&&!session&&<p>Preparing checkout…</p>}{error&&<p className="pro-shop-error" role="alert">{error}</p>}{result?<div role="status"><p className="pro-shop-confirmed">{result}</p><button className="button" onClick={close}>Done</button></div>:session?<SecureCard session={session} onCharge={charge} busy={busy}/>:<button onClick={close}>Close</button>}</section></div>}
 </>;
}
