'use client';
import {useState,useEffect,type FormEvent} from 'react';
export default function RentalForm(){
  const [arrival,setArrival]=useState('');
  const [unitQuery,setUnitQuery]=useState('');
  const [unitId,setUnitId]=useState('');
  const [units,setUnits]=useState<{id:string,label:string}[]>([]);
  useEffect(()=>{if(unitId||!unitQuery.trim()){setUnits([]);return}const controller=new AbortController();const timer=setTimeout(()=>{fetch('/api/units?q='+encodeURIComponent(unitQuery),{signal:controller.signal}).then(r=>r.ok?r.json():{units:[]}).then(d=>setUnits(d.units||[])).catch(()=>{})},180);return()=>{clearTimeout(timer);controller.abort()}},[unitQuery,unitId]);
  const [state,setState]=useState<'ready'|'sending'|'done'|'error'>('ready');
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(state==='sending')return;
    if(!unitId){setState('error');return;}
    const data=new FormData(event.currentTarget);
    const get=(name:string)=>String(data.get(name)||'').trim();
    setState('sending');
    try {
      const response=await fetch('/api/register-renter',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({...Object.fromEntries(data.entries()),unitId})});
      if(!response.ok || !(await response.json()).ok)throw Error();
      setState('done');
    } catch {setState('error');}
  }
  if(state==='done')return <p role="status">Your stay request was submitted. The authorized condo owner will be asked to confirm the dates before passes become available. This does not grant access or issue a pass.</p>;
  const section={border:'1px solid rgba(125,125,125,.22)',borderRadius:14,padding:'clamp(18px,3vw,28px)',marginBottom:20,background:'#fff'};
  const grid={display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,260px),1fr))',gap:'18px 22px'} as const;
  const field={display:'grid',gap:10,minWidth:0,fontSize:16,fontWeight:500,lineHeight:1.4} as const;
  const input={width:'100%',boxSizing:'border-box' as const,minWidth:0,height:56,minHeight:56,padding:'12px 16px',border:'1px solid #b8c3ba',borderRadius:8,background:'#fff',color:'#24382e',fontSize:16,fontWeight:400,letterSpacing:0,lineHeight:1.4,boxShadow:'none',fontFamily:'inherit'} as const;
  return <form onSubmit={submit} style={{maxWidth:960,margin:'28px auto 0'}}>
    <section style={section}>
      <h2 style={{margin:'0 0 8px'}}>Condominium Information</h2><p style={{margin:'0 0 22px',opacity:.75}}>Select the condo where you will be staying. The authorized owner will receive a confirmation request.</p>
      <div style={grid}>
        <div style={{...field,position:'relative'}}><label htmlFor="unit-search">Condominium building and unit</label><input id="unit-search" style={input} value={unitQuery} onChange={e=>{setUnitQuery(e.target.value);setUnitId('')}} required autoComplete="off" placeholder="Start typing your unit" aria-autocomplete="list" aria-controls="unit-options" aria-expanded={units.length>0}/><input type="hidden" name="unit" value={unitQuery}/>{!unitId&&units.length>0&&<div id="unit-options" role="listbox" style={{position:'absolute',top:'100%',left:0,right:0,zIndex:10,background:'white',border:'1px solid #b8c3ba',borderRadius:8,maxHeight:240,overflowY:'auto'}}>{units.map(u=><button key={u.id} type="button" role="option" aria-selected={false} onClick={()=>{setUnitId(u.id);setUnitQuery(u.label);setUnits([])}} style={{display:'block',width:'100%',padding:14,textAlign:'left',background:'white',color:'#24382e',border:0,cursor:'pointer'}}>{u.label}</button>)}</div>}{unitId&&<small style={{color:'#226b43'}}>Unit selected</small>}</div>
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
      <label htmlFor="renter-authorization" style={{lineHeight:1.6}}>I confirm that the rental information is accurate. The condo owner must approve the stay before passes can be purchased.</label>
    </div>
    <button type="submit" disabled={state==='sending'||!unitId} style={{maxWidth:'100%',minHeight:46}}>{state==='sending'?'Sending…':'Submit stay for review'}</button>
    {state==='error'&&<p role="alert">We could not save your registration in LINDEX. Please try again or email <a href="mailto:linderhofclubhouse@gmail.com">the clubhouse</a> with your stay details.</p>}
  </form>;
}
