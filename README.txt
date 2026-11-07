LINDEX + PUBLIC WEBSITE RENTER FLOW CORRECTION

LINDEX: replace src/App.jsx. This retains the latest admin/owner fixes from the prior patch. Signup condo lookup tries both public RPC names and shows clickable matching unit options, rather than relying on browser datalist behavior.

PUBLIC WEBSITE: replace app/register-a-renter/page.tsx and app/passes/page.tsx. The /passes page redirects to the single renter stay form. Condo owners only confirm requests; they do not submit the initial registration.

IMPORTANT: The signup RPC must exist and return unit_label rows. If no units appear, verify that PUBLIC_CONDO_UNIT_LABELS.sql from the previous patch was executed and lindex_owner_registry has records. This patch cannot populate a missing database directory.

Test in a staging deployment: signup unit selection, renter stay submission, owner confirmation, and post-confirmation email. No production tests were run.
