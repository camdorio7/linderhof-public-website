import {NextResponse} from 'next/server';
export const runtime='nodejs';
const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const json=(data:object,status=200)=>NextResponse.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function POST(request:Request){
 try{
  if(Number(request.headers.get('content-length')||0)>10000)return json({error:'Submission too large.'},413);
  const d=await request.json();
  if(d.website)return json({ok:true});
  const str=(k:string,max:number)=>String(d[k]||'').trim().slice(0,max+1);
  const first=str('first',80),last=str('last',80),email=str('email',254).toLowerCase(),unit=str('unit',100),unitId=str('unitId',36),renter=str('renter',120),renterEmail=str('renterEmail',254).toLowerCase(),arrival=str('arrival',10),departure=str('departure',10),occupants=Number(d.occupants);
  if(!unit||unit.length>100||!/^[0-9a-f-]{36}$/i.test(unitId)||!renter||renter.length>120||!emailPattern.test(renterEmail)||renterEmail.length>254||!/^\d{4}-\d{2}-\d{2}$/.test(arrival)||!/^\d{4}-\d{2}-\d{2}$/.test(departure)||!Number.isInteger(occupants)||occupants<1||occupants>99)return json({error:'Please check the required fields.'},400);
  const start=new Date(arrival+'T12:00:00Z'),end=new Date(departure+'T12:00:00Z');
  if(Number.isNaN(+start)||Number.isNaN(+end)||start.toISOString().slice(0,10)!==arrival||end.toISOString().slice(0,10)!==departure||end<start||(+end- +start)>365*86400000)return json({error:'Please check the stay dates.'},400);
  const url=(process.env.LINDEX_SUPABASE_URL||'').replace(/\/$/,'');
  const key=process.env.LINDEX_SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key){console.error('LINDEX renter submission configuration missing');return json({error:'Renter registration is temporarily unavailable.'},503);}
  const headers={apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'};
  // Only accept an exact unit ID from the server-side registry; no free-form unit numbers.
  const registry=await fetch(`${url}/rest/v1/lindex_owner_registry?select=id,unit_label&id=eq.${encodeURIComponent(unitId)}`,{headers,cache:'no-store'});
  if(!registry.ok)return json({error:'Registration temporarily unavailable.'},503);
  const matches=await registry.json();
  if(matches.length!==1||matches[0].unit_label!==unit)return json({error:'Please select a unit from the suggestions.'},422);
  const setting=await fetch(`${url}/rest/v1/lindex_public_renter_settings?select=enabled&id=eq.1`,{headers,cache:'no-store'});
  if(!setting.ok)return json({error:'Registration is temporarily unavailable.'},503);
  if(!(await setting.json())[0]?.enabled)return json({error:'Registration without a LINDEX account is currently disabled.'},403);
  const payload={unit_id:matches[0].id,unit_label:matches[0].unit_label,owner_first:renter.split(' ')[0],owner_last:renter.split(' ').slice(1).join(' ')||'-',owner_contact_email:renterEmail,renter_name:renter,renter_email:renterEmail,start_date:arrival,end_date:departure,occupants,status:'pending'};
  const insert=await fetch(`${url}/rest/v1/lindex_public_renter_requests`,{method:'POST',headers:{...headers,Prefer:'return=representation'},body:JSON.stringify(payload),cache:'no-store'});
  if(!insert.ok){console.error('Public renter intake insert failed',insert.status,(await insert.text()).slice(0,200));return json({error:'Unable to save your request.'},502);}
  const saved=await insert.json();
  // Notification failures must not erase a valid pending request; log for follow-up.
  if(saved?.[0]?.id){
   const notice=await fetch(`${url}/functions/v1/send-owner-renter-request`,{method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({request_id:saved[0].id}),cache:'no-store'}).catch(()=>null);
   if(!notice?.ok)console.error('Owner renter notification needs retry',saved[0].id,notice?.status);
  }
  return json({ok:true});
 }catch(e){console.error('Renter registration failed',e);return json({error:'Unable to process the registration.'},500);}
}
