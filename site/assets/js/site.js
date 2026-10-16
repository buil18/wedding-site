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

  // Monogram C / G trong vòng hoa (đầu trang Welcome + chân trang)
  function monogramHTML(colorClass) {
    return `
      <div class="el box crop" style="--x:500;--y:32;--w:209;--h:209">
        <img data-img="9c8a825b087272bd0649e594cf39f64c.png" alt="" style="--ix:-30;--iy:0;--iw:268;--ih:209">
      </div>
      <p class="el t t-script ${colorClass}" style="--x:575;--y:93;--w:44;--fs:58;--lh:81">C</p>
      <p class="el t t-script ${colorClass}" style="--x:583;--y:110;--w:52;--fs:62.5;--lh:87">G</p>`;
  }

  function namesHTML() {
    return `
      <p class="el t t-script t-white nowrap" style="--x:222;--y:316;--w:330;--fs:96;--ls:2;--lh:92;text-align:right">Claire</p>
      <p class="el t t-script t-white" style="--x:571;--y:321;--w:76;--fs:84;--lh:80">&amp;</p>
      <p class="el t t-script t-white nowrap" style="--x:664;--y:316;--w:330;--fs:96;--ls:2;--lh:92;text-align:left">Graham</p>
      <p class="el t t-num t-white nowrap" style="--x:470;--y:419;--w:288;--fs:29.3;--ls:5.87;--lh:25">04.15.2030</p>`;
  }

  function footerHTML() {
    return `
      <section class="sec site-footer" style="--sh:684;--bgc:#757440">
        <img class="bg" data-img="d97f37717a8d7691b45a467278ae97b2.jpg" alt="" style="--py:100%;--op:.75">
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
    return `
      <section class="sec faq" style="--sh:1540">
        <p class="el t t-script" style="--x:210;--y:88;--w:797;--fs:106.7;--lh:124">Faq’s</p>
        ${items}
      </section>`;
  }

  function countdownHTML(colorVar) {
    const box = (k, label) =>
      `<div class="cd-item"><span class="cd-num" data-cd="${k}">00</span><span class="cd-label">${label}</span></div>`;
    return `<div class="countdown" style="--c:${colorVar}">
      ${box("d", "Days")}${box("h", "Hours")}${box("m", "Minutes")}${box("s", "Seconds")}
    </div>`;
  }

  /* ---------- Dựng menu ---------- */

  function buildHeader() {
    const current = document.body.dataset.page || "";
    const links = PAGES.map(
      (p) =>
        `<a href="${pageUrl(p.slug)}"${p.slug === current ? ' class="is-active" aria-current="page"' : ""}>${p.label}</a>`
    ).join("");
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
  }

  /* ---------- Chèn các khối dùng chung ---------- */

  function injectPartials() {
    document.querySelectorAll("[data-faq]").forEach((n) => (n.outerHTML = faqHTML()));
    document.querySelectorAll("[data-monogram]").forEach((n) => (n.outerHTML = monogramHTML("")));
    document.querySelectorAll("[data-countdown]").forEach((n) => {
      n.innerHTML = countdownHTML(n.dataset.countdown || "var(--white)");
    });
    document.querySelectorAll("[data-footer]").forEach((n) => (n.outerHTML = footerHTML()));

    const credit = document.createElement("div");
    credit.className = "site-credit";
    credit.textContent = "Designed by Tiến Lợi";
    document.body.append(credit);
  }

  function resolveAssets() {
    document.querySelectorAll("img[data-img]").forEach((img) => {
      img.src = imgUrl(img.dataset.img);
      if (!img.hasAttribute("loading")) img.loading = "lazy";
    });
    document.querySelectorAll("[data-link]").forEach((a) => {
      a.href = pageUrl(a.dataset.link);
    });
  }

  /* ---------- Đếm ngược ---------- */

  function startCountdowns() {
    const nodes = document.querySelectorAll(".countdown");
    if (!nodes.length) return;
    const target = new Date(CFG.weddingDate || "2030-04-16T18:00:00").getTime();
    const pad = (n) => String(n).padStart(2, "0");
    function tick() {
      let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
      const v = {
        d: Math.floor(s / 86400),
        h: Math.floor((s % 86400) / 3600),
        m: Math.floor((s % 3600) / 60),
        s: s % 60,
      };
      nodes.forEach((cd) =>
        cd.querySelectorAll("[data-cd]").forEach((el) => {
          const k = el.dataset.cd;
          el.textContent = k === "d" ? v.d : pad(v[k]);
        })
      );
    }
    tick();
    setInterval(tick, 1000);
  }

  buildHeader();
  injectPartials();
  resolveAssets();
  startCountdowns();

  window.SITE = { pageUrl, imgUrl };
})();
