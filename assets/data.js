/* ==========================================================================
   SITE CONFIG + ALL DOCUMENT AND CHECKLIST CONTENT
   --------------------------------------------------------------------------
   This is the only file you need to edit to change wording, add clauses,
   or add a new generator. See HOW-TO-ADD-A-DOCUMENT.md for a template.

   After going live, replace YOUR-DOMAIN.com everywhere (including the HTML
   files and sitemap.xml) with your real domain.
   ========================================================================== */

window.SITE = {
  name: "Paperwork",
  domain: "https://YOUR-DOMAIN.com",
  email: "hello@YOUR-DOMAIN.com",
  tagline: "Free document generators and checklists for freelancers and small businesses",
  updated: "26 October 2026",

  /* Leave client empty until AdSense approves you. Then paste your
     ca-pub-XXXXXXXXXXXXXXXX number here and ads will start loading
     (only after the visitor accepts the cookie banner). */
  adsense: {
    client: "",                 // e.g. "ca-pub-1234567890123456"
    slots: { top: "", inline: "" }  // optional ad unit ids
  }
};

/* ----------------------------- helpers ---------------------------------- */

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function raw(values, key) {
  var v = values[key];
  return v == null ? "" : String(v).trim();
}

function nl2br(s) {
  return esc(s).replace(/\r?\n/g, "<br>");
}

/* Returns escaped text, or a visible placeholder when empty. */
function val(values, key, fallback) {
  var s = raw(values, key);
  if (!s) return '<span class="blank">[' + (fallback || "not completed") + "]</span>";
  return nl2br(s);
}

/* Textarea -> <ul> when the user writes "- item" lines, else paragraphs. */
function list(values, key) {
  var s = raw(values, key);
  if (!s) return '<span class="blank">[not completed]</span>';
  var lines = s.split(/\r?\n/).map(function (l) { return l.replace(/^[-*•]\s*/, "").trim(); }).filter(Boolean);
  if (!lines.length) return '<span class="blank">[not completed]</span>';
  return "<ul>" + lines.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ul>";
}

function money(n, currency) {
  try {
    return new Intl.NumberFormat(currency === "GBP" ? "en-GB" : "en-US", {
      style: "currency", currency: currency || "GBP"
    }).format(n || 0);
  } catch (e) {
    return (currency || "GBP") + " " + (n || 0).toFixed(2);
  }
}

function signatures(a, b) {
  return '<div class="sig-grid">' +
    '<div class="sig"><div class="sig-line"></div><p><strong>' + esc(a.name) + "</strong><br>" +
    esc(a.role) + "<br>Date: " + esc(a.date) + "</p></div>" +
    '<div class="sig"><div class="sig-line"></div><p><strong>' + esc(b.name) + "</strong><br>" +
    esc(b.role) + "<br>Date: " + esc(b.date) + "</p></div>" +
    "</div>";
}

/* --------------------------- shared fields ------------------------------ */

var todayField = { name: "docDate", label: "Date of agreement", type: "date", defaultToday: true, width: "half" };

/* ==========================================================================
   DOCUMENTS  (form fields + the document they generate)
   ========================================================================== */

