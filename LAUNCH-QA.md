# Linderhof website launch QA

## Changes in this package
- Preserves existing Kernwood-inspired desktop design, logo, background, LPOA, membership, Facebook, and admin routes.
- Improves small-screen navigation wrapping and spacing, header/hero overlap, cards, tables and admin top padding.
- Adds keyboard skip navigation and visible keyboard focus indicators.
- Adds reduced-motion support and lazy loading for homepage feature images.

## Test before launch
1. Test widths 375px, 390px, 768px, 1024px and desktop on Home, Membership, Golf, Amenities, LPOA, Events, Contact, Admin.
2. Confirm Facebook embed loads and its fallback link works when blocked.
3. Confirm admin login, content fetch (non-null SHA), Save & Publish, and Vercel redeployment.
4. Confirm media upload and membership PDF replacement using noncritical test assets.
5. Confirm all membership rates against the club-approved 2027 guide.
6. Confirm public contact/inquiry forms remain paused until email delivery is configured.
7. Confirm LINDEX links, phone links, and directions.
8. Run npm install and npm run build in a network-enabled environment.

Note: Changes published via the admin GitHub workflow require a successful Vercel deployment before becoming public.
