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

export type LindexAnnouncement = {
  id: string;
  title: string;
  message: string;
  created_at: string;
};

export type LindexClubhouseHours = {
  monday_hours: string;
  tuesday_hours: string;
  wednesday_hours: string;
  thursday_hours: string;
  friday_hours: string;
  saturday_hours: string;
  sunday_hours: string;
  hours_note: string | null;
};

type LindexPublicFeed = {
  events: LindexEvent[];
  announcements: LindexAnnouncement[];
  clubhouseHours: LindexClubhouseHours | null;
  connected: boolean;
};

const EMPTY_FEED: LindexPublicFeed = {
  events: [],
  announcements: [],
  clubhouseHours: null,
  connected: false,
};

const HOUR_KEYS = [
  'monday_hours',
  'tuesday_hours',
  'wednesday_hours',
  'thursday_hours',
  'friday_hours',
  'saturday_hours',
  'sunday_hours',
] as const;

function parseClubhouseHours(value: unknown): LindexClubhouseHours | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  // Only display actual values from LINDEX. Never substitute a stale local schedule.
  if (!HOUR_KEYS.every((key) => typeof record[key] === 'string')) return null;
  return {
    monday_hours: String(record.monday_hours).slice(0, 160),
    tuesday_hours: String(record.tuesday_hours).slice(0, 160),
    wednesday_hours: String(record.wednesday_hours).slice(0, 160),
    thursday_hours: String(record.thursday_hours).slice(0, 160),
    friday_hours: String(record.friday_hours).slice(0, 160),
    saturday_hours: String(record.saturday_hours).slice(0, 160),
    sunday_hours: String(record.sunday_hours).slice(0, 160),
    hours_note: typeof record.hours_note === 'string' ? record.hours_note.slice(0, 500) : null,
  };
}

export async function getLindexEvents(): Promise<LindexPublicFeed> {
  const endpoint = process.env.LINDEX_EVENTS_API_URL;
  const secret = process.env.LINDEX_PUBLIC_EVENTS_SECRET;
  if (!endpoint || !secret) {
    console.error('LINDEX public feed configuration missing', {
      endpointConfigured: !!endpoint,
      secretConfigured: !!secret,
    });
    return { ...EMPTY_FEED };
  }
  try {
    const response = await fetch(endpoint, {
      headers: { 'x-lindex-events-secret': secret },
      cache: 'no-store',
      signal: AbortSignal.timeout(7000),
    });
    if (!response.ok) {
      throw new Error(`LINDEX public feed HTTP ${response.status}`);
    }
    const json: unknown = await response.json();
    if (!json || typeof json !== 'object' || !('events' in json) || !Array.isArray(json.events)) {
      throw new Error('Unexpected LINDEX public feed response');
    }
    const events = json.events.filter((event: unknown): event is LindexEvent =>
      !!event && typeof event === 'object' && 'title' in event && typeof event.title === 'string' &&
      'event_date' in event && typeof event.event_date === 'string');
    const announcements = ('announcements' in json && Array.isArray(json.announcements)
      ? json.announcements : []).filter((announcement: unknown): announcement is LindexAnnouncement =>
      !!announcement && typeof announcement === 'object' && 'title' in announcement &&
      typeof announcement.title === 'string' && 'message' in announcement &&
      typeof announcement.message === 'string' && 'created_at' in announcement &&
      typeof announcement.created_at === 'string');
    const clubhouseHours = 'clubhouse_hours' in json ? parseClubhouseHours(json.clubhouse_hours) : null;
    return { events, announcements, clubhouseHours, connected: true };
  } catch (error) {
    console.error('LINDEX public feed unavailable', error);
    return { ...EMPTY_FEED };
  }
}
