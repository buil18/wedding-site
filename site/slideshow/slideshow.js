/* =========================================================
   slideshow.js: bộ máy trình chiếu (thường không cần sửa)
   Nội dung, thứ tự ảnh, nhạc: sửa trong slides.js
   Phím: Space tạm dừng/tiếp tục · → / ← chuyển slide · F toàn màn hình · M tắt/bật tiếng
   ========================================================= */
(function () {
  const C = window.SLIDESHOW;
  // báo lỗi ngay trên màn hình (thay vì màn hình đen)
  function fail(msg) {
    const b = document.createElement("div"); b.className = "errbox";
    b.innerHTML = `<b>Trình chiếu chưa chạy được</b>${msg}`; document.body.appendChild(b);
  }
  if (!C || !Array.isArray(C.parts)) {
    fail("File <code>slides.js</code> đang bị lỗi cú pháp, thường do thiếu dấu phẩy <code>,</code> cuối dòng, thiếu dấu ngoặc kép <code>\"</code> hoặc thiếu ngoặc đóng <code>]</code>.<br>Mở slides.js, xem lại đoạn vừa sửa (hoặc Ctrl+Z để quay lại bản trước).");
    return;
  }
  // chỉ báo lỗi của chính trang; bỏ qua "Script error." do trình duyệt/tivi tự sinh, và không che ảnh khi đang chiếu
  window.addEventListener("error", e => {
    const m = String(e.message || "");
    if (!m || /^script error/i.test(m)) return;
    if (e.filename && !/slides?(show)?\.js/i.test(e.filename)) return;
    if (document.querySelector(".slide.shown")) { console.warn(m); return; }
    fail(m);
  });
  const W = 1920, H = 1080, FADE = 1.4;   // khớp --fade trong slideshow.css
  const MAU = /[?&]mau\b/.test(location.search);
  const $ = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const url = name => C.photoFolder + encodeURIComponent(name);

  /* ---------------- Trang trí SVG ---------------- */
  const leaf = (x, y, a, L, w) => `<path transform="translate(${x} ${y}) rotate(${a})" d="M0 0 Q${L * .5} ${-w} ${L} 0 Q${L * .5} ${w} 0 0Z"/>`;
  function sprig(flip) {
    let g = "";
    [[30, 150], [55, 128], [80, 106], [104, 86], [128, 66], [150, 48], [170, 32]].forEach(([x, y], i) => { const L = 46 - i * 3; g += leaf(x, y, -95 + i * 2, L, 11) + leaf(x, y, 20 - i * 2, L, 11); });
    g += leaf(184, 22, -38, 34, 9);
    return `<svg viewBox="0 0 220 190" ${flip ? 'style="transform:scaleX(-1)"' : ""}><path d="M12 182 C 60 140, 120 80, 190 18" fill="none" stroke="var(--leaf)" stroke-width="2.2" stroke-linecap="round"/><g fill="var(--leaf)" fill-opacity=".55" stroke="var(--leaf)" stroke-width="1.2">${g}</g></svg>`;
  }
  const heart = `<svg viewBox="-4 -4 648 602"><path d="M320 590 C 120 440, 0 330, 0 185 C 0 72, 88 0, 188 0 C 252 0, 300 34, 320 84 C 340 34, 388 0, 452 0 C 552 0, 640 72, 640 185 C 640 330, 520 440, 320 590 Z" fill="none" stroke="var(--blue)" stroke-width="5"/></svg>`;
  const rings = `<svg viewBox="0 0 150 100"><g fill="none" stroke="var(--tan)" stroke-width="3.2"><circle cx="56" cy="60" r="32"/><circle cx="94" cy="60" r="32"/></g><path d="M56 16 l9 10 -9 9 -9 -9z" fill="#fff" stroke="var(--blue-deep)" stroke-width="2"/></svg>`;

  /* ---------------- Chữ gõ từng ký tự ---------------- */
  function typed(text, start, step) {
    let t = start, out = "";
    String(text).split(" ").forEach((word, i) => {
      if (i) { out += " "; t += step; }
      out += '<span class="w">' + [...word].map(ch => { const s = `<span class="ch" style="--d:${t.toFixed(2)}s">${ch}</span>`; t += step; return s; }).join("") + "</span>";
    });
    return [out, t];
  }

  /* ---------------- Ảnh: tỉ lệ thật, không cắt ---------------- */
  const info = {};                                   // tên → {ok, r}
  const ratio = n => (info[n] && info[n].ok ? info[n].r : 1.5);
  const has = n => info[n] && info[n].ok;
  function fit(r, mw, mh) { let w = mw, h = w / r; if (h > mh) { h = mh; w = h * r; } return [Math.round(w), Math.round(h)]; }

  function el(s, cls, x, y, w, h, html, st) {
    const e = $("div", cls, html);
    Object.assign(e.style, { left: x + "px", top: y + "px" }, w ? { width: w + "px" } : {}, h ? { height: h + "px" } : {}, st || {});
    s.appendChild(e); return e;
  }
  const dl = (e, d, t) => { e.style.setProperty("--d", d + "s"); if (t) e.style.setProperty("--t", t + "s"); return e; };

  // khung ảnh (kích thước = đúng tỉ lệ ảnh); style: "frame" | "pol" | "plain"
  function photo(s, name, x, y, w, h, style, anim, d, rot) {
    const pad = style === "pol" ? [16, 16, 58, 16] : style === "frame" ? [12, 12, 12, 12] : [0, 0, 0, 0];
    const box = el(s, `pf ${style} a ${anim}`, x - pad[3], y - pad[0], w + pad[1] + pad[3], h + pad[0] + pad[2]);
    box.style.padding = pad.map(p => p + "px").join(" ");
    if (rot) box.style.setProperty("--r", rot + "deg");
    dl(box, d);
    if (has(name)) { const im = new Image(); im.src = url(name); im.alt = ""; box.appendChild(im); }
    else box.appendChild($("div", "missing", `<b>Chưa có ảnh</b>${name}`));
    if (style === "pol") { const tp = $("div", "tape" + (Math.random() > .5 ? " warm" : "")); tp.style.setProperty("--tr", (rot > 0 ? 4 : -4) + "deg"); box.appendChild(tp); }
    return box;
  }
  function blurBg(s, name) {
    if (!has(name)) return;
    const b = el(s, "bgblur", -80, -80, W + 160, H + 160);
    b.style.backgroundImage = `url("${url(name)}")`;
  }

  /* ---------------- Bố cục ảnh ---------------- */
  let variant = 0;
  // một hàng ảnh cùng chiều cao, căn giữa
  function row(s, names, top, maxH, maxW, style, opts = {}) {
    const gap = style === "pol" ? 80 : 56;
    const rs = names.map(ratio), sum = rs.reduce((a, b) => a + b, 0);
    const h = Math.round(Math.min(maxH, (maxW - gap * (names.length - 1)) / sum));
    const total = rs.reduce((a, r) => a + Math.round(r * h), 0) + gap * (names.length - 1);
    let x = Math.round((W - total) / 2);
    names.forEach((n, k) => {
      const w = Math.round(rs[k] * h);
      const off = opts.stagger ? (k % 2 ? opts.stagger : -opts.stagger) : 0;
      const rot = style === "pol" ? (k % 2 ? 3 : -3) + (k % 3 === 2 ? 1.5 : 0) : 0;
      photo(s, n, x, top + Math.round((maxH - h) / 2) + off, w, h, style, style === "pol" ? "drop" : "up", (opts.d || .3) + k * .55, rot);
      x += w + gap;
    });
  }
  function photosSlide(s, names) {
    const n = names.length, v = variant++;
    if (n === 1) {
      blurBg(s, names[0]);
      const [w, h] = fit(ratio(names[0]), 1580, 920);
      photo(s, names[0], (W - w) / 2, (H - h) / 2, w, h, "frame", "zoom", .2);
      return;
    }
    if (n <= 3) {
      const pol = v % 3 === 2;
      row(s, names, pol ? 150 : 110, pol ? 760 : 860, pol ? 1640 : 1720, pol ? "pol" : "frame", { stagger: pol ? 0 : (n === 2 ? 34 : 22) });
      if (v % 2) dl(el(s, "a fade deco", v % 4 === 1 ? 40 : 1680, v % 4 === 1 ? 880 : 30, 200, 172, sprig(v % 4 !== 1)), 1.6);
      return;
    }
    // 4–6 ảnh: hai hàng, kiểu polaroid
    const a = names.slice(0, Math.ceil(n / 2)), b = names.slice(Math.ceil(n / 2));
    row(s, a, 45, 440, 1700, "pol", { d: .3 });
    row(s, b, 555, 440, 1700, "pol", { d: .3 + a.length * .55 });
  }

  /* ---------------- Slide có chữ ---------------- */
  const N = C.names;
  // ảnh bên trái/phải, trả về [x vùng chữ, rộng vùng chữ]
  function sidePhoto(s, name, side, maxW = 860) {
    const [w, h] = fit(ratio(name), maxW, 900);
    const x = side === "left" ? 110 : W - 110 - w;
    if (name) photo(s, name, x, (H - h) / 2, w, h, "frame", "wipeU", .3);
    const tx = side === "left" ? x + w + 60 : 80, tw = side === "left" ? W - tx - 80 : x - 140;
    return [tx, tw];
  }
  const TEXT = {
    names(s, c) {
      const [tx, tw] = sidePhoto(s, c.photo, "left");
      dl(el(s, "a fade label", tx, 250, tw, null, c.label || "Lễ thành hôn", { textAlign: "center" }), 1);
      dl(el(s, "a up vn-names", tx, 300, tw, null, N.groom, { fontSize: "140px", textAlign: "center" }), 1.5);
      dl(el(s, "a fade vn-names", tx, 450, tw, null, "&amp;", { fontSize: "90px", textAlign: "center", color: "var(--blue-deep)" }), 2.1);
      dl(el(s, "a up vn-names", tx, 540, tw, null, N.bride, { fontSize: "140px", textAlign: "center" }), 2.5);
      dl(el(s, "a fade num", tx, 760, tw, null, c.date || C.weddingDate || "", { fontSize: "46px", textAlign: "center", letterSpacing: ".12em" }), 3.2);
      dl(el(s, "a fade deco", W - 260, 850, 190, 165, sprig()), 3.4);
    },
    days(s, c) {
      const [tx, tw] = sidePhoto(s, c.photo, "left", 820);
      const v = loveSpan();
      dl(el(s, "a zoom deco", tx + tw / 2 - 40, 110, 80, 74, heart), .8);
      dl(el(s, "a fade", tx, 210, tw, null, `<span class="cnt" data-to="${v.total}">0</span> days in love`, { fontFamily: "var(--sans)", fontWeight: 600, fontSize: "60px", letterSpacing: ".04em", textAlign: "center", textTransform: "uppercase" }), 1);
      dl(el(s, "a fade para", tx, 300, tw, null, "từ " + fmtDate(C.loveStart), { fontSize: "38px", textAlign: "center", color: "var(--ink-soft)" }), 1.4);
      [[v.y, "năm"], [v.m, "tháng"], [v.w, "tuần"], [v.d, "ngày"]].forEach(([n, u], k) => {
        dl(el(s, "a up", tx + tw / 2 - 190, 390 + k * 140, 420, null,
          `<span class="cnt num" data-to="${n}" style="font-size:104px;font-weight:500;line-height:1;display:inline-block;width:150px;text-align:right">0</span><span style="font-family:var(--sans);font-size:38px;margin-left:26px">${u}</span>`), 2 + k * .4);
      });
    },
    happy(s, c) {
      const [tx, tw] = sidePhoto(s, c.photo, "right");
      dl(el(s, "a grow vline", tx + tw / 2, 0, null, 200), .8, 1.4);
      const [html, end] = typed(c.text || "Ngày mình nắm tay nhau và trao nhẫn cưới là ngày chúng ta bắt đầu một gia đình nhỏ.", 1.4, .035);
      el(s, "para", tx + 40, 290, tw - 80, null, html, { fontSize: "44px", textAlign: "center" });
      dl(el(s, "a up names", tx, 560, tw, null, "Happy<br>Wedding", { fontSize: "150px", textAlign: "center", lineHeight: ".95" }), Math.min(end, 4.5) + .3, 1.8);
      dl(el(s, "a zoom deco", tx + tw / 2 - 65, 920, 130, 90, rings), Math.min(end, 4.5) + 1.2);
    },
    thanks(s, c) {
      const [tx, tw] = sidePhoto(s, c.photo, "right");
      dl(el(s, "a up hand", tx, 290, tw, null, c.title || "Cảm ơn", { fontSize: "210px", textAlign: "center" }), .8, 2);
      dl(el(s, "a growX hline", tx + tw / 2 - 150, 600, 300, null), 2);
      dl(el(s, "a fade para", tx + 40, 650, tw - 80, null, c.text || "Sự hiện diện của quý vị<br>là món quà ý nghĩa nhất", { fontSize: "48px", textAlign: "center", lineHeight: "1.45" }), 2.5);
      dl(el(s, "a fade deco", 60, 40, 200, 172, sprig()), 2);
    },
  };

  /* ---------------- Days in love ---------------- */
  const parseDate = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const fmtDate = s => s.split("-").reverse().join(".");
  function loveSpan() {
    const a = parseDate(C.loveStart), b = C.loveUntil ? parseDate(C.loveUntil) : new Date(); b.setHours(0, 0, 0, 0);
    const total = Math.round((b - a) / 864e5);
    let y = b.getFullYear() - a.getFullYear(), m = b.getMonth() - a.getMonth(), d = b.getDate() - a.getDate();
    if (d < 0) { m--; d += new Date(b.getFullYear(), b.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    return { total, y, m, w: Math.floor(d / 7), d: d % 7 };
  }
  function countUp(slide) {
    slide.querySelectorAll(".cnt").forEach((e, k) => {
      const to = +e.dataset.to, fmt = n => n.toLocaleString("vi-VN");
      if (MAU) { e.textContent = fmt(to); return; }
      const t0 = performance.now() + (k ? 2000 + (k - 1) * 400 : 1000), dur = 1600;
      const tick = now => { const p = Math.min(Math.max((now - t0) / dur, 0), 1); e.textContent = fmt(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1 && slide.isConnected) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
  }

  /* ---------------- Từ danh sách → các slide ---------------- */
  function plan(part, single) {
    const out = [], keep = n => MAU || has(n);
    let run = [];
    const flush = () => {
      const L = run.map(n => ratio(n) > 1.05);
      let i = 0;
      while (i < run.length) {
        let take = 1;
        if (single) take = 1;
        else if (!L[i]) {                                   // ảnh dọc
          let k = 0; while (i + k < run.length && !L[i + k]) k++;
          take = k >= 5 || k === 3 ? 3 : k >= 2 ? 2 : (i + 1 < run.length ? 2 : 1);
        } else if (i + 1 < run.length) take = 2;       // ảnh ngang: đi đôi
        out.push({ photos: run.slice(i, i + take) });
        i += take;
      }
      run = [];
    };
    part.photos.forEach(it => {
      if (typeof it === "string") { if (keep(it)) run.push(it); return; }
      flush();
      if (Array.isArray(it)) { const ps = it.filter(keep); if (ps.length) out.push({ photos: ps.slice(0, 6) }); }
      else if (it && it.slide) out.push(Object.assign({}, it, { photo: it.photo && keep(it.photo) ? it.photo : null }));
    });
    flush();
    out.forEach(sl => sl.weight = sl.slide ? 1.3 : 1 + .25 * (sl.photos.length - 1));
    return out;
  }
  function build(sl) {
    const s = $("section", "slide");
    if (sl.slide && TEXT[sl.slide]) TEXT[sl.slide](s, sl); else photosSlide(s, sl.photos);
    return s;
  }

  /* ---------------- Tải ảnh, âm thanh ---------------- */
  function loadPhotos(onProgress) {
    const names = new Set([C.cover]);
    C.parts.forEach(p => p.photos.forEach(it => { if (typeof it === "string") names.add(it); else if (Array.isArray(it)) it.forEach(n => names.add(n)); else if (it && it.photo) names.add(it.photo); }));
    const list = [...names]; let count = 0;
    return Promise.all(list.map(n => new Promise(res => {
      const im = new Image(); let done = false;
      const fin = ok => { if (done) return; done = true; info[n] = { ok, r: ok ? im.naturalWidth / im.naturalHeight : 1.5 }; count++; onProgress && onProgress(count / list.length); res(); };
      im.onload = () => fin(true); im.onerror = () => fin(false); setTimeout(() => fin(false), 30000);
      im.src = url(n);
    })));
  }
  function loadAudio(part) {
    return new Promise(res => {
      if (!part.audio) return res(null);
      const a = new Audio(); a.preload = "auto"; let done = false;
      const fin = ok => { if (done) return; done = true; res(ok && isFinite(a.duration) && a.duration > 1 ? a : null); };
      a.addEventListener("loadedmetadata", () => fin(true)); a.addEventListener("error", () => fin(false)); setTimeout(() => fin(false), 15000);
      a.src = part.audio; a.volume = part.volume ?? 1;
    });
  }
  // gán thời điểm bắt đầu cho từng slide theo độ dài âm thanh
  function timeline(slides, audio) {
    const total = audio ? audio.duration : slides.length * C.secondsIfNoAudio;
    const sum = slides.reduce((a, s) => a + s.weight, 0);
    let t = 0; slides.forEach(s => { s.start = t; s.len = total * s.weight / sum; t += s.len; });
    return total;
  }

  /* ---------------- Chế độ xem khung (?mau) ---------------- */
  function renderMau(parts) {
    document.body.classList.add("mau");
    const sheet = $("div", "sheet");
    const all = Object.keys(info).length, ok = Object.values(info).filter(i => i.ok).length;
    sheet.appendChild($("h1", "", `Khung trình chiếu · có ${ok}/${all} ảnh
      <small>Ô gạch chéo = ảnh ghi trong slides.js nhưng chưa có trong thư mục photos (kiểm tra lại tên file). Ảnh nào cũng hiện trọn, không bị cắt.<br>
      Mở lại trang không có ?mau để chiếu.</small>`));
    parts.forEach((p, pi) => {
      const dur = p.audio ? Math.round(p.audio.duration) : null;
      sheet.appendChild($("h1", "part", `Phần ${pi + 1}: ${p.name} · ${p.slides.length} slide · ${dur ? `âm thanh ${Math.floor(dur / 60)}:${String(dur % 60).padStart(2, "0")} → khoảng ${(dur / p.slides.length).toFixed(1)} giây/slide` : `<span class="warn">chưa có file âm thanh ${p.def.audio}</span>`}`));
      p.slides.forEach((sl, k) => {
        const it = $("div", "item");
        it.appendChild($("h2", "", `Slide ${k + 1} · ${sl.slide ? "chữ: " + sl.slide : sl.photos.length + " ảnh"} · ${(sl.slide ? [sl.photo || "(không ảnh)"] : sl.photos).join(", ")}`));
        const box = $("div", "box"), st = $("div", "stage static"), s = build(sl);
        s.classList.add("shown", "play"); st.appendChild(s); box.appendChild(st); it.appendChild(box); sheet.appendChild(it); countUp(s);
      });
    });
    document.body.appendChild(sheet);
  }

  /* ---------------- Trình chiếu ---------------- */
  function run(parts, cover, wantStart) {
    const stage = $("div", "stage"); document.body.appendChild(stage);
    const fitStage = () => stage.style.setProperty("--scale", Math.min(innerWidth / W, innerHeight / H));
    addEventListener("resize", fitStage); fitStage();
    const hud = $("div", "hud"); document.body.appendChild(hud);
    let hudT; const showHud = m => { hud.textContent = m; hud.classList.add("show"); clearTimeout(hudT); hudT = setTimeout(() => paused || hud.classList.remove("show"), 1800); };


    let pi = -1, si = -1, cur = null, paused = false, clock = 0, last = 0, started = false, muted = false;
    const P = () => parts[pi];
    const now = () => (P().audio ? P().audio.currentTime : clock);

    function show(k) {
      si = k;
      const s = build(P().slides[k]); stage.appendChild(s); void s.offsetWidth; s.classList.add("play", "shown"); countUp(s);
      const old = cur; cur = s; if (old) { old.classList.remove("shown"); setTimeout(() => old.remove(), FADE * 1000 + 300); }
    }
    function startPart(k, at = 0) {
      parts.forEach(p => p.audio && p.audio.pause());
      pi = (k + parts.length) % parts.length; si = -1; clock = at;
      const a = P().audio;
      if (a) { a.currentTime = at; a.muted = muted; if (!paused) a.play().catch(() => {}); }
    }
    function tick(ts) {
      const dt = last ? (ts - last) / 1000 : 0; last = ts;
      if (started && !paused) {
        const p = P();
        if (!p.audio) clock += dt;
        const t = now();
        if ((p.audio && p.audio.ended) || t >= p.total - .05) startPart(pi + 1);
        else {
          let k = 0; while (k + 1 < p.slides.length && p.slides[k + 1].start <= t) k++;
          if (k !== si) show(k);
        }
      }
      requestAnimationFrame(tick);
    }
    function jump(dir) {
      let k = si + dir, p = pi;
      if (k >= P().slides.length) { startPart(pi + 1); return; }
      if (k < 0) { p = pi - 1; startPart(p); k = P().slides.length - 1; }
      const t = P().slides[k].start + .05; clock = t; if (P().audio) P().audio.currentTime = t; show(k);
    }
    function togglePause() {
      paused = !paused; stage.classList.toggle("paused", paused);
      const a = P().audio; if (a) paused ? a.pause() : a.play().catch(() => {});
      showHud(paused ? `Tạm dừng · ${P().name} · slide ${si + 1}/${P().slides.length}` : "Tiếp tục");
    }
    function begin() {
      if (started) return; started = true;
      cover.classList.add("gone"); setTimeout(() => cover.remove(), 1500);
      document.documentElement.requestFullscreen?.().catch(() => {});
      startPart(0);
    }
    cover.onclick = begin;
    addEventListener("keydown", e => {
      if (!started) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); begin(); } return; }
      if (e.key === " ") { e.preventDefault(); togglePause(); }
      else if (e.key === "ArrowRight" || e.key === "PageDown") jump(1);
      else if (e.key === "ArrowLeft" || e.key === "PageUp") jump(-1);
      else if (e.key === "f" || e.key === "F") (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {});
      else if (e.key === "m" || e.key === "M") { muted = !muted; parts.forEach(p => p.audio && (p.audio.muted = muted)); showHud(muted ? "Đã tắt tiếng" : "Đã bật tiếng"); }
    });
    let mt; addEventListener("mousemove", () => { document.body.classList.remove("hide-cursor"); clearTimeout(mt); mt = setTimeout(() => document.body.classList.add("hide-cursor"), 2500); });
    // ?part=2&slide=5 : vào thẳng (dùng khi kiểm tra)
    const qp = location.search.match(/[?&]part=(\d+)/), qs = location.search.match(/[?&]slide=(\d+)/);
    if (qp || qs) { cover.remove(); started = true; startPart((qp ? +qp[1] : 1) - 1); const k = Math.min((qs ? +qs[1] : 1) - 1, P().slides.length - 1); clock = P().slides[k].start + .05; if (P().audio) P().audio.currentTime = clock; }
    requestAnimationFrame(tick);
    if (wantStart) begin();
  }

  /* ---------------- Khởi động ---------------- */
  // màn hình mở đầu hiện NGAY, ảnh và nhạc tải ngầm phía sau (thanh mảnh dưới đáy = tiến độ tải)
  let cover = null, wantStart = false;
  if (!MAU) {
    cover = $("div", "cover");
    cover.innerHTML = `<div class="cv-names"><span>${C.names.groom}</span><i>&amp;</i><span>${C.names.bride}</span></div><div class="cv-bar"><i></i></div>`;
    const ci = new Image(); ci.onload = () => cover.style.backgroundImage = `url("${ci.src}")`; ci.src = url(C.cover);
    document.body.appendChild(cover);
    // bấm khi chưa tải xong: ghi nhận, tải xong tự chạy
    cover.onclick = () => { wantStart = true; cover.classList.add("waiting"); };
    addEventListener("keydown", e => { if (!cover.isConnected || cover.dataset.ready) return; if (e.key === "Enter" || e.key === " ") { e.preventDefault(); cover.onclick(); } });
  }
  const bar = cover && cover.querySelector(".cv-bar i");
  Promise.all([loadPhotos(p => bar && (bar.style.width = (p * 100).toFixed(1) + "%")), Promise.all(C.parts.map(loadAudio))]).then(([, audios]) => {
    const parts = C.parts.map((def, i) => {
      let slides = plan(def); const audio = audios[i];
      // phần có ít ảnh mà âm thanh dài (vd. voice nhà thờ): mỗi slide 1 ảnh cho đỡ đứng lâu
      if (audio && audio.duration / slides.length > 10) slides = plan(def, true);
      return { def, name: def.name, slides, audio, total: timeline(slides, audio) };
    }).filter(p => p.slides.length);
    if (MAU) return renderMau(parts);
    if (!parts.length) { cover && cover.remove(); fail("Không tìm thấy ảnh nào trong danh sách. Mở trang với <code>?mau</code> để kiểm tra tên file."); return; }
    cover.dataset.ready = "1"; cover.classList.add("ready");
    run(parts, cover, wantStart);
  });
})();
