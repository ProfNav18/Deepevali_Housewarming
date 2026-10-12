/**
 * RSVP & Wishes — Deepavali Open House & Housewarming
 * ---------------------------------------------------
 * 1. Create a new Google Sheet > Extensions > Apps Script.
 * 2. Delete the starter code, paste this file, Save.
 * 3. Deploy > New deployment > Type: Web app
 *      Execute as: Me
 *      Who has access: Anyone
 * 4. Copy the Web App URL (ends with /exec) into js/config.js -> rsvpApiUrl.
 *
 * Every RSVP is added as one row in the "RSVP" tab.
 * To download as Excel: File > Download > Microsoft Excel (.xlsx).
 * To hide an unsuitable wish, delete that row in the Sheet.
 */

var TAB = 'RSVP';
var HEADER = ['Timestamp', 'Name', 'Phone', 'Attendance', 'Guests', 'Vegetarian', 'Non-Vegetarian', 'Wishes'];

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(TAB);
  if (!sh) {
    sh = ss.insertSheet(TAB);
    sh.appendRow(HEADER);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADER.length).setFontWeight('bold');
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Prevent formula injection when text starts with = + - @
function clean_(s, max) {
  s = String(s == null ? '' : s).trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
function unquote_(s) { return String(s).replace(/^'/, ''); }

// Public read: guest and meal totals + wishes (phone numbers are never returned)
function doGet() {
  var rows = sheet_().getDataRange().getValues().slice(1);
  var attending = 0, notAttending = 0, veg = 0, nonVeg = 0, wishes = [];
  rows.forEach(function (r) {
    if (r[3] === 'Attending') {
      attending += Number(r[4]) || 1;
      veg += Number(r[5]) || 0;
      nonVeg += Number(r[6]) || 0;
    } else if (r[3] === 'Not Attending') notAttending += 1;
    var w = unquote_(r[7]).trim();
    if (w) wishes.push({ name: unquote_(r[1]), wish: w });
  });
  wishes.reverse(); // newest first
  return json_({ ok: true, attending: attending, notAttending: notAttending, veg: veg, nonVeg: nonVeg, wishes: wishes });
}

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var name = clean_(d.name, 60);
    var attendance = d.attending === 'Attending' || d.attending === 'Not Attending' ? d.attending : '';
    if (!name || !attendance) return json_({ ok: false, error: 'Name and attendance are required' });
    var guests = attendance === 'Attending' ? Math.min(Math.max(parseInt(d.pax, 10) || 1, 1), 20) : 0;
    var veg = Math.min(Math.max(parseInt(d.veg, 10) || 0, 0), guests);
    var nonVeg = Math.min(Math.max(parseInt(d.nonveg, 10) || 0, 0), guests - veg);
    var phone = clean_(d.phone, 20);
    var wishes = clean_(d.wishes, 300);

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      sheet_().appendRow([new Date(), name, phone, attendance, guests, veg, nonVeg, wishes]);
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}
