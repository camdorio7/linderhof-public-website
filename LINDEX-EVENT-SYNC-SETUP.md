# LINDEX → Public Website Event Sync

The public website retains its existing design and Facebook feed. It fetches upcoming, explicitly public events from LINDEX server-side, cached for up to five minutes. Admin-created website events remain available too.

## 1. Update LINDEX (separate project)

1. Run `PUBLIC_WEBSITE_EVENTS.sql` in the **LINDEX Supabase** SQL editor.
2. Deploy the accompanying LINDEX ZIP to the existing LINDEX GitHub/Vercel project. This adds an opt-in checkbox **Show this event on the public Linderhof website** to LINDEX's event editor.
3. In **LINDEX Vercel** add `LINDEX_PUBLIC_EVENTS_SECRET` (Production). Generate with `openssl rand -hex 32`.
4. Ensure existing `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_URL` (or `VITE_SUPABASE_URL`) are present on LINDEX server. Do not expose the service-role key in the public website.
5. Redeploy LINDEX.

## 2. Update the public website

1. Deploy the accompanying public website ZIP to its **separate** GitHub/Vercel project.
2. In **public website Vercel** add:
   - `LINDEX_EVENTS_API_URL` = `https://linderhofmembers.com/api/public-website-events`
   - `LINDEX_PUBLIC_EVENTS_SECRET` = the exact same secret set in LINDEX Vercel.
3. Redeploy the public website.
4. Create or edit an event in LINDEX, check **Show this event on the public Linderhof website**, save it, and wait up to five minutes. Then refresh the public `/events` page.

## Privacy / behavior

- All existing LINDEX events remain private by default, including member-only activities.
- Only title, date, time, description, location, type and image URL of opted-in upcoming events are transferred; **no member names, RSVP records, or payment details**.
- Event changes and deletions in LINDEX are reflected after cache refresh.
- The public website cannot modify LINDEX events.
- If the LINDEX feed is unavailable, the public site continues showing website-managed events and Facebook.
- `LINDEX_PUBLIC_EVENTS_SECRET` is server-only; do not prefix it with `NEXT_PUBLIC_` or `VITE_`.
- Before marking an event public, check that its description and location are appropriate for all visitors.
