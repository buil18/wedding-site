/* =========================================================
   envelope.js: chạm phong bì / TAP TO OPEN → hiệu ứng mở → Invitation
   ========================================================= */
(function () {
  "use strict";

  const home = document.querySelector(".home");
  if (!home) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let opening = false;

  function open(e) {
    e.preventDefault();
    if (opening) return;
    opening = true;
    const S = window.SITE;
    const target = S.pageUrl("invitation");
    // Bấm chạm = thao tác của người dùng → bật nhạc ngay, rồi báo trang sau tự cuộn
    if (S.music) S.music.start();
    if (S.autoscroll) S.autoscroll.arm();
    const leave = () => (S.go ? S.go(target, { instant: true }) : (location.href = target));
    if (reduce) {
      leave();
      return;
    }
    home.classList.add("is-opening");
    setTimeout(leave, 1100);
  }

  home.querySelectorAll("[data-open]").forEach((el) => el.addEventListener("click", open));

  // Quay lại bằng nút Back: trả phong bì về trạng thái đóng
  window.addEventListener("pageshow", () => {
    opening = false;
    home.classList.remove("is-opening");
  });
})();
