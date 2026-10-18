/**
 * RsvpWeb.gs — nhận biểu mẫu RSVP của WEBSITE CƯỚI (Tuyết Nhung & Tiến Lợi)
 * ---------------------------------------------------------------------------
 * Dùng chung Web App /exec với dự án thiệp trước, KHÔNG làm hỏng dự án đó:
 * website cưới gửi JSON có  "project": "nhung-loi-site",  nên chỉ cần 1 dòng
 * định tuyến ở đầu doPost cũ (xem README.md cùng thư mục).
 *
 * Dữ liệu ghi vào một tab riêng tên  "RSVP Nhung Loi"  (tự tạo nếu chưa có),
 * trong cùng file Google Sheet mà script đang dùng.
 */

const RSVPWEB_PROJECT = 'nhung-loi-site';
const RSVPWEB_SHEET_NAME = 'RSVP Nhung Loi';
const RSVPWEB_TZ = 'Asia/Ho_Chi_Minh';
const RSVPWEB_HEADERS = ['Thời gian', 'Họ tên', 'Tham dự', 'Khách của', 'Số người'];

/** Gọi từ doPost cũ:  if (isRsvpWebRequest_(data)) return handleRsvpWeb_(data); */
function isRsvpWebRequest_(data) {
  return !!data && data.project === RSVPWEB_PROJECT;
}

function handleRsvpWeb_(data) {
  // Ô bẫy thư rác: bot điền vào thì bỏ qua nhưng vẫn trả "ok"
  if (data.hp) return rsvpWebJson_({ ok: true });

  const name = rsvpWebClean_(data.name, 120);
  const attending = data.attending === 'yes' ? 'Có' : data.attending === 'no' ? 'Không' : '';
  const side = data.side === 'bride' ? 'Cô dâu' : data.side === 'groom' ? 'Chú rể' : '';
  // Báo vắng: 0 người. Báo tham dự: bắt buộc 1-5.
  let guests = attending === 'Có' ? parseInt(data.guests, 10) : 0;

  if (!name || !attending || !side || isNaN(guests) || guests < 0 || guests > 5 || (attending === 'Có' && guests < 1)) {
    return rsvpWebJson_({ ok: false, error: 'invalid' });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sheet = rsvpWebSheet_();
    sheet.appendRow([
      Utilities.formatDate(new Date(), RSVPWEB_TZ, 'yyyy-MM-dd HH:mm:ss'),
      name, attending, side, guests,
    ]);
  } finally {
    lock.releaseLock();
  }
  return rsvpWebJson_({ ok: true });
}

/** Tab riêng cho website cưới (tự tạo + tiêu đề cột) */
function rsvpWebSheet_() {
  // Nếu dự án cũ có hằng SHEET_ID thì dùng đúng file đó; không thì dùng file đang gắn với script
  const ss = (typeof SHEET_ID !== 'undefined' && SHEET_ID)
    ? SpreadsheetApp.openById(SHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(RSVPWEB_SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(RSVPWEB_SHEET_NAME);
    sh.setFrozenRows(1);
  }
  // Tab đã có từ bản cũ (cột Món ăn / Email): đổi tiêu đề sang cột mới
  const head = sh.getRange(1, 1, 1, RSVPWEB_HEADERS.length);
  if (head.getValues()[0].join('|') !== RSVPWEB_HEADERS.join('|')) {
    head.setValues([RSVPWEB_HEADERS]).setFontWeight('bold');
  }
  return sh;
}

function rsvpWebClean_(v, max) {
  let s = String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max);
  // Chặn công thức Sheet (=, +, -, @ ở đầu ô)
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function rsvpWebJson_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Chạy tay 1 lần trong trình soạn thảo để kiểm tra quyền + tạo tab (không cần Web App) */
function testRsvpWeb() {
  handleRsvpWeb_({ project: RSVPWEB_PROJECT, name: 'Test', attending: 'yes', side: 'bride', guests: 2 });
}
