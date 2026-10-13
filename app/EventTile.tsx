import type {LindexEvent} from '../lib/lindex-events';
export default function EventTile({item}:{item:LindexEvent}) {
  const date = new Date(`${item.event_date}T12:00:00`);
  return <article className="announcementCard eventTile">
    {item.image_url && /^https:\/\//i.test(item.image_url) && <a className="eventFlyerLink" href={item.image_url} target="_blank" rel="noopener noreferrer" aria-label={`View full flyer for ${item.title}`}><img className="eventFlyerImage" src={item.image_url} alt={`${item.title} event flyer`} loading="lazy"/><span className="eventFlyerHint">View full flyer ↗</span></a>}
    <time dateTime={item.event_date}>{date.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'America/New_York'})}{item.event_time ? ` · ${item.event_time.slice(0,5)}` : ''}</time>
    <h3>{item.title}</h3>
    {item.location && <p><strong>{item.location}</strong></p>}
    {item.description && <p className="eventTileDescription">{item.description}</p>}
    <a href="https://linderhofmembers.com/?iosPage=events" target="_blank" rel="noopener noreferrer">Details in LINDEX ↗</a>
  </article>;
}
