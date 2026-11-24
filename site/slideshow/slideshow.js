/* =========================================================
   slideshow.js: bộ máy trình chiếu (thường không cần sửa)
   Nội dung, ảnh, thời gian: sửa trong slides.js
   Phím: → / ←  chuyển slide · Space  tạm dừng · F  toàn màn hình · M  tắt/bật nhạc
   ========================================================= */
(function () {
  const C = window.SLIDESHOW;
  const W = 1920, H = 1080;
  const MAU = /[?&]mau\b/.test(location.search);
  const $ = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

  /* ---------------- Trang trí (vẽ bằng SVG) ---------------- */
  function leafPath(x, y, a, L, wd) {
    return `<path transform="translate(${x} ${y}) rotate(${a})" d="M0 0 Q${L * .5} ${-wd} ${L} 0 Q${L * .5} ${wd} 0 0Z"/>`;
  }
  function sprig(color = "var(--leaf)", flip = false) {
    // nhành lá: thân cong + lá mọc hai bên
    let leaves = "";
    const pts = [[30, 150], [55, 128], [80, 106], [104, 86], [128, 66], [150, 48], [170, 32]];
    pts.forEach(([x, y], i) => {
      const L = 46 - i * 3;
      leaves += leafPath(x, y, -95 + i * 2, L, 11) + leafPath(x, y, 20 - i * 2, L, 11);
    });
    leaves += leafPath(184, 22, -38, 34, 9);
    return `<svg viewBox="0 0 220 190" ${flip ? 'style="transform:scaleX(-1)"' : ""}>
      <path d="M12 182 C 60 140, 120 80, 190 18" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round"/>
      <g fill="${color}" fill-opacity=".55" stroke="${color}" stroke-width="1.2">${leaves}</g></svg>`;
  }
  const rings = `<svg viewBox="0 0 150 100"><g fill="none" stroke="var(--tan)" stroke-width="3.2">
      <circle cx="56" cy="60" r="32"/><circle cx="94" cy="60" r="32"/></g>
      <path d="M56 16 l9 10 -9 9 -9 -9z" fill="#fff" stroke="var(--blue-deep)" stroke-width="2"/></svg>`;
  const sparkle = (c = "var(--tan)") => `<svg viewBox="0 0 24 24"><path fill="${c}" d="M12 0C13 8 16 11 24 12 16 13 13 16 12 24 11 16 8 13 0 12 8 11 11 8 12 0Z"/></svg>`;
  const heartDoodle = `<svg viewBox="0 0 260 90"><path fill="none" stroke="var(--ink-soft)" stroke-width="2" stroke-linecap="round"
      d="M4 70 C 50 72, 80 40, 120 52 C 150 60, 150 80, 170 78 M170 78 C 150 62, 148 40, 166 36 C 180 33, 186 46, 186 52 C 188 44, 198 32, 210 38 C 228 48, 210 70, 186 84 M186 84 C 210 88, 236 70, 256 60"/></svg>`;
  function dried(color1 = "var(--tan)", color2 = "#b58a63") {
    // hoa khô: vài cành mảnh, nụ tròn
    const stems = [[60, 300, 40, 40], [80, 300, 95, 20], [70, 300, 130, 70]];
    let s = "", heads = "";
    stems.forEach(([x1, y1, x2, y2], i) => {
      s += `<path d="M${x1} ${y1} Q ${(x1 + x2) / 2 + (i - 1) * 18} ${(y1 + y2) / 2} ${x2} ${y2}" />`;
      for (let k = 0; k < 4; k++) heads += `<circle cx="${x2 + (k % 2 ? 7 : -6) + k}" cy="${y2 + k * 5 - 6}" r="${7 - k}" fill="${k % 2 ? color2 : color1}"/>`;
    });
    return `<svg viewBox="0 0 170 310"><g fill="none" stroke="#a99278" stroke-width="2">${s}</g>${heads}</svg>`;
  }
  const HEART = "M320 590 C 120 440, 0 330, 0 185 C 0 72, 88 0, 188 0 C 252 0, 300 34, 320 84 C 340 34, 388 0, 452 0 C 552 0, 640 72, 640 185 C 640 330, 520 440, 320 590 Z";

  /* ---------------- Chữ gõ từng ký tự ---------------- */
  // trả về [html, thời điểm gõ xong (giây)]
  function typed(text, start = 0.6, step = 0.035) {
    let t = start, out = "";
    String(text).split(/<br\s*\/?>/i).forEach((line, li) => {
      if (li) out += "<br>";
      line.split(" ").forEach((word, wi) => {
        if (wi) { out += " "; t += step; }
        out += '<span class="w">' + [...word].map(ch => { const s = `<span class="ch" style="--d:${t.toFixed(2)}s">${ch}</span>`; t += step; return s; }).join("") + "</span>";
      });
    });
    return [out, t];
  }

  /* ---------------- Ảnh ---------------- */
  const info = {}; // "07" -> {ok, w, h}
  const photoUrl = id => C.photoFolder + id + C.photoExt;
  function hint(w, h) { const r = w / h; return r > 1.15 ? "ngang" : r < 0.87 ? "dọc" : "vuông"; }
  // ô ảnh đặt ở (x,y) cỡ w×h; opt: {cls, anim, d, kb, frameHint}
  function ph(slide, id, x, y, w, h, opt = {}) {
    const p = $("div", "ph " + (opt.cls || "") + (opt.anim ? " a " + opt.anim : ""));
    Object.assign(p.style, { left: x + "px", top: y + "px", width: w + "px", height: h + "px" });
    if (opt.d != null) p.style.setProperty("--d", opt.d + "s");
    if (opt.t != null) p.style.setProperty("--t", opt.t + "s");
    fillPhoto(p, slide, id, opt.frameHint || hint(w, h));
    return p;
  }
  function fillPhoto(p, slide, id, hintText) {
    const ok = info[id] && info[id].ok;
    if (ok) {
      const img = new Image(); img.src = photoUrl(id); img.alt = "";
      img.style.setProperty("--pos", (C.photoFocus && C.photoFocus[id]) || "50% 30%");
      p.appendChild(img); p.classList.add("has", "kb");
      p.style.setProperty("--kb", slide._sec + 3 + "s");
    } else {
      p.classList.add("empty");
      p.appendChild($("span", "", `Ảnh ${id}<small>${hintText}</small>`));
    }
  }
  function el(slide, cls, x, y, w, h, html, style) {
    const e = $("div", cls, html);
    Object.assign(e.style, { left: x + "px", top: y + "px" }, w ? { width: w + "px" } : {}, h ? { height: h + "px" } : {}, style || {});
    slide.appendChild(e); return e;
  }
  const d = (e, s, t) => { e.style.setProperty("--d", s + "s"); if (t) e.style.setProperty("--t", t + "s"); return e; };

  /* ---------------- Bố cục ---------------- */
  const N = C.names;
  const L = {
    opening(s, c) {
      d(el(s, "a zoom", 200, 82, 680, 920, "", { border: "1.5px solid var(--blue)", borderRadius: "340px 340px 14px 14px" }), .2, 2);
      s.appendChild(Object.assign(ph(s, c.photos[0], 230, 112, 620, 860, { anim: "wipeU", d: .4, t: 2.2, frameHint: "dọc" }), {})).style.borderRadius = "310px 310px 10px 10px";
      d(el(s, "a fade label", 960, 205, 800, null, c.label || "", { textAlign: "center" }), 1.2);
      d(el(s, "a up names", 960, 270, 800, null, N.first, { fontSize: "150px", textAlign: "center" }), 1.6);
      d(el(s, "a fade names", 960, 410, 800, null, "&amp;", { fontSize: "96px", textAlign: "center", color: "var(--blue-deep)" }), 2.2);
      d(el(s, "a up names", 960, 500, 800, null, N.second, { fontSize: "150px", textAlign: "center" }), 2.6);
      const [html] = typed(c.text, 3.6, .03);
      el(s, "para", 1010, 720, 700, null, html, { fontSize: "38px", textAlign: "center" });
      d(el(s, "a fade deco", 1600, 860, 190, 165, sprig()), 3.2);
    },
    person(s, c, groom) {
      const px = groom ? 960 : 0, tx = groom ? 0 : 960;
      s.appendChild(ph(s, c.photos[0], px, 0, 960, 1080, { anim: groom ? "wipeR" : "wipeL", d: .2, t: 2.2, frameHint: "dọc" }));
      d(el(s, "a grow vline", tx + 480, 0, null, 300), .6, 1.4);
      d(el(s, "a fade label", tx + 80, 360, 800, null, c.label || "", { textAlign: "center" }), 1.6);
      d(el(s, "a up names", tx + 40, 430, 880, null, groom ? N.first : N.second, { fontSize: "180px", textAlign: "center" }), 2.1, 1.8);
      d(el(s, "a grow vline", tx + 480, 760, null, 320), 3, 1.6);
      d(el(s, "a fade deco", tx + (groom ? 90 : 700), groom ? 820 : 80, 170, 150, sprig("var(--leaf)", !groom)), 3.4);
    },
    groom(s, c) { L.person(s, c, true); },
    bride(s, c) { L.person(s, c, false); },
    bigday(s, c) {
      s.appendChild(ph(s, c.photos[0], 140, 80, 1640, 650, { anim: "wipeL", d: .2, t: 2.4, cls: "framed", frameHint: "ngang" }));
      d(el(s, "a up caps", 160, 790, 1600, null, c.text || "", { fontSize: "40px", textAlign: "center" }), 1.8);
      d(el(s, "a zoom deco", 895, 935, 130, 90, rings), 2.8);
    },
    full(s, c) {
      const id = c.photos[0], i = info[id];
      let w = 1200, h = 900;
      if (i && i.ok) { const r = i.w / i.h; h = 940; w = h * r; if (w > 1640) { w = 1640; h = w / r; } }
      if (i && i.ok) {
        const bg = $("div", "ph"); Object.assign(bg.style, { inset: "-60px", filter: "blur(38px) saturate(.85)", opacity: ".38", background: "none" });
        const im = new Image(); im.src = photoUrl(id); bg.appendChild(im); s.appendChild(bg);
      }
      s.appendChild(ph(s, id, (W - w) / 2, (H - h) / 2, w, h, { anim: "zoom", d: .2, t: 2, cls: "framed", frameHint: "bất kỳ" }));
    },
    trio(s, c) {
      const [html, end] = typed(c.text, .5, .028);
      el(s, "para", 210, 70, 1500, null, html, { fontSize: "44px", textAlign: "center" });
      const w = 500, h = 640, gap = 50, x0 = (W - (3 * w + 2 * gap)) / 2;
      c.photos.slice(0, 3).forEach((id, k) => s.appendChild(ph(s, id, x0 + k * (w + gap), 340 + (k === 1 ? -14 : 14), w, h, { anim: "up", d: Math.min(end, 3) + .2 + k * .6, t: 1.6, cls: "framed" })));
    },
    days(s, c) {
      const hx = 240, hy = 230;
      d(el(s, "a zoom deco", hx - 26, hy - 26, 692, 650, `<svg viewBox="-26 -26 692 650"><path d="${HEART}" fill="none" stroke="var(--blue)" stroke-width="2.4" transform="translate(-14 10)"/></svg>`), .2, 2);
      const p = ph(s, c.photos[0], hx, hy, 640, 590, { anim: "zoom", d: .5, t: 2, frameHint: "vuông" });
      p.style.clipPath = `path("${HEART}")`; s.appendChild(p);
      d(el(s, "a fade deco", hx - 110, hy + 360, 230, 200, sprig()), 1.6);
      d(el(s, "a fade deco", hx + 500, hy - 120, 230, 200, sprig("var(--leaf)", true)), 1.9);
      const v = loveSpan();
      const total = el(s, "a fade", 960, 190, 860, null, `<span class="cnt" data-to="${v.total}">0</span> days in love`, { fontFamily: "var(--sans)", fontWeight: 600, fontSize: "64px", letterSpacing: ".04em", textAlign: "center", textTransform: "uppercase" });
      d(total, 1);
      d(el(s, "a fade para", 960, 290, 860, null, "từ " + fmtDate(C.loveStart), { fontSize: "38px", textAlign: "center", color: "var(--ink-soft)" }), 1.4);
      [[v.y, "năm"], [v.m, "tháng"], [v.w, "tuần"], [v.d, "ngày"]].forEach(([n, u], k) => {
        d(el(s, "a up", 1190, 380 + k * 145, 420, null,
          `<span class="cnt" data-to="${n}" style="font-family:var(--serif);font-size:110px;font-weight:500;line-height:1;display:inline-block;width:150px;text-align:right">0</span><span style="font-family:var(--sans);font-size:40px;margin-left:26px">${u}</span>`), 2 + k * .45);
      });
    },
    scrapbook(s, c) {
      const ids = c.photos, n = ids.length;
      d(el(s, "a fade hand", 120, 36, 1300, null, c.title || "", { fontSize: "110px" }), .3);
      d(el(s, "a fade deco", 1560, 70, 260, 90, heartDoodle), .9);
      const presets = {
        2: { sz: 480, pos: [[380, 260, -4], [1020, 300, 4]] },
        3: { sz: 430, pos: [[200, 300, -5], [760, 240, 3], [1300, 320, -2]] },
        4: { sz: 380, pos: [[150, 300, -6], [590, 380, 4], [1030, 270, -3], [1460, 400, 6]] },
        5: { sz: 350, pos: [[110, 330, -6], [480, 230, 4], [850, 400, -2], [1200, 250, 5], [1520, 430, -4]] },
        6: { sz: 330, pos: [[230, 200, -5], [700, 230, 3], [1170, 190, -3], [470, 590, 4], [940, 610, -4], [1410, 580, 5]] },
      };
      const P = presets[Math.min(Math.max(n, 2), 6)];
      ids.slice(0, 6).forEach((id, k) => {
        const [x, y, r] = P.pos[k], sz = P.sz;
        const pol = el(s, "pol a drop", x, y, sz + 40, sz + 98);
        pol.style.setProperty("--r", r + "deg"); d(pol, 1 + k * .75, 1.1);
        const inner = ph(s, id, 20, 20, sz, sz, { frameHint: "vuông" }); inner.style.position = "absolute";
        pol.appendChild(inner);
        const tape = $("div", "tape" + (k % 2 ? " warm" : "")); tape.style.setProperty("--tr", (k % 2 ? 5 : -4) + "deg"); pol.appendChild(tape);
      });
      [[1830, 980, 30], [60, 980, 22], [1840, 170, 20]].forEach(([x, y, z], k) => d(el(s, "a zoom deco", x, y, z, z, sparkle()), 2 + k * .4));
    },
    pair(s, c) {
      const [html, end] = typed(c.text, .5, .045);
      el(s, "hand", 150, 60, 1620, null, html, { fontSize: "76px" });
      const go = Math.min(end, 3.2);
      [[330, 300, -3, c.photos[0]], [930, 320, 3, c.photos[1]]].forEach(([x, y, r, id], k) => {
        const pol = el(s, "pol a drop", x, y, 560, 698); pol.style.setProperty("--r", r + "deg"); d(pol, go + k * .7, 1.2);
        const inner = ph(s, id, 20, 20, 520, 600, { frameHint: "dọc" }); inner.style.position = "absolute"; pol.appendChild(inner);
        const tape = $("div", "tape" + (k ? " warm" : "")); pol.appendChild(tape);
      });
      d(el(s, "a fade deco", 1580, 470, 200, 365, dried()), go + 1.2);
      d(el(s, "a fade deco", 80, 760, 150, 275, dried("#b58a63", "var(--tan)")), go + 1.5);
      d(el(s, "a zoom deco", 1640, 170, 40, 40, sparkle("var(--blue)")), go + 1.8);
    },
    duo(s, c) {
      d(el(s, "a fade", 300, 100, 640, 860, "", { border: "1.5px solid var(--tan)" }), .2);
      d(el(s, "a fade", 980, 120, 640, 860, "", { border: "1.5px solid var(--blue)" }), .4);
      s.appendChild(ph(s, c.photos[0], 330, 70, 640, 860, { anim: "wipeU", d: .5, t: 1.8, frameHint: "dọc" }));
      s.appendChild(ph(s, c.photos[1], 950, 150, 640, 860, { anim: "wipeU", d: 1.2, t: 1.8, frameHint: "dọc" }));
      d(el(s, "a fade names", 1610, 930, 300, null, N.short, { fontSize: "60px", color: "var(--ink-soft)" }), 2.6);
      d(el(s, "a zoom deco", 210, 60, 34, 34, sparkle()), 2.4);
    },
    mosaic(s, c) {
      const [a, ...rest] = c.photos;
      s.appendChild(ph(s, a, 140, 90, 640, 900, { anim: "wipeU", d: .3, t: 1.8, cls: "framed", frameHint: "dọc" }));
      const gx = 830, gw = 450, gh = 425, gap = 50;
      rest.slice(0, 4).forEach((id, k) => {
        const x = gx + (k % 2) * (gw + gap), y = 90 + Math.floor(k / 2) * (gh + gap);
        s.appendChild(ph(s, id, x, y, gw, gh, { anim: "zoom", d: 1 + k * .5, t: 1.4, cls: "framed" }));
      });
    },
    happy(s, c) {
      s.appendChild(ph(s, c.photos[0], 0, 0, 600, 1080, { anim: "wipeU", d: .2, t: 2, frameHint: "dọc" }));
      s.appendChild(ph(s, c.photos[1], 1320, 0, 600, 1080, { anim: "wipeU", d: .6, t: 2, frameHint: "dọc" }));
      el(s, "", 600, 0, 720, 1080, "", { background: "rgba(255,253,249,.7)" });
      d(el(s, "a grow vline", 960, 0, null, 220), 1, 1.4);
      const [html, end] = typed(c.text, 1.6, .035);
      el(s, "para", 660, 300, 600, null, html, { fontSize: "42px", textAlign: "center" });
      d(el(s, "a up names", 620, 600, 680, null, "Happy<br>Wedding", { fontSize: "140px", textAlign: "center", lineHeight: ".95" }), end + .3, 1.8);
      d(el(s, "a grow vline", 960, 900, null, 180), end + 1, 1.2);
    },
    blessing(s, c) {
      s.appendChild(ph(s, c.photos[0], 140, 80, 420, 500, { anim: "zoom", d: .2, cls: "framed" }));
      s.appendChild(ph(s, c.photos[1], 600, 80, 420, 500, { anim: "zoom", d: .6, cls: "framed" }));
      s.appendChild(ph(s, c.photos[2], 1110, 80, 680, 920, { anim: "wipeU", d: 1, t: 2, cls: "framed", frameHint: "dọc" }));
      d(el(s, "a fade", 140, 630, 880, 370, "", { background: "rgba(220,212,200,.45)" }), 1.4);
      d(el(s, "a up", 200, 680, 780, null, c.title || "", { fontFamily: "var(--serif)", fontWeight: 600, fontSize: "84px", lineHeight: "1" }), 1.8);
      const [html] = typed(c.text, 2.6, .06);
      el(s, "para", 200, 800, 780, null, html, { fontSize: "60px" });
      d(el(s, "a fade deco", 860, 860, 150, 130, sprig()), 3.6);
    },
    ending(s, c) {
      const id = c.photos[0], has = info[id] && info[id].ok;
      const tx = has || MAU ? 140 : 460;
      if (has || MAU) {
        s.appendChild(ph(s, id, 1060, 90, 700, 900, { anim: "fade", d: .3, t: 3, frameHint: "dọc (không bắt buộc)" })).style.borderRadius = "350px 350px 10px 10px";
        d(el(s, "a fade deco", 1600, 40, 260, 225, sprig("var(--leaf)", true)), 1.6);
      } else {
        d(el(s, "a fade deco", 1500, 120, 260, 225, sprig("var(--leaf)", true)), 1.6);
        d(el(s, "a fade deco", 160, 760, 260, 225, sprig()), 1.9);
      }
      d(el(s, "a up hand", tx, 250, 1000, null, c.title || "", { fontSize: "220px", textAlign: "center" }), .8, 2);
      d(el(s, "a fade names", tx, 560, 1000, null, N.short, { fontSize: "96px", textAlign: "center", color: "var(--blue-deep)" }), 1.8);
      d(el(s, "a growX hline", tx + 350, 700, 300, null), 2.4);
      d(el(s, "a fade para", tx + 100, 740, 800, null, c.text || "", { fontSize: "42px", textAlign: "center" }), 2.8);
    },
  };

  /* ---------------- Days in love ---------------- */
  function parseDate(s) { const [y, m, dd] = s.split("-").map(Number); return new Date(y, m - 1, dd); }
  function fmtDate(s) { const [y, m, dd] = s.split("-"); return `${dd}.${m}.${y}`; }
  function loveSpan() {
    const a = parseDate(C.loveStart), b = C.loveUntil ? parseDate(C.loveUntil) : new Date();
    b.setHours(0, 0, 0, 0);
    const total = Math.round((b - a) / 864e5);
    let y = b.getFullYear() - a.getFullYear(), m = b.getMonth() - a.getMonth(), dd = b.getDate() - a.getDate();
    if (dd < 0) { m--; dd += new Date(b.getFullYear(), b.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    return { total, y, m, w: Math.floor(dd / 7), d: dd % 7 };
  }
  const fmtNum = n => n.toLocaleString("vi-VN");
  function countUp(slide) {
    slide.querySelectorAll(".cnt").forEach((e, k) => {
      const to = +e.dataset.to, t0 = performance.now() + (k ? 2000 + (k - 1) * 450 : 1000), dur = 1800;
      if (MAU) { e.textContent = fmtNum(to); return; }
      e.textContent = "0";
      const tick = now => {
        const p = Math.min(Math.max((now - t0) / dur, 0), 1), ease = 1 - Math.pow(1 - p, 3);
        e.textContent = fmtNum(Math.round(to * ease));
        if (p < 1 && slide.classList.contains("play")) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  /* ---------------- Dựng slide ---------------- */
  function build(c) {
    const s = $("section", "slide l-" + c.layout);
    s._sec = c.seconds || C.defaultSeconds;
    (L[c.layout] || L.full)(s, c);
    return s;
  }
  function playable(c) { return c.optional || c.photos.every(id => info[id] && info[id].ok); }

  function checkPhotos() {
    const ids = [...new Set(C.slides.flatMap(c => c.photos))];
    return Promise.all(ids.map(id => new Promise(res => {
      const im = new Image();
      const done = ok => { info[id] = { ok, w: im.naturalWidth, h: im.naturalHeight }; res(); };
      im.onload = () => done(true); im.onerror = () => done(false);
      setTimeout(() => info[id] || done(false), 20000);
      im.src = photoUrl(id);
    })));
  }

  /* ---------------- Chế độ xem mẫu ---------------- */
  function renderMau() {
    document.body.classList.add("mau");
    const sheet = $("div", "sheet");
    const have = Object.values(info).filter(i => i.ok).length, total = Object.keys(info).length;
    sheet.appendChild($("h1", "", `Khung mẫu trình chiếu: ${C.slides.length} slide · đã có ${have}/${total} ảnh
      <small>Ô gạch chéo là chỗ trống: chép ảnh vào thư mục slideshow/photos/ đặt đúng tên số (ví dụ 18.jpg). Chữ dưới số là kiểu ảnh hợp với ô (dọc, ngang, vuông).<br>
      Slide "thiếu ảnh" sẽ tự bỏ qua khi trình chiếu. Mở lại trang không có ?mau để chiếu.</small>`));
    C.slides.forEach((c, k) => {
      const it = $("div", "item"), ok = playable(c);
      it.appendChild($("h2", "", `Slide ${k + 1} · ${c.layout} · ảnh ${c.photos.join(", ")}<em class="${ok ? "ok" : "no"}">${ok ? "sẽ chiếu" : "thiếu ảnh"}</em>`));
      const box = $("div", "box"), st = $("div", "stage static"), s = build(c);
      s.classList.add("shown", "play"); st.appendChild(s); box.appendChild(st); it.appendChild(box); sheet.appendChild(it);
      countUp(s);
    });
    document.body.appendChild(sheet);
  }

  /* ---------------- Trình chiếu ---------------- */
  function run() {
    const stage = $("div", "stage"); document.body.appendChild(stage);
    const fit = () => stage.style.setProperty("--scale", Math.min(innerWidth / W, innerHeight / H));
    addEventListener("resize", fit); fit();

    const list = C.slides.filter(playable);
    const hud = $("div", "hud"); document.body.appendChild(hud);
    const start = $("div", "start");
    if (!list.length) {
      start.innerHTML = `<div class="t3">Chưa có slide nào đủ ảnh. Mở <b>?mau</b> để xem cần thêm ảnh nào.</div>`;
      document.body.appendChild(start); return;
    }
    const have = Object.values(info).filter(i => i.ok).length;
    start.innerHTML = `<div class="t1">${N.short}</div><div class="t2">Bấm để bắt đầu trình chiếu</div>
      <div class="t3">${list.length}/${C.slides.length} slide · ${have} ảnh · lặp lại liên tục<br>→ / ← chuyển slide · Space tạm dừng · F toàn màn hình · M tắt nhạc</div>`;
    document.body.appendChild(start);

    const audio = C.music ? Object.assign(new Audio(C.music), { loop: true, volume: C.musicVolume ?? .7, preload: "auto" }) : null;
    let idx = -1, cur = null, timer = null, endAt = 0, remain = 0, paused = false, hudT;

    const showHud = msg => { hud.textContent = msg; hud.classList.add("show"); clearTimeout(hudT); hudT = setTimeout(() => paused || hud.classList.remove("show"), 1800); };
    function go(n) {
      idx = (n + list.length) % list.length;
      const s = build(list[idx]);
      stage.appendChild(s);
      void s.offsetWidth;
      s.classList.add("play", "shown");
      countUp(s);
      const old = cur; cur = s;
      if (old) { old.classList.remove("shown"); setTimeout(() => old.remove(), 1600); }
      schedule(s._sec * 1000);
    }
    function schedule(ms) { clearTimeout(timer); remain = ms; endAt = Date.now() + ms; if (!paused) timer = setTimeout(() => go(idx + 1), ms); }
    function togglePause() {
      paused = !paused; stage.classList.toggle("paused", paused);
      if (paused) { clearTimeout(timer); remain = Math.max(endAt - Date.now(), 800); audio && audio.pause(); showHud(`Tạm dừng · slide ${idx + 1}/${list.length}`); }
      else { schedule(remain); audio && audio.play().catch(() => {}); showHud("Tiếp tục"); }
    }
    function fullscreen() { (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {}); }

    start.addEventListener("click", () => {
      start.classList.add("gone");
      document.documentElement.requestFullscreen?.().catch(() => {});
      audio && audio.play().catch(() => {});
      go(0);
    });
    addEventListener("keydown", e => {
      if (idx < 0) { if (e.key === "Enter" || e.key === " ") start.click(); return; }
      if (e.key === "ArrowRight" || e.key === "PageDown") { go(idx + 1); showHud(`Slide ${idx + 1}/${list.length}`); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { go(idx - 1); showHud(`Slide ${idx + 1}/${list.length}`); }
      else if (e.key === " ") { e.preventDefault(); togglePause(); }
      else if (e.key === "f" || e.key === "F") fullscreen();
      else if ((e.key === "m" || e.key === "M") && audio) { audio.muted = !audio.muted; showHud(audio.muted ? "Đã tắt nhạc" : "Đã bật nhạc"); }
    });
    // ẩn con trỏ chuột khi không dùng
    let mt; addEventListener("mousemove", () => { document.body.classList.remove("hide-cursor"); clearTimeout(mt); mt = setTimeout(() => document.body.classList.add("hide-cursor"), 2500); });
    // ?slide=5 : bắt đầu ngay từ slide 5 (dùng khi kiểm tra), không cần bấm
    const q = location.search.match(/[?&]slide=(\d+)/);
    if (q) { start.classList.add("gone"); go(+q[1] - 1); }
  }

  checkPhotos().then(() => (MAU ? renderMau() : run()));
})();
