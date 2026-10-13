import { createClient } from '@supabase/supabase-js';

function nhToday() {
  const parts = new Intl.DateTimeFormat('en-US', {timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const get = (type) => parts.find(p => p.type === type)?.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({error:'Method not allowed'});
  res.setHeader('Cache-Control','private, no-store');
  const secret = process.env.LINDEX_PUBLIC_EVENTS_SECRET;
  const provided = req.headers['x-lindex-events-secret'];
  if (!secret) {
    console.error('LINDEX public events: LINDEX_PUBLIC_EVENTS_SECRET is not configured for this deployment');
    return res.status(503).json({error:'Event feed authentication not configured'});
  }
  if (typeof provided !== 'string' || provided !== secret) {
    console.error('LINDEX public events: authentication rejected', {
      secretHeaderPresent: typeof provided === 'string',
      // Never log either secret, even partially.
    });
    return res.status(401).json({error:'Unauthorized'});
  }
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(503).json({error:'Events service not configured'});
  try {
    const db = createClient(url,key,{auth:{persistSession:false}});
    const {data,error} = await db.from('events')
      .select('id,title,event_date,event_time,description,location,event_type,image_url')
      .eq('show_on_public_website',true)
      .gte('event_date',nhToday())
      .order('event_date',{ascending:true}).limit(24);
    if (error) throw error;
    return res.status(200).json({events:data || []});
  } catch (error) {
    console.error('LINDEX public events fetch failed',error);
    return res.status(502).json({error:'Unable to load public events'});
  }
}
