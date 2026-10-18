/* =========================================================
   rsvp.js: kiểm tra và gửi biểu mẫu RSVP
   - Chưa có SITE_CONFIG.rsvpEndpoint: chỉ kiểm tra, báo "chưa kết nối".
   - Có endpoint (Apps Script Web App): gửi POST JSON (text/plain).
   ========================================================= */
(function () {
  "use strict";

  const form = document.getElementById("rsvp-form");
  if (!form) return;

  const status = form.querySelector(".f-status");
  const button = form.querySelector(".f-submit");
  const endpoint = (window.SITE_CONFIG || {}).rsvpEndpoint;

  function setStatus(text, isError) {
    status.textContent = text;
    status.classList.toggle("is-error", !!isError);
  }

  const guestsField = document.getElementById("rsvp-guests");
  guestsField.classList.add("is-off"); // chưa chọn "tham dự" thì làm mờ, chọn "tham dự" mới bắt buộc

  // Chỉ hỏi số người khi khách báo sẽ tham dự
  function syncGuests() {
    const yes = (form.querySelector('input[name="attending"]:checked') || {}).value === "yes";
    guestsField.classList.toggle("is-off", !yes);
    guestsField.classList.remove("is-invalid");
    if (!yes) guestsField.querySelectorAll("input").forEach((i) => (i.checked = false));
  }
  form.addEventListener("change", (e) => {
    if (e.target.name === "attending") syncGuests();
  });

  function validate() {
    let ok = true;
    form.querySelectorAll(".field").forEach((field) => {
      if (field.classList.contains("is-off")) return;
      const inputs = [...field.querySelectorAll("input")];
      const valid = inputs[0].type === "radio" ? inputs.some((i) => i.checked) : inputs[0].checkValidity();
      field.classList.toggle("is-invalid", !valid);
      if (!valid) ok = false;
    });
    return ok;
  }

  form.addEventListener("change", () => {
    if (form.querySelector(".is-invalid")) validate();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) {
      setStatus("Please complete all required fields.", true);
      return;
    }

    if (!endpoint) {
      setStatus("Thank you! (Form preview only, not connected yet.)");
      return;
    }

    button.disabled = true;
    setStatus("Sending…");
    try {
      const fd = new FormData(form);
      const payload = {
        project: "nhung-loi-site", // để Apps Script nhận biết đây là biểu mẫu của website cưới
        name: String(fd.get("name") || "").trim(),
        attending: fd.get("attending") || "",
        side: fd.get("side") || "", // "bride" | "groom"
        guests: fd.get("attending") === "yes" ? Number(fd.get("guests") || 0) : 0, // 1-5, báo vắng = 0
        hp: String(fd.get("hp") || ""),
        submittedAt: new Date().toISOString(),
      };
      // text/plain + no-cors: không bị chặn CORS, Apps Script đọc được qua e.postData.contents
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      form.reset();
      syncGuests();
      setStatus("Thank you! Your response has been received.");
    } catch (err) {
      setStatus("Something went wrong. Please try again.", true);
    } finally {
      button.disabled = false;
    }
  });
})();
