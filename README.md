# Paperwork

A static site with four document generators (freelance contract, invoice, NDA,
contractor agreement) and two checklists (UK self-assessment, US LLC formation).

Everything runs in the browser. There is no build step, no npm install, no
server, no database and no upload endpoint. You can deploy it by dragging the
folder onto a host.

```
paperwork/
  index.html                  homepage
  about.html  privacy.html  terms.html  404.html
  tools/
    freelance-contract.html
    invoice.html
    nda.html
    contractor-agreement.html
  checklists/
    index.html
    self-assessment.html
    llc-formation.html
  assets/
    styles.css                all styling (edit the variables at the top)
    data.js                   SITE config + every document's fields and wording
    app.js                    form engine, preview, download, checklist logic
  robots.txt  sitemap.xml  ads.txt  _headers
```

---

## 1. Get it live (10 minutes, free)

### Cloudflare Pages (recommended)

1. Create a free account at <https://dash.cloudflare.com>.
2. Go to **Workers & Pages → Create → Pages → Upload assets**.
3. Name the project, then drag the **contents of the `paperwork` folder** into
   the upload box. Do not drag the parent folder — `index.html` must end up at
   the site root.
4. Click **Deploy**. You get a free `*.pages.dev` address immediately.
5. Add your own domain under **Custom domains**.

### Netlify (also fine)

1. <https://app.netlify.com/drop>
2. Drag the `paperwork` folder onto the page.
3. Rename the site under **Site configuration → Change site name**, then add a
   custom domain.

### Do not use GitHub Pages unless you know what you are doing

GitHub Pages ignores `_headers` and needs a `CNAME` file for a custom domain.
The two options above handle HTTPS and compression for you.

---

## 2. Before you go live: replace the placeholder domain

Every page contains `https://YOUR-DOMAIN.com`. Search and replace it across the
folder with your real domain (no trailing slash). In VS Code: **Ctrl+Shift+H**.

Files that contain it: all `.html` files, `sitemap.xml`, `robots.txt`.

Also change:

| Where | What |
|---|---|
| `assets/data.js` | `SITE.domain`, `SITE.email` |
| `about.html`, `privacy.html`, `terms.html` | the `hello@YOUR-DOMAIN.com` address |
| `sitemap.xml` | lastmod dates when you edit pages |

If you skip this, your canonical tags all point at a domain you do not own and
Google will not index the site.

---

## 3. Turn on ads (after approval)

Ad slots are already placed and hidden. Nothing loads until you fill in your
publisher id.

1. Apply to Google AdSense with the live site. You need the privacy policy,
   about page and real content — all three are already there.
2. When approved, open `assets/data.js` and set:

   ```js
   adsense: {
     client: "ca-pub-1234567890123456",
     slots: { top: "1234567890", inline: "0987654321" }
   }
   ```

   `slots` are optional — leave them empty and AdSense auto-formats.
3. Open `ads.txt`, uncomment the last line and insert your `pub-...` id.
4. Redeploy.

The consent banner appears automatically. Ads load only after a visitor accepts,
which is what the UK GDPR and Google's EU user consent policy require. For
serious EEA/UK traffic, switch to a Google-certified CMP (AdSense → Privacy &
messaging) rather than relying on the built-in banner.

**Do not** paste AdSense code into the HTML directly — you will end up with
double-loading and policy problems.

---

## 4. Editing the words

### Change a clause or a form field

Everything lives in `assets/data.js`. Each document is an object with:

- `groups` — the form, grouped into sections
- `build: function (v) { ... }` — the generated document

Inside `build`, `v` holds what the user typed. Helpers you can use:

| Helper | What it does |
|---|---|
| `val(v, "field")` | escaped value, or a highlighted `[not completed]` placeholder |
| `raw(v, "field")` | raw trimmed string, for `if` checks |
| `list(v, "field")` | turns `- item` lines into a `<ul>` |
| `esc(text)` | HTML-escape any string |
| `money(number, "GBP")` | formats currency |

The clause headings are numbered automatically by CSS, so do not add "1." to
`<h2>` text.

### Change colours and type

Top of `assets/styles.css`: `--accent`, `--paper`, `--serif`, `--sans`. Change
those four and the whole site follows.

### Add a whole new generator

See `HOW-TO-ADD-A-DOCUMENT.md`.

---

## 5. Testing before you deploy

Open `paperwork/index.html` directly in a browser — it works from `file://`
because every path is relative. Check:

- [ ] Each generator fills in, previews and downloads a `.doc`
- [ ] "Print / PDF" shows only the document, not the form or nav
- [ ] Checklist ticks survive a page reload
- [ ] Mobile layout: the form stacks above the preview, nothing overflows
- [ ] No console errors (F12 → Console)

To test over HTTP instead (recommended, matches production):

```
cd paperwork
npx serve .
```

Then open the address it prints.

---

## 6. Honest expectations

This site will not earn anything until it has traffic, and traffic takes months.
A realistic path:

| Monthly pageviews | Approx. ad revenue at $8–12 RPM |
|---|---|
| 1,000 | $8–12 |
| 10,000 | $80–120 |
| 50,000 | $400–600 |
| 100,000 | $800–1,200 |

What moves you up that table:

1. **More tools, not more words.** Each new generator is a new keyword with
   buying intent. Ten tools beat one tool plus nine blog posts.
2. **Long-tail specificity.** "Invoice generator with VAT reverse charge" beats
   "free invoice generator".
3. **Links from real places.** Answer questions on r/freelance, r/smallbusiness
   and accounting forums with the tool, not spam.
4. **Freshness.** Update the review date and the thresholds when tax rules
   change; stale content loses rankings.

Ad revenue is the floor. The same traffic is worth 2–5× more through affiliate
links to accounting software, registered agent services or contract-review
services — add those only where they genuinely help the reader.

---

## 7. Legal and policy housekeeping

- The templates are general information, not legal advice. That disclaimer is on
  every page — do not remove it.
- Keep the privacy policy accurate if you change ad providers or add analytics.
- If you add a contact form or newsletter, you become a data controller for that
  data and the privacy policy must say so.
- Do not add popunder or push-notification ad networks alongside AdSense.
