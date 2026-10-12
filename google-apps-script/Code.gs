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
 * Every RSVP is added as one row in the "RSVP" tab. Columns J–K show live totals
 * (people attending, vegetarian, non-vegetarian, families attending / not attending).
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
    sh.getRange(1, 1, 1, HEADER.length).setValues([HEADER]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  ensureSummary_(sh);
  return sh;
}

// Totals in columns J–K, recalculated by the Sheet itself whenever a row is added
var SUMMARY = [
  ['Summary', 'Total'],
  ['Total people attending', '=SUMIF(D2:D,"Attending",E2:E)'],
  ['Vegetarian', '=SUMIF(D2:D,"Attending",F2:F)'],
  ['Non-vegetarian', '=SUMIF(D2:D,"Attending",G2:G)'],
  ['Families attending', '=COUNTIF(D2:D,"Attending")'],
  ['Families not attending', '=COUNTIF(D2:D,"Not Attending")']
];
function ensureSummary_(sh) {
  if (sh.getRange('J1').getValue() === 'Summary') return;
  var box = sh.getRange(1, 10, SUMMARY.length, 2);
  box.setValues(SUMMARY);
  box.setBorder(true, true, true, true, true, true);
  sh.getRange(1, 10, 1, 2).setFontWeight('bold').setBackground('#f6d27a');
  sh.getRange(2, 10, SUMMARY.length - 1, 1).setFontWeight('bold').setBackground('#fff3d6');
  sh.getRange(2, 11, SUMMARY.length - 1, 1).setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  sh.setColumnWidth(10, 190);
}

// Next empty row in the RSVP columns (A–H), ignoring the totals in J–K
function nextRow_(sh) {
  var colA = sh.getRange('A:A').getValues();
  var last = 0;
  for (var i = colA.length - 1; i >= 0; i--) { if (colA[i][0] !== '') { last = i + 1; break; } }
  return last + 1;
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
  var sh = sheet_();
  var count = nextRow_(sh) - 2;
  var rows = count > 0 ? sh.getRange(2, 1, count, HEADER.length).getValues() : [];
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
      var sh = sheet_();
      sh.getRange(nextRow_(sh), 1, 1, HEADER.length).setValues([[new Date(), name, phone, attendance, guests, veg, nonVeg, wishes]]);
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}
