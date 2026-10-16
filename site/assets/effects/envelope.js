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
    const target = window.SITE.pageUrl("invitation");
    if (reduce) {
      location.href = target;
      return;
    }
    home.classList.add("is-opening");
    setTimeout(() => (location.href = target), 1100);
  }

  home.querySelectorAll("[data-open]").forEach((el) => el.addEventListener("click", open));

  // Quay lại bằng nút Back: trả phong bì về trạng thái đóng
  window.addEventListener("pageshow", () => {
    opening = false;
    home.classList.remove("is-opening");
  });
})();
