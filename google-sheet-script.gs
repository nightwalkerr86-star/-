/**
 * Reasey fortune game → Google Sheet
 *
 * Setup (once):
 * 1. Create a new Google Sheet (e.g. "Reasey players").
 * 2. In the sheet: Extensions → Apps Script. Delete what's there and paste this whole file. Save.
 * 3. Deploy → New deployment → type "Web app".
 *      Execute as: Me
 *      Who has access: Anyone
 *    Click Deploy, allow access, and copy the "Web app URL" (ends in /exec).
 * 4. Put that URL in index.html:  const SHEET_URL = 'https://script.google.com/macros/s/…/exec';
 *
 * Each player who ticks the consent box becomes one new row.
 */

const COLUMNS = [
  'time', 'lang', 'who', 'name',
  'birth_typed', 'calendar', 'leap_month', 'birth_date',
  'birth_time', 'birth_place', 'gender',
  'relationship', 'work',
  'zodiac', 'weekday', 'page'
];

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);          // header row the first time

  let data = {};
  try { data = JSON.parse(e.postData.contents || '{}'); } catch (err) {}

  const clean = v => String(v == null ? '' : v).replace(/^[=+\-@]/, "'$&").slice(0, 200);   // no formulas, no huge values
  sheet.appendRow(COLUMNS.map(c => c === 'time' ? new Date() : clean(data[c])));

  return ContentService.createTextOutput('ok');
}

function doGet() {
  return ContentService.createTextOutput('Reasey sheet is ready');
}
