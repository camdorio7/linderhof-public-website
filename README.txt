TEMPORARY NO-ACCOUNT RENTER REGISTRATION — CHANGED FILES ONLY

PUBLIC WEBSITE: replace app/api/register-renter/route.ts, app/register-a-renter/RentalForm.tsx, app/register-a-renter/page.tsx, app/passes/page.tsx.
LINDEX: replace src/OwnerRegistry.jsx; add and RUN supabase/migrations/20261105_public_renter_intake.sql in Supabase before deploying either website.

The public website Vercel environment must have LINDEX_SUPABASE_URL and LINDEX_SUPABASE_SERVICE_ROLE_KEY (server only). Never expose the service role key with NEXT_PUBLIC_ prefix.

SECURITY/WORKFLOW: New submissions are unverified intake records in lindex_public_renter_requests. They DO NOT automatically become renter_stays, create passes, or authorize checkout. Staff must independently verify ownership and authorization and use the existing LINDEX renter stay / pass workflow for final approval and payment. The admin 'Mark verified' button only records review status, NOT pass authorization.

LIMITATIONS: No verified-email challenge or automated conversion to renter_stays in this patch. Public intake has no dedicated rate limiter or bot protection; configure rate limiting/WAF at hosting edge before broad launch. Service role key must stay on server. Do not publish owner registry details. Test with a legitimate owner, an ineligible unit, and the disabled setting.
