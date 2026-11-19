const HEADERS = ['Registered at','Name','Reading for','Birth date','Calendar','Birth time','Birthplace','Gender','Relationship','Work','Zodiac','Born on','Language'];

const LABEL = {
  who: { self:'Myself', partner:'Partner', family:'Family', friend:'Friend' },
  gender: { m:'Male', f:'Female' },
  relationship: { single:'Single', crush:'Has a crush', dating:'In a relationship', breakup:'Just broke up', married:'Married' },
  work: { student:'Student', seeking:'Looking for work', employed:'Employed', business:'Own business', freelance:'Freelancer', none:'Not working' },
  lang: { km:'Khmer', zh:'Chinese' },
  weekday: { Sun:'Sunday', Mon:'Monday', Tue:'Tuesday', Wed:'Wednesday', Thu:'Thursday', Fri:'Friday', Sat:'Saturday' },
  zodiac: { 'ជូត':'Rat','ឆ្លូវ':'Ox','ខាល':'Tiger','ថោះ':'Rabbit','រោង':'Dragon','ម្សាញ់':'Snake','មមី':'Horse','មមែ':'Goat','វក':'Monkey','រកា':'Rooster','ច':'Dog','កុរ':'Pig' }
};
const RED = '#5a1212', GOLD = '#f6c686', BAND = '#fbf3e6';

function doPost(e) {
  const sheet = dataSheet_();
  let d = {};
  try { d = JSON.parse(e.postData.contents || '{}'); } catch (err) {}
  const t = v => String(v == null ? '' : v).replace(/^[=+\-@]/, "'$&").slice(0, 120);
  const pick = (map, v) => map[v] || t(v);
  const zod = LABEL.zodiac[d.zodiac] ? LABEL.zodiac[d.zodiac] + ' (' + d.zodiac + ')' : t(d.zodiac);
  const cal = d.calendar === 'lunar' ? ('Lunar' + (d.leap_month ? ' (leap month)' : '') + ' — typed ' + t(d.birth_typed)) : 'Solar';
  sheet.appendRow([
    new Date(), t(d.name), pick(LABEL.who, d.who), t(d.birth_date), cal,
    d.birth_time === 'unknown' ? "Doesn't know" : t(d.birth_time), t(d.birth_place),
    pick(LABEL.gender, d.gender), pick(LABEL.relationship, d.relationship), pick(LABEL.work, d.work),
    zod, pick(LABEL.weekday, d.weekday), pick(LABEL.lang, d.lang)
  ]);
  return ContentService.createTextOutput('ok');
}

function doGet() { return ContentService.createTextOutput('Reasey sheet is ready'); }

/* Run this ONCE from the editor (choose "setupSheet" next to Run, then click Run). */
function setupSheet() {
  const sheet = dataSheet_();
  sheet.clear(); sheet.setName('Players');
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
    .setBackground(RED).setFontColor(GOLD).setFontWeight('bold').setFontSize(11)
    .setVerticalAlignment('middle').setHorizontalAlignment('center');
  sheet.setRowHeight(1, 34); sheet.setFrozenRows(1);
  [160,170,110,110,150,110,150,90,140,140,130,110,90].forEach((w, i) => sheet.setColumnWidth(i + 1, w));
  sheet.getRange('A2:A').setNumberFormat('dd mmm yyyy, hh:mm');
  sheet.getRange('A2:M').setVerticalAlignment('middle').setFontSize(10);
  sheet.getBandings().forEach(b => b.remove());
  sheet.getRange(1, 1, 1000, HEADERS.length).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false)
    .setHeaderRowColor(RED).setFirstRowColor('#ffffff').setSecondRowColor(BAND);
  if (sheet.getFilter()) sheet.getFilter().remove();
  sheet.getRange(1, 1, 1000, HEADERS.length).createFilter();
  const extra = sheet.getMaxColumns() - HEADERS.length;
  if (extra > 0) sheet.deleteColumns(HEADERS.length + 1, extra);
  summary_();
}

function dataSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName('Players') || ss.getSheets()[0];
}

function summary_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const s = ss.getSheetByName('Summary') || ss.insertSheet('Summary');
  s.clear();
  s.getRange('A1').setValue('Reasey — Player summary').setFontSize(16).setFontWeight('bold').setFontColor(RED);
  s.getRange('A3:B5').setValues([
    ['Total players', '=COUNTA(Players!B2:B)'],
    ['Registered today', '=COUNTIFS(Players!A2:A,">="&TODAY())'],
    ['Last 7 days', '=COUNTIFS(Players!A2:A,">="&(TODAY()-6))']
  ]);
  s.getRange('A3:A5').setFontWeight('bold'); s.getRange('B3:B5').setFontSize(13).setFontWeight('bold').setFontColor(RED);
  const blocks = [['By zodiac','K'],['By relationship','I'],['By work','J'],['By gender','H'],['By language','M'],['Reading for','C']];
  let col = 1, row = 8;
  blocks.forEach(([title, c], i) => {
    const r = row, k = col;
    s.getRange(r, k, 1, 2).setValues([[title, 'Players']]).setBackground(RED).setFontColor(GOLD).setFontWeight('bold');
    s.getRange(r + 1, k).setFormula('=IFERROR(QUERY(Players!' + c + '2:' + c + ',"select ' + c + ', count(' + c + ') where ' + c + ' is not null group by ' + c + ' order by count(' + c + ') desc label count(' + c + ') \'\'",0),"—")');
    col += 3; if (i % 3 === 2) { col = 1; row += 16; }
  });
  [1,4,7].forEach(c => { s.setColumnWidth(c, 170); s.setColumnWidth(c + 1, 80); s.setColumnWidth(c + 2, 30); });
  s.setFrozenRows(1);
}
