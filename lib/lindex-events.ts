export type LindexEvent = {
  id: string;
  title: string;
  event_date: string;
  event_time: string | null;
  description: string | null;
  location: string | null;
  event_type: string | null;
  image_url: string | null;
};
export type LindexAnnouncement = {id:string;title:string;message:string;created_at:string};
export async function getLindexEvents(): Promise<{events:LindexEvent[]; announcements:LindexAnnouncement[]; connected:boolean}> {
  const endpoint = process.env.LINDEX_EVENTS_API_URL;
  const secret = process.env.LINDEX_PUBLIC_EVENTS_SECRET;
  if (!endpoint || !secret) {
    console.error('LINDEX events configuration missing', { endpointConfigured: !!endpoint, secretConfigured: !!secret });
    return {events:[],announcements:[],connected:false};
  }
  try {
    const response = await fetch(endpoint, {
      headers:{'x-lindex-events-secret':secret},
      cache:'no-store',
      signal:AbortSignal.timeout(7000),
    });
    if (!response.ok) throw new Error(`LINDEX event feed HTTP ${response.status} (${response.status === 401 ? 'authentication rejected by LINDEX' : response.status === 503 ? 'LINDEX server configuration missing' : 'upstream error'})`);
    const json:unknown = await response.json();
    if (!json || typeof json !== 'object' || !('events' in json) || !Array.isArray(json.events)) throw new Error('Unexpected LINDEX event response');
    const events = json.events.filter((e:unknown):e is LindexEvent => !!e && typeof e==='object' && 'title' in e && typeof e.title==='string' && 'event_date' in e && typeof e.event_date==='string');
    const announcements = ('announcements' in json && Array.isArray(json.announcements) ? json.announcements : []).filter((a:unknown):a is LindexAnnouncement => !!a && typeof a==='object' && 'title' in a && typeof a.title==='string' && 'message' in a && typeof a.message==='string' && 'created_at' in a && typeof a.created_at==='string');
    return {events,announcements,connected:true};
  } catch (error) {
    console.error('LINDEX events unavailable',error);
    return {events:[],announcements:[],connected:false};
  }
}
