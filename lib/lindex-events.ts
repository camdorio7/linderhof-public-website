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
export async function getLindexEvents(): Promise<{events:LindexEvent[]; connected:boolean}> {
  const endpoint = process.env.LINDEX_EVENTS_API_URL;
  const secret = process.env.LINDEX_PUBLIC_EVENTS_SECRET;
  if (!endpoint || !secret) return {events:[],connected:false};
  try {
    const response = await fetch(endpoint, {
      headers:{'x-lindex-events-secret':secret},
      next:{revalidate:300},
      signal:AbortSignal.timeout(7000),
    });
    if (!response.ok) throw new Error(`LINDEX event feed HTTP ${response.status}`);
    const json:unknown = await response.json();
    if (!json || typeof json !== 'object' || !('events' in json) || !Array.isArray(json.events)) throw new Error('Unexpected LINDEX event response');
    const events = json.events.filter((e:unknown):e is LindexEvent => !!e && typeof e==='object' && 'title' in e && typeof e.title==='string' && 'event_date' in e && typeof e.event_date==='string');
    return {events,connected:true};
  } catch (error) {
    console.error('LINDEX events unavailable',error);
    return {events:[],connected:false};
  }
}
