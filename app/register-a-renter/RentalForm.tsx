'use client';
import {useState,type FormEvent} from 'react';
export default function RentalForm(){
  const [arrival,setArrival]=useState('');
  const [state,setState]=useState<'ready'|'sending'|'done'|'error'>('ready');
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(state==='sending')return;
    const data=new FormData(event.currentTarget);
    const get=(name:string)=>String(data.get(name)||'').trim();
    setState('sending');
    try {
      const response=await fetch('/api/register-renter',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify(Object.fromEntries(data.entries()))});
      if(!response.ok || !(await response.json()).ok)throw Error();
      setState('done');
    } catch {setState('error');}
  }
  if(state==='done')return <p role="status">Your renter registration was saved in LINDEX and is pending clubhouse approval. This does not grant access or issue a pass.</p>;
  const section={border:'1px solid rgba(125,125,125,.22)',borderRadius:14,padding:'clamp(18px,3vw,28px)',marginBottom:20,background:'#fff'};
  const grid={display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,260px),1fr))',gap:'18px 22px'} as const;
  const field={display:'grid',gap:10,minWidth:0,fontSize:16,fontWeight:500,lineHeight:1.4} as const;
  const input={width:'100%',boxSizing:'border-box' as const,minWidth:0,height:56,minHeight:56,padding:'12px 16px',border:'1px solid #b8c3ba',borderRadius:8,background:'#fff',color:'#24382e',fontSize:16,fontWeight:400,letterSpacing:0,lineHeight:1.4,boxShadow:'none',fontFamily:'inherit'} as const;
  return <form onSubmit={submit} style={{maxWidth:960,margin:'28px auto 0'}}>
    <section style={section}>
      <h2 style={{margin:'0 0 8px'}}>Owner Information</h2><p style={{margin:'0 0 22px',opacity:.75}}>Enter your contact details. Your email does not need to be your LINDEX login.</p>
      <div style={grid}>
        <label style={field}>First name<input style={input} name="first" maxLength={80} required autoComplete="given-name"/></label>
        <label style={field}>Last name<input style={input} name="last" maxLength={80} required autoComplete="family-name"/></label>
        <label style={field}>Contact email<input style={input} name="email" maxLength={254} required type="email" autoComplete="email"/></label>
        <label style={field}>Condominium building and unit<input style={input} name="unit" maxLength={100} required placeholder="Building / unit number"/></label>
      </div>
    </section>
    <section style={section}>
      <h2 style={{margin:'0 0 20px'}}>Renter Information</h2>
      <div style={grid}>
        <label style={field}>Renter full name<input style={input} name="renter" maxLength={120} required/></label>
        <label style={field}>Renter email<input style={input} name="renterEmail" maxLength={254} type="email" required/></label>
      </div>
    </section>
    <section style={section}>
      <h2 style={{margin:'0 0 20px'}}>Stay Details</h2>
      <div style={grid}>
        <label style={field}>Arrival<input style={input} name="arrival" type="date" required value={arrival} onChange={e=>setArrival(e.target.value)}/></label>
        <label style={field}>Departure<input style={input} name="departure" type="date" required min={arrival}/></label>
        <label style={field}>Number of occupants<input style={input} name="occupants" type="number" defaultValue={1} min="1" max="99" required/></label>
      </div>
    </section>
    <input hidden name="website" tabIndex={-1} autoComplete="off"/>
    <div style={{display:'flex',alignItems:'flex-start',gap:12,margin:'20px 0 24px'}}>
      <input id="renter-authorization" type="checkbox" required style={{width:18,height:18,flex:'0 0 18px',margin:'3px 0 0'}}/>
      <label htmlFor="renter-authorization" style={{lineHeight:1.6}}>I confirm that I am authorized to register this renter for a condominium within Linderhof Country Club. Submission does not grant access.</label>
    </div>
    <button type="submit" disabled={state==='sending'} style={{maxWidth:'100%',minHeight:46}}>{state==='sending'?'Sending…':'Submit stay for review'}</button>
    {state==='error'&&<p role="alert">We could not save your registration in LINDEX. Please try again or email <a href="mailto:linderhofclubhouse@gmail.com">the clubhouse</a> with your stay details.</p>}
  </form>;
}
