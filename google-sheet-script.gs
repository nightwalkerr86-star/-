const HEADERS = ['Registered at / 登记时间','Name / 姓名','Reading for / 为谁算命','Birth date / 出生日期','Calendar / 历法','Birth time / 出生时间','Birthplace / 出生地','Gender / 性别','Relationship / 感情状况','Work / 工作','Zodiac / 生肖','Born on / 出生星期','Language / 语言'];

const LABEL = {
  who: { self:'Myself / 自己', partner:'Partner / 伴侣', family:'Family / 家人', friend:'Friend / 朋友' },
  gender: { m:'Male / 男', f:'Female / 女' },
  relationship: { single:'Single / 单身', crush:'Has a crush / 暗恋中', dating:'In a relationship / 恋爱中', breakup:'Just broke up / 刚分手', married:'Married / 已婚' },
  work: { student:'Student / 学生', seeking:'Looking for work / 找工作', employed:'Employed / 上班族', business:'Own business / 自己做生意', freelance:'Freelancer / 自由职业', none:'Not working / 无工作' },
  lang: { km:'Khmer / 高棉语', zh:'Chinese / 中文' },
  weekday: { Sun:'Sunday / 星期日', Mon:'Monday / 星期一', Tue:'Tuesday / 星期二', Wed:'Wednesday / 星期三', Thu:'Thursday / 星期四', Fri:'Friday / 星期五', Sat:'Saturday / 星期六' },
  zodiac: { 'ជូត':'Rat / 鼠','ឆ្លូវ':'Ox / 牛','ខាល':'Tiger / 虎','ថោះ':'Rabbit / 兔','រោង':'Dragon / 龙','ម្សាញ់':'Snake / 蛇','មមី':'Horse / 马','មមែ':'Goat / 羊','វក':'Monkey / 猴','រកា':'Rooster / 鸡','ច':'Dog / 狗','កុរ':'Pig / 猪' }
};
const RED = '#5a1212', GOLD = '#f6c686', BAND = '#fbf3e6';

function doPost(e) {
  const sheet = dataSheet_();
  let d = {};
  try { d = JSON.parse(e.postData.contents || '{}'); } catch (err) {}
  const t = v => String(v == null ? '' : v).replace(/^[=+\-@]/, "'$&").slice(0, 120);
  const KH = /[ក-៿]/;
  const digits = v => String(v == null ? '' : v).replace(/[០-៩]/g, c => '០១២៣៤៥៦៧៨៩'.indexOf(c));
  const tr = (v, to) => { try { return LanguageApp.translate(v, 'km', to); } catch (err) { return ''; } };
  // Khmer text → "original (English / 中文)" so the boss can read it
  const kx = v => { v = t(digits(v)); if (!KH.test(v)) return v; const en = tr(v, 'en'), zh = tr(v, 'zh-CN'); return v + ' (' + [en, zh].filter(Boolean).join(' / ') + ')'; };
  d.name = kx(d.name); d.birth_place = kx(d.birth_place); d.birth_date = digits(d.birth_date); d.birth_typed = digits(d.birth_typed); d.birth_time = digits(d.birth_time);
  const pick = (map, v) => map[v] || t(v);
  const zod = LABEL.zodiac[d.zodiac] ? LABEL.zodiac[d.zodiac] + ' (' + d.zodiac + ')' : t(d.zodiac);
  const cal = d.calendar === 'lunar' ? ('Lunar / 农历' + (d.leap_month ? ' (leap month / 闰月)' : '') + ' — typed / 输入 ' + t(d.birth_typed)) : 'Solar / 公历';
  sheet.appendRow([
    new Date(), t(d.name), pick(LABEL.who, d.who), t(d.birth_date), cal,
    d.birth_time === 'unknown' ? "Doesn't know / 不知道" : t(d.birth_time), t(d.birth_place),
    pick(LABEL.gender, d.gender), pick(LABEL.relationship, d.relationship), pick(LABEL.work, d.work),
    zod, pick(LABEL.weekday, d.weekday), pick(LABEL.lang, d.lang)
  ]);
  return ContentService.createTextOutput('ok');
}

function doGet() { return ContentService.createTextOutput('Reasey sheet is ready'); }

/* Run this ONCE from the editor (choose "setupSheet" next to Run, then click Run). */
function setupSheet() {
  const sheet = dataSheet_();
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
    .setBackground(RED).setFontColor(GOLD).setFontWeight('bold').setFontSize(11)
    .setVerticalAlignment('middle').setHorizontalAlignment('center').setWrap(true);
  sheet.setName('Players');
  sheet.setRowHeight(1, 44); sheet.setFrozenRows(1);
  [170,170,130,120,170,120,150,110,160,160,140,140,110].forEach((w, i) => sheet.setColumnWidth(i + 1, w));
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
  s.getRange('A1').setValue('Reasey — Player summary / 用户统计').setFontSize(16).setFontWeight('bold').setFontColor(RED);
  s.getRange('A3:B5').setValues([
    ['Total players / 总人数', '=COUNTA(Players!B2:B)'],
    ['Registered today / 今天', '=COUNTIFS(Players!A2:A,">="&TODAY())'],
    ['Last 7 days / 最近7天', '=COUNTIFS(Players!A2:A,">="&(TODAY()-6))']
  ]);
  s.getRange('A3:A5').setFontWeight('bold'); s.getRange('B3:B5').setFontSize(13).setFontWeight('bold').setFontColor(RED);
  const blocks = [['By zodiac / 生肖','K'],['By relationship / 感情','I'],['By work / 工作','J'],['By gender / 性别','H'],['By language / 语言','M'],['Reading for / 为谁算','C']];
  let col = 1, row = 8;
  blocks.forEach(([title, c], i) => {
    const r = row, k = col;
    s.getRange(r, k, 1, 2).setValues([[title, 'Players / 人数']]).setBackground(RED).setFontColor(GOLD).setFontWeight('bold');
    s.getRange(r + 1, k).setFormula('=IFERROR(QUERY(Players!' + c + '2:' + c + ',"select ' + c + ', count(' + c + ') where ' + c + ' is not null group by ' + c + ' order by count(' + c + ') desc label count(' + c + ') \'\'",0),"—")');
    col += 3; if (i % 3 === 2) { col = 1; row += 16; }
  });
  [1,4,7].forEach(c => { s.setColumnWidth(c, 200); s.setColumnWidth(c + 1, 100); s.setColumnWidth(c + 2, 30); });
  s.setFrozenRows(1);
}
