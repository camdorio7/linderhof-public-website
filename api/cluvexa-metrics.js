import { createClient } from '@supabase/supabase-js';

function nyDate(){
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const get=t=>parts.find(p=>p.type===t)?.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  res.setHeader('Cache-Control','private, no-store');
  const supplied=req.headers['x-cluvexa-integration-key'];
  const expected=process.env.CLUVEXA_INTEGRATION_SECRET;
  if(!expected) return res.status(503).json({error:'LINDEX CLUVEXA integration is not configured.'});
  if(typeof supplied!=='string'||supplied.length!==expected.length||supplied!==expected) return res.status(401).json({error:'Unauthorized'});
  const supabaseUrl=process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!supabaseUrl||!serviceKey) return res.status(503).json({error:'LINDEX server configuration is incomplete.'});
  const db=createClient(supabaseUrl,serviceKey,{auth:{persistSession:false}});
  const today=nyDate();
  try{
    const [members,allCheckins,memberCheckins,guestCheckins,golfCheckins,poolCheckins,passes,eventCount,nextEvents,settings]=await Promise.all([
      db.from('profiles').select('*',{count:'exact',head:true}).eq('membership_status','active'),
      db.from('club_daily_sign_ins').select('*',{count:'exact',head:true}).eq('sign_in_date',today),
      db.from('club_daily_sign_ins').select('*',{count:'exact',head:true}).eq('sign_in_date',today).eq('visitor_type','member'),
      db.from('club_daily_sign_ins').select('*',{count:'exact',head:true}).eq('sign_in_date',today).eq('visitor_type','guest'),
      db.from('club_daily_sign_ins').select('*',{count:'exact',head:true}).eq('sign_in_date',today).eq('access_type','golf'),
      db.from('club_daily_sign_ins').select('*',{count:'exact',head:true}).eq('sign_in_date',today).eq('access_type','pool'),
      db.from('guest_pass_requests').select('*',{count:'exact',head:true}).eq('payment_status','paid').eq('status','active'),
      db.from('events').select('*',{count:'exact',head:true}).gte('event_date',today),
      db.from('events').select('id,title,event_date,event_time,location').gte('event_date',today).order('event_date',{ascending:true}).limit(5),
      db.from('club_settings').select('id,pool_status,updated_at').eq('id','main').maybeSingle()
    ]);
    const errors=[members,allCheckins,memberCheckins,guestCheckins,golfCheckins,poolCheckins,passes,eventCount,nextEvents].map(x=>x.error).filter(Boolean);
    if(errors.length) throw errors[0];
    return res.status(200).json({
      platform:'LINDEX',club:'Linderhof Country Club',mode:'read-only',generated_at:new Date().toISOString(),club_date:today,
      metrics:{active_members:members.count||0,check_ins_today:allCheckins.count||0,member_check_ins_today:memberCheckins.count||0,guest_check_ins_today:guestCheckins.count||0,golf_check_ins_today:golfCheckins.count||0,pool_check_ins_today:poolCheckins.count||0,active_passes:passes.count||0,upcoming_events:eventCount.count||0},
      operations:{pool_status:settings.data?.pool_status||null,last_settings_update:settings.data?.updated_at||null},
      next_events:nextEvents.data||[]
    });
  }catch(error){console.error('CLUVEXA metrics error',error);return res.status(500).json({error:'Could not prepare LINDEX operational metrics.'});}
}
