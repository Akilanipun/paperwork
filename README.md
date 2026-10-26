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

## 2. Domain (already set)

The live domain is baked in everywhere:

```
https://paperwork.sltechempire.store
hello@sltechempire.store
```

Every page carries the real canonical URL, so indexing works as-is. If you ever
move the site to a different domain, search and replace
`paperwork.sltechempire.store` across the whole folder (VS Code:
**Ctrl+Shift+H**), and also update:

| Where | What |
|---|---|
| `assets/data.js` | `SITE.domain`, `SITE.email` |
| `about.html`, `privacy.html`, `terms.html` | the `hello@sltechempire.store` address |
| `sitemap.xml` | lastmod dates when you edit pages |

If you skip this after a move, the canonical tags point at a domain you do not
own and Google will drop the pages from the index.

---

## 3. Ads (Adsterra banner — already live)

One **300×250 Adsterra banner** on tool and checklist pages, loaded only after a
visitor presses **Accept**. The popunder and social bar were removed — they were
invisible formats that made the site look ad-free.

Your zone is configured in `assets/data.js`:

```js
requireConsent: true,

adsterra: {
  banner: {
    key: "885f283e75c13ade7d91462fbeb6b628",
    src: "https://bauval.org/22/885f283e75c13ade7d91462fbeb6b628",
    width: 300,
    height: 250,
    slots: ["top", "inline"]
  }
}
```

- `top` is the banner above the form; `inline` is the one near the bottom.
- Remove one from `slots` to show a single banner per page.
- The snippet is **not** pasted into the HTML. `app.js` builds it and runs it
  inside an isolated iframe, so Adsterra's `document.write` cannot wipe the page.

### The consent gate

- Accept → banner script loads, choice saved in `localStorage`
- Decline → no ad request, no ad cookie, tools still work
- Returning visitors who accepted get the banner immediately, no prompt
- To ask everyone again, clear the site's data in the browser

That is what UK GDPR / PECR ask for.

**To switch ads off completely**, set both to empty:

```js
banner: { key: "", src: "", width: 300, height: 250, slots: ["top"] }
```

**To load ads without asking** (not recommended for UK/EU traffic), set
`requireConsent: false`. The banner disappears and the ad loads on page load.

### Second network (optional, empty)

`adsense` stays in `assets/data.js` with an empty `client`. While it is empty,
nothing Google-related loads. If AdSense or Ezoic ever approves the site, paste
your id there and the same slots are reused. `ads.txt` is AdSense-only and is
unused by Adsterra — leaving it as a comment does no harm.

### Rules of thumb

- **Never** paste the Adsterra `<script>` tags into the HTML as well — you will
  double-load the same zone and get invalid traffic flagged.
- Keep one banner per slot. Do not add a second network into the same box.
- Banners pay far less per impression than a popunder, but they are visible and
  do not cost trust. If revenue is too low, add a second zone rather than
  switching back to a popunder on the same page.

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

Opening `paperwork/index.html` from `file://` only lets you see the page you
opened — menu links use the live, extensionless URLs (`/tools/invoice`), so
clicking around needs a local server. If you want to browse locally, run this
in the `paperwork` folder:

```
npx serve .
```

Otherwise test on the live site after deploying. Check:

- [ ] Each generator fills in, previews and downloads a `.doc`
- [ ] "Print / PDF" shows only the document, not the form or nav
- [ ] Checklist ticks survive a page reload
- [ ] Mobile layout: the form stacks above the preview, nothing overflows
- [ ] The 300×250 banner appears after you accept the cookie banner
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
- Adsterra needs no `ads.txt` entry. Do not add popunder or push-notification
  networks alongside the banner — mixing formats on one page attracts
  invalid-traffic flags.
