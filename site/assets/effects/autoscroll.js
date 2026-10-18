/* =========================================================
   autoscroll.js: tự cuộn trang sau khi bấm TAP TO OPEN
   Cấu hình trong config.js > autoScroll: { enabled, speed (px/giây), delay (ms) }
   - Dừng ngay khi người xem chạm / lăn chuột / bấm phím / bấm chuột.
   - Dừng khi tới cuối trang. Tôn trọng "giảm chuyển động" của hệ thống.
   ========================================================= */
(function () {
  "use strict";
  const S = window.SITE;
  if (!S || S.autoscroll) return;
  const cfg = Object.assign({ enabled: true, speed: 45, delay: 1600 }, (window.SITE_CONFIG || {}).autoScroll);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const KEY = "autoscrollArm";

  let timer = 0;
  let raf = 0;

  function stop() {
    clearTimeout(timer);
    cancelAnimationFrame(raf);
    timer = raf = 0;
    ["wheel", "touchstart", "keydown", "mousedown", "pointerdown"].forEach((t) =>
      window.removeEventListener(t, stop, true)
    );
  }

  function run() {
    ["wheel", "touchstart", "keydown", "mousedown", "pointerdown"].forEach((t) =>
      window.addEventListener(t, stop, { capture: true, passive: true })
    );
    let last = performance.now();
    let pos = window.scrollY;
    (function step(now) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      // Người xem tự cuộn (kéo thanh cuộn…): dừng
      if (Math.abs(window.scrollY - pos) > 3) return stop();
      pos = Math.min(max, pos + ((now - last) / 1000) * cfg.speed);
      last = now;
      window.scrollTo(0, pos);
      if (pos >= max - 1) return stop();
      raf = requestAnimationFrame(step);
    })(last);
  }

  function begin() {
    stop();
    if (!cfg.enabled || reduce.matches) return;
    timer = setTimeout(run, cfg.delay);
  }

  // Gọi trước khi chuyển trang: trang kế tiếp sẽ tự cuộn
  function arm() {
    try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
  }

  function consume() {
    let on = false;
    try {
      on = sessionStorage.getItem(KEY) === "1";
      sessionStorage.removeItem(KEY);
    } catch (e) {}
    if (on) begin();
    else stop();
  }

  S.autoscroll = { arm, stop };
  S.hooks.push(consume);
  consume(); // trang đầu tiên sau khi tải lại (chế độ mở file trực tiếp)
})();
