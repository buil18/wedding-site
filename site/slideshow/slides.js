/* =========================================================
   slides.js: NỘI DUNG TRÌNH CHIẾU (file bạn chỉnh)
   ---------------------------------------------------------
   ẢNH: chép vào  site/slideshow/photos/  rồi ghi đúng TÊN FILE vào danh sách bên dưới.
        Thứ tự trong danh sách = thứ tự chiếu. Muốn đổi thứ tự: chuyển dòng lên/xuống.
        Tên file phải ghi y hệt (cả chữ hoa/thường, dấu cách, đuôi .jpg).
        File nào chưa có trong thư mục thì tự bỏ qua.

   BỐ CỤC tự xếp theo ảnh ngang / dọc, KHÔNG cắt ảnh:
     "a.jpg"                     → máy tự ghép với ảnh bên cạnh cho đẹp
     ["a.jpg", "b.jpg"]          → ép các ảnh này chung một slide (2–6 ảnh)
     { slide: "...", ... }       → slide có chữ (xem cuối file)

   THỜI GIAN: mỗi phần chạy đúng bằng độ dài file âm thanh của phần đó,
   máy tự chia đều cho các slide. Hết phần cuối thì quay lại phần đầu.

   XEM KHUNG: mở /slideshow/?mau để xem tất cả slide và ảnh nào còn thiếu.
   ========================================================= */

window.SLIDESHOW = {
  names: { groom: "Tiến Lợi", bride: "Tuyết Nhung" },
  loveStart: "2019-06-15",      // ngày bắt đầu yêu (slide Days in love)
  loveUntil: "",                // để trống = tính tới ngày chiếu. Cố định thì ghi "2026-11-28"
  weddingDate: "28 · 11 · 2026", // ngày hiện dưới tên ở slide "names"
  cover: "cover.jpg",           // ảnh màn hình mở đầu (phủ kín màn hình, nên dùng ảnh ngang)
  photoFolder: "photos/",
  secondsIfNoAudio: 7,          // khi chưa có file âm thanh: mỗi slide chạy bao nhiêu giây

  parts: [
    /* ---------- PHẦN 1: NHÀ THỜ (đoạn voice, không nhạc nền) ---------- */
    {
      name: "Nhà thờ",
      audio: "music/voice.mp3",
      volume: 1,
      photos: [
        ["000038.JPG", "000039.JPG"],                     // chú rể, cô dâu trước nhà thờ (2 dọc)
        ["L&N_130.jpg", "L&N_135.jpg", "L&N_137.jpg"],    // cô dâu trong nhà thờ (3 dọc)
        ["L&N_145.jpg", "L&N_149.jpg"],                   // lối đi, hàng ghế (2 dọc)
        ["000005.JPG"],                                   // khoảnh khắc trùm voan, 1 ảnh lớn
        ["000003.JPG"],                                   // chụp chung trước bàn thờ (ngang), 1 ảnh lớn
        ["L&N_75.jpg"],                                   // gia đình trước bàn thờ, 1 ảnh lớn
      ],
    },

    /* ---------- PHẦN 2: LỄ CƯỚI (bài Mối duyên vàng) ---------- */
    {
      name: "Lễ cưới",
      audio: "music/moi-duyen-vang.mp3",
      volume: 0.85,
      photos: [
        { slide: "names", photo: "L&N_554.jpg" },

        // --- Cô dâu chuẩn bị ---
        ["L&N_138.jpg"],                                   // 1 ngang lớn
        ["L&N_148.jpg", "L&N_190.jpg"],                    // 2 dọc
        ["L&N_191.jpg", "L&N_191 (1).jpg"],                // 2 ngang
        ["L&N_198.jpg", "L&N_194.jpg", "L&N_195.jpg"],     // 3 dọc
        ["L&N_193.jpg", "L&N_221.jpg"],                    // 2 dọc
        ["000044.JPG", "000046.JPG"],                      // 2 ngang: cô dâu, phù dâu
        ["L&N_204.jpg"],                                   // 1 ngang lớn

        { slide: "days", photo: "L&N_555.jpg" },

        // --- Nhà trai đến ---
        ["L&N_240.jpg", "L&N_251.jpg"],                    // 2 ngang
        ["L&N_274.jpg", "L&N_279.jpg"],                    // 2 ngang
        ["L&N_303.jpg"],                                   // 1 ngang lớn
        ["L&N_318.jpg", "L&N_319.jpg"],                    // 2 ngang
        ["L&N_320.jpg", "L&N_321.jpg"],                    // 2 ngang
        ["L&N_322.jpg", "L&N_324.jpg"],                    // 2 ngang
        ["L&N_307.jpg"],                                   // 1 dọc lớn
        ["L&N_310.jpg", "L&N_313.jpg"],                    // 2 ngang
        ["L&N_325.jpg"],                                   // 1 ngang lớn
        ["L&N_348.jpg", "L&N_346.jpg"],                    // ngang + dọc
        ["L&N_355.jpg", "L&N_375.jpg"],                    // 2 dọc

        // --- Tráp (8 dọc) ---
        ["L&N_386.jpg", "L&N_387.jpg", "L&N_385.jpg"],     // 3 dọc
        ["L&N_384.jpg", "L&N_383.jpg", "L&N_381.jpg"],     // 3 dọc
        ["L&N_380.jpg", "L&N_379.jpg"],                    // 2 dọc

        // --- Lễ gia tiên ---
        ["000060.JPG"],                                    // 1 ngang lớn: phòng lễ
        ["L&N_404.jpg", "L&N_428.jpg"],                    // 2 dọc
        ["L&N_398.jpg", "L&N_397.jpg"],                    // 2 ngang
        ["L&N_411.jpg", "L&N_424.jpg"],                    // 2 ngang
        ["L&N_427.jpg", "L&N_434.jpg"],                    // 2 ngang
        ["L&N_458.jpg", "L&N_459.jpg"],                    // 2 ngang
        ["L&N_468.jpg", "L&N_470.jpg"],                    // 2 ngang
        ["L&N_471.jpg"],                                   // 1 ngang lớn
        ["L&N_472.jpg", "L&N_477.jpg"],                     // 2 dọc
        ["L&N_483.jpg", "L&N_364.jpg"],                    // 2 dọc
        ["000050.JPG", "L&N_554.jpg"],                     // 2 dọc: cô dâu chú rể
        ["000064.JPG"],                                    // 1 dọc lớn

        { slide: "happy", photo: "L&N_513.jpg" },

        // --- Bạn bè, kết ---
        ["L&N_496.jpg", "L&N_498.jpg"],                    // 2 ngang
        ["L&N_501.jpg"],                                   // 1 dọc lớn
        ["L&N_509.jpg", "L&N_510.jpg"],                    // 2 ngang
        ["L&N_561.jpg"],                                   // 1 ngang lớn

        { slide: "thanks", photo: "000058.JPG" },
      ],
    },
  ],
};

/* SLIDE CÓ CHỮ (mỗi loại 1 ảnh, ảnh nào cũng được, không bị cắt):
   { slide: "names",  photo: "..." }   tên cô dâu chú rể
   { slide: "days",   photo: "..." }   "… days in love", tính từ loveStart
   { slide: "happy",  photo: "..." }   "Happy Wedding"
   { slide: "thanks", photo: "..." }   "Cảm ơn"
   Có thể thêm chữ riêng: { slide: "happy", photo: "...", text: "Câu của bạn" } */
