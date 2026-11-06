import type { LindexEvent } from '../lib/lindex-events';

function easternTime(value: string): string {
  // LINDEX event_time is a local New Hampshire wall-clock time (HH:mm[:ss]).
  const match = /^(\d{1,2}):(\d{2})/.exec(value);
  if (!match) return value;
  const hour = Number(match[1]);
  if (hour > 23) return value;
  return `${hour % 12 || 12}:${match[2]} ${hour >= 12 ? 'PM' : 'AM'}`;
}
function easternZone(date: string): string {
  // Determine EST/EDT on the event date, rather than on the viewer's current date.
  const d = new Date(`${date}T12:00:00Z`);
  return new Intl.DateTimeFormat('en-US', {timeZone:'America/New_York',timeZoneName:'short'}).formatToParts(d).find(p => p.type === 'timeZoneName')?.value || 'ET';
}
function safeSquareUrl(url?: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && /(^|\.)(square\.link|squareup\.com|square\.site|square\.online)$/.test(parsed.hostname.toLowerCase()) ? parsed.href : null;
  } catch { return null; }
}
export default function EventTile({ item }: { item: LindexEvent }) {
  const date = new Date(`${item.event_date}T12:00:00`);
  const squareUrl = safeSquareUrl(item.square_url);
  const audience = ["Members Only", "Members & Guests", "All Are Welcome"].includes(item.audience || "") ? item.audience : "All Are Welcome";

  return (
    <article className={`announcementCard eventTile${item.image_url && /^https:\/\//i.test(item.image_url) ? '' : ' eventTile--noFlyer'}`}>
      {item.image_url && /^https:\/\//i.test(item.image_url) && (
        <a
          className="eventFlyerLink"
          href={item.image_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View the event flyer for ${item.title}`}
        >
          <img className="eventFlyerImage" src={item.image_url} alt={`${item.title} event flyer`} loading="lazy" />
          <span className="eventFlyerHint">VIEW EVENT FLYER ↗</span>
        </a>
      )}
      <div className="eventTileContent">
        <time dateTime={item.event_date}>
          {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/New_York' })}
          {item.event_time ? ` · ${easternTime(item.event_time)} ${easternZone(item.event_date)}` : ''}
        </time>
        <h3>{item.title}</h3>
        <p className="eventAudience">{audience}</p>
        {item.location && <p><strong>{item.location}</strong></p>}
        {item.description && <p className="eventTileDescription">{item.description}</p>}
        <div className="eventTileActions">
          {squareUrl && <a className="button dark" href={squareUrl} target="_blank" rel="noopener noreferrer">PAY ON SQUARE ↗</a>}
          <a className="button" href="https://linderhofmembers.com/?iosPage=events" target="_blank" rel="noopener noreferrer">VIEW IN LINDEX ↗</a>
        </div>
      </div>
    </article>
  );
}
