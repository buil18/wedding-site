# Brief dựng web thiệp cưới 8 mục (bàn giao cho Claude Code)

Nguồn tham chiếu: https://solvacreativestudio.my.canva.site/dusty-blue-butter-yellow-digital-website-suite/
(template Canva của Solva Creative Studio). Mục tiêu giai đoạn 1: **dựng lại y nguyên** nội dung, font, bố cục. Sau đó người dùng tự chỉnh từng phần.

## 1. Nguyên tắc
- Giữ nguyên chữ gốc kể cả lỗi chính tả và các chỗ mâu thuẫn (xem mục 9). Chưa sửa gì.
- Dựng đủ 8 trang, đúng đường dẫn như gốc, có menu ☰ dùng chung.
- Ảnh và logo: tạm thời dùng nguyên ảnh gốc (mục 7), sẽ thay sau.
- Phần Google (RSVP): theo logic dự án thiệp cưới riêng của người dùng (mục 8), không dùng Google Form của template.
- Chạy trên GitHub Pages (site tĩnh), có thư mục frontend, backend (Apps Script), ảnh, hiệu ứng riêng.
- Người dùng muốn xem nội dung bằng văn bản trước, duyệt xong mới dựng file thật. Phần nội dung này đã được duyệt.

## 2. Cấu trúc trang
| # | Menu | Đường dẫn | Ghi chú |
|---|------|-----------|---------|
| 1 | Home | `/` | Phong bì, chạm để mở |
| 2 | Invitation | `/invitation` | Tấm thiệp viền hoa + 3 khối nhỏ |
| 3 | Welcome | `/welcome` | Hero, lời chào, RSVP, Gift Registry, FAQ |
| 4 | Our Story | `/our-story` | Câu chuyện + bộ ảnh |
| 5 | Details | `/details` | Lịch cuối tuần, địa điểm, dress code, menu, wedding party |
| 6 | Travel & Stay | `/travel--stay` | (hai dấu gạch ngang) |
| 7 | Registry | `/registry` | Logo cửa hàng, lời cảm ơn |
| 8 | RSVP | `/rsvp` | Biểu mẫu + FAQ |

- Menu: biểu tượng ☰ góc phải trên; mục đang mở in đậm (700). Chữ menu 15px, màu `#304254`.
- Chân trang chung: `04.15.2030` · monogram C / G · Claire & Graham · RETURN TO INVITE. Bản gốc còn dòng Terms & Support / Privacy Policy / Designed with Canva (của nền tảng Canva, nên bỏ hoặc thay).

## 3. Font (CHƯA XÁC NHẬN TÊN THẬT)
Canva đặt tên font theo mã băm, file là WOFF2 nén nên chưa đọc được tên gốc.
| Mã trong trang | Vai trò | Nơi dùng |
|----------------|---------|----------|
| `YAE7Qib2Fbc_0` | Chữ thư pháp (script) | Tiêu đề lớn, tên cô dâu chú rể, "The Details", "You're Invited", "Faq's", "Itinerary", "Wedding", "Dress Code", "Dinner Menu", "Our Story"... |
| `YAFdJtfMD6Y_0` | Serif, thường dùng chữ hoa giãn chữ | Menu, nhãn, giờ, ngày, danh sách, nội dung, FAQ |
| `YAGL3nGfe-U_0` | Serif đậm riêng | "Gift Registry" (400, 67px), "RSVP" (700, 53px) ở trang Welcome |
| `YAFcflbZSXg_0` | Font nút | "click here" 21px, "CLICK HERE" 24px, giãn chữ 3.5–4.75px |
| `YACgEXvxf8Q_0` | Chưa thấy chỗ dùng | Có tải ở trang Home, cần kiểm tra |

Việc cần làm: xác định tên font thật (xem mục 10). Trong lúc chờ dùng font tạm: script ≈ chữ thư pháp kiểu Bickham/Pinyon, serif ≈ Cormorant Garamond / EB Garamond.

Thang cỡ chữ (px, đo ở màn hình rộng 1232):
- Script: 107 (tên ở hero Welcome, "Faq's"), 100 ("You're Invited"), 86.7 (tiêu đề trang Details), 80 ("The Details" trên thiệp), 73.3 (Friday, Dinner Menu), 60 ("The"), 53 (tên trên thiệp, "Save the Date"), 47.6 ("&"), 41.8 (Appetizer / Main Course / Dessert, giãn 2.09), 40 ("Claire & Graham", "RSVP").
- Serif: 33.3 hoa (ngày, lh 46), 32 (ngày trên thiệp, giãn 6.4), 24 (nội dung, lh 38), 21.3 hoa (lịch trình, giãn 0.53), 21.3 đậm hoa (tên phù dâu rể), 18.7 (món ăn, lh 22), 12 (chữ nhỏ trên thiệp, giãn 2.14).
- Màu chữ: `#7FACDC` (xanh bụi) trên nền sáng; trắng trên ảnh; menu `#304254`; liên kết gốc Canva `#0000EE` (bỏ).

