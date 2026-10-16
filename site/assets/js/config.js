/* =========================================================
   config.js: các giá trị hay phải sửa, gom về một chỗ
   ========================================================= */
window.SITE_CONFIG = {
  // Thời điểm đếm ngược tới (giờ địa phương). Bản gốc: 04.16.2030, "at six in the evening".
  weddingDate: "2026-11-14T09:00:00",

  // Ảnh tạm: lấy trực tiếp từ trang mẫu gốc (không lưu bản sao trong dự án).
  imgBase:
    "https://solvacreativestudio.my.canva.site/dusty-blue-butter-yellow-digital-website-suite/_assets/media/",

  // Thay ảnh: thêm dòng "tên-file-gốc": "đường dẫn ảnh của bạn" (tính từ thư mục site/).
  // Ví dụ: "e810a2f06163df4366164dac47d1cb06.jpg": "assets/img/own/hero.jpg",
  imgOverride: {},

  // Địa chỉ Web App của Google Apps Script (để trống: biểu mẫu RSVP chỉ có giao diện).
  rsvpEndpoint: "",
};
