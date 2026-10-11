# Build fix and crest update

- Fixed TypeScript inference for `content/site.json` empty `events` array in `app/events/page.tsx`. Event entries now use a declared `ClubEvent` type, including `date`.
- Replaced the previous cropped logo image with the full crest supplied by the club, and updated the header CSS to use `object-fit: contain` without cropping.
- No changes to the admin credentials or Facebook URL.

Deploy the full ZIP to GitHub, replacing the existing files.
