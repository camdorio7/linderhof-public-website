# Linderhof Country Club public website

Next.js 15 website with a Kernwood-inspired, photographic, centered-navigation layout.

## Deploy
Upload the **contents** of this directory to the GitHub repository, and remove any old `app/api/checkout`, `app/shop`, and other Stripe files still in GitHub. GitHub ZIP uploads do not delete old files automatically. Vercel builds using `npm run build`.

## Before launch
- Replace the illustrative Unsplash imagery with real Linderhof photos.
- Replace the text-based center logo with the club's optimized transparent crest asset when available.
- Verify the membership inquiry destination email `info@linderhofcountryclub.com`; the form currently opens the visitor's email app rather than sending directly.
- Verify content and membership categories against official club documents.
- Member login links to https://linderhofmembers.com. No store or Stripe functionality is included.
