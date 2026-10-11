# Linderhof website administration

The website has a private `/admin` dashboard. The dashboard edits `content/site.json` in your GitHub repository using GitHub's Contents API. Your existing Vercel/GitHub deployment publishes the changes automatically after a successful build. No Supabase, Resend, or custom domain is needed.

## One-time setup
1. Upload this entire project to your GitHub website repository. Ensure `content/site.json` exists on the `main` branch.
2. In GitHub, create a **fine-grained personal access token** scoped **only** to the website repository, with **Contents: Read and write**. Never paste the token into website code or public GitHub files.
3. In Vercel > Project > Settings > Environment Variables, set `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `GITHUB_REPO` (e.g. `yourusername/linderhof-public-website`), `GITHUB_BRANCH` (`main`), and `GITHUB_TOKEN`. Use a strong unique password and a randomly generated 64-character secret. Set them for Production; redeploy.
4. Open `https://YOUR-VERCEL-URL/admin` and sign in. Edit content and click **Save & publish changes**. Vercel must already be connected to the same GitHub repository.

## Important security and workflow notes
- The GitHub token stays on the server; never prefix it with `NEXT_PUBLIC_`.
- The dashboard uses an HTTP-only, signed, 8-hour session cookie. Use HTTPS on Vercel.
- Rotate the token and password if exposed. Grant the token access only to the public website repository, not LINDEX.
- Only the homepage headings/text and manual news announcements are editable in this first admin version. Membership rates, images, menus, and other page text are still managed in source code. Facebook remains embedded separately.
- GitHub API can return a conflict if another editor changes the file while the dashboard is open. Reload and retry after checking changes.
- If you do not configure environment variables, the public website still works, but admin login is disabled.
- No email form is activated.
