# Linderhof Country Club — Club Events layout refresh

This ZIP contains **only changed public website files**. It is based on the prior Social Membership + LINDEX Clubhouse Hours release. It does not replace or modify the LINDEX backend.

## What changed
- Homepage Club Events no longer reserves a blank second event-card slot when only one public event exists.
- With one event, the flyer and details appear together in a wide horizontal event card beside a compact Social Membership invitation.
- With two events, the two event cards and membership invitation form three columns on wide screens.
- With three events, the cards and membership invitation form a balanced two-by-two grid.
- The News & Events page uses the same adaptive layout; more than three events use a three-column grid on wide screens.
- On phones, everything stacks into one readable column.
- Event flyer opens the flyer image; event details open LINDEX; the Social Membership CTA opens the existing Square membership checkout. These are deliberately separate actions.
- LINDEX clubhouse hours connection is **unchanged**.

## Installation
1. In the **Linderhof public website** GitHub repository, replace the files below, preserving the relative paths.
2. Commit and redeploy in Vercel.
3. Hard-refresh the homepage and `/events` page; test at mobile and desktop widths.

Files:
- `app/page.tsx`
- `app/events/page.tsx`
- `app/EventTile.tsx`
- `app/SocialMembershipCard.tsx`
- `app/globals.css`

No new Supabase SQL, environment variables, or LINDEX changes are needed.

## Checks performed
- TypeScript/TSX syntax parsing for all four updated TSX files.
- CSS parsing without errors.
- Local browser layout test at 390, 768, 1024, and 1440 px, for 1, 2, 3, and 5 events, with no horizontal overflow.
- Visual review of desktop and mobile layouts using a representative flyer image.

The full Next.js production build and live LINDEX/Square links were not tested here; verify them on Vercel after deployment.
