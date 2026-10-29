

Site tĩnh gồm 4 trang: Home, Invitation, Details, RSVP.

## Chạy thử trên máy
Chọn một trong hai cách:
- **VS Code + Live Server**: bấm "Go Live" (đã cấu hình thư mục gốc là `site/` trong `.vscode/settings.json`).
- **Node**: `node tools/serve.js` rồi mở http://localhost:5500

Không mở trực tiếp file `.html` bằng trình duyệt (`file://`), vì các liên kết dạng `/invitation/` cần máy chủ.

## Cấu trúc
```
site/                     ← toàn bộ web (sau này đưa lên GitHub Pages)
  index.html              Home (phong bì, chạm để mở)
  invitation/ welcome/ our-story/ details/ rsvp/
  assets/css/base.css     màu, font, hệ toạ độ co giãn, menu, chân trang, đếm ngược
  assets/css/rsvp.css     biểu mẫu RSVP
  assets/js/config.js     ngày cưới, ảnh thay thế, địa chỉ Apps Script
  assets/js/site.js       menu, chân trang, FAQ, đếm ngược (dùng chung)
  assets/js/rsvp.js       kiểm tra + gửi biểu mẫu
  assets/effects/         hiệu ứng phong bì ở Home
  assets/img/             hướng dẫn thay ảnh (README.md)
backend/apps-script/      (để dành) Google Apps Script cho RSVP
tools/serve.js            máy chủ xem thử
```

## Cách bố cục hoạt động
Mỗi phần tử đặt theo toạ độ đo ở bản gốc (màn rộng 1232px), ví dụ
`style="--x:446;--y:746;--w:336;--fs:50"`: `--x/--y` là góc trên trái, `--w/--h` kích thước,
`--fs` cỡ chữ, `--lh` dòng, `--ls` giãn chữ. Màn nhỏ hơn 920px tự thu nhỏ theo tỉ lệ
(giống bản gốc Canva trên điện thoại). Sửa vị trí/cỡ chữ: đổi các số này.

Ảnh có khung cắt: `<div class="el box crop" style="--x;--y;--w;--h">` (khung) chứa
`<img style="--ix;--iy;--iw;--ih">` (vị trí ảnh bên trong khung).

## Font
| Vai trò | Font |
|---|---|
| Tên, tiêu đề thư pháp | Alex Brush (dự phòng Great Vibes) |
| Nhãn chữ hoa giãn chữ, tiêu đề mục, thứ/tháng, nhãn đếm ngược | Montserrat |
| Ngày, giờ, số đếm ngược | Cormorant (số đứng thẳng) |
| Đoạn văn, địa chỉ, ô nhập, nút | Noto Serif |
