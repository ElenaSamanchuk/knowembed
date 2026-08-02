# Deploy — GitHub Pages + Vercel

## GitHub Pages

**URL:** https://elenasamanchuk.github.io/knowembed/

Push to `main` → CI builds with `GITHUB_PAGES=true` → `base: /knowembed/` + `404.html` for SPA routes.

Settings: https://github.com/ElenaSamanchuk/knowembed/settings/pages  
Source: **GitHub Actions**

Routes work after deploy:
- `/knowembed/`
- `/knowembed/pricing`
- `/knowembed/login`
- `/knowembed/embed-demo.html`

---

## Vercel

**URL:** https://knowembed.vercel.app/

### 1. Connect repo

https://vercel.com/new → Import **ElenaSamanchuk/knowembed**

| Setting | Value |
|---------|--------|
| Framework | Vite (or Other) |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm ci` |

`vercel.json` in repo already sets rewrites for `/pricing`, `/app`, etc.

### 2. Environment variables (required — без них белый экран)

https://vercel.com → твой проект **knowembed** → **Settings → Environment Variables**

Add for **Production**, **Preview**, **Development**:

| Name | Value |
|------|--------|
| `VITE_SUPABASE_URL` | `https://buwxmfapwampgpwvnulb.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | anon key из Supabase → Settings → API |

### 3. Redeploy

Deployments → latest → **Redeploy** (или push в main)

### Routes (root domain, без `/knowembed`):
- https://knowembed.vercel.app/
- https://knowembed.vercel.app/pricing
- https://knowembed.vercel.app/embed-demo.html

---

## Stripe redirect URLs

| Host | success_url |
|------|-------------|
| GitHub Pages | `https://elenasamanchuk.github.io/knowembed/checkout?success=1` |
| Vercel | `https://knowembed.vercel.app/checkout?success=1` |

App sends correct origin automatically via `appOrigin()`.
