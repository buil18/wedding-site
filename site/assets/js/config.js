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
  imgOverride: {
    "own-teal-bg.jpg": "assets/img/own/teal-bg.jpg",
    "own-welcome-hero.jpg": "assets/img/own/welcome-hero.jpg",
    "own-welcome-oval.jpg": "assets/img/own/welcome-oval.jpg",
    "own-welcome-countdown.jpg": "assets/img/own/welcome-countdown.jpg",
    "own-story-oval.jpg": "assets/img/own/story-oval.jpg",
    "own-story-1.jpg": "assets/img/own/story-1.jpg",
    "own-story-2.jpg": "assets/img/own/story-2.jpg",
    "own-story-3.jpg": "assets/img/own/story-3.jpg",
    "own-story-4.jpg": "assets/img/own/story-4.jpg",
    "own-story-5.jpg": "assets/img/own/story-5.jpg",
    "own-story-6.jpg": "assets/img/own/story-6.jpg",
    "own-story-7.jpg": "assets/img/own/story-7.jpg",
    "own-story-8.jpg": "assets/img/own/story-8.jpg",
    "own-inv-photo-1.jpg": "assets/img/own/inv-photo-1-fit.jpg",
    "own-inv-photo-2.jpg": "assets/img/own/inv-photo-2-fit.jpg",
    "own-details-hero.jpg": "assets/img/own/details-hero.jpg",
    "own-details-friday.jpg": "assets/img/own/details-friday.jpg",
    "own-details-venue.jpg": "assets/img/own/details-venue.jpg",
    "own-footer-bg.jpg": "assets/img/own/footer-bg.jpg",
  },

  // Chọn phần ảnh được giữ lại khi ảnh khác tỉ lệ với khung (ảnh luôn phủ kín khung, không bị trống).
  // "x% y%": 0% = mép trái/trên, 50% = giữa, 100% = mép phải/dưới.
  // defaultFocus áp cho mọi ảnh của bạn trong khung cắt; 25% dọc = giữ phần trên (có mặt người).
  defaultFocus: "50% 25%",
  // Riêng từng ảnh (tên khóa giống trong imgOverride). Ví dụ giữ nhiều phần dưới hơn:
  //   "own-story-5.jpg": "50% 60%",
  // Với ảnh nền (hero, đếm ngược, chân trang) mục này thay cho --py trong file HTML.
  imgFocus: {
    // Ảnh bầu dục "You're Invited": lấy nhiều phần dưới để không cắt chân
    "own-welcome-oval.jpg": "50% 82%",
    "own-welcome-oval.jpg": "50% 82%",
  "own-details-hero.jpg": "50% 0%",        // ảnh nền đầu trang (nếu bạn đã thêm)
  "own-details-friday.jpg": "50% 75%",    // thêm dòng này: lấy sát phần dưới, thấy chân
  },

  // Địa chỉ Web App của Google Apps Script (để trống: biểu mẫu RSVP chỉ có giao diện).
  rsvpEndpoint:
    "https://script.google.com/macros/s/AKfycbzJPhBvcm_tHePe3tY_QphEudCgpiezTFg_OrnQtBFPZ9nSdYyRl5ejW45Gq3QqS8PT/exec",

  // Nhạc nền (nút nhạc nổi ở mọi trang, tự phát khi bấm TAP TO OPEN).
  //  youtubeId: dán ID (11 ký tự sau "v=" trong link YouTube) hoặc cả link. Để "" nếu dùng file.
  //  file: nhạc đặt trong thư mục site/music/ (dùng khi không có youtubeId, hoặc khi YouTube không phát được).
  music: {
    youtubeId: "Y5VoCfbB6As",
    file: "music/song.mp3",
    volume: 0.6, // 0 → 1
  },

  // Tự cuộn trang sau khi bấm TAP TO OPEN. speed: px/giây, delay: chờ bao lâu (ms) sau khi vào trang.
  autoScroll: { enabled: true, speed: 45, delay: 1600 },
};