## 4. Bố cục từng trang (tóm tắt)
- **Home**: ảnh nền vải lanh xám, phong bì vàng bơ lót sọc trắng-vàng, dấu sáp ở giữa, thiệp viền hoa nhô lên, hoa và ảnh cặp đôi ở góc dưới phải. Chữ "TAP TO OPEN" (2 lớp), "YOU'RE INVITED TO THE WEDDING OF", "04. 16. 2030", "Claire and Graham".
- **Invitation**: thiệp viền hoa căn giữa, mọi chữ xanh bụi căn giữa theo thứ tự ở mục 6. Dưới thiệp: "The Details" (script 80px), "Save the Date 04.16.30", "RSVP" kèm nút CLICK HERE.
- **Welcome**: (1) hero ảnh toàn khung, monogram C/G góc trên, tên Claire & Graham chữ script 107px trắng, ngày 04.15.2030, nút RSVP HERE; (2) "You're Invited" + 3 đoạn + hoa trang trí + nút CLICK HERE; (3) RSVP; (4) Gift Registry; (5) Faq's gồm 6 mục, mỗi mục: số 24px, câu hỏi hoa 27px, câu trả lời 21px, tất cả căn giữa.
- **Our Story**: tiêu đề + dòng phụ, hai khối chữ (HOW WE MET, THE PROPOSAL) xen ảnh, cuối trang "Our Favorite Moments" là bộ ảnh (xếp lệch).
- **Details**: hero ảnh cặp đôi nền cây xanh, chữ trắng. Sau đó các khối: Friday / The Wedding / Itinerary (bốn mốc giờ cột trái, tên sự kiện cột phải) / The Venue (chữ trắng đè ảnh) / Dress Code / Dinner Menu (3 nhóm) / Wedding Party (2 cột Maid of Honor – Best Man, rồi Bridesmaids – Groomsmen).
- **Travel & Stay**: ảnh nền; Hotels (2 thẻ + nút BOOK HERE); Travel (sân bay + 2 nút BOOK HERE); Things to Do Nearby (4 nhóm: dining, lounges, explore, shopping) kèm hoa trang trí.
- **Registry**: ảnh nền; tiêu đề; dòng chỉ dẫn; hàng 4 logo cửa hàng (ảnh); lời cảm ơn; hai nút HOME và RSVP.
- **RSVP**: nền xanh nhạt, biểu mẫu ô bo tròn, nút gửi màu xanh `#7FACDC`, rồi FAQ.
- Responsive: bản gốc co lại thành bố cục điện thoại khi cửa sổ hẹp (menu ☰). Cần dựng cả hai.

## 5. Hiệu ứng
- Home: phong bì mở khi chạm rồi chuyển sang Invitation.
- Menu ☰ mở danh sách 8 mục. Các hiệu ứng khác chưa khảo sát kỹ (hover, cuộn), cần xem thêm khi dựng.

## 6. Nội dung gốc (giữ nguyên)

### Home
TAP TO OPEN / YOU'RE INVITED TO THE WEDDING OF / 04. 16. 2030 / Claire and Graham

### Invitation
Thiệp, từ trên xuống: TOGETHER / WITH THEIR FAMILIES / Claire Harrington / & / Graham Sullivan / INVITE YOU TO CELEBRATE / THEIR MARRIAGE / 04.16.30 / AT SIX IN THE EVENING / 123 ANYWHERE ST., ANY CITY, ST 12345
Dưới thiệp: The Details · Save the Date 04.16.30 · RSVP "Please kindly reply by March 01, 2025" · CLICK HERE

### Welcome
Hero: Claire & Graham · 04.15.2030 · RSVP HERE
**You're Invited**
We're so glad you're here. What began as a simple friendship grew into a love that has brought us to this beautiful moment.

Here you'll find all the details about our day, the celebration, the place, and the people who mean the most to us.

We can't wait to share our story and create new memories with you.

CLICK HERE
**RSVP** — PLEASE KINDLY REPLY BY MARCH 01, 2025 — CLICK HERE
**Gift Registry** — CLICK HERE
**Faq's** — xem FAQ bên dưới

### Our Story
**Our Story** — A LITTLE ABOUT US AND HOW WE GOT HERE.

