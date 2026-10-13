# LINDEX event feed: authentication and routing repair

## What the uploaded code showed
- Public website sends `x-lindex-events-secret`; LINDEX expects the same header. No header-name mismatch.
- LINDEX `vercel.json` had a catch-all SPA rewrite. This update excludes `/api/*` from that rewrite.
- The observed HTTP 401 means the LINDEX endpoint rejected authentication on those requests. The rewrite is a separate routing hardening fix, not proof of the 401 cause.

## Required Vercel settings
- LINDEX project Production: `LINDEX_PUBLIC_EVENTS_SECRET`
- Public website Production: `LINDEX_PUBLIC_EVENTS_SECRET` (exact same value)
- Public website Production: `LINDEX_EVENTS_API_URL=https://linderhofmembers.com/api/public-website-events`
- LINDEX project Production: `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_URL` (or `VITE_SUPABASE_URL`)

Redeploy both projects after changing environment variables. Verify that `linderhofmembers.com` is assigned to the LINDEX deployment you changed. The logs now distinguish a missing LINDEX secret (503), an absent header (401), and a supplied but mismatched header (401) without exposing any secret values. If 401 remains and `secretHeaderPresent: true`, the running deployments still disagree about the secret or domain target.

The API only returns events with `show_on_public_website=true` and `event_date` today or later in New Hampshire.

Do not put the shared secret in `NEXT_PUBLIC_` variables or paste it into chat.
