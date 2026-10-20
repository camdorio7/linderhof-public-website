import Link from 'next/link';
import type { LindexClubhouseHours } from '../lib/lindex-events';

const DAYS: ReadonlyArray<{ label: string; key: keyof Omit<LindexClubhouseHours, 'hours_note'> }> = [
  { label: 'Monday', key: 'monday_hours' },
  { label: 'Tuesday', key: 'tuesday_hours' },
  { label: 'Wednesday', key: 'wednesday_hours' },
  { label: 'Thursday', key: 'thursday_hours' },
  { label: 'Friday', key: 'friday_hours' },
  { label: 'Saturday', key: 'saturday_hours' },
  { label: 'Sunday', key: 'sunday_hours' },
];

export default function ClubhouseHours({ hours }: { hours: LindexClubhouseHours | null }) {
  return (
    <section id="clubhouse-hours" className="clubhouseHours" aria-labelledby="clubhouse-hours-title">
      <div className="clubhouseHoursHeading">
        <p className="eyebrow">PLAN YOUR VISIT</p>
        <h3 id="clubhouse-hours-title">Clubhouse Hours</h3>
        <p>Hours are maintained by the club in LINDEX.</p>
      </div>
      {hours ? (
        <>
          <dl className="clubhouseHoursGrid">
            {DAYS.map(({ label, key }) => (
              <div className="clubhouseHoursRow" key={key}>
                <dt>{label}</dt>
                <dd>{hours[key] || 'Not posted'}</dd>
              </div>
            ))}
          </dl>
          {hours.hours_note && <p className="clubhouseHoursNote">{hours.hours_note}</p>}
        </>
      ) : (
        <p className="clubhouseHoursUnavailable">The current schedule is temporarily unavailable. Please check LINDEX or contact the clubhouse before visiting.</p>
      )}
      <Link className="clubhouseHoursLink" href="/contact">Contact &amp; directions ↗</Link>
    </section>
  );
}
