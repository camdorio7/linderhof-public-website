# Linderhof iPhone menu – root cause and installation

## Why the previous patch did not work
The repository contained `app/MobileNavigation.tsx` and mobile CSS, but `app/layout.tsx` never imported or rendered the component. CSS alone cannot display an unmounted React component.

## Install
1. Copy **all three files** from this ZIP into the public website repository at the same paths, replacing the existing files:
   - `app/layout.tsx`
   - `app/MobileNavigation.tsx`
   - `app/globals.css`
2. Commit/push to the branch that Vercel deploys.
3. Check the Vercel deployment is successful and visit the correct deployment domain.
4. In iPhone Safari, reload the page; if an older version persists, open a private tab.

The supplied `globals.css` is your existing stylesheet with a small override appended at the bottom; do not append it again to itself. This fix does not alter Square, Pro Shop, or desktop navigation.

## Expected result
At <=700px screen width, a white sticky header with the crest on the left and MENU on the right appears on every page. Tapping MENU opens a full-screen navigation overlay with CLOSE. Desktop keeps its existing header.

## Verification
This fixes the missing React render in the uploaded source. It has not been tested against the live iPhone deployment.
