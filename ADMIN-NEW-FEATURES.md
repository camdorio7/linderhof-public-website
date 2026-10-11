# Admin additions

This update preserves the existing Kernwood-style public site.

- Upload club photos (JPG/PNG/WebP, up to 4 MB) directly to the GitHub repository. Uploaded photos become selectable in the three website image slots. **After upload, click Save & publish changes** to persist the updated photo library and selections.
- Replace the 2027 membership PDF (up to 8 MB) in GitHub. The existing download URL stays the same.
- Edit the LPOA description and both contact numbers.
- Preview draft homepage content, upcoming events, and LPOA text before saving. This is an approximate admin preview, not a pixel-perfect public-site preview.
- Existing announcements, events, membership rates, Facebook link, and login remain.

## Setup and caveats
Keep the existing environment variables described in ADMIN-SETUP.md. The GitHub fine-grained token needs Contents read/write for this website repo. Changes go live only after GitHub accepts the commit and Vercel deploys successfully. Do not upload sensitive documents or private photos to this public repository. Avoid simultaneous edits in two admin tabs; reload before editing to prevent version conflicts. The admin is single-password access, not individual staff accounts. Media uploads commit immediately and cannot be undone by canceling a draft.

No Resend or domain is required.
