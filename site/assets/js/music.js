/* =========================================================
   music.js: nút nhạc nổi ở mọi trang
   - Nguồn nhạc cấu hình trong config.js > music:
       youtubeId: "dQw4w9WgXcQ"   (ID hoặc cả link YouTube)  → phát ẩn, lặp lại
       file: "music/song.mp3"      (file trong thư mục site/music/) → dùng khi không có youtubeId, hoặc khi YouTube lỗi
   - SITE.music.start() được gọi khi bấm TAP TO OPEN (đó là thao tác chạm của người dùng nên trình duyệt cho phát).
   - Chuyển trang bằng site.js không tải lại, nên nhạc chạy liền mạch.
   ========================================================= */
(function () {
  "use strict";
  const S = window.SITE;
  if (!S || S.music) return;
  const cfg = (window.SITE_CONFIG || {}).music || {};
  const vol = typeof cfg.volume === "number" ? cfg.volume : 0.6;

  const m = String(cfg.youtubeId || "").match(/(?:v=|youtu\.be\/|embed\/|shorts\/)?([A-Za-z0-9_-]{11})(?:[?&#].*)?$/);
  const ytId = cfg.youtubeId && m ? m[1] : "";
  const file = cfg.file ? S.assetUrl(cfg.file) : "";

  let mode = ytId ? "yt" : file ? "audio" : "none";
  let wanted = false;
  let playing = false;
  let player = null;
  let ytReady = false;
  let audio = null;
  let missing = false;

  /* ---------- Nút ---------- */
  const btn = document.createElement("button");
  btn.id = "music-btn";
  btn.type = "button";
  btn.setAttribute("aria-label", "Bật / tắt nhạc");
  btn.innerHTML =
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="m-note"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>' +
    '<span class="m-bars" aria-hidden="true"><i></i><i></i><i></i></span><span class="m-slash" aria-hidden="true"></span>';
  const tip = document.createElement("div");
  tip.id = "music-tip";
  document.body.append(btn, tip);

  function say(text) {
    tip.textContent = text;
    tip.classList.add("show");
    clearTimeout(say.t);
    say.t = setTimeout(() => tip.classList.remove("show"), 3200);
  }

  function setPlaying(v) {
    playing = v;
    btn.classList.toggle("is-playing", v);
    btn.title = v ? "Tắt nhạc" : "Bật nhạc";
    try { sessionStorage.setItem("musicOn", v ? "1" : "0"); } catch (e) {}
  }
  setPlaying(false);

  /* ---------- Audio (file) ---------- */
  function ensureAudio() {
    if (audio || !file) return audio;
    audio = new Audio(file);
    audio.loop = true;
    audio.volume = vol;
    audio.preload = "auto";
    audio.addEventListener("playing", () => setPlaying(true));
    audio.addEventListener("pause", () => setPlaying(false));
    audio.addEventListener("error", () => {
      mode = "none";
      missing = true;
      if (wanted) say("Chưa có file nhạc trong thư mục site/music/");
      wanted = false;
      setPlaying(false);
    });
    return audio;
  }

  /* ---------- YouTube ---------- */
  function loadYT() {
    if (window.YT && window.YT.Player) return initYT();
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () {
      if (prev) prev();
      initYT();
    };
    const t = document.createElement("script");
    t.src = "https://www.youtube.com/iframe_api";
    t.async = true;
    t.onerror = fallback;
    document.head.appendChild(t);
  }

  function initYT() {
    if (player) return;
    const holder = document.createElement("div");
    holder.id = "yt-holder";
    document.body.appendChild(holder);
    const vars = { autoplay: 0, controls: 0, loop: 1, playlist: ytId, playsinline: 1, disablekb: 1, fs: 0, rel: 0, modestbranding: 1 };
    if (/^https?:$/.test(location.protocol)) vars.origin = location.origin;
    player = new window.YT.Player("yt-holder", {
      width: "200",
      height: "200",
      videoId: ytId,
      playerVars: vars,
      events: {
        onReady: () => {
          ytReady = true;
          try { player.setVolume(Math.round(vol * 100)); } catch (e) {}
          if (wanted) player.playVideo();
        },
        onStateChange: (e) => {
          const st = window.YT.PlayerState;
          if (e.data === st.PLAYING) setPlaying(true);
          else if (e.data === st.PAUSED) setPlaying(false);
          else if (e.data === st.ENDED) player.playVideo();
        },
        onError: fallback,
      },
    });
  }

  function fallback() {
    if (file) {
      mode = "audio";
      if (wanted) ensureAudio() && ensureAudio().play().catch(() => {});
    } else {
      mode = "none";
      wanted = false;
      setPlaying(false);
      say("Không phát được video YouTube này (kiểm tra ID hoặc cho phép nhúng)");
    }
  }

  /* ---------- Điều khiển ---------- */
  function play() {
    wanted = true;
    if (mode === "yt") {
      if (ytReady) player.playVideo();
    } else if (mode === "audio") {
      const a = ensureAudio();
      a && a.play().catch(() => setPlaying(false));
    } else {
      say(missing ? "Chưa có file nhạc trong thư mục site/music/" : "Chưa cấu hình nhạc: điền youtubeId hoặc đặt file vào site/music/ (xem config.js)");
    }
  }

  function pause() {
    wanted = false;
    if (mode === "yt" && ytReady) player.pauseVideo();
    if (audio) audio.pause();
    setPlaying(false);
  }

  btn.addEventListener("click", () => (playing || wanted ? pause() : play()));

  S.music = {
    start() { if (!playing) play(); },
    stop: pause,
    get playing() { return playing; },
  };

  if (mode === "yt") loadYT();
  else if (mode === "audio") ensureAudio();
})();
