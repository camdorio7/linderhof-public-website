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
  const ownerRes=await fetch(`${url}/rest/v1/profiles?select=id,unit_number,full_name,email,membership_level,membership_status,good_standing&email=eq.${encodeURIComponent(email)}&limit=20`,{headers,cache:'no-store'});
  if(!ownerRes.ok){console.error('LINDEX owner lookup failed',ownerRes.status,(await ownerRes.text()).slice(0,800));return json({error:'Unable to process registration.'},502);}
  const owners=await ownerRes.json();
  const owner=owners.find((p:any)=>String(p.unit_number||'').trim().toLowerCase()===unit.toLowerCase()&&String(p.full_name||'').trim().replace(/\s+/g,' ').toLowerCase()===`${first} ${last}`.replace(/\s+/g,' ').toLowerCase()&&p.membership_level==='owner'&&p.membership_status==='active'&&p.good_standing===true);
  // Do not disclose whether a particular owner, email, or unit is in the member directory.
  if(!owner)return json({error:'We could not verify the owner and unit. Please sign in to LINDEX to register your renter or contact the clubhouse.'},422);
  const duplicate=await fetch(`${url}/rest/v1/renter_stays?select=id&owner_id=eq.${owner.id}&renter_email=eq.${encodeURIComponent(renterEmail)}&start_date=eq.${arrival}&end_date=eq.${departure}&status=eq.pending&limit=1`,{headers,cache:'no-store'});
  if(!duplicate.ok)return json({error:'Unable to verify the registration.'},502);
  if((await duplicate.json()).length)return json({ok:true});
  const insert=await fetch(`${url}/rest/v1/renter_stays`,{method:'POST',headers:{...headers,Prefer:'return=minimal'},body:JSON.stringify({owner_id:owner.id,unit_number:owner.unit_number,renter_name:renter,renter_email:renterEmail,start_date:arrival,end_date:departure,occupants,status:'pending'}),cache:'no-store'});
  if(!insert.ok){console.error('LINDEX renter registration insert failed',insert.status);return json({error:'Unable to save the registration in LINDEX.'},502);}
  return json({ok:true});
 }catch(e){console.error('Renter registration failed',e);return json({error:'Unable to process the registration.'},500);}
}
