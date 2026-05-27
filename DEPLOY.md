# Deploying AIR to Cloudflare

This branch (`migrate/cloudflare`) replaces Firebase + Vercel with the full Cloudflare stack:

| Concern | Cloudflare product | Binding |
|---|---|---|
| Next.js SSR / API routes | **Pages** (via `@opennextjs/cloudflare`) | — |
| `quiz_sessions`, `answer_distributions` | **D1** | `AIR_DB` |
| Rate-limit + rollup counters | **KV** | `AIR_KV` |
| Share-poster image cache | **R2** | `AIR_POSTERS` |
| Event telemetry (replaces GA4) | **Analytics Engine** | `AIR_ANALYTICS` |
| Anti-abuse on quiz submit | **Turnstile** (invisible) | env var |

Everything runs on the edge — no origin server.

> **Live:** https://air.tao-shen.workers.dev — this branch is already deployed.
> DNS cutover (`air.democra.ai`) is the last remaining step; see §6.

---

## 0 · One-time setup

```bash
cd air
npm install
npm install -g wrangler           # if you don't have it yet
wrangler login                    # opens browser for OAuth
```

Check your account ID shows up:

```bash
wrangler whoami
```

---

## 1 · Create the Cloudflare resources

```bash
# D1 database
wrangler d1 create air
# → copy the "database_id" into wrangler.toml  (REPLACE_WITH_D1_ID)

# KV namespace
wrangler kv namespace create AIR_KV
# → copy the "id" into wrangler.toml  (REPLACE_WITH_KV_ID)

# R2 bucket
wrangler r2 bucket create air-posters

# Analytics Engine dataset — nothing to create; the binding auto-provisions.
```

Edit `wrangler.toml` and paste the IDs into the two placeholders.

---

## 2 · Apply the D1 schema

```bash
# Local SQLite for `next dev` / `wrangler pages dev`
npm run cf:d1:apply:local

# Production D1
npm run cf:d1:apply:remote
```

---

## 3 · Turnstile (anti-abuse on quiz submit)

1. Dashboard → **Turnstile** → **Add site**. Pick "Invisible".
2. Copy the **Site Key** and **Secret Key**.
3. Set them on the Pages project:

   ```bash
   # Public (bundled into the client JS)
   wrangler pages project env add NEXT_PUBLIC_TURNSTILE_SITE_KEY \
       --project-name=air --value=<SITE_KEY>

   # Secret (server-only)
   wrangler pages secret put TURNSTILE_SECRET_KEY --project-name=air
   ```

> If you skip this step the app still works — the server-side verifier soft-fails open. Turn it on before you open traffic from the public.

---

## 4 · Local dev

```bash
# Regular Next dev with remote-style bindings (no wrangler)
npm run dev

# Full Worker-runtime preview (identical to prod)
npm run cf:preview
```

Local D1 lives at `.wrangler/state/v3/d1`. KV is emulated. R2 uses a local dir. Nothing touches production.

---

## 5 · First deploy

```bash
npm run cf:deploy
```

The first run will:

1. Build Next.js via OpenNext into `.open-next/`.
2. Upload the Worker + assets to Cloudflare Pages (`air.pages.dev`).
3. Print the preview URL — e.g. `https://air.pages.dev` or `https://<commit-hash>.air.pages.dev`.

**→ That URL is what you share.**

---

## 6 · Custom domain (`air.democra.ai`)

1. Dashboard → Pages → `air` → **Custom domains** → "Set up a custom domain" → `air.democra.ai`.
2. If `democra.ai` is on Cloudflare DNS, the CNAME is auto-created.
3. If still on another DNS provider, add the CNAME manually:
   ```
   air.democra.ai  CNAME  air.pages.dev
   ```
4. SSL provisions in ~30 seconds. Then update the old Vercel deployment to redirect (or simply delete the Vercel project once DNS has propagated).

---

## 7 · Continuous deploy (GitHub)

Dashboard → Pages → `air` → **Settings → Builds & deployments**:

- Production branch: `main`
- Build command: `npx opennextjs-cloudflare build`
- Build output directory: `.open-next/assets`
- Root directory: `/air`  *(since the project sits in a monorepo subdir)*

Cloudflare will auto-build every push. Preview deploys fire on every PR.

---

## 8 · Verifying data is flowing

After a quiz completes in production:

```bash
wrangler d1 execute AIR_DB --remote --command \
  "SELECT session_id, profile_code, probability, created_at FROM quiz_sessions ORDER BY created_at DESC LIMIT 5;"
```

```bash
wrangler d1 execute AIR_DB --remote --command \
  "SELECT question_id, answer_value, count FROM answer_aggregate ORDER BY count DESC LIMIT 20;"
```

Analytics Engine data is queryable via the [SQL API](https://developers.cloudflare.com/analytics/analytics-engine/sql-api/):

```bash
curl "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/analytics_engine/sql" \
  -H "Authorization: Bearer <API_TOKEN>" \
  -d "SELECT blob1 AS event, COUNT() AS n FROM air_events GROUP BY blob1 ORDER BY n DESC"
```

---

## Rollback

The old Vercel/Firebase stack is untouched on `main`. Switch the DNS record back to `cname.vercel-dns.com` and you're live on Vercel again within a minute.
