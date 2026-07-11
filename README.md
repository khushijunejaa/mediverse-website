# Mediverse — Website

A production-ready static site (HTML, CSS, vanilla JavaScript + GSAP, Lenis, SplitType).
No build step. No server. Just static files you can host anywhere.

---

## 1. Before you publish — 3 quick edits

### a) Turn on the contact form (Formspree — free, no server)
1. Go to **https://formspree.io** and create a free account (use the email where you want to receive enquiries).
2. Create a **New Form**, name it "Mediverse Consultation". Formspree gives you an endpoint like:
   `https://formspree.io/f/abcdwxyz`
3. Open **`index.html`**, find this line (search for `YOUR_FORM_ID`):
   ```html
   <form class="mform" id="contactForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST" novalidate>
   ```
   Replace `YOUR_FORM_ID` with your real ID, e.g. `.../f/abcdwxyz`.
4. Save. The first time someone submits, Formspree emails you to confirm the form — click that link once and you're live. Submissions then arrive in your inbox.

### b) Set your real email address
Search the project for `hello@mediverse.example` and replace every instance with your real business email (it appears in `index.html` footer and in form error messages).

### c) Set your domain in SEO files
When you know your final domain, replace `YOURDOMAIN.com` in:
- `robots.txt`
- `sitemap.xml`
- the `<link rel="canonical">` and `og:` URL in `index.html`

*(You can do this now or after connecting the domain — it only affects SEO, not whether the site works.)*

---

## 2. Publish to GitHub Pages

### Option A — via GitHub website (no tools needed)
1. Create a GitHub account at https://github.com (if you don't have one).
2. Click **New repository**. Name it e.g. `mediverse-website`. Set it **Public**. Create.
3. On the repo page click **"uploading an existing file"**.
4. Drag **all the files and folders** from this project (`index.html`, `404.html`, `css/`, `js/`, `assets/`, `.nojekyll`, `robots.txt`, `sitemap.xml`) into the upload area. Commit.
5. Go to **Settings → Pages**. Under *Build and deployment → Source*, choose **Deploy from a branch**, branch **main**, folder **/ (root)**. Save.
6. Wait ~1 minute. Your site is live at `https://YOURUSERNAME.github.io/mediverse-website/`.

> The included **`.nojekyll`** file tells GitHub Pages to serve every folder as-is (important — don't delete it).

### Option B — via Git (command line)
```bash
cd "path/to/MEDIVERSE WEBSITE"
git init
git add .
git commit -m "Launch Mediverse site"
git branch -M main
git remote add origin https://github.com/YOURUSERNAME/mediverse-website.git
git push -u origin main
```
Then enable Pages in **Settings → Pages** as in Option A, step 5.

---

## 3. Connect your custom domain (later)

1. In your repo: **Settings → Pages → Custom domain**, type your domain (e.g. `www.mediverse.com`) and Save.
   GitHub creates a `CNAME` file in the repo automatically — leave it there.
2. At your **domain registrar** (GoDaddy, Namecheap, etc.), add DNS records:

   **For a `www` subdomain (recommended):**
   | Type  | Name | Value |
   |-------|------|-------|
   | CNAME | www  | `YOURUSERNAME.github.io` |

   **For the root/apex domain (`mediverse.com`), add four A records:**
   | Type | Name | Value |
   |------|------|-------|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |

3. Back in **Settings → Pages**, tick **Enforce HTTPS** once it becomes available (can take up to a few hours after DNS propagates).

That's it — your domain now points at the site.

---

## Project structure
```
index.html          Homepage
404.html            Not-found page
css/style.css       All styles
js/main.js          All interactions & animations
assets/             Optimized images (logo, portraits, smoke)
.nojekyll           Required for GitHub Pages
robots.txt          SEO
sitemap.xml         SEO
```

The large source `.png` files in the root are your originals — the site actually uses the smaller optimized `.webp` files in `assets/`. You can keep the PNGs for future edits or delete them; they aren't loaded by the site.

## Editing content
- **Text/copy:** edit directly in `index.html`.
- **Expert photos:** replace the files in `assets/experts/` (keep the same names) or point the `<img src>` to new files.
- **Equipment marquee items:** edit the `<span class="pill">…</span>` list in `index.html`.
