(function () {
  "use strict";

  var SITE = window.SITE || {};
  var DOCS = window.DOCUMENTS || {};

  /* ------------------------------ utils --------------------------------- */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function store(key, value) {
    if (arguments.length === 1) {
      try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch (e) { return null; }
    }
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
  function unstore(key) { try { localStorage.removeItem(key); } catch (e) {} }

  function debounce(fn, ms) {
    var t;
    return function () {
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, ms);
    };
  }

  function today() {
    var d = new Date();
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  }

  function slug(s) {
    return String(s || "document").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
  }

  /* --------------------------- ad loading ------------------------------- */

  function initAds() {
    var cfg = (SITE.adsense || {});
    var slots = $$(".ad-slot");
    if (!cfg.client) {
      document.documentElement.classList.add("no-ads");
      return;
    }
    function load() {
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(cfg.client);
      s.crossOrigin = "anonymous";
      document.head.appendChild(s);
      slots.forEach(function (slot) {
        var unit = document.createElement("ins");
        unit.className = "adsbygoogle";
        unit.style.display = "block";
        unit.setAttribute("data-ad-client", cfg.client);
        var id = slot.getAttribute("data-slot");
        if (id) unit.setAttribute("data-ad-slot", id);
        unit.setAttribute("data-full-width-responsive", "true");
        slot.innerHTML = "";
        slot.appendChild(unit);
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
      });
    }
    if (store("consent") === "granted") { load(); return; }

    var banner = $("#consent");
    if (!banner) return;
    banner.hidden = false;
    $("#consent-accept", banner).addEventListener("click", function () {
      store("consent", "granted"); banner.hidden = true; load();
    });
    $("#consent-decline", banner).addEventListener("click", function () {
      store("consent", "declined"); banner.hidden = true;
    });
  }

  /* ---------------------------- document -------------------------------- */

  function fieldHtml(f) {
    var id = "f-" + f.name;
    var cls = "field" + (f.width === "full" || f.type === "textarea" || f.type === "items" ? " full" : "");
    var help = f.help ? '<p class="help" id="' + id + '-help">' + esc(f.help) + "</p>" : "";
    var describedby = f.help ? ' aria-describedby="' + id + '-help"' : "";

    if (f.type === "items") {
      return '<div class="' + cls + '" data-field="' + f.name + '">' +
        '<span class="label">' + esc(f.label) + "</span>" +
        '<div class="items" data-items="' + f.name + '">' +
        '<div class="item-head" aria-hidden="true"><span>Description</span><span>Qty</span><span>Unit price</span><span></span></div>' +
        '<div class="item-rows"></div>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-add-item>+ Add line</button>' +
        "</div>" + help + "</div>";
    }

    var common = ' id="' + id + '" name="' + f.name + '"' +
      (f.placeholder ? ' placeholder="' + esc(f.placeholder) + '"' : "") +
      (f.required ? " required" : "") +
      (f.autocomplete ? ' autocomplete="' + f.autocomplete + '"' : "") +
      describedby;

    if (f.type === "textarea") {
      return '<div class="' + cls + '"><label class="label" for="' + id + '">' + esc(f.label) +
        (f.required ? ' <span class="req">*</span>' : "") + "</label>" +
        '<textarea rows="' + (f.rows || 3) + '"' + common + "></textarea>" + help + "</div>";
    }

    if (f.type === "select") {
      var opts = (f.options || []).map(function (o) {
        return '<option value="' + esc(o) + '">' + esc(o) + "</option>";
      }).join("");
      return '<div class="' + cls + '"><label class="label" for="' + id + '">' + esc(f.label) +
        (f.required ? ' <span class="req">*</span>' : "") + "</label>" +
        '<select' + common + ">" + opts + "</select>" + help + "</div>";
    }

    var type = f.type === "email" ? "email" : f.type === "number" ? "number" : f.type === "date" ? "date" : "text";
    var extra = type === "number" ? ' step="0.01" min="0" inputmode="decimal"' : "";
    return '<div class="' + cls + '"><label class="label" for="' + id + '">' + esc(f.label) +
      (f.required ? ' <span class="req">*</span>' : "") + "</label>" +
      "<input type=\"" + type + "\"" + extra + common + ">" + help + "</div>";
  }

  function initDoc() {
    var form = $("[data-doc]");
    if (!form) return;
    var spec = DOCS[form.getAttribute("data-doc")];
    if (!spec) return;

    var key = "paperwork:doc:" + form.getAttribute("data-doc");
    var preview = $("#doc-preview");
    var status = $("#save-status");
    var saved = store(key) || {};

    /* build the form */
    var html = spec.groups.map(function (g) {
      return '<fieldset><legend>' + esc(g.legend) + "</legend><div class=\"grid\">" +
        g.fields.map(fieldHtml).join("") + "</div></fieldset>";
    }).join("");
    html += '<div class="form-actions">' +
      '<button type="submit" class="btn">Update preview</button>' +
      '<button type="button" class="btn btn-ghost" data-reset>Start over</button>' +
      "</div>";
    form.innerHTML = html;

    /* ---------- line items ---------- */
    function itemRow(v) {
      v = v || {};
      return '<div class="item-row">' +
        '<input data-item="desc" placeholder="Website design" aria-label="Description"' + (v.desc ? ' value="' + esc(v.desc) + '"' : "") + ">" +
        '<input data-item="qty" type="number" step="0.01" min="0" inputmode="decimal" placeholder="1" aria-label="Quantity"' + (v.qty ? ' value="' + esc(v.qty) + '"' : "") + ">" +
        '<input data-item="price" type="number" step="0.01" min="0" inputmode="decimal" placeholder="0.00" aria-label="Unit price"' + (v.price ? ' value="' + esc(v.price) + '"' : "") + ">" +
        '<button type="button" class="icon-btn" data-remove-item aria-label="Remove this line">×</button>' +
        "</div>";
    }

    function addItem(values) {
      var rows = $(".item-rows", form);
      if (!rows) return;
      rows.insertAdjacentHTML("beforeend", itemRow(values));
    }

    form.addEventListener("click", function (e) {
      if (e.target.matches("[data-add-item]")) { addItem(); render(); return; }
      var rm = e.target.closest("[data-remove-item]");
      if (rm) {
        var row = rm.closest(".item-row");
        var all = $$(".item-row", form);
        if (all.length > 1) row.remove(); else { $$("input", row).forEach(function (i) { i.value = ""; }); }
        render();
      }
    });

    function collectItems(name) {
      var box = $('[data-items="' + name + '"]', form);
      if (!box) return [];
      return $$(".item-row", box).map(function (row) {
        return {
          desc: $('[data-item="desc"]', row).value.trim(),
          qty: $('[data-item="qty"]', row).value,
          price: $('[data-item="price"]', row).value
        };
      }).filter(function (it) { return it.desc || it.qty || it.price; });
    }

    /* ---------- collect / restore ---------- */
    function collect() {
      var out = {};
      spec.groups.forEach(function (g) {
        g.fields.forEach(function (f) {
          if (f.type === "items") { out[f.name] = collectItems(f.name); return; }
          var el = form.elements[f.name];
          if (!el) return;
          if (f.type === "checkbox") { out[f.name] = el.checked; return; }
          out[f.name] = el.value;
        });
      });
      return out;
    }

    function restore(values) {
      spec.groups.forEach(function (g) {
        g.fields.forEach(function (f) {
          if (f.type === "items") {
            var box = $(".item-rows", form);
            box.innerHTML = "";
            var items = values[f.name];
            if (Array.isArray(items) && items.length) {
              items.forEach(function (it) { box.insertAdjacentHTML("beforeend", itemRow(it)); });
            } else { addItem(); }
            return;
          }
          var el = form.elements[f.name];
          if (!el) return;
          var v = values[f.name];
          if (v == null || v === "") {
            if (f.defaultToday) el.value = today();
            else if (f.defaultValue) el.value = f.defaultValue;
          } else if (f.type === "checkbox") {
            el.checked = !!v;
          } else {
            el.value = v;
          }
        });
      });
    }

    /* ---------- render ---------- */
    function render() {
      var values = collect();
      preview.innerHTML = spec.build.call(spec, values);
      store(key, values);
      if (status) {
        status.textContent = "Saved in this browser";
        status.classList.add("on");
        clearTimeout(status._t);
        status._t = setTimeout(function () { status.classList.remove("on"); }, 1800);
      }
      document.body.classList.toggle("has-preview", true);
    }
    var renderSoon = debounce(render, 160);

    /* ---------- validation ---------- */
    function validate() {
      var firstBad = null;
      $$("[required]", form).forEach(function (el) {
        var wrap = el.closest(".field");
        var bad = !String(el.value).trim();
        if (wrap) wrap.classList.toggle("invalid", bad);
        if (bad && !firstBad) firstBad = el;
      });
      if (firstBad) {
        firstBad.focus();
        firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return !firstBad;
    }

    form.addEventListener("input", function (e) {
      var wrap = e.target.closest(".field");
      if (wrap && wrap.classList.contains("invalid") && String(e.target.value).trim()) wrap.classList.remove("invalid");
      renderSoon();
    });
    form.addEventListener("change", renderSoon);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) return;
      render();
      preview.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    $("[data-reset]", form).addEventListener("click", function () {
      if (!confirm("Clear everything you have typed? This cannot be undone.")) return;
      unstore(key);
      form.reset();
      var box = $(".item-rows", form);
      if (box) { box.innerHTML = ""; addItem(); }
      restore({});
      render();
    });

    /* ---------- output actions ---------- */
    function fileName(ext) {
      return slug(spec.docTitle) + "-" + today() + "." + ext;
    }

    function download(blob, name) {
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
    }

    var btnWord = $("#dl-word");
    if (btnWord) btnWord.addEventListener("click", function () {
      var css = "@page{size:A4;margin:2cm}body{font-family:Georgia,'Times New Roman',serif;font-size:11pt;line-height:1.5;color:#111}" +
        "h1{font-size:19pt;margin:0 0 6pt}h2{font-size:10pt;text-transform:uppercase;letter-spacing:.08em;margin:16pt 0 4pt}" +
        "p{margin:0 0 8pt}ul{margin:0 0 8pt 16pt}.doc-meta{color:#555;font-size:9pt}" +
        "table{border-collapse:collapse;width:100%;margin:8pt 0}td,th{border-bottom:1px solid #ccc;padding:5pt;text-align:left;font-size:10pt}" +
        ".num{text-align:right}.sig{float:left;width:44%;margin-right:6%}.sig-line{border-bottom:1px solid #000;height:26pt}" +
        ".invoice-title{text-align:right}.invoice-head{overflow:hidden}.invoice-head>div{float:left;width:48%}.invoice-head>div:last-child{float:right}" +
        ".blank{color:#999}.label{font-size:9pt;text-transform:uppercase;letter-spacing:.06em;color:#555}";
      var doc = "<html xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:w=\"urn:schemas-microsoft-com:office:word\" xmlns=\"http://www.w3.org/TR/REC-html40\"><head><meta charset=\"utf-8\"><title>" +
        esc(spec.docTitle) + "</title><style>" + css + "</style></head><body>" + preview.innerHTML + "</body></html>";
      download(new Blob(["\ufeff" + doc], { type: "application/msword" }), fileName("doc"));
    });

    var btnCopy = $("#copy-doc");
    if (btnCopy) btnCopy.addEventListener("click", function () {
      var text = preview.innerText;
      var done = function () { btnCopy.textContent = "Copied"; setTimeout(function () { btnCopy.textContent = "Copy text"; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {});
      } else {
        var ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); done(); } catch (e) {}
        ta.remove();
      }
    });

    var btnPrint = $("#print-doc");
    if (btnPrint) btnPrint.addEventListener("click", function () {
      if (!validate()) return;
      window.print();
    });

    /* ---------- go ---------- */
    restore(saved);
    if (!Object.keys(saved).length) store(key, collect());
    render();
  }

  /* ---------------------------- checklist -------------------------------- */

  function initChecklist() {
    var box = $("[data-checklist]");
    if (!box) return;
    var key = "paperwork:check:" + box.getAttribute("data-checklist");
    var items = $$("[data-check]", box);
    var state = store(key) || {};

    function update() {
      var done = 0;
      items.forEach(function (el) {
        var on = !!el.checked;
        el.closest(".check").classList.toggle("is-done", on);
        if (on) done++;
      });
      var pct = items.length ? Math.round((done / items.length) * 100) : 0;
      var bar = $("#check-progress");
      var label = $("#check-count");
      if (bar) bar.style.width = pct + "%";
      if (bar && bar.parentElement) bar.parentElement.setAttribute("aria-valuenow", pct);
      if (label) label.textContent = done + " of " + items.length + " done" + (pct === 100 ? " — all clear" : "");
    }

    items.forEach(function (el) {
      var id = el.getAttribute("data-check");
      el.checked = !!state[id];
      el.addEventListener("change", function () {
        state[id] = el.checked;
        store(key, state);
        update();
      });
    });

    var reset = $("#check-reset");
    if (reset) reset.addEventListener("click", function () {
      if (!confirm("Clear all ticks?")) return;
      items.forEach(function (el) { el.checked = false; });
      state = {}; unstore(key); update();
    });

    var expand = $("#check-expand");
    if (expand) expand.addEventListener("click", function () {
      var open = box.classList.toggle("show-all");
      expand.textContent = open ? "Hide details" : "Show all details";
    });

    update();
  }

  /* ------------------------------ chrome -------------------------------- */

  function initChrome() {
    var y = $("#year"); if (y) y.textContent = new Date().getFullYear();
    var menu = $("[data-menu]");
    if (menu) menu.addEventListener("click", function () {
      var nav = $("#site-nav");
      var open = nav.classList.toggle("open");
      menu.setAttribute("aria-expanded", open ? "true" : "false");
    });
    var t = $("[data-updated]");
    if (t && SITE.updated) t.textContent = SITE.updated;
  }

  function init() {
    initChrome();
    initDoc();
    initChecklist();
    initAds();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