window.DOCUMENTS = {

  /* ---------------------------------------------------------------------- */
  "freelance-contract": {
    h1: "Freelance contract generator",
    metaTitle: "Free Freelance Contract Template (UK) — Generator",
    metaDescription:
      "Build a plain-English freelance services contract for the UK in two minutes. Scope, payment terms, late payment interest, IP and termination. Free, no signup.",
    lede:
      "A plain-English services agreement you can send before you start work. Fill in the blanks, then download it as a Word file or PDF.",
    docTitle: "Freelance Services Agreement",
    groups: [
      {
        legend: "You (the freelancer)",
        fields: [
          { name: "yourName", label: "Your full name", type: "text", required: true, placeholder: "Alex Morgan", width: "half", autocomplete: "name" },
          { name: "yourBusiness", label: "Trading name (optional)", type: "text", placeholder: "Morgan Studio", width: "half" },
          { name: "yourAddress", label: "Your address", type: "textarea", required: true, rows: 2, placeholder: "12 Example Street\nBristol BS1 4AA", width: "full" },
          { name: "yourEmail", label: "Your email", type: "email", required: true, placeholder: "alex@example.com", width: "half" },
          { name: "vatNumber", label: "VAT number (optional)", type: "text", placeholder: "GB123456789", width: "half" }
        ]
      },
      {
        legend: "Client",
        fields: [
          { name: "clientName", label: "Client or company name", type: "text", required: true, placeholder: "Northwind Ltd", width: "half" },
          { name: "clientContact", label: "Main contact", type: "text", placeholder: "Sam Patel", width: "half" },
          { name: "clientAddress", label: "Client address", type: "textarea", required: true, rows: 2, placeholder: "1 Client Road\nLondon EC1A 1BB", width: "full" },
          { name: "clientEmail", label: "Client email", type: "email", required: true, placeholder: "sam@northwind.example", width: "half" }
        ]
      },
      {
        legend: "The work",
        fields: [
          { name: "projectTitle", label: "Project name", type: "text", required: true, placeholder: "Website redesign", width: "half" },
          todayField,
          { name: "scope", label: "What you will do", type: "textarea", required: true, rows: 4, width: "full", help: "One line per item. Be specific — this is the clause that prevents scope creep.", placeholder: "- Design and build 5 pages\n- Set up analytics\n- Two rounds of revisions" },
          { name: "deliverables", label: "Deliverables and timetable", type: "textarea", rows: 3, width: "full", placeholder: "- Wireframes: 10 working days after kickoff\n- Final site: 6 weeks after kickoff" },
          { name: "exclusions", label: "Not included (optional)", type: "textarea", rows: 2, width: "full", placeholder: "- Copywriting\n- Ongoing maintenance after handover" }
        ]
      },
      {
        legend: "Money",
        fields: [
          { name: "fee", label: "Fee", type: "text", required: true, placeholder: "£3,500 fixed", width: "half" },
          { name: "deposit", label: "Deposit (optional)", type: "text", placeholder: "£1,000 on signing", width: "half" },
          { name: "paymentDays", label: "Payment terms", type: "select", width: "half", options: ["7 days", "14 days", "30 days", "45 days"], defaultValue: "14 days" },
          { name: "expenses", label: "Expenses policy (optional)", type: "text", placeholder: "Software and stock at cost, pre-approved", width: "half" },
          { name: "lateInterest", label: "Add statutory late payment interest?", type: "select", width: "half", options: ["Yes — 8% above base rate", "No"], defaultValue: "Yes — 8% above base rate", help: "UK businesses can charge interest under the Late Payment of Commercial Debts (Interest) Act 1998." }
        ]
      },
      {
        legend: "Terms",
        fields: [
          { name: "ipMode", label: "Intellectual property", type: "select", width: "half", options: ["Transfers to client on full payment", "Client owns on creation, you keep a portfolio licence"], defaultValue: "Transfers to client on full payment" },
          { name: "noticeDays", label: "Cancellation notice", type: "select", width: "half", options: ["7 days' written notice", "14 days' written notice", "30 days' written notice"], defaultValue: "14 days' written notice" },
          { name: "jurisdiction", label: "Governing law", type: "select", width: "half", options: ["England and Wales", "Scotland", "Northern Ireland"], defaultValue: "England and Wales" }
        ]
      }
    ],

    build: function (v) {
      var deposit = raw(v, "deposit");
      var late = raw(v, "lateInterest").indexOf("Yes") === 0;
      var ipTransfer = raw(v, "ipMode").indexOf("Transfers") === 0;
      var out = [];

      out.push(`<h1>${esc(this.docTitle)}</h1>`);
      out.push(`<p class="doc-meta">Dated ${val(v, "docDate")}</p>`);

      out.push(`<h2>Parties</h2>`);
      out.push(`<p><strong>${val(v, "yourName")}</strong>${raw(v, "yourBusiness") ? " trading as " + esc(raw(v, "yourBusiness")) : ""}<br>
        ${val(v, "yourAddress")}<br>${val(v, "yourEmail")}${raw(v, "vatNumber") ? "<br>VAT no. " + esc(raw(v, "vatNumber")) : ""}<br>
        (“the Supplier”)</p>`);
      out.push(`<p>and</p>`);
      out.push(`<p><strong>${val(v, "clientName")}</strong>${raw(v, "clientContact") ? "<br>For the attention of " + esc(raw(v, "clientContact")) : ""}<br>
        ${val(v, "clientAddress")}<br>${val(v, "clientEmail")}<br>(“the Client”)</p>`);

      out.push(`<h2>The services</h2>`);
      out.push(`<p>The Supplier will carry out the following work for the project “${val(v, "projectTitle")}” (the “Services”):</p>`);
      out.push(list(v, "scope"));
      out.push(`<h2>Deliverables and timetable</h2>`);
      out.push(list(v, "deliverables"));
      if (raw(v, "exclusions")) {
        out.push(`<p>The following are not included in the Services unless separately agreed in writing:</p>`);
        out.push(list(v, "exclusions"));
      }

      out.push(`<h2>Client responsibilities</h2>`);
      out.push(`<p>The Client will provide accurate information, materials, access and approvals reasonably required for the Services, and will respond to requests for feedback within five working days. The Supplier is not responsible for delays caused by late responses or missing materials, and any deadline affected by such delay will be extended by the length of the delay.</p>`);
      out.push(`<p>Deliverables are deemed accepted five working days after they are sent to the Client unless the Client raises specific written objections within that period.</p>`);

      out.push(`<h2>Fees and payment</h2>`);
      out.push(`<p>The Client will pay ${val(v, "fee")} for the Services.${deposit ? " A deposit of " + esc(deposit) + " is payable before work begins and is non-refundable once work has started." : ""} The Supplier will invoice on completion${deposit ? " of each stage, with the deposit deducted" : ""}, and the Client will pay within ${esc(raw(v, "paymentDays") || "14 days")} of the invoice date. All amounts are exclusive of VAT where applicable.</p>`);
      if (raw(v, "expenses")) {
        out.push(`<p>Expenses: ${esc(raw(v, "expenses"))}. Expenses are charged at cost with receipts and must be approved in advance.</p>`);
      }

      out.push(`<h2>Late payment</h2>`);
      if (late) {
        out.push(`<p>If an invoice is not paid by its due date, the Supplier may charge statutory interest at 8% above the Bank of England base rate, calculated daily from the due date until payment, together with fixed compensation of £40, £70 or £100 depending on the amount owed, in accordance with the Late Payment of Commercial Debts (Interest) Act 1998. Charging interest does not prevent the Supplier from suspending further work.</p>`);
      } else {
        out.push(`<p>Invoices are payable by the due date. The Supplier may suspend work on overdue accounts and recover reasonable costs of chasing unpaid invoices.</p>`);
      }

      out.push(`<h2>Intellectual property</h2>`);
      if (ipTransfer) {
        out.push(`<p>Copyright and other intellectual property rights in the final deliverables transfer to the Client on payment in full of all fees. Until payment, all rights remain with the Supplier. The Supplier retains ownership of pre-existing materials, tools and know-how used to create the deliverables, and grants the Client a non-exclusive, perpetual licence to use them as part of the deliverables.</p>`);
      } else {
        out.push(`<p>The Client owns the deliverables on creation. The Supplier retains a non-exclusive right to display the work in a portfolio and to reuse underlying techniques, code libraries and know-how that do not contain the Client's confidential information.</p>`);
      }

      out.push(`<h2>Confidentiality</h2>`);
      out.push(`<p>Each party will keep the other's confidential information private and use it only for this agreement, during the project and for two years afterwards. This does not apply to information that is public, already known, independently developed, or required to be disclosed by law.</p>`);

      out.push(`<h2>Data protection</h2>`);
      out.push(`<p>Where either party handles personal data in connection with the Services, it will comply with applicable data protection law, including the UK GDPR and the Data Protection Act 2018.</p>`);

      out.push(`<h2>Status</h2>`);
      out.push(`<p>The Supplier is an independent contractor, not an employee, worker or agent of the Client. The Supplier controls how and when the Services are performed, is responsible for their own tax and National Insurance, and is not entitled to employee benefits, holiday pay or sick pay.</p>`);

      out.push(`<h2>Liability</h2>`);
      out.push(`<p>Neither party is liable for indirect or consequential loss. The Supplier's total liability under this agreement is limited to the total fees paid for the Services. Nothing in this agreement excludes liability for death or personal injury caused by negligence, fraud, or any other liability that cannot lawfully be excluded.</p>`);

      out.push(`<h2>Termination</h2>`);
      out.push(`<p>Either party may end this agreement by giving ${esc(raw(v, "noticeDays") || "14 days' written notice")}. The Client will pay for all work carried out up to the date of termination, including any non-refundable expenses already committed. Clauses on confidentiality, intellectual property and liability survive termination.</p>`);

      out.push(`<h2>General</h2>`);
      out.push(`<p>This agreement is the entire agreement between the parties and replaces any previous discussion on the same subject. Any change must be agreed in writing by both parties. If any clause is found unenforceable, the rest remains in force. This agreement is governed by the law of ${esc(raw(v, "jurisdiction") || "England and Wales")}, and the courts of that jurisdiction have exclusive jurisdiction.</p>`);

      out.push(`<h2>Signatures</h2>`);
      out.push(signatures(
        { name: raw(v, "yourName") || "Supplier", role: raw(v, "yourBusiness") || "Freelancer", date: raw(v, "docDate") || "____________" },
        { name: raw(v, "clientName") || "Client", role: raw(v, "clientContact") || "Authorised signatory", date: "____________" }
      ));

      return out.join("\n");
    }
  },

  /* ---------------------------------------------------------------------- */
  "invoice": {
    h1: "Invoice generator",
    metaTitle: "Free Invoice Generator (UK VAT & US sales tax) — PDF & Word",
    metaDescription:
      "Create a professional invoice with VAT or sales tax in seconds. Live totals, automatic VAT breakdown, line items, and a download that opens in Word or Google Docs.",
    lede:
      "Add your line items and get a numbered invoice with the right tax fields. Downloads as Word, or print straight to PDF.",
    docTitle: "Invoice",
    groups: [
      {
        legend: "Your business",
        fields: [
          { name: "fromName", label: "Business or your name", type: "text", required: true, placeholder: "Morgan Studio", width: "half" },
          { name: "fromAddress", label: "Address", type: "textarea", required: true, rows: 2, placeholder: "12 Example Street\nBristol BS1 4AA", width: "full" },
          { name: "fromEmail", label: "Email", type: "email", placeholder: "alex@example.com", width: "half" },
          { name: "fromPhone", label: "Phone (optional)", type: "text", placeholder: "+44 7700 900000", width: "half" },
          { name: "vatNumber", label: "VAT number (UK)", type: "text", placeholder: "GB123456789", width: "half", help: "Required on a VAT invoice." },
          { name: "companyNumber", label: "Company number (optional)", type: "text", placeholder: "12345678", width: "half" }
        ]
      },
      {
        legend: "Bill to",
        fields: [
          { name: "toName", label: "Client name", type: "text", required: true, placeholder: "Northwind Ltd", width: "half" },
          { name: "toContact", label: "Contact (optional)", type: "text", placeholder: "Sam Patel", width: "half" },
          { name: "toAddress", label: "Client address", type: "textarea", rows: 2, width: "full", placeholder: "1 Client Road\nLondon EC1A 1BB" },
          { name: "toEmail", label: "Client email (optional)", type: "email", placeholder: "accounts@northwind.example", width: "half" }
        ]
      },
      {
        legend: "Invoice details",
        fields: [
          { name: "invoiceNumber", label: "Invoice number", type: "text", required: true, placeholder: "INV-0042", width: "half" },
          { name: "currency", label: "Currency", type: "select", width: "half", options: ["GBP", "USD", "EUR"], defaultValue: "GBP" },
          { name: "invoiceDate", label: "Invoice date", type: "date", required: true, defaultToday: true, width: "half" },
          { name: "dueDate", label: "Due date", type: "date", width: "half", help: "Leave blank to say “due on receipt”." },
          { name: "reference", label: "Reference / PO number (optional)", type: "text", placeholder: "PO-8812", width: "half" }
        ]
      },
      {
        legend: "Line items",
        fields: [
          { name: "lineItems", type: "items", label: "What you are charging for" }
        ]
      },
      {
        legend: "Tax",
        fields: [
          { name: "taxMode", label: "Tax treatment", type: "select", required: true, width: "half", defaultValue: "No tax",
            options: ["No tax", "UK VAT 20%", "UK VAT 5%", "UK VAT 0%", "US sales tax (custom rate)"] },
          { name: "taxRate", label: "Sales tax rate %", type: "number", width: "half", placeholder: "7.25", help: "Only used for US sales tax. Applies to taxable items in your state." },
          { name: "taxNote", label: "Tax note (optional)", type: "text", width: "full", placeholder: "Reverse charge: VAT to be accounted for by the recipient", help: "Shown under the totals — use for reverse charge, exempt or out-of-scope sales." }
        ]
      },
      {
        legend: "Payment",
        fields: [
          { name: "paymentTerms", label: "Payment terms", type: "select", width: "half", options: ["Due on receipt", "7 days", "14 days", "30 days", "45 days"], defaultValue: "14 days" },
          { name: "bankDetails", label: "How to pay", type: "textarea", rows: 3, width: "full", placeholder: "Bank: Example Bank\nSort code: 00-00-00\nAccount: 12345678\nReference: INV-0042" },
          { name: "notes", label: "Notes to the client (optional)", type: "textarea", rows: 2, width: "full", placeholder: "Thank you for your business." }
        ]
      }
    ],

    build: function (v) {
      var cur = raw(v, "currency") || "GBP";
      var items = Array.isArray(v.lineItems) ? v.lineItems : [];
      var subtotal = 0;

      var rows = items.map(function (it) {
        var qty = parseFloat(it.qty) || 0;
        var price = parseFloat(it.price) || 0;
        var line = qty * price;
        subtotal += line;
        return `<tr>
          <td>${esc(it.desc) || '<span class="blank">[description]</span>'}</td>
          <td class="num">${qty || ""}</td>
          <td class="num">${price ? money(price, cur) : ""}</td>
          <td class="num">${money(line, cur)}</td>
        </tr>`;
      }).join("");

      if (!rows) {
        rows = `<tr><td><span class="blank">[add a line item]</span></td><td class="num"></td><td class="num"></td><td class="num">${money(0, cur)}</td></tr>`;
      }

      var mode = raw(v, "taxMode");
      var rate = 0;
      var taxLabel = "";
      if (mode === "UK VAT 20%") { rate = 0.2; taxLabel = "VAT (20%)"; }
      else if (mode === "UK VAT 5%") { rate = 0.05; taxLabel = "VAT (5%)"; }
      else if (mode === "UK VAT 0%") { rate = 0; taxLabel = "VAT (0%)"; }
      else if (mode === "US sales tax (custom rate)") {
        rate = (parseFloat(raw(v, "taxRate")) || 0) / 100;
        taxLabel = "Sales tax (" + (parseFloat(raw(v, "taxRate")) || 0) + "%)";
      }

      var tax = subtotal * rate;
      var total = subtotal + tax;
      var showTax = mode !== "No tax";

      var cur = raw(v, "currency") || "GBP";
      var items = Array.isArray(v.lineItems) ? v.lineItems : [];
      var subtotal = 0;
      var rows = "";

      items.forEach(function (it) {
        var qty = parseFloat(it.qty) || 0;
        var price = parseFloat(it.price) || 0;
        var line = qty * price;
        subtotal += line;
        rows += "<tr>" +
          "<td>" + (esc(it.desc) || '<span class="blank">[description]</span>') + "</td>" +
          '<td class="num">' + (qty || "") + "</td>" +
          '<td class="num">' + (price ? money(price, cur) : "") + "</td>" +
          '<td class="num">' + money(line, cur) + "</td>" +
          "</tr>";
      });

      if (!rows) {
        rows = '<tr><td><span class="blank">[add a line item]</span></td><td class="num"></td>' +
          '<td class="num"></td><td class="num">' + money(0, cur) + "</td></tr>";
      }

      var mode = raw(v, "taxMode");
      var rate = 0;
      var taxLabel = "";
      if (mode === "UK VAT 20%") { rate = 0.2; taxLabel = "VAT (20%)"; }
      else if (mode === "UK VAT 5%") { rate = 0.05; taxLabel = "VAT (5%)"; }
      else if (mode === "UK VAT 0%") { rate = 0; taxLabel = "VAT (0%)"; }
      else if (mode === "US sales tax (custom rate)") {
        rate = (parseFloat(raw(v, "taxRate")) || 0) / 100;
        taxLabel = "Sales tax (" + (parseFloat(raw(v, "taxRate")) || 0) + "%)";
      }

      var tax = subtotal * rate;
      var total = subtotal + tax;
      var showTax = mode !== "No tax";

      var taxRow = showTax
        ? "<tr><td>" + esc(taxLabel) + '</td><td class="num">' + money(tax, cur) + "</td></tr>"
        : "";
      var taxNote = raw(v, "taxNote")
        ? '<p class="small">' + esc(raw(v, "taxNote")) + "</p>" : "";
      var zeroNote = mode === "UK VAT 0%"
        ? '<p class="small">Zero-rated or exempt sale. If the reverse charge applies, the customer accounts for VAT.</p>' : "";
      var salesNote = mode === "US sales tax (custom rate)"
        ? '<p class="small">Sales tax applies only to taxable sales in states where you have a filing obligation (nexus). Rates vary by state, county and city.</p>' : "";
      var bankBlock = raw(v, "bankDetails")
        ? '<p class="label">How to pay</p><p>' + nl2br(raw(v, "bankDetails")) + "</p>" : "";
      var notesBlock = raw(v, "notes") ? "<p>" + nl2br(raw(v, "notes")) + "</p>" : "";

      var emailLine = raw(v, "fromEmail") ? "<br>" + esc(raw(v, "fromEmail")) : "";
      var phoneLine = raw(v, "fromPhone") ? "<br>" + esc(raw(v, "fromPhone")) : "";
      var vatLine = raw(v, "vatNumber") ? "<br>VAT no. " + esc(raw(v, "vatNumber")) : "";
      var coLine = raw(v, "companyNumber") ? "<br>Company no. " + esc(raw(v, "companyNumber")) : "";
      var dueText = raw(v, "dueDate") ? "<br>Due: " + esc(raw(v, "dueDate")) : "<br>Due: on receipt";
      var refLine = raw(v, "reference") ? "<br>Ref: " + esc(raw(v, "reference")) : "";
      var dueLine = raw(v, "dueDate") ? " - due " + esc(raw(v, "dueDate")) : "";
      var contactLine = raw(v, "toContact") ? "<br>" + esc(raw(v, "toContact")) : "";
      var addressLine = raw(v, "toAddress") ? "<br>" + nl2br(raw(v, "toAddress")) : "";
      var toEmailLine = raw(v, "toEmail") ? "<br>" + esc(raw(v, "toEmail")) : "";

      var html = '<div class="invoice-head">' +
        "<div>" +
        "<h1>" + esc(raw(v, "fromName") || "Your business") + "</h1>" +
        '<p class="small">' + val(v, "fromAddress") + emailLine + phoneLine + vatLine + coLine + "</p>" +
        "</div>" +
        '<div class="invoice-title">' +
        '<h2 class="plain">INVOICE</h2>' +
        '<p class="small"><strong>' + val(v, "invoiceNumber", "number") + "</strong><br>" +
        "Date: " + val(v, "invoiceDate") + dueText + refLine + "</p>" +
        "</div>" +
        "</div>" +
        '<div class="invoice-billto">' +
        '<p class="label">Bill to</p>' +
        "<p><strong>" + val(v, "toName") + "</strong>" + contactLine + addressLine + toEmailLine + "</p>" +
        "</div>" +
        '<table class="invoice-table">' +
        '<thead><tr><th>Description</th><th class="num">Qty</th><th class="num">Unit price</th><th class="num">Amount</th></tr></thead>' +
        "<tbody>" + rows + "</tbody>" +
        "</table>" +
        '<table class="invoice-totals"><tbody>' +
        '<tr><td>Subtotal</td><td class="num">' + money(subtotal, cur) + "</td></tr>" +
        taxRow +
        '<tr class="grand"><td>Total due</td><td class="num">' + money(total, cur) + "</td></tr>" +
        "</tbody></table>" +
        taxNote + zeroNote + salesNote +
        '<div class="invoice-pay">' +
        '<p class="label">Payment terms</p>' +
        "<p>" + esc(raw(v, "paymentTerms") || "Due on receipt") + dueLine + ".</p>" +
        bankBlock + notesBlock +
        "</div>";

      return html;
    }
  },

  /* ---------------------------------------------------------------------- */
  "nda": {
    h1: "Mutual NDA generator",
    metaTitle: "Free Mutual NDA Template (UK & US) — Generator",
    metaDescription:
      "Create a mutual non-disclosure agreement in minutes. Standard exclusions, term, permitted disclosures and governing law. Free, no signup, instant download.",
    lede:
      "For those early conversations before a contract exists — client pitches, partnerships, investor chats. Covers both sides equally.",
    docTitle: "Mutual Non-Disclosure Agreement",
    groups: [
      {
        legend: "Party 1",
        fields: [
          { name: "p1Name", label: "Name or company", type: "text", required: true, placeholder: "Morgan Studio", width: "half" },
          { name: "p1Address", label: "Address", type: "textarea", rows: 2, width: "full", placeholder: "12 Example Street\nBristol BS1 4AA" },
          { name: "p1Signatory", label: "Signatory name and role", type: "text", placeholder: "Alex Morgan, Director", width: "half" }
        ]
      },
      {
        legend: "Party 2",
        fields: [
          { name: "p2Name", label: "Name or company", type: "text", required: true, placeholder: "Northwind Ltd", width: "half" },
          { name: "p2Address", label: "Address", type: "textarea", rows: 2, width: "full", placeholder: "1 Client Road\nLondon EC1A 1BB" },
          { name: "p2Signatory", label: "Signatory name and role", type: "text", placeholder: "Sam Patel, CEO", width: "half" }
        ]
      },
      {
        legend: "The agreement",
        fields: [
          todayField,
          { name: "purpose", label: "Purpose of the discussions", type: "textarea", required: true, rows: 3, width: "full", placeholder: "Exploring a potential design partnership for the Northwind website relaunch." },
          { name: "termYears", label: "How long information stays confidential", type: "select", width: "half", options: ["2 years", "3 years", "5 years"], defaultValue: "3 years" },
          { name: "jurisdiction", label: "Governing law", type: "select", width: "half", options: ["England and Wales", "Scotland", "Northern Ireland", "State of Delaware", "State of New York", "State of California"], defaultValue: "England and Wales" }
        ]
      }
    ],

    build: function (v) {
      var out = [];
      out.push(`<h1>${esc(this.docTitle)}</h1>`);
      out.push(`<p class="doc-meta">Dated ${val(v, "docDate")}</p>`);
      out.push(`<h2>Parties</h2>`);
      out.push(`<p>This agreement is between <strong>${val(v, "p1Name")}</strong> of ${val(v, "p1Address")} and <strong>${val(v, "p2Name")}</strong> of ${val(v, "p2Address")} (each a “party”, together “the parties”).</p>`);

      out.push(`<h2>Purpose</h2>`);
      out.push(`<p>The parties wish to discuss ${val(v, "purpose")} (the “Purpose”) and may need to share confidential information with each other for that Purpose.</p>`);

      out.push(`<h2>Confidential information</h2>`);
      out.push(`<p>“Confidential information” means any non-public information disclosed by one party to the other in connection with the Purpose, in any form, including business plans, pricing, customer lists, designs, source code, technical data and financial information. It includes the existence and content of the parties' discussions.</p>`);

      out.push(`<h2>Exclusions</h2>`);
      out.push(`<p>Confidential information does not include information that: (a) is or becomes public through no breach of this agreement; (b) the receiving party already knew without a duty of confidence; (c) is independently developed without use of the confidential information; or (d) is lawfully received from someone else without a duty of confidence.</p>`);

      out.push(`<h2>Obligations</h2>`);
      out.push(`<p>Each receiving party will: use the confidential information only for the Purpose; keep it confidential using at least the care it uses for its own confidential information; and share it only with employees, contractors and professional advisers who need it for the Purpose and are bound by equivalent obligations. The receiving party is responsible for its representatives' compliance.</p>`);

      out.push(`<h2>Permitted disclosures</h2>`);
      out.push(`<p>A party may disclose confidential information where required by law, regulation, court order or a regulator, provided it gives the other party prompt notice where lawful and discloses only what is required. A party may also disclose the agreement in confidence to its lawyers, accountants and investors.</p>`);

      out.push(`<h2>No licence or warranty</h2>`);
      out.push(`<p>Nothing in this agreement grants any intellectual property licence or other rights beyond what is needed for the Purpose. Confidential information is provided “as is” without warranty of accuracy or completeness.</p>`);

      out.push(`<h2>Term</h2>`);
      out.push(`<p>This agreement starts on the date above and continues for ${esc(raw(v, "termYears") || "3 years")} from the date of the last disclosure. The confidentiality obligations survive for that period.</p>`);

      out.push(`<h2>Return or destruction</h2>`);
      out.push(`<p>On written request, or when the Purpose ends, the receiving party will return or securely destroy the confidential information, except for copies required by law or automatic backups, which remain subject to this agreement.</p>`);

      out.push(`<h2>Remedies</h2>`);
      out.push(`<p>The parties agree that damages may not be an adequate remedy for breach of this agreement, and that the disclosing party may seek injunctive relief in addition to any other remedy.</p>`);

      out.push(`<h2>General</h2>`);
      out.push(`<p>This agreement is the entire agreement on confidentiality for the Purpose and does not oblige either party to enter any further contract. No variation is effective unless in writing and signed by both parties. If a clause is unenforceable, the rest remains in force. This agreement is governed by the law of ${esc(raw(v, "jurisdiction") || "England and Wales")}.</p>`);

      out.push(`<h2>Signatures</h2>`);
      out.push(signatures(
        { name: raw(v, "p1Name") || "Party 1", role: raw(v, "p1Signatory") || "Authorised signatory", date: raw(v, "docDate") || "____________" },
        { name: raw(v, "p2Name") || "Party 2", role: raw(v, "p2Signatory") || "Authorised signatory", date: "____________" }
      ));

      return out.join("\n");
    }
  },

  /* ---------------------------------------------------------------------- */
  "contractor-agreement": {
    h1: "Independent contractor agreement generator (US)",
    metaTitle: "Free Independent Contractor Agreement Template (US)",
    metaDescription:
      "Generate a US independent contractor agreement with 1099-friendly wording, work-for-hire IP assignment, payment terms and state governing law. Free download.",
    lede:
      "US-style contractor agreement that keeps the working relationship clearly non-employment — control, taxes, equipment and IP are all addressed.",
    docTitle: "Independent Contractor Agreement",
    groups: [
      {
        legend: "Client",
        fields: [
          { name: "clientName", label: "Client or company", type: "text", required: true, placeholder: "Northwind LLC", width: "half" },
          { name: "clientAddress", label: "Address", type: "textarea", rows: 2, width: "full", placeholder: "500 Market St, Suite 200\nSan Francisco, CA 94105" },
          { name: "clientState", label: "State", type: "text", placeholder: "California", width: "half" }
        ]
      },
      {
        legend: "Contractor",
        fields: [
          { name: "contractorName", label: "Contractor name or business", type: "text", required: true, placeholder: "Alex Morgan Design", width: "half" },
          { name: "contractorAddress", label: "Address", type: "textarea", rows: 2, width: "full", placeholder: "1 Example Ave\nAustin, TX 78701" },
          { name: "contractorEntity", label: "Entity type", type: "select", width: "half", options: ["Individual / sole proprietor", "LLC", "Corporation", "Partnership"], defaultValue: "Individual / sole proprietor" }
        ]
      },
      {
        legend: "Scope and money",
        fields: [
          todayField,
          { name: "services", label: "Services", type: "textarea", required: true, rows: 4, width: "full", placeholder: "- Design 5 marketing pages\n- Deliver Figma files and production assets" },
          { name: "rate", label: "Rate or project fee", type: "text", required: true, placeholder: "$4,000 fixed, or $85 per hour", width: "half" },
          { name: "paymentDays", label: "Payment terms", type: "select", width: "half", options: ["Net 7", "Net 15", "Net 30", "Net 45"], defaultValue: "Net 15" },
          { name: "expenses", label: "Expenses (optional)", type: "text", placeholder: "Pre-approved software and travel at cost", width: "full" },
          { name: "endDate", label: "End date (optional)", type: "date", width: "half", help: "Leave blank for an open-ended engagement." }
        ]
      },
      {
        legend: "Terms",
        fields: [
          { name: "terminationDays", label: "Termination notice", type: "select", width: "half", options: ["7 days", "14 days", "30 days"], defaultValue: "14 days" },
          { name: "governingState", label: "Governing law (state)", type: "text", width: "half", placeholder: "California" },
          { name: "ipMode", label: "Intellectual property", type: "select", width: "full", options: ["Work made for hire, assigned on payment", "License to client, contractor retains ownership"], defaultValue: "Work made for hire, assigned on payment" }
        ]
      }
    ],

    build: function (v) {
      var hire = raw(v, "ipMode").indexOf("Work made") === 0;
      var out = [];
      out.push(`<h1>${esc(this.docTitle)}</h1>`);
      out.push(`<p class="doc-meta">Effective ${val(v, "docDate")}</p>`);
      out.push(`<p>This Independent Contractor Agreement (“Agreement”) is between <strong>${val(v, "clientName")}</strong>, located at ${val(v, "clientAddress")} (“Client”), and <strong>${val(v, "contractorName")}</strong>, a ${esc(raw(v, "contractorEntity") || "sole proprietor")} located at ${val(v, "contractorAddress")} (“Contractor”).</p>`);

      out.push(`<h2>Services</h2>`);
      out.push(`<p>Contractor will provide the following services (the “Services”):</p>`);
      out.push(list(v, "services"));
      out.push(`<p>Contractor will determine the method, details and means of performing the Services, and will provide their own equipment and workspace unless the parties agree otherwise in writing.</p>`);

      out.push(`<h2>Term</h2>`);
      out.push(`<p>This Agreement begins on the effective date${raw(v, "endDate") ? " and ends on " + esc(raw(v, "endDate")) + ", unless terminated earlier" : " and continues until the Services are complete or either party terminates it"} in accordance with the termination clause.</p>`);

      out.push(`<h2>Compensation</h2>`);
      out.push(`<p>Client will pay Contractor ${val(v, "rate")}. Contractor will submit invoices describing the Services performed, and Client will pay within ${esc(raw(v, "paymentDays") || "Net 15")} of receiving a correct invoice.${raw(v, "expenses") ? " Expenses: " + esc(raw(v, "expenses")) + "." : ""} Contractor is responsible for all costs of doing business not expressly agreed as reimbursable.</p>`);

      out.push(`<h2>Independent contractor status</h2>`);
      out.push(`<p>The parties intend that Contractor is an independent contractor and not an employee, agent, joint venturer or partner of Client. Contractor is not entitled to employee benefits, workers' compensation, unemployment insurance, pension contributions or paid leave. Contractor is solely responsible for all federal, state and local taxes on amounts paid under this Agreement, including self-employment tax, and will provide a Form W-9 on request. Client will issue Form 1099-NEC where required (generally payments of $600 or more in a calendar year). Contractor may work for other clients and is free to accept other engagements.</p>`);
      out.push(`<p>Contractor is responsible for complying with all licences, permits and insurance required for the Services.</p>`);

      out.push(`<h2>Intellectual property</h2>`);
      if (hire) {
        out.push(`<p>All deliverables created specifically for Client under this Agreement are “work made for hire” to the extent permitted by law. To the extent any deliverable is not work made for hire, Contractor assigns all right, title and interest in it to Client upon full payment. Contractor retains ownership of pre-existing tools, code, templates and know-how and grants Client a perpetual, non-exclusive licence to use them as incorporated in the deliverables.</p>`);
      } else {
        out.push(`<p>Contractor retains all right, title and interest in the deliverables and grants Client a perpetual, worldwide, non-exclusive licence to use, reproduce and display them for Client's business purposes. Client may not resell the deliverables as a standalone product.</p>`);
      }

      out.push(`<h2>Confidentiality</h2>`);
      out.push(`<p>Contractor will keep Client's non-public business information confidential and use it only to perform the Services, during the engagement and for three years afterwards. This does not apply to information that is public, independently developed, or required to be disclosed by law.</p>`);

      out.push(`<h2>Representations</h2>`);
      out.push(`<p>Contractor represents that the deliverables are original, do not infringe any third party's intellectual property, and that Contractor has the right to grant the rights in this Agreement. Contractor will obtain any third-party licences needed for assets used in the deliverables.</p>`);

      out.push(`<h2>Limitation of liability</h2>`);
      out.push(`<p>Neither party is liable for indirect, incidental or consequential damages. Contractor's total liability under this Agreement will not exceed the total fees paid for the Services. Nothing limits liability for fraud, wilful misconduct, or liability that cannot be limited by law.</p>`);

      out.push(`<h2>Termination</h2>`);
      out.push(`<p>Either party may terminate this Agreement for convenience on ${esc(raw(v, "terminationDays") || "14 days")} written notice, or immediately for material breach that is not cured within seven days of written notice. Client will pay for all Services performed and approved expenses incurred through the termination date.</p>`);

      out.push(`<h2>General</h2>`);
      out.push(`<p>This Agreement is the entire agreement between the parties and supersedes prior discussions on the same subject. Changes must be in writing and signed by both parties. Contractor may not subcontract the Services without Client's written consent. If a provision is unenforceable, the remainder stays in effect. This Agreement is governed by the laws of the State of ${esc(raw(v, "governingState") || raw(v, "clientState") || "[state]")}, without regard to conflict-of-law rules.</p>`);

      out.push(`<h2>Signatures</h2>`);
      out.push(signatures(
        { name: raw(v, "clientName") || "Client", role: "Client", date: raw(v, "docDate") || "____________" },
        { name: raw(v, "contractorName") || "Contractor", role: "Contractor", date: raw(v, "docDate") || "____________" }
      ));

      return out.join("\n");
    }
  }
};

