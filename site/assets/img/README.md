# Ảnh

Ảnh cưới của bạn nằm trong `own/` (đã cắt đúng tỉ lệ từng khung, thu nhỏ còn khoảng 100–200 KB/ảnh).
Các ảnh trang trí (phong bì, hoa, thẻ, dấu sáp, nền vải lanh, nền sọc vàng, khung thực đơn, vòng hoa monogram)
vẫn lấy từ trang mẫu gốc qua `imgBase` trong `site/assets/js/config.js`.

## Bảng ảnh đã thay (khóa trong `imgOverride` → file trong `own/` → ảnh gốc DSCF)
| Vị trí | File | Ảnh gốc |
|---|---|---|
| Welcome: ảnh lớn đầu trang | welcome-hero.jpg | DSCF4646 |
| Welcome: ảnh oval | welcome-oval.jpg | DSCF4974 |
| Welcome: nền đếm ngược | welcome-countdown.jpg | DSCF5735 |
| Our Story: ảnh oval | story-oval.jpg | DSCF4970 |
| Our Story: bộ ảnh 1–8 | story-1…8.jpg | 5583, 4904, 5703, 5137, 5401, 5155, 5626, 4736 |
| Invitation: 2 ảnh nhỏ | inv-photo-1/2.jpg | DSCF4686, DSCF4701 |
| Details: ảnh lớn đầu trang | details-hero.jpg | DSCF5449 |
| Details: khối Friday | details-friday.jpg | DSCF5547 |
| Details: Venue | details-venue.jpg | DSCF5674 |
| Chân trang (mọi trang) | footer-bg.jpg | DSCF4736 |
| Nền Home + Dinner Menu | teal-bg.jpg | DSCF5735 (vùng nền) |

## Đổi ảnh khác
1. Chép ảnh mới vào `own/` (cùng tỉ lệ khung càng tốt), hoặc ghi đè file cùng tên.
2. Muốn đổi sang tên khác: sửa dòng tương ứng trong `imgOverride` (`config.js`).
3. Mở lại web, bấm Ctrl+F5.

Còn là ô giữ chỗ (ảnh gốc tạo động): 3 con tem ở Home, mã QR ở Invitation và Welcome.
