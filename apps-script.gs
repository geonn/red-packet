/**
 * Apps Script: 把 POST 提交写入 Google Sheets
 * 使用方法：替换 SHEET_ID 与 SECRET，部署为 Web App（任何人可访问）
 */
var SHEET_ID = '1GnDFkKz0Lj8arc6JpD0khm9_-gJsi_z9TdW1Jyp6VYE';
var SECRET = '1GnDFkKz0Lj8arc6JpD0khm9_-gJsi_z9TdW1Jyp6VYE';

function doPost(e) {
  var result = { ok: false };
  try {
    var payload = {};
    try { payload = JSON.parse(e.postData.contents); } catch (err) { payload = e.parameter || {}; }
    if (!payload || payload.secret !== SECRET) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'Unauthorized' })).setMimeType(ContentService.MimeType.JSON);
    }
    var name = payload.name || '';
    var phone = payload.phone || '';
    var prize = payload.prize || 'RM10';
    var message = payload.message || '';

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName('entries');
    if (!sheet) {
      // 如果没有 sheet，则创建并写入表头
      sheet = ss.insertSheet('entries');
      sheet.appendRow(['timestamp','name','phone','prize','message']);
    }
    sheet.appendRow([new Date(), name, phone, prize, message]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message })).setMimeType(ContentService.MimeType.JSON);
  }
}
