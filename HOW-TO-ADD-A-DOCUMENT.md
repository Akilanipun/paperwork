# How to add a generator

You need to edit two files. No build step, no terminal.

1. `assets/data.js` — add the form fields and the document wording.
2. `tools/your-page.html` — copy an existing page and change the title, the
   prose and the `data-doc` attribute.

---

## Step 1: add the document to `assets/data.js`

Inside `window.DOCUMENTS = { ... }`, after the last document, add a comma and
this block. Keep the `build` function exactly as structured here.

```js
  "rent-increase-letter": {
    h1: "Rent increase letter generator",
    metaTitle: "Free Rent Increase Letter Template (UK)",
    metaDescription: "One or two sentences for Google. Include the main keyword once.",
    lede: "One or two sentences for the page, under the H1.",
    docTitle: "Notice of Rent Increase",
    groups: [
      {
        legend: "Landlord",
        fields: [
          { name: "landlordName", label: "Your name", type: "text", required: true, width: "half" },
          { name: "landlordAddress", label: "Your address", type: "textarea", rows: 2, width: "full" },
          todayField
        ]
      },
      {
        legend: "Tenant and property",
        fields: [
          { name: "tenantName", label: "Tenant name", type: "text", required: true, width: "half" },
          { name: "property", label: "Property address", type: "textarea", rows: 2, required: true, width: "full" }
        ]
      },
      {
        legend: "The increase",
        fields: [
          { name: "newRent", label: "New monthly rent", type: "text", required: true, placeholder: "£1,250", width: "half" },
          { name: "startDate", label: "Effective from", type: "date", width: "half" },
          { name: "reason", label: "Reason (optional)", type: "textarea", rows: 2, width: "full" }
        ]
      }
    ],

    build: function (v) {
      var out = [];
      out.push(`<h1>${esc(this.docTitle)}</h1>`);
      out.push(`<p class="doc-meta">Dated ${val(v, "docDate")}</p>`);

      out.push(`<h2>Parties</h2>`);
      out.push(`<p>From <strong>${val(v, "landlordName")}</strong>, ${val(v, "landlordAddress")}, to <strong>${val(v, "tenantName")}</strong> at ${val(v, "property")}.</p>`);

      out.push(`<h2>Notice</h2>`);
      out.push(`<p>I am writing to give notice that the rent for the property will increase to ${val(v, "newRent")} per month from ${val(v, "startDate")}.</p>`);

      if (raw(v, "reason")) {
        out.push(`<h2>Reason</h2>`);
        out.push(`<p>${esc(raw(v, "reason"))}</p>`);
      }

      out.push(`<h2>Signature</h2>`);
      out.push(`<p>${val(v, "landlordName")}</p><div class="sig"><div class="sig-line"></div><p>Signature</p></div>`);

      return out.join("\n");
    }
  }
```

### Field reference

| Key | Values | Notes |
|---|---|---|
| `name` | unique string | becomes the `id`, the local storage key and `v.name` |
| `label` | string | shown above the input |
| `type` | `text` `email` `number` `date` `textarea` `select` | |
| `required` | `true` | blocks download until filled |
| `width` | `half` `full` | two-column form on desktop |
| `placeholder` | string | use `\n` for line breaks in a textarea |
| `help` | string | small help text under the input |
| `rows` | number | textarea height |
| `options` | array | for `select` |
| `defaultValue` | string | pre-selected option or pre-filled value |
| `defaultToday` | `true` | pre-fills today's date |
| `autocomplete` | `name` `email` | browser autofill hint |

To add a repeatable table (like the invoice line items), use
`{ name: "lineItems", type: "items", label: "Line items" }`. The values arrive
as `v.lineItems` — an array of `{ desc, qty, price }`.

---

## Step 2: copy a page

1. Duplicate `tools/nda.html` and rename it, for example `tools/rent-increase-letter.html`.
2. In the new file, change:
   - `<title>` and `<meta name="description">`
   - `<link rel="canonical" href="...">`
   - the `og:title`, `og:description`, `og:url`
   - the JSON-LD block (`WebApplication` name/url, breadcrumb item, FAQ entries)
   - the `<h1>` and `.lede`
   - `<form data-doc="nda">` → `<form data-doc="rent-increase-letter">`
   - the prose below the tool — replace it with 300–500 genuinely useful words
3. Add a card linking to it in `index.html` and, optionally, in the footer.
   Link **without** the `.html` extension — write `tools/rent-increase-letter`,
   because that is the URL the host serves. A `.html` link still works, but the
   host answers it with a redirect.
4. Add the URL to `sitemap.xml`, also without `.html`:
   `https://paperwork.sltechempire.store/tools/rent-increase-letter`.

The preview, download, print, copy and save features work automatically because
`assets/app.js` reads `data-doc` and looks the document up in `DOCUMENTS`.

---

## Writing rules that keep the pages ranking

- **One keyword per page, in the title, H1 and first paragraph.** "Rent increase
  letter template" — not "rent, eviction, tenancy and deposit documents".
- **The tool must be above the prose.** People came to do a job, not to read.
- **Say what is not covered.** The "not legal advice" callout is required, and it
  also protects you if a document is challenged.
- **Give a real answer in the prose.** Three specific, checkable facts beat 500
  words of filler. If you cannot verify a figure, say where to check it.
- **Update the review date** when you change anything substantive.
