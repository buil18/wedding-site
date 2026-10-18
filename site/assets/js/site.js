/* =========================================================
   site.js: phần dùng chung cho mọi trang
   - Menu trên cùng (thanh ngang / ☰ trên điện thoại)
   - Chân trang (ảnh, monogram, tên, RETURN TO INVITE)
   - Khối FAQ (Welcome + RSVP)
   - Đếm ngược
   - Nạp ảnh theo config.js, nối liên kết giữa các trang
   ========================================================= */
(function () {
  "use strict";

  const CFG = window.SITE_CONFIG || {};
  const ROOT = new URL("../../", document.currentScript.src).href;
  const IS_FILE = location.protocol === "file:";

  const PAGES = [
    { slug: "", label: "Home" },
    { slug: "invitation", label: "Invitation" },
    { slug: "welcome", label: "Welcome" },
    { slug: "our-story", label: "Our Story" },
    { slug: "details", label: "Details" },
    { slug: "rsvp", label: "RSVP" },
  ];

  function pageUrl(slug) {
    return ROOT + (slug ? slug + "/" : "") + (IS_FILE ? "index.html" : "");
  }

  function imgUrl(name) {
    const own = (CFG.imgOverride || {})[name];
    return own ? ROOT + own : (CFG.imgBase || "") + name;
  }

  /* ---------- Mẫu HTML dùng chung ---------- */

  // Monogram N / L trong vòng hoa (đầu trang Welcome + chân trang). Chữ được căn lại bằng placeMonograms().
  function monogramHTML(colorClass) {
    return `
      <div class="el box crop" style="--x:500;--y:32;--w:209;--h:209">
        <img data-img="9c8a825b087272bd0649e594cf39f64c.png" alt="" style="--ix:-30;--iy:0;--iw:268;--ih:209">
      </div>
      <div class="mono" style="--x:500;--y:32;--w:209;--h:209" aria-hidden="true">
        <span class="t t-script ${colorClass}" data-mono="N" style="--fs:46;--lh:58">N</span>
        <span class="t t-script ${colorClass}" data-mono="L" style="--fs:46;--lh:58">L</span>
      </div>`;
  }

  // Tâm ô trống trong vòng hoa (toạ độ trong khung 209x209) và độ lệch chéo N (trên trái) / L (dưới phải)
  const MONO = { cx: 102, cy: 106, off: { N: [-12, -9], L: [12, 9] } };

  function placeMonograms(scope) {
    const boxes = (scope || document).querySelectorAll(".mono");
    if (!boxes.length) return;
    const ctx = document.createElement("canvas").getContext("2d");
    const run = () =>
      boxes.forEach((box) => {
        const items = [];
        box.querySelectorAll("span[data-mono]").forEach((sp) => {
          const cs = getComputedStyle(sp);
          const fs = parseFloat(sp.style.getPropertyValue("--fs")) * (parseFloat(cs.getPropertyValue("--script-scale")) || 1);
          const lh = parseFloat(sp.style.getPropertyValue("--lh")) || fs;
          const ch = sp.dataset.mono;
          ctx.font = `${fs}px ${cs.fontFamily}`;
          const m = ctx.measureText(ch);
          const fa = m.fontBoundingBoxAscent != null ? m.fontBoundingBoxAscent : fs * 0.8;
          const fd = m.fontBoundingBoxDescent != null ? m.fontBoundingBoxDescent : fs * 0.2;
          const baseline = (lh - (fa + fd)) / 2 + fa; // vị trí đường chân chữ trong dòng
          const inkX = (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2;
          const inkY = baseline + (m.actualBoundingBoxDescent - m.actualBoundingBoxAscent) / 2;
          const [dx, dy] = MONO.off[ch];
          const lx = MONO.cx + dx - inkX;
          const ly = MONO.cy + dy - inkY;
          items.push({
            sp, lx, ly,
            l: lx - m.actualBoundingBoxLeft, r: lx + m.actualBoundingBoxRight,
            t: ly + baseline - m.actualBoundingBoxAscent, b: ly + baseline + m.actualBoundingBoxDescent,
          });
        });
        // Cả cặp N+L nằm đúng tâm: dịch cả hai theo độ lệch của khung bao nét chữ
        const ux = (Math.min(...items.map((i) => i.l)) + Math.max(...items.map((i) => i.r))) / 2;
        const uy = (Math.min(...items.map((i) => i.t)) + Math.max(...items.map((i) => i.b))) / 2;
        items.forEach((i) => {
          i.sp.style.setProperty("--lx", (i.lx + MONO.cx - ux).toFixed(2));
          i.sp.style.setProperty("--ly", (i.ly + MONO.cy - uy).toFixed(2));
        });
        box.classList.add("is-set");
      });
    run();
    if (document.fonts) {
      if (document.fonts.load) document.fonts.load('52px "Parfumerie Script Pro"').catch(() => {}).then(run);
      document.fonts.ready.then(run);
    }
  }

  // Tên + ngày trên ảnh bìa Welcome và chân trang: xếp 3 dòng giữa trang (Tuyet Nhung / & / Tien Loi) cho khỏi bị co khi tên dài.
  function namesHTML() {
    return `
      <p class="el t t-script t-white nowrap" style="--x:258;--y:236;--w:700;--fs:80;--lh:104">Tuyet Nhung</p>
      <p class="el t t-script t-white nowrap" style="--x:508;--y:333;--w:200;--fs:54;--lh:70">&amp;</p>
      <p class="el t t-script t-white nowrap" style="--x:258;--y:381;--w:700;--fs:80;--lh:104">Tien Loi</p>
      <p class="el t t-num t-white nowrap" style="--x:470;--y:510;--w:288;--fs:29.3;--ls:5.87;--lh:34">14.11.2026</p>`;
  }

  function footerHTML() {
    return `
      <section class="sec site-footer" style="--sh:684;--bgc:#757440">
        <img class="bg" data-img="own-footer-bg.jpg" alt="" style="--py:100%;--op:1">
        ${monogramHTML("t-white")}
        ${namesHTML()}
        <div class="return-band"></div>
        <a class="el t t-body btn-text nowrap" data-link="invitation"
           style="--x:380;--y:641;--w:458;--fs:19;--ls:2.13;--lh:24;--c:var(--blue-deep)">RETURN TO INVITE</a>
      </section>`;
  }

  const FAQ = [
    ["01", "Can I bring a guest?", "Please refer to your invitation for guest details.", 302, 367, 410],
    ["02", "Are kids invited?", "We love your little ones, but this will be an adults-only celebration.", 469, 521, 578],
    ["03", "What’s the dress code?", "Formal or black-tie optional. See examples on the homepage for color inspiration.", 637, 702, 745],
    ["04", "What should we expect weather-wise?", "Early spring in Texas is warm and breezy — plan for comfort during the outdoor ceremony.", 829, 894, 938],
    ["05", "Will transportation be provided?", "Yes! A shuttle will run from the host hotel to and from the venue for all main events.", 1022, 1087, 1131],
    ["06", "Is there parking at the venue?", "Yes — complimentary valet parking is available onsite for guests who prefer to drive.", 1216, 1281, 1324],
  ];

  function faqHTML() {
    const items = FAQ.map(
      ([n, q, a, yn, yq, ya]) => `
        <p class="el t t-num" style="--x:568;--y:${yn};--w:80;--fs:24;--ls:4;--lh:33">${n}</p>
        <p class="el t t-label" style="--x:310;--y:${yq};--w:597;--fs:20;--ls:1.5;--lh:37">${q}</p>
        <p class="el t t-body" style="--x:320;--y:${ya};--w:577;--fs:17;--lh:26">${a}</p>`
    ).join("");
    const flow = FAQ.map(
      ([n, q, a]) => `<li><span class="faq-n">${n}</span><h3>${q}</h3><p>${a}</p></li>`
    ).join("");
    return `
      <section class="sec faq" style="--sh:1450" data-noreflow>
        <p class="el t t-script" style="--x:210;--y:88;--w:797;--fs:106.7;--lh:124">Faq’s</p>
        ${items}
        <div class="faq-flow"><h2>Faq’s</h2><ol>${flow}</ol></div>
      </section>`;
  }

  function countdownHTML(colorVar) {
    const box = (k, label) =>
      `<div class="cd-item"><span class="cd-num" data-cd="${k}">00</span><span class="cd-label">${label}</span></div>`;
    return `<div class="countdown" style="--c:${colorVar}">
      ${box("d", "Days")}${box("h", "Hours")}${box("m", "Minutes")}${box("s", "Seconds")}
    </div>`;
  }

  /* ---------- Dựng menu (chỉ dựng một lần, đổi trang không dựng lại) ---------- */

  function buildHeader() {
    const links = PAGES.map((p) => `<a href="${pageUrl(p.slug)}" data-slug="${p.slug}">${p.label}</a>`).join("");
    const header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML = `
      <button class="nav-toggle" type="button" aria-label="Menu" aria-expanded="false">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
          <path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
      <nav class="site-nav">${links}</nav>`;
    document.body.prepend(header);

    const btn = header.querySelector(".nav-toggle");
    btn.addEventListener("click", () => {
      const open = header.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
    header.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        header.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  function markActive() {
    const current = document.body.dataset.page || "";
    document.querySelectorAll(".site-nav a").forEach((a) => {
      const on = a.dataset.slug === current;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  /* ---------- Chèn các khối dùng chung ---------- */

  function injectPartials(scope) {
    scope.querySelectorAll("[data-faq]").forEach((n) => (n.outerHTML = faqHTML()));
    scope.querySelectorAll("[data-monogram]").forEach((n) => (n.outerHTML = monogramHTML("")));
    scope.querySelectorAll("[data-countdown]").forEach((n) => {
      n.innerHTML = countdownHTML(n.dataset.countdown || "var(--white)");
    });
    scope.querySelectorAll("[data-names]").forEach((n) => (n.outerHTML = namesHTML()));
    scope.querySelectorAll("[data-footer]").forEach((n) => (n.outerHTML = footerHTML()));
  }

  // Tiêu điểm ảnh ("x% y%"): ưu tiên imgFocus trong config.js; nếu không có thì ảnh của bạn
  // trong khung cắt lấy mặc định defaultFocus (giữ phần phía trên, nơi thường có khuôn mặt).
  function focusFor(img, name) {
    const f = (CFG.imgFocus || {})[name];
    if (f) return f;
    const own = (CFG.imgOverride || {})[name];
    if (own && img.closest(".crop")) return CFG.defaultFocus || "50% 25%";
    return "";
  }

  function resolveAssets(scope) {
    scope.querySelectorAll("img[data-img]").forEach((img) => {
      img.src = imgUrl(img.dataset.img);
      if (!img.hasAttribute("loading")) img.loading = "lazy";
      // Ảnh luôn phủ kín khung (không trống, không méo). Chỉ cần chọn phần nào của ảnh được giữ lại.
      const fp = focusFor(img, img.dataset.img);
      if (fp) img.style.objectPosition = fp;
    });
    scope.querySelectorAll("[data-link]").forEach((a) => {
      a.href = pageUrl(a.dataset.link);
    });
  }

  /* ---------- Đếm ngược (một bộ đếm chung, tự tìm khối đếm đang có trên trang) ---------- */

  function tickCountdowns() {
    const nodes = document.querySelectorAll(".countdown");
    if (!nodes.length) return;
    const target = new Date(CFG.weddingDate || "2026-11-14T09:00:00").getTime();
    const pad = (n) => String(n).padStart(2, "0");
    const s = Math.max(0, Math.floor((target - Date.now()) / 1000));
    const v = { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
    nodes.forEach((cd) =>
      cd.querySelectorAll("[data-cd]").forEach((el) => {
        const k = el.dataset.cd;
        el.textContent = k === "d" ? v.d : pad(v[k]);
      })
    );
  }

  /* ---------- Điện thoại: chữ đoạn văn phải đọc được ----------
     Trên màn hẹp toàn bộ khung bị thu nhỏ, nên chữ đoạn văn được nâng lên cỡ tối thiểu (xem base.css).
     Đoạn nào vì thế dài thêm thì đẩy các phần tử bên dưới xuống đúng bằng phần dài thêm. */

  const mq = window.matchMedia("(max-width: 767px)");

  function reflow(scope) {
    (scope || document).querySelectorAll(".sec").forEach((sec) => {
      sec.style.removeProperty("--dsh");
      sec.querySelectorAll(".el").forEach((e) => e.style.removeProperty("--dy"));
    });
    if (!mq.matches) return;
    const W = document.documentElement.clientWidth;
    (scope || document).querySelectorAll(".sec:not([data-noreflow])").forEach((sec) => {
      const uPx = W / (sec.hasAttribute("data-wide") ? 920 : 640);
      const texts = [...sec.querySelectorAll(".t.t-body:not(.nowrap), .t.t-label:not(.nowrap)")]
        .map((el) => ({ el, y: parseFloat(el.style.getPropertyValue("--y")) }))
        .filter((o) => !isNaN(o.y))
        .sort((a, b) => a.y - b.y);
      if (!texts.length) return;
      const els = [...sec.querySelectorAll(".el")].map((el) => ({ el, y: parseFloat(el.style.getPropertyValue("--y")), dy: 0 }));
      let total = 0;
      texts.forEach(({ el, y }) => {
        el.classList.add("no-bump");
        const h0 = el.getBoundingClientRect().height;
        el.classList.remove("no-bump");
        const h1 = el.getBoundingClientRect().height;
        const g = (h1 - h0) / uPx;
        if (g < 1) return;
        total += g;
        els.forEach((o) => {
          if (o.el !== el && o.y > y + 0.5) o.dy += g;
        });
      });
      els.forEach((o) => o.dy && o.el.style.setProperty("--dy", o.dy.toFixed(1)));
      if (total) sec.style.setProperty("--dsh", total.toFixed(1));
    });
  }

  /* ---------- Khởi tạo trang + chuyển trang không tải lại (để nhạc không bị ngắt) ---------- */

  const hooks = [];
  const PERSIST = /\/assets\/js\/(config|site)\.js(\?|$)/;

  function setupPage(scope) {
    injectPartials(scope);
    resolveAssets(scope);
    tickCountdowns();
    placeMonograms(scope);
    reflow(scope);
    hooks.forEach((fn) => {
      try { fn(); } catch (e) { console.error(e); }
    });
  }

  function loadScript(src) {
    return new Promise((res) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = s.onerror = () => res();
      document.body.appendChild(s);
    });
  }

  function ensureStyles(doc, base) {
    const jobs = [];
    doc.querySelectorAll('head link[rel="stylesheet"]').forEach((l) => {
      const href = new URL(l.getAttribute("href"), base).href;
      if ([...document.querySelectorAll('link[rel="stylesheet"]')].some((x) => x.href === href)) return;
      jobs.push(new Promise((res) => {
        const n = document.createElement("link");
        n.rel = "stylesheet";
        n.href = href;
        n.onload = n.onerror = () => res();
        document.head.appendChild(n);
      }));
    });
    return Promise.all(jobs);
  }

  let navigating = false;

  async function go(href, opts) {
    opts = opts || {};
    const url = new URL(href, location.href);
    if (IS_FILE) { location.href = url.href; return; }
    if (navigating) return;
    navigating = true;
    try {
      const res = await fetch(url.href, { credentials: "same-origin" });
      if (!res.ok) throw new Error(res.status);
      const doc = new DOMParser().parseFromString(await res.text(), "text/html");
      const next = doc.querySelector("main");
      if (!next) throw new Error("no main");
      await ensureStyles(doc, url);

      const cur = document.querySelector("main");
      cur.classList.add("pjax-out");
      await new Promise((r) => setTimeout(r, opts.instant ? 0 : 220));

      document.title = doc.title;
      document.body.dataset.page = doc.body.dataset.page || "";
      const fresh = document.importNode(next, true);
      cur.replaceWith(fresh);
      if (opts.push !== false) history.pushState({}, "", url.href);
      window.scrollTo(0, 0);
      markActive();

      const scripts = [...doc.querySelectorAll("body script[src]")]
        .map((s) => new URL(s.getAttribute("src"), url).href)
        .filter((src) => !PERSIST.test(src));
      for (const src of scripts) await loadScript(src);

      setupPage(fresh);
      fresh.classList.add("pjax-in");
      requestAnimationFrame(() => requestAnimationFrame(() => fresh.classList.remove("pjax-in")));
    } catch (err) {
      location.href = url.href;
    } finally {
      navigating = false;
    }
  }

  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest("a[href]");
    if (!a || a.target === "_blank" || a.hasAttribute("download") || a.hasAttribute("data-open")) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !url.href.startsWith(ROOT)) return;
    if (url.pathname === location.pathname && url.hash) return;
    e.preventDefault();
    go(url.href);
  });

  window.addEventListener("popstate", () => go(location.href, { push: false, instant: true }));

  buildHeader();
  markActive();
  setupPage(document);
  setInterval(tickCountdowns, 1000);
  mq.addEventListener && mq.addEventListener("change", () => reflow());
  let rt;
  window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => reflow(), 150); });
  window.addEventListener("load", () => reflow());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => reflow());

  const credit = document.createElement("div");
  credit.className = "site-credit";
  credit.textContent = "Designed by Tiến Lợi";
  document.body.append(credit);

  window.SITE = {
    pageUrl, imgUrl, go, hooks, root: ROOT,
    assetUrl: (p) => (/^(https?:)?\/\//.test(p) ? p : ROOT + p),
  };

  // Nhạc + tự cuộn: tải một lần, giữ nguyên khi chuyển trang
  ["assets/js/music.js", "assets/effects/autoscroll.js"].forEach((f) => loadScript(ROOT + f));
})();