**HOW WE MET**
We met one summer at a friend's lake house in Austin. It was one of those weekends full of people who barely know each other, too much food, and music playing a little too loud. Somehow, we ended up talking by the water most of the night and realized we had the same sense of humor.

After that, we kept in touch. First texts, then weekend visits, then road trips. Between the long drives, bad playlists, and takeout dinners, we just kind of became each other's person.

**THE PROPOSAL**
A few years later, we planned a weekend trip to Charleston. It wasn't meant to be anything special. Just time away, good food, and a little exploring.

One morning, we were walking through White Point Garden, and out of nowhere, he stopped, got quiet, and pulled out a ring. I think I said, "Wait, are you serious?" before I even said yes.

It was simple and perfect. No big crowd, no setup... just us. We grabbed breakfast right after and couldn't stop smiling the entire day.

**Our Favorite Moments** (bộ ảnh)

### Details
**The Weekend Details** — Everything you need to plan your stay and celebrate with us. — Claire & Graham

**Friday**: FRIDAY, APRIL 14 · 6:00 PM · Welcome Drinks · Hotel Valencia Riverwalk · Terrace Bar · Dress Code: Dress Casual

**The Wedding / Itinerary**: SATURDAY, OCTOBER 24
The celebration begins at The Greenhouse at Driftwood, followed by cocktails and dinner beneath the lights of the conservatory.
3:00 PM VOWS AND I DO'S · 4:00 PM COCKTAIL HOUR · 5:00 PM DINNER AND DANCING · 8:00 PM THE SEND-OFF

**The Venue**: 3:00 PM · Gran Paraiso Gardens · Savannah, Georgia

**Dress Code**: FORMAL GARDEN ELEGANCE
Think polished silhouettes, elevated fabrics, timeless glamour, and a touch of garden romance. A curated color palette will be shared closer to the date.

Portions of the event will take place on grass, so footwear that balances style and comfort is encouraged.

**Dinner Menu**
- Appetizer: Burrata with roasted cherry tomatoes, basil oil & grilled sourdough · Sparkling wine
- Main Course: Herb-crusted rack of lamb with red wine reduction · Truffle mashed potatoes · Roasted baby carrots with thyme and honey
- Dessert: Dark chocolate fondant with vanilla bean ice cream · Espresso or dessert wine

**Wedding Party**
We're so thankful for the people who've been part of our story from the start. The ones who've listened, celebrated, and shown up for every version of us.
- Maid of Honor: Emily Torres — My college roommate and best friend.
- Best Man: Michael Reed — Evan's cousin and partner in crime since forever.
- Bridesmaids: Olivia Harper, Jasmine Lee, Megan Cole
- Groomsmen: Ryan Brooks, Conner Hayes, Dylan Foster

### Travel & Stay
**Travel & Stay** — Hotel and travel info for your trip, plus a few favorites in the area.

**Hotels**: We;ve reserved a room block at the Hotel Valencia Riverwalk. Mention The Whitmore Wedding when booking. Each is within walking distance of local cafes, restaurants, and shops.
- The Thompson Hotel — Modern luxury stay, 10 minutes from the venue — BOOK HERE
- Hotel Contessa — Riverside suites with a rooftop bar — BOOK HERE

**Travel**: The easiest airport to fly into is the Austin Bergstorm Internation Airport (AUS), about 25 minutes from the venue. For guests arriving from out of state, the following options are also nearby:
- San Antonio International Airport (SAT) — Approx 1.5 hours by car — BOOK HERE
- Dallas/Fort Worth International Airport (DFW) — About a 3 hour drive — BOOK HERE

**Things to Do Nearby**
- dining: Juniper & Rye · Saffron House · The Garden Room · The Conservatory
- lounges: The Velvet Hour · The Copper Room · Bramble Lounge
- explore: Waterfront Promenade · Historic House Museum · Botanical Garden Trails · the historic distract & harbor walk
- shopping: Market Hall · The Artisan Row

### Registry
**Gift Registry** — Your presence at our wedding is the best gift. For those who'd like to bless us further, we've made it easy with a few registry options.
CLICK A LOGO TO VIEW OUR REGISTRY AT THAT STORE (hàng logo cửa hàng)
**Thank you!** — We can't wait to celebrate this unforgettable weekend with our favorite people. — HOME · RSVP

### RSVP
We can't wait to celebrate with you, and your presence means the world to us! Please kindly let us know if you will be able to celebrate with us by: **Rsvp** — March 01, 2030
Biểu mẫu:
- Will you be attending our wedding?* — Yes, I can't wait / Sadly, I can't make it
- Choice of entrée* — Meat / Seafood / Vegetarian
- Enter your email*
- Nút gửi (chưa thấy nhãn chữ)

