# Linderhof iPhone Navigation Fix

## What this does
- Restores a clearly visible white masthead with Linderhof crest and MENU control on iPhone/mobile Safari.
- Provides a full-screen, scrollable white navigation panel with centered links, similar to the supplied Kernwood reference.
- Includes Pro Shop, LPOA, events, membership and LINDEX login links.
- Supports safe-area spacing, ESC key, body scroll lock, and reduced-motion preferences.
- Changes only public website navigation files; no LINDEX, database, or Square payment changes.

## Deploy
1. In the **Linderhof public website** GitHub repository, replace `app/MobileNavigation.tsx` with the file here.
2. **Append** the contents of `MOBILE-NAV-OVERRIDES.css` to the END of your existing `app/globals.css`. Do not replace the full stylesheet: other releases may have changed it since this patch's source snapshot.
3. Commit and deploy in Vercel.
4. Test iPhone Safari on the actual production/preview URL: header visible, MENU opens, CLOSE works, links navigate, page scroll resumes, and no sideways overflow.

Note: The reference screenshot appears to be a Vercel preview URL. Confirm that the preview you are checking is the same deployment that contains this fix. If you still see the old version, refresh Safari or use a private tab.

This patch was assembled from the latest available mobile navigation source in the provided Option 2 update; no live iPhone Safari/browser verification has been performed.
