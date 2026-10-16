/* =========================================================
   rsvp.js: kiểm tra và gửi biểu mẫu RSVP
   - Chưa có SITE_CONFIG.rsvpEndpoint: chỉ kiểm tra, báo "chưa kết nối".
   - Có endpoint (Apps Script Web App): gửi POST dạng form.
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

  function validate() {
    let ok = true;
    form.querySelectorAll(".field").forEach((field) => {
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
      const data = new URLSearchParams(new FormData(form));
      data.append("submittedAt", new Date().toISOString());
      await fetch(endpoint, { method: "POST", mode: "no-cors", body: data });
      form.reset();
      setStatus("Thank you! Your response has been received.");
    } catch (err) {
      setStatus("Something went wrong. Please try again.", true);
    } finally {
      button.disabled = false;
    }
  });
})();
