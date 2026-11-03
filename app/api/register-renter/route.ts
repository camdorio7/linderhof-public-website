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
  const first=str('first',80),last=str('last',80),email=str('email',254).toLowerCase(),unit=str('unit',100),renter=str('renter',120),renterEmail=str('renterEmail',254).toLowerCase(),arrival=str('arrival',10),departure=str('departure',10),occupants=Number(d.occupants);
  if(!first||first.length>80||!last||last.length>80||!emailPattern.test(email)||email.length>254||!unit||unit.length>100||!renter||renter.length>120||!emailPattern.test(renterEmail)||renterEmail.length>254||!/^\d{4}-\d{2}-\d{2}$/.test(arrival)||!/^\d{4}-\d{2}-\d{2}$/.test(departure)||!Number.isInteger(occupants)||occupants<1||occupants>99)return json({error:'Please check the required fields.'},400);
  const start=new Date(arrival+'T12:00:00Z'),end=new Date(departure+'T12:00:00Z');
  if(Number.isNaN(+start)||Number.isNaN(+end)||start.toISOString().slice(0,10)!==arrival||end.toISOString().slice(0,10)!==departure||end<start||(+end- +start)>365*86400000)return json({error:'Please check the stay dates.'},400);
  const url=(process.env.LINDEX_SUPABASE_URL||'').replace(/\/$/,'');
  const key=process.env.LINDEX_SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key){console.error('LINDEX renter submission configuration missing');return json({error:'Renter registration is temporarily unavailable.'},503);}
  const headers={apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'};
  // Public intake is a pending request only. No ownership or access is granted here.
  // Registry keys strip punctuation: e.g. 18-11 -> 1811.
  // Match only exact normalized keys, never partial matches.
  const unitKey=unit.toLowerCase().replace(/[^a-z0-9]/g,'').replace(/^unit/, '');
  if(!unitKey)return json({error:'Please check the condominium unit.'},400);
  const candidateKeys=[...new Set([unitKey, `unit${unitKey}`])];
  const filter=`or=(${candidateKeys.map(k=>`unit_key.eq.${k}`).join(',')})`;
  const registry=await fetch(`${url}/rest/v1/lindex_owner_registry?select=id,unit_label&${encodeURI(filter)}`,{headers,cache:'no-store'});
  if(!registry.ok){console.error('Owner registry lookup failed',registry.status);return json({error:'Registration is temporarily unavailable.'},503);}
  const matches=await registry.json();
  // Do not reveal whether a unit is in the private registry.
  if(matches.length!==1)return json({error:'Unable to submit this request. Please contact the clubhouse.'},422);
  const setting=await fetch(`${url}/rest/v1/lindex_public_renter_settings?select=enabled&id=eq.1`,{headers,cache:'no-store'});
  if(!setting.ok)return json({error:'Registration is temporarily unavailable.'},503);
  if(!(await setting.json())[0]?.enabled)return json({error:'Registration without a LINDEX account is currently disabled.'},403);
  const payload={unit_id:matches[0].id,unit_label:matches[0].unit_label,owner_first:first,owner_last:last,owner_contact_email:email,renter_name:renter,renter_email:renterEmail,start_date:arrival,end_date:departure,occupants,status:'pending'};
  const insert=await fetch(`${url}/rest/v1/lindex_public_renter_requests`,{method:'POST',headers:{...headers,Prefer:'return=minimal'},body:JSON.stringify(payload),cache:'no-store'});
  if(!insert.ok){console.error('Public renter intake insert failed',insert.status,(await insert.text()).slice(0,200));return json({error:'Unable to save your request.'},502);}
  return json({ok:true});
 }catch(e){console.error('Renter registration failed',e);return json({error:'Unable to process the registration.'},500);}
}