### FAQ (ở Welcome và RSVP)
01 CAN I BRING A GUEST? — Please refer to your invitation for guest details.
02 ARE KIDS INVITED? — We love your little ones, but this will be an adults-only celebration.
03 WHAT'S THE DRESS CODE? — Formal or black-tie optional. See examples on the homepage for color inspiration.
04 WHAT SHOULD WE EXPECT WEATHER-WISE? — Early spring in Texas is warm and breezy — plan for comfort during the outdoor ceremony.
05 WILL TRANSPORTATION BE PROVIDED? — Yes! A shuttle will run from the host hotel to and from the venue for all main events.
06 IS THERE PARKING AT THE VENUE? — Yes — complimentary valet parking is available onsite for guests who prefer to drive.

## 7. Ảnh và logo (dùng tạm nguyên bản)
Địa chỉ ảnh: `https://solvacreativestudio.my.canva.site/dusty-blue-butter-yellow-digital-website-suite/_assets/media/<tên file>` (đường dẫn thư mục suy ra từ đường dẫn font `_assets/fonts/`, cần kiểm tra trước khi dùng). Có 4 ảnh PNG nhỏ không nằm trong `media/` (tên là mã UUID ở gốc site), cần lấy thêm từ trang Home và Welcome. Kích thước là kích thước hiển thị đo được.
- Home: nền `a3dbd0fb31aeebf5caa681a1a6bb08eb.jpg`; phong bì `e9da65d15aa85985cc4c5d4886e4a94e.png`; `cb0a3edd0dd2e483628374b64033568f.png`
- Invitation: nền `000125b7dcf9c923fd9f5feafb6a55f3.jpg`; thiệp và hoa `8b32b2f60ac8ee667db2d45eb30ac836.png`, `fe52c40d297014b4d0bbca423632f387.png`, `6110d472713846520436bc24580bc131.png` (3103×2069, nền lớn); ảnh cặp đôi `62e217d6ba2ef1a7493381e9e5ff3d33.jpg`, `61ea4697d271d608590efef30a4ec133.jpg`; dấu sáp `1a073f3576d77c2576e7863ac387ff4a.png`; còn lại là hoa trang trí PNG
- Welcome: hero `e810a2f06163df4366164dac47d1cb06.jpg`, `7511548bcb06854c815c59f97901f07c.jpg`; hoa `a116087922...`, `9a022556dbe...`, `649f8f8d798...`, `5d01717f28b...`; ảnh `2a405fe44682408dfebcad88a3694423.jpg`; `9c8a825b087272bd0649e594cf39f64c.png` (268×209, biểu tượng RSVP)
- Our Story: `2a405fe44682408dfebcad88a3694423.jpg`, `db4b3b8b02d09d64ee886de60cb33692.jpg`, `69a8698b00e27953591d63ea218e22aa.jpg`, `9cff4e30c0cd02b3bf0f33538bcaafb1.jpg`, `d97f37717a8d7691b45a467278ae97b2.jpg`, `d24e873d4f89b531b68860be9ff64af0.jpg`, `1080428c8ece1b952a867ef77db8879d.jpg`, `fafb6fcbcc620d08b965480218d749c1.jpg`, `e7145a71bbe56d3b84f9fbf046d4e07c.jpg`
- Details: hero `cba3b25bde8d40531a8c25a6e6c8fd18.jpg`; `ba900e6ceeebccfe586cf18cc067285f.jpg`; `8cb9461bbd16527777afb0c23cb966be.png` (nền, dùng chung với RSVP); venue `9fc9c3f7a138c18b06c6f241d8fb6945.jpg`
- Travel & Stay: ảnh `9eced80e751487065134c97338e7b277.jpg`, `cde1798d64390c0e73edb9c28cd1e78a.jpg`, `c3836953f08b48c501f17284d6981c21.jpg`; hoa dùng chung với Our Story
- Registry: nền `000125b7...jpg`; ảnh `d97f37717a8d7691b45a467278ae97b2.jpg`; logo cửa hàng `cbaa4512d9b57350fa15450724d6edd8.png`, `e2de1ce48724bcdd729b19fc16c72350.png`, `cf829fa7af330af3dee04093044db3c3.png`, `bedf1b6aeedafd27cacc96e87d631c38.png`; `9c8a825b087272bd0649e594cf39f64c.png`
- RSVP: nền `8cb9461bbd16527777afb0c23cb966be.png`

