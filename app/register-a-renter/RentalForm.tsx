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
    const message=['Owner renter registration for club review',
      'Unit / building: '+get('unit'),'Renter: '+get('renter'),'Renter email: '+get('renterEmail'),
      'Arrival: '+get('arrival'),'Departure: '+get('departure'),'Occupants: '+get('occupants')].join('\n');
    setState('sending');
    try {
      const response=await fetch('/api/inquiry',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({kind:'contact',first:get('first'),last:get('last'),email:get('email'),message,website:get('website')})});
      if(!response.ok || !(await response.json()).ok)throw Error();
      setState('done');
    } catch {setState('error');}
  }
  if(state==='done')return <p role="status">Your request was sent to the club for review. Please watch your email for follow-up.</p>;
  return <form onSubmit={submit} className="inquiryForm" style={{gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,235px),1fr))'}}>
    <label>Owner first name<input name="first" maxLength={80} required autoComplete="given-name"/></label>
    <label>Owner last name<input name="last" maxLength={80} required autoComplete="family-name"/></label>
    <label>Owner email<input name="email" maxLength={254} required type="email" autoComplete="email"/></label>
    <label>Unit and building<input name="unit" maxLength={100} required/></label>
    <label>Renter full name<input name="renter" maxLength={120} required/></label>
    <label>Renter email<input name="renterEmail" maxLength={254} type="email" required/></label>
    <label>Arrival<input name="arrival" type="date" required value={arrival} onChange={e=>setArrival(e.target.value)}/></label>
    <label>Departure<input name="departure" type="date" required min={arrival}/></label>
    <label>Number of occupants<input name="occupants" type="number" defaultValue={1} min="1" max="99" required/></label>
    <input hidden name="website" tabIndex={-1} autoComplete="off"/>
    <button type="submit" disabled={state==='sending'}>{state==='sending'?'Sending…':'Submit stay for review'}</button>
    {state==='error'&&<p role="alert">We could not confirm delivery. Please try again or email <a href="mailto:linderhofclubhouse@gmail.com">the clubhouse</a> with your stay details.</p>}
  </form>;
}
