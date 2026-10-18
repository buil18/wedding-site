# RSVP của website cưới → Google Sheet

Website gửi form tới Web App `…/exec` (đã điền sẵn trong `site/assets/js/config.js` → `rsvpEndpoint`).
Web App này đang phục vụ dự án thiệp cũ, nên ta **thêm** một bộ xử lý riêng, không sửa logic cũ.

## Cài (làm một lần, ~3 phút)
1. Mở Apps Script của Web App đó (Extensions → Apps Script từ Google Sheet).
2. Tạo file mới `RsvpWeb.gs` → dán toàn bộ nội dung file `RsvpWeb.gs` trong thư mục này.
3. Mở `doPost` cũ, ngay sau dòng đã parse JSON thành `data`, thêm đúng 1 dòng:
   ```js
   if (isRsvpWebRequest_(data)) return handleRsvpWeb_(data);
   ```
   Ví dụ:
   ```js
   function doPost(e) {
     const data = JSON.parse(e.postData.contents);
     if (isRsvpWebRequest_(data)) return handleRsvpWeb_(data);   // ← thêm dòng này
     ... (code cũ giữ nguyên) ...
   }
   ```
4. Chạy thử `testRsvpWeb` một lần (cấp quyền nếu được hỏi) → tab **RSVP Nhung Loi** xuất hiện (nhớ xóa dòng Test).
5. **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy.**
   Giữ nguyên deployment cũ để link `/exec` không đổi.

## Cách hoạt động
- Website gửi JSON `{project:"nhung-loi-site", name, attending, side, guests, hp, submittedAt}`.
- Chỉ request có `project:"nhung-loi-site"` mới vào tab mới; request của dự án cũ đi đường cũ.
- `hp` là ô bẫy thư rác (ẩn); có giá trị thì bỏ qua.
- Trình duyệt gửi kiểu `no-cors` nên website không đọc được phản hồi; xem kết quả trong Google Sheet.

## Các cột trong tab "RSVP Nhung Loi"
Thời gian | Họ tên | Tham dự (Có/Không) | Khách của (Cô dâu/Chú rể) | Số người (1-5, báo vắng = 0)

Nếu tab đã tạo từ bản trước (cột Món ăn / Email): script tự đổi tiêu đề cột; xóa các dòng Test cũ.
Mỗi lần sửa `RsvpWeb.gs` phải Deploy → Manage deployments → Edit → New version thì web mới nhận bản sửa.
