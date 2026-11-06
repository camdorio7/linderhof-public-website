import {NextResponse} from 'next/server';
export const runtime='nodejs';
export async function GET(request:Request){
 const q=(new URL(request.url).searchParams.get('q')||'').trim().toLowerCase().replace(/[^a-z0-9]/g,'');
 if(q.length<1||q.length>40)return NextResponse.json({units:[]},{headers:{'Cache-Control':'no-store'}});
 const url=(process.env.LINDEX_SUPABASE_URL||'').replace(/\/$/,'');
 const key=process.env.LINDEX_SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key)return NextResponse.json({error:'Unit search unavailable'},{status:503});
 try{
  const r=await fetch(`${url}/rest/v1/lindex_owner_registry?select=id,unit_label,unit_key&unit_key=like.${encodeURIComponent(q+'*')}&order=unit_label.asc&limit=15`,{headers:{apikey:key,Authorization:`Bearer ${key}`},cache:'no-store'});
  if(!r.ok)throw Error('registry lookup');
  const units=(await r.json()).map((u:{id:string,unit_label:string})=>({id:u.id,label:u.unit_label}));
  return NextResponse.json({units},{headers:{'Cache-Control':'no-store'}});
 }catch{return NextResponse.json({error:'Unit search unavailable'},{status:503})}
}