Ảnh và logo thuộc tác giả template, chỉ dùng tạm trong lúc dựng khung, sẽ thay bằng ảnh của người dùng (thư mục ảnh tự upload sau).

## 8. Phần Google (RSVP) theo dự án thiệp cưới của người dùng
- Không dùng Google Form của template (`forms.gle/kqaeY2rdFnaVWxLL6`, link của tác giả).
- RSVP ghi vào Google Sheet qua Google Apps Script (backend); web chạy GitHub Pages (tài khoản `buil18`, kho `loinhung2026` đã dùng cho thiệp chính).
- Danh sách khách ở Google Sheet "Wedding-plan": cột Khách và cột Đối tượng quyết định cách ghi trên thiệp; link riêng cho từng khách.
- Cần chốt khi dựng: các trường biểu mẫu mẫu (Will you be attending, Choice of entrée, Email) giữ nguyên ở giai đoạn 1, nối vào Apps Script sau.

## 9. Mâu thuẫn và lỗi trong bản gốc (giữ nguyên, chỉnh sau)
- Ngày: 04.16.2030 (Home, Invitation) / 04.15.2030 (chân trang) / April 14 và October 24 (Details). Hạn trả lời: March 01, 2025 (Welcome, Invitation) / March 01, 2030 (RSVP).
- Địa điểm: Savannah, Georgia (Details) / Austin, Texas (Our Story, Travel, FAQ).
- Tên: "The Whitmore Wedding" (Travel), "Evan's cousin" (Wedding Party).
- Lỗi chính tả: We;ve, Bergstorm Internation, distract.

## 10. Việc còn mở
1. Tên font thật của 4–5 mã ở mục 3 (chưa xác định). Cách làm: mở bản thiết kế gốc trên Canva để xem tên font, hoặc giải mã tên từ 5 file WOFF2 của trang. Đây là template của tác giả khác, không nằm trong tài khoản Canva của người dùng.
2. Khảo sát hiệu ứng (phong bì mở, hover, cuộn) trước khi dựng.
3. Xác nhận đường dẫn ảnh `_assets/media/` và lấy 4 ảnh UUID.
4. Bản thu nhỏ theo điện thoại: đo lại ở độ rộng 390px khi dựng.

## 11. Quyết định đã chốt (2026-10-16), ưu tiên hơn các mục trên
- **Bỏ hẳn** trang Travel & Stay và Registry, bỏ logo cửa hàng, bỏ khối Gift Registry ở Welcome. Còn 6 trang.
- Chạy cục bộ (VS Code Live Server hoặc `node tools/serve.js`), **chưa triển khai GitHub**.
- Ảnh: dùng link trực tiếp tới ảnh gốc (`config.js` → `imgBase`), không lưu bản sao; thay sau bằng `imgOverride`.
- Font (thay cho mục 3): script = Alex Brush (dự phòng Great Vibes); nhãn hoa giãn chữ / tiêu đề mục / thứ-tháng / tên buổi lễ / nhãn đếm ngược = Montserrat; ngày, giờ, số = Cormorant (số đứng thẳng); đoạn văn, địa chỉ, ô nhập, nút = Noto Serif.
- Invitation: "click here" dưới RSVP → /rsvp; "click here" dưới The Details → /welcome. RETURN TO INVITE → /invitation.
- Chân trang: bỏ Terms/Privacy/Designed with Canva; thay bằng dòng "Designed by Tiến Lợi".
- FAQ tĩnh. RSVP: chỉ giao diện, nút "SUBMIT"; Apps Script nối sau. Link riêng từng khách: chưa làm.

## 12. Kết quả khảo sát bản gốc (bổ sung cho brief)
- Màn rộng: menu là thanh ngang; ☰ chỉ ở màn hẹp. Bản gốc thu nhỏ đều toàn bộ bố cục khi màn < 920px.
- Home: nền ảnh hoa cẩm tú cầu (không phải vải lanh), phong bì vàng có 4 con tem; bản gốc không có hiệu ứng mở, chỉ chuyển trang (hiệu ứng phong bì hiện tại là thêm mới).
- Welcome và RSVP có **bộ đếm ngược** (ngày/giờ/phút/giây), Welcome trên ảnh, RSVP trên nền sọc vàng.
- Details có bản đồ Google nhúng cạnh ảnh venue, và 6 ô màu dress code.
- Biểu mẫu RSVP gốc có thêm ô "Your Full Name(s):*".
- Ảnh UUID (3 con tem, mã QR) là ảnh tạo động, không lấy được → đang dùng ô giữ chỗ.
- Font gốc thứ 5 (`YACgEXvxf8Q_0`) dùng cho chữ RETURN TO INVITE.
