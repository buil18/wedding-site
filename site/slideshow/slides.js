/* =========================================================
   slides.js: NỘI DUNG TRÌNH CHIẾU (file bạn chỉnh)
   ---------------------------------------------------------
   THÊM ẢNH: chép ảnh vào  site/slideshow/photos/  đặt tên theo số ô (15.jpg, 16.jpg ... 50.jpg).
   Không cần sửa code. Slide nào chưa đủ ảnh thì tự bỏ qua, đủ ảnh là tự hiện.

   XEM KHUNG MẪU: mở  /slideshow/?mau  để thấy tất cả slide, ô nào còn trống,
   ô nào hợp ảnh dọc / ngang / vuông.

   Mỗi slide gồm:
     layout : kiểu bố cục (xem danh sách ở cuối file)
     photos : các số ảnh dùng trong slide, theo thứ tự ô trên màn hình
     text / title / ... : chữ trên slide (sửa thoải mái)
     seconds: thời gian hiện slide (giây), bỏ trống thì lấy mặc định
   ========================================================= */

window.SLIDESHOW = {
  // ---- Cài đặt chung ----
  names: { first: "Tien Loi", second: "Tuyet Nhung", short: "Loi & Nhung" }, // chữ viết tay không có dấu (giống thiệp)
  loveStart: "2019-06-15",      // ngày bắt đầu yêu, dùng cho slide "Days in love"
  loveUntil: "",                // để trống = tính tới hôm nay (ngày chiếu). Muốn cố định: "2026-11-14"
  defaultSeconds: 11,           // thời gian mặc định mỗi slide
  music: "../music/song.mp3",   // nhạc nền, phát lặp lại. Để "" nếu không cần nhạc
  musicVolume: 0.7,             // 0 → 1
  photoFolder: "photos/",       // thư mục ảnh
  photoExt: ".jpg",             // đuôi ảnh (tất cả ảnh cùng một đuôi)
  photoFocus: {
    // Phần ảnh được giữ khi ảnh bị cắt cho vừa khung: "ngang dọc" (0% = trái/trên, 50% = giữa).
    // Mặc định "50% 30%" (giữ phần trên, có mặt người). Ví dụ riêng ảnh 7 lấy thấp hơn:
    // "07": "50% 60%",
    "04": "50% 45%",
    "09": "50% 35%",
  },

  // ---- Danh sách slide (chạy từ trên xuống, hết thì quay lại từ đầu) ----
  slides: [
    // 1. Mở đầu: ảnh vòm cung + tên
    { layout: "opening", photos: ["01"], seconds: 13,
      label: "Trân trọng chào đón",
      text: "Cảm ơn quý vị đã dành thời gian đến chung vui cùng gia đình chúng con trong ngày hạnh phúc này." },

    // 2-3. Chú rể, cô dâu
    { layout: "groom", photos: ["02"], label: "Con là chú rể" },
    { layout: "bride", photos: ["03"], label: "Con là cô dâu" },

    // 4. Ảnh ngang lớn + câu chữ hoa + đôi nhẫn
    { layout: "bigday", photos: ["04"],
      text: "Và hôm nay là ngày trọng đại nhất<br>của vợ chồng chúng con" },

    // 5. Một ảnh lớn có viền
    { layout: "full", photos: ["05"] },

    // 6. Đoạn chữ + 3 ảnh dọc
    { layout: "trio", photos: ["06", "07", "08"], seconds: 13,
      text: "Sau những năm tháng yêu thương và tìm hiểu, chúng con đã chính thức về chung một nhà, trong sự chúc phúc của gia đình, họ hàng hai bên và bạn bè." },

    // 7. Days in love (tự tính từ loveStart)
    { layout: "days", photos: ["09"], seconds: 12 },

    // 8
    { layout: "full", photos: ["10"] },

    // 9. Ảnh polaroid rơi xuống (4 ảnh)
    { layout: "scrapbook", photos: ["11", "12", "13", "14"], seconds: 13,
      title: "Những ngày bên nhau" },

    // ===== Từ đây là ô chờ ảnh của bạn (15 → 50) =====

    // 10. Câu viết tay + 2 polaroid
    { layout: "pair", photos: ["15", "16"], seconds: 12,
      text: "Có những ngày bình thường bỗng trở nên đáng nhớ, chỉ vì có nhau." },

    // 11
    { layout: "full", photos: ["17"] },

    // 12. Hai ảnh dọc so le
    { layout: "duo", photos: ["18", "19"] },

    // 13. 1 ảnh lớn + 4 ảnh nhỏ
    { layout: "mosaic", photos: ["20", "21", "22", "23", "24"], seconds: 13 },

    // 14
    { layout: "full", photos: ["25"] },

    // 15
    { layout: "trio", photos: ["26", "27", "28"], seconds: 13,
      text: "Cảm ơn bố mẹ đã luôn yêu thương, nuôi dưỡng và ở bên chúng con trên mọi chặng đường." },

    // 16. Polaroid rơi xuống (6 ảnh)
    { layout: "scrapbook", photos: ["29", "30", "31", "32", "33", "34"], seconds: 14,
      title: "Và còn nhiều kỷ niệm nữa" },

    // 17
    { layout: "full", photos: ["35"] },

    // 18
    { layout: "duo", photos: ["36", "37"] },

    // 19
    { layout: "mosaic", photos: ["38", "39", "40", "41", "42"], seconds: 13 },

    // 20
    { layout: "pair", photos: ["43", "44"], seconds: 12,
      text: "Từ hôm nay, mọi con đường phía trước mình sẽ cùng nhau đi." },

    // 21. Ảnh | chữ | ảnh  + "Happy Wedding"
    { layout: "happy", photos: ["45", "46"], seconds: 13,
      text: "Ngày mình nắm tay nhau và trao nhẫn cưới là ngày chúng ta bắt đầu một gia đình nhỏ." },

    // 22. Lời chúc phúc
    { layout: "blessing", photos: ["47", "48", "49"], seconds: 13,
      title: "Lời chúc phúc", text: "của tất cả mọi người" },

    // 23. Kết thúc (ảnh 50 không bắt buộc: chưa có ảnh vẫn hiện chữ)
    { layout: "ending", photos: ["50"], optional: true, seconds: 12,
      title: "Cảm ơn", text: "Chúc quý vị một buổi tiệc thật vui và ấm áp" },
  ],
};

/* Các kiểu bố cục (layout) và số ảnh:
   opening  1 ảnh dọc (khung vòm)        groom / bride  1 ảnh dọc
   bigday   1 ảnh ngang                  full     1 ảnh bất kỳ (hiện trọn ảnh, có viền)
   trio     3 ảnh dọc + đoạn chữ         days     1 ảnh (khung trái tim, cắt gần vuông)
   scrapbook 2–6 ảnh (polaroid vuông)    pair     2 ảnh (polaroid) + câu viết tay
   duo      2 ảnh dọc                    mosaic   5 ảnh: 1 dọc lớn + 4 nhỏ
   happy    2 ảnh dọc + chữ giữa         blessing 3 ảnh: 2 nhỏ + 1 dọc cao
   ending   1 ảnh dọc (không bắt buộc)
   Muốn thêm slide: chép một dòng có sẵn, đổi số ảnh (ví dụ "51"), dán vào chỗ muốn chèn. */
 