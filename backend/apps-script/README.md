# Backend RSVP (Google Apps Script) — chưa làm

Giai đoạn 1 chỉ có giao diện biểu mẫu. Khi nối:
1. Viết `Code.gs` với hàm `doPost(e)` ghi các trường `name`, `attending`, `entree`, `email`, `submittedAt` vào Google Sheet.
2. Deploy dạng Web App (Execute as: Me, Who has access: Anyone).
3. Dán URL Web App vào `rsvpEndpoint` trong `site/assets/js/config.js`.

`site/assets/js/rsvp.js` đã sẵn sàng gửi POST dạng form (`mode: "no-cors"`) khi có `rsvpEndpoint`.
Phần danh sách khách / link riêng từng khách (sheet "Wedding-plan") để giai đoạn sau.
