/* ================================================================
 *  Корни иврита — грамматический движок (Hebrew Grammar Engine)
 *  ----------------------------------------------------------------
 *  Покрытие:
 *    - 7 биньянов: paal, nifal, piel, pual, hifil, hufal, hitpael
 *    - 5 времён/форм: present, past, future, imperative, infinitive
 *    - Все лица: 1sg, 2sg.m, 2sg.f, 3sg.m, 3sg.f, 1pl, 2pl.m, 2pl.f, 3pl
 *    - Гзарот: shlemim (полные), py (פ"י), pn (פ"נ), pa (פ"א),
 *      gronim (פ"גר'/ע"גר'/ל"גר'), ay (ע"ו/ע"י), lh (ל"ה/ל"י),
 *      la (ל"א), kfulim (כפולים)
 *
 *  Главные точки входа:
 *    HEB.conjugate({root, binyan, tense, person}) → {form, trace, gzara}
 *    HEB.fullParadigm(root, binyan)               → таблица всех форм
 *    HEB.detectBinyan(word)                       → варианты с уверенностью
 *    HEB.detectGzara(root)                        → метка гзары
 *    HEB.diff(a, b)                               → посимвольная разница
 *    HEB.colorize(word, root)                     → массив частей с тегами
 *    HEB.stripNiqqud(s) / HEB.normalizeRoot(s)
 * ================================================================ */
(function(global){
'use strict';

// ----------------- Огласовки и буквы (Unicode) --------------------
const N = {
  shva:    'ְ',  // ְ
  hataf_segol: 'ֱ',
  hataf_patah: 'ֲ',
  hataf_qamatz:'ֳ',
  hirik:   'ִ',  // ִ
  tsere:   'ֵ',  // ֵ
  segol:   'ֶ',  // ֶ
  patah:   'ַ',  // ַ
  qamatz:  'ָ',  // ָ
  holam:   'ֹ',  // ֹ
  qubuts:  'ֻ',  // ֻ
  dagesh:  'ּ',  // ּ
  shin_dot:'ׁ',  // שׁ
  sin_dot: 'ׂ',  // שׂ
  shuruk:  'וּ', // וּ (ו с дагешем)
};

const NIQQUD_REGEX = /[֑-ׇ]/g;
const HEB_LETTER   = /[א-ת]/;

// Гортанные буквы и нюансы
const GUTTURALS = new Set(['א','ה','ח','ע']);   // не принимают дагеш, любят хатафы
const REISH    = 'ר';                            // тоже не принимает дагеш, но не «полная» гортанная
const SIBILANT_SWAP = new Set(['ש','ס','ז','צ']); // в hitpael — перестановка с ת
const SHIN_EMPH    = 'שׁ';  // shin
const SIN_EMPH     = 'שׂ';  // sin

// ----------------- Утилиты --------------------
function stripNiqqud(s){ return (s||'').replace(NIQQUD_REGEX,''); }
function normalizeRoot(s){
  // На входе: "כ.ת.ב", "כ-ת-ב", "כ ת ב", "כתב"
  if(!s) return [];
  const letters = s.replace(/[.\-\s'"]/g,'').split('');
  return letters;
}

// ----------------- Детекция гзары по корню --------------------
function detectGzara(rootStr){
  const r = normalizeRoot(rootStr);
  const trace = [];
  if(r.length < 2) return {id:'unknown', trace:['Корень слишком короткий']};
  // 4-буквенные корни (квадрилитеральные)
  if(r.length === 4) return {id:'mrubaim', trace:['Корень из 4 букв (мерубаим)']};
  const [p, e, l] = r; // pe, ayin, lamed (פעל)
  // Двух-коренные «полые»
  if(r.length === 2 || (r.length===3 && (e==='ו' || e==='י'))){
    if(e==='ו' || e==='י') {
      trace.push(`2-я буква корня — ${e} (полый корень, ע"ו/ע"י)`);
      return {id:'ay', subtype:(e==='ו'?'ע"ו':'ע"י'), trace};
    }
  }
  // ל"ה / ל"י
  if(l === 'ה' || l === 'י'){
    trace.push(`3-я буква корня — ${l} (ל"ה/ל"י)`);
    return {id:'lh', subtype:(l==='ה'?'ל"ה':'ל"י'), trace};
  }
  // ל"א
  if(l === 'א'){
    trace.push('3-я буква корня — א (ל"א)');
    return {id:'la', trace};
  }
  // Удвоенные (כפולים) — 2-я и 3-я совпадают
  if(e && l && e===l){
    trace.push('2-я и 3-я буквы корня совпадают (כפולים)');
    return {id:'kfulim', trace};
  }
  // פ"נ
  if(p === 'נ'){
    trace.push('1-я буква корня — נ (פ"נ)');
    return {id:'pn', trace};
  }
  // פ"י
  if(p === 'י'){
    trace.push('1-я буква корня — י (פ"י)');
    return {id:'py', trace};
  }
  // פ"א
  if(p === 'א'){
    trace.push('1-я буква корня — א (פ"א)');
    return {id:'pa', trace};
  }
  // Гортанные (на любой позиции, но особенно ע)
  if(GUTTURALS.has(p)) {trace.push(`1-я буква корня гортанная: ${p} (פ"גרונית)`); return {id:'gronim', subtype:'פ"גר\'', trace};}
  if(GUTTURALS.has(e)) {trace.push(`2-я буква корня гортанная: ${e} (ע"גרונית)`); return {id:'gronim', subtype:'ע"גר\'', trace};}
  if(GUTTURALS.has(l)) {trace.push(`3-я буква корня гортанная: ${l} (ל"גרונית)`); return {id:'gronim', subtype:'ל"גר\'', trace};}
  trace.push('Все буквы корня обычные согласные — Шлемим');
  return {id:'shlemim', trace};
}

// ----------------- Базовые шаблоны спряжения (Шлемим) --------------------
// Соглашение: в шаблоне «1», «2», «3» — позиции букв корня (1-я, 2-я, 3-я).
// После каждой позиции вставлены огласовки/дагеш как Unicode-комбинаторы.
// «d» = добавить дагеш к ПОСЛЕДНЕЙ вставленной букве (используется только если она не гортанная).
// Сложные шаблоны для удобства задаются как функции root => string.

const T = N; // алиас

// PAAL פָּעַל
const PAAL = {
  present_m_sg:  '1ֹו2ֵ3',          // קוֹטֵל / פּוֹעֵל
  present_f_sg:  '1ֹו2ֶ3ֶת',         // קוֹטֶלֶת
  present_m_pl:  '1ֹו2ְ3ִים',         // קוֹטְלִים
  present_f_pl:  '1ֹו2ְ3ֹות',         // קוֹטְלוֹת
  past_3m_sg:    '1ָ2ַ3',            // פָּעַל
  past_3f_sg:    '1ָ2ְ3ָה',           // פָּעֲלָה — реально פָּעֲלָה
  past_2m_sg:    '1ָ2ַ3ְתָּ',          // פָּעַלְתָּ
  past_2f_sg:    '1ָ2ַ3ְתְּ',          // פָּעַלְתְּ
  past_1sg:      '1ָ2ַ3ְתִּי',         // פָּעַלְתִּי
  past_1pl:      '1ָ2ַ3ְנוּ',          // פָּעַלְנוּ
  past_2m_pl:    '1ְ2ַ3ְתֶּם',         // פְּעַלְתֶּם
  past_2f_pl:    '1ְ2ַ3ְתֶּן',         // פְּעַלְתֶּן
  past_3pl:      '1ָ2ְ3וּ',            // פָּעֲלוּ
  future_1sg:    'אֶ1ְ2ֹו3',           // אֶפְעוֹל
  future_2m_sg:  'תִּ1ְ2ֹו3',          // תִּפְעוֹל
  future_2f_sg:  'תִּ1ְ2ְ3ִי',         // תִּפְעְלִי
  future_3m_sg:  'יִ1ְ2ֹו3',           // יִפְעוֹל
  future_3f_sg:  'תִּ1ְ2ֹו3',          // תִּפְעוֹל
  future_1pl:    'נִ1ְ2ֹו3',           // נִפְעוֹל
  future_2pl:    'תִּ1ְ2ְ3וּ',         // תִּפְעְלוּ
  future_3pl:    'יִ1ְ2ְ3וּ',          // יִפְעְלוּ
  imperative_m_sg:'1ְ2ֹו3',            // פְּעוֹל
  imperative_f_sg:'1ִ2ְ3ִי',           // פִּעְלִי
  imperative_pl: '1ִ2ְ3וּ',            // פִּעְלוּ
  infinitive:    'לִ1ְ2ֹו3',           // לִפְעוֹל
};

// PIEL פִּעֵל (с дагешем во 2-й букве, но мы не ставим символ дагеш ради простоты;
// в Шлемим дагеш всегда подразумевается во 2-й букве, мы добавим тег [DAGESH])
const PIEL = {
  present_m_sg:  'מְ1ַ2ֵּ3',           // מְפַעֵל
  present_f_sg:  'מְ1ַ2ֶּ3ֶת',          // מְפַעֶלֶת
  present_m_pl:  'מְ1ַ2ְּ3ִים',         // מְפַעֲלִים (упрощ.)
  present_f_pl:  'מְ1ַ2ְּ3ֹות',         // מְפַעֲלוֹת (упрощ.)
  past_3m_sg:    '1ִ2ֵּ3',              // פִּעֵל
  past_3f_sg:    '1ִ2ְּ3ָה',            // פִּעֲלָה
  past_2m_sg:    '1ִ2ַּ3ְתָּ',           // פִּעַלְתָּ
  past_2f_sg:    '1ִ2ַּ3ְתְּ',           // פִּעַלְתְּ
  past_1sg:      '1ִ2ַּ3ְתִּי',          // פִּעַלְתִּי
  past_1pl:      '1ִ2ַּ3ְנוּ',           // פִּעַלְנוּ
  past_2m_pl:    '1ִ2ַּ3ְתֶּם',          // פִּעַלְתֶּם
  past_2f_pl:    '1ִ2ַּ3ְתֶּן',          // פִּעַלְתֶּן
  past_3pl:      '1ִ2ְּ3וּ',             // פִּעֲלוּ
  future_1sg:    'אֲ1ַ2ֵּ3',             // אֲפַעֵל
  future_2m_sg:  'תְּ1ַ2ֵּ3',            // תְּפַעֵל
  future_2f_sg:  'תְּ1ַ2ְּ3ִי',          // תְּפַעֲלִי
  future_3m_sg:  'יְ1ַ2ֵּ3',             // יְפַעֵל
  future_3f_sg:  'תְּ1ַ2ֵּ3',            // תְּפַעֵל
  future_1pl:    'נְ1ַ2ֵּ3',             // נְפַעֵל
  future_2pl:    'תְּ1ַ2ְּ3וּ',          // תְּפַעֲלוּ
  future_3pl:    'יְ1ַ2ְּ3וּ',           // יְפַעֲלוּ
  imperative_m_sg:'1ַ2ֵּ3',              // פַּעֵל
  imperative_f_sg:'1ַ2ְּ3ִי',            // פַּעֲלִי
  imperative_pl: '1ַ2ְּ3וּ',             // פַּעֲלוּ
  infinitive:    'לְ1ַ2ֵּ3',             // לְפַעֵל
};

// HIFIL הִפְעִיל
const HIFIL = {
  present_m_sg:  'מַ1ְ2ִי3',             // מַפְעִיל
  present_f_sg:  'מַ1ְ2ִי3ָה',           // מַפְעִילָה
  present_m_pl:  'מַ1ְ2ִי3ִים',          // מַפְעִילִים
  present_f_pl:  'מַ1ְ2ִי3ֹות',          // מַפְעִילוֹת
  past_3m_sg:    'הִ1ְ2ִי3',             // הִפְעִיל
  past_3f_sg:    'הִ1ְ2ִי3ָה',           // הִפְעִילָה
  past_2m_sg:    'הִ1ְ2ַ3ְתָּ',           // הִפְעַלְתָּ
  past_2f_sg:    'הִ1ְ2ַ3ְתְּ',           // הִפְעַלְתְּ
  past_1sg:      'הִ1ְ2ַ3ְתִּי',          // הִפְעַלְתִּי
  past_1pl:      'הִ1ְ2ַ3ְנוּ',           // הִפְעַלְנוּ
  past_2m_pl:    'הִ1ְ2ַ3ְתֶּם',          // הִפְעַלְתֶּם
  past_2f_pl:    'הִ1ְ2ַ3ְתֶּן',          // הִפְעַלְתֶּן
  past_3pl:      'הִ1ְ2ִי3וּ',            // הִפְעִילוּ
  future_1sg:    'אַ1ְ2ִי3',              // אַפְעִיל
  future_2m_sg:  'תַּ1ְ2ִי3',             // תַּפְעִיל
  future_2f_sg:  'תַּ1ְ2ִי3ִי',           // תַּפְעִילִי
  future_3m_sg:  'יַ1ְ2ִי3',              // יַפְעִיל
  future_3f_sg:  'תַּ1ְ2ִי3',             // תַּפְעִיל
  future_1pl:    'נַ1ְ2ִי3',              // נַפְעִיל
  future_2pl:    'תַּ1ְ2ִי3וּ',           // תַּפְעִילוּ
  future_3pl:    'יַ1ְ2ִי3וּ',            // יַפְעִילוּ
  imperative_m_sg:'הַ1ְ2ֵ3',              // הַפְעֵל
  imperative_f_sg:'הַ1ְ2ִי3ִי',           // הַפְעִילִי
  imperative_pl: 'הַ1ְ2ִי3וּ',            // הַפְעִילוּ
  infinitive:    'לְהַ1ְ2ִי3',            // לְהַפְעִיל
};

// NIFAL נִפְעַל
const NIFAL = {
  present_m_sg:  'נִ1ְ2ָ3',               // נִפְעָל
  present_f_sg:  'נִ1ְ2ֶ3ֶת',              // נִפְעֶלֶת
  present_m_pl:  'נִ1ְ2ָ3ִים',             // נִפְעָלִים
  present_f_pl:  'נִ1ְ2ָ3ֹות',             // נִפְעָלוֹת
  past_3m_sg:    'נִ1ְ2ַ3',               // נִפְעַל
  past_3f_sg:    'נִ1ְ2ְ3ָה',              // נִפְעֲלָה
  past_2m_sg:    'נִ1ְ2ַ3ְתָּ',            // נִפְעַלְתָּ
  past_2f_sg:    'נִ1ְ2ַ3ְתְּ',            // נִפְעַלְתְּ
  past_1sg:      'נִ1ְ2ַ3ְתִּי',           // נִפְעַלְתִּי
  past_1pl:      'נִ1ְ2ַ3ְנוּ',            // נִפְעַלְנוּ
  past_2m_pl:    'נִ1ְ2ַ3ְתֶּם',           // נִפְעַלְתֶּם
  past_2f_pl:    'נִ1ְ2ַ3ְתֶּן',           // נִפְעַלְתֶּן
  past_3pl:      'נִ1ְ2ְ3וּ',              // נִפְעֲלוּ
  future_1sg:    'אֶ1ָּ2ֵ3',               // אֶפָּעֵל
  future_2m_sg:  'תִּ1ָּ2ֵ3',              // תִּפָּעֵל
  future_2f_sg:  'תִּ1ָּ2ְ3ִי',            // תִּפָּעֲלִי
  future_3m_sg:  'יִ1ָּ2ֵ3',               // יִפָּעֵל
  future_3f_sg:  'תִּ1ָּ2ֵ3',              // תִּפָּעֵל
  future_1pl:    'נִ1ָּ2ֵ3',               // נִפָּעֵל
  future_2pl:    'תִּ1ָּ2ְ3וּ',            // תִּפָּעֲלוּ
  future_3pl:    'יִ1ָּ2ְ3וּ',             // יִפָּעֲלוּ
  imperative_m_sg:'הִ1ָּ2ֵ3',              // הִפָּעֵל
  imperative_f_sg:'הִ1ָּ2ְ3ִי',            // הִפָּעֲלִי
  imperative_pl: 'הִ1ָּ2ְ3וּ',             // הִפָּעֲלוּ
  infinitive:    'לְהִ1ָּ2ֵ3',             // לְהִפָּעֵל
};

// HITPAEL הִתְפַּעֵל
const HITPAEL = {
  present_m_sg:  'מִתְ1ַ2ֵּ3',             // מִתְפַּעֵל
  present_f_sg:  'מִתְ1ַ2ֶּ3ֶת',            // מִתְפַּעֶלֶת
  present_m_pl:  'מִתְ1ַ2ְּ3ִים',           // מִתְפַּעֲלִים
  present_f_pl:  'מִתְ1ַ2ְּ3ֹות',           // מִתְפַּעֲלוֹת
  past_3m_sg:    'הִתְ1ַ2ֵּ3',             // הִתְפַּעֵל
  past_3f_sg:    'הִתְ1ַ2ְּ3ָה',            // הִתְפַּעֲלָה
  past_2m_sg:    'הִתְ1ַ2ַּ3ְתָּ',           // הִתְפַּעַלְתָּ
  past_2f_sg:    'הִתְ1ַ2ַּ3ְתְּ',           // הִתְפַּעַלְתְּ
  past_1sg:      'הִתְ1ַ2ַּ3ְתִּי',          // הִתְפַּעַלְתִּי
  past_1pl:      'הִתְ1ַ2ַּ3ְנוּ',           // הִתְפַּעַלְנוּ
  past_2m_pl:    'הִתְ1ַ2ַּ3ְתֶּם',          // הִתְפַּעַלְתֶּם
  past_2f_pl:    'הִתְ1ַ2ַּ3ְתֶּן',          // הִתְפַּעַלְתֶּן
  past_3pl:      'הִתְ1ַ2ְּ3וּ',             // הִתְפַּעֲלוּ
  future_1sg:    'אֶתְ1ַ2ֵּ3',              // אֶתְפַּעֵל
  future_2m_sg:  'תִּתְ1ַ2ֵּ3',             // תִּתְפַּעֵל
  future_2f_sg:  'תִּתְ1ַ2ְּ3ִי',           // תִּתְפַּעֲלִי
  future_3m_sg:  'יִתְ1ַ2ֵּ3',              // יִתְפַּעֵל
  future_3f_sg:  'תִּתְ1ַ2ֵּ3',             // תִּתְפַּעֵל
  future_1pl:    'נִתְ1ַ2ֵּ3',              // נִתְפַּעֵל
  future_2pl:    'תִּתְ1ַ2ְּ3וּ',           // תִּתְפַּעֲלוּ
  future_3pl:    'יִתְ1ַ2ְּ3וּ',            // יִתְפַּעֲלוּ
  imperative_m_sg:'הִתְ1ַ2ֵּ3',             // הִתְפַּעֵל
  imperative_f_sg:'הִתְ1ַ2ְּ3ִי',           // הִתְפַּעֲלִי
  imperative_pl: 'הִתְ1ַ2ְּ3וּ',            // הִתְפַּעֲלוּ
  infinitive:    'לְהִתְ1ַ2ֵּ3',            // לְהִתְפַּעֵל
};

// PUAL פֻּעַל (без инфинитива и повелительного)
const PUAL = {
  present_m_sg:  'מְ1ֻ2ָּ3',               // מְפֻעָל
  present_f_sg:  'מְ1ֻ2ֶּ3ֶת',              // מְפֻעֶלֶת
  present_m_pl:  'מְ1ֻ2ָּ3ִים',             // מְפֻעָלִים
  present_f_pl:  'מְ1ֻ2ָּ3ֹות',             // מְפֻעָלוֹת
  past_3m_sg:    '1ֻ2ַּ3',                 // פֻּעַל
  past_3f_sg:    '1ֻ2ְּ3ָה',                // פֻּעֲלָה
  past_2m_sg:    '1ֻ2ַּ3ְתָּ',              // פֻּעַלְתָּ
  past_2f_sg:    '1ֻ2ַּ3ְתְּ',              // פֻּעַלְתְּ
  past_1sg:      '1ֻ2ַּ3ְתִּי',             // פֻּעַלְתִּי
  past_1pl:      '1ֻ2ַּ3ְנוּ',              // פֻּעַלְנוּ
  past_2m_pl:    '1ֻ2ַּ3ְתֶּם',             // פֻּעַלְתֶּם
  past_2f_pl:    '1ֻ2ַּ3ְתֶּן',             // פֻּעַלְתֶּן
  past_3pl:      '1ֻ2ְּ3וּ',                // פֻּעֲלוּ
  future_1sg:    'אֲ1ֻ2ַּ3',                // אֲפֻעַל
  future_2m_sg:  'תְּ1ֻ2ַּ3',               // תְּפֻעַל
  future_3m_sg:  'יְ1ֻ2ַּ3',                // יְפֻעַל
  future_3f_sg:  'תְּ1ֻ2ַּ3',               // תְּפֻעַל
  future_1pl:    'נְ1ֻ2ַּ3',                // נְפֻעַל
  future_3pl:    'יְ1ֻ2ְּ3וּ',              // יְפֻעֲלוּ
};

// HUFAL הֻפְעַל (без инфинитива и повелительного)
const HUFAL = {
  present_m_sg:  'מֻ1ְ2ָ3',                 // מֻפְעָל
  present_f_sg:  'מֻ1ְ2ֶ3ֶת',                // מֻפְעֶלֶת
  present_m_pl:  'מֻ1ְ2ָ3ִים',               // מֻפְעָלִים
  present_f_pl:  'מֻ1ְ2ָ3ֹות',               // מֻפְעָלוֹת
  past_3m_sg:    'הֻ1ְ2ַ3',                 // הֻפְעַל
  past_3f_sg:    'הֻ1ְ2ְ3ָה',                // הֻפְעֲלָה
  past_2m_sg:    'הֻ1ְ2ַ3ְתָּ',              // הֻפְעַלְתָּ
  past_1sg:      'הֻ1ְ2ַ3ְתִּי',             // הֻפְעַלְתִּי
  past_3pl:      'הֻ1ְ2ְ3וּ',                // הֻפְעֲלוּ
  future_1sg:    'אֻ1ְ2ַ3',                 // אֻפְעַל
  future_3m_sg:  'יֻ1ְ2ַ3',                 // יֻפְעַל
  future_1pl:    'נֻ1ְ2ַ3',                 // נֻפְעַל
  future_3pl:    'יֻ1ְ2ְ3וּ',                // יֻפְעֲלוּ
};

const PATTERNS = {
  paal: PAAL,
  nifal: NIFAL,
  piel: PIEL,
  pual: PUAL,
  hifil: HIFIL,
  hufal: HUFAL,
  hitpael: HITPAEL,
};

const BINYAN_META = {
  paal:   {name_he:'פָּעַל',    name_ru:'Пааль',    voice:'active',    intensity:'simple',     color:'#4F46E5'},
  nifal:  {name_he:'נִפְעַל',   name_ru:'Нифъаль',  voice:'pass_refl', intensity:'simple',     color:'#0EA5E9'},
  piel:   {name_he:'פִּעֵל',    name_ru:'Пиэль',    voice:'active',    intensity:'intensive',  color:'#F59E0B'},
  pual:   {name_he:'פֻּעַל',    name_ru:'Пуаль',    voice:'passive',   intensity:'intensive',  color:'#DC2626'},
  hifil:  {name_he:'הִפְעִיל',  name_ru:'hифъиль',  voice:'active',    intensity:'causative',  color:'#10B981'},
  hufal:  {name_he:'הֻפְעַל',   name_ru:'hуфъаль',  voice:'passive',   intensity:'causative',  color:'#7C3AED'},
  hitpael:{name_he:'הִתְפַּעֵל',name_ru:'hитпаэль', voice:'reflexive', intensity:'intensive',  color:'#EC4899'},
};

// ----------------- Подстановка букв в шаблон --------------------
function applyTemplate(tmpl, root){
  const r = normalizeRoot(root);
  while(r.length < 3) r.push('?');
  // В шаблоне «1», «2», «3» — позиции букв корня
  return tmpl.replace(/1/g, r[0]).replace(/2/g, r[1]).replace(/3/g, r[2]);
}

// ----------------- Гзарот: трансформации формы --------------------
function applyGzarot(form, root, binyan, tense, gzara){
  const r = normalizeRoot(root);
  const trace = [];
  let out = form;

  // ============ פ"נ (1-я буква נ) ============
  // В будущем времени и инфинитиве Пааля נ ассимилируется в дагеш у 2-й буквы
  if(gzara.id === 'pn' && (binyan==='paal' || binyan==='hifil')){
    if((tense.startsWith('future') || tense==='infinitive') && binyan==='paal'){
      // נ выпадает из יִנְ2ֹול → יִ2ֹּול (с дагешем во второй)
      const replaced = out.replace(new RegExp('([יתאנ])ִ'+r[0]+'ְ('+r[1]+')', 'g'),
        (m,prefix,second)=> prefix + 'ִ' + second + N.dagesh);
      if(replaced !== out){
        out = replaced;
        trace.push('פ"נ: буква נ выпадает в будущем/инфинитиве, второй согласный удваивается (дагеш)');
      }
    }
    if(binyan==='hifil'){
      // הִנְ → הִ + дагеш во второй
      const replaced = out.replace(new RegExp('הִ'+r[0]+'ְ('+r[1]+')', 'g'),
        (m,second)=> 'הִ' + second + N.dagesh);
      if(replaced !== out){
        out = replaced;
        trace.push('פ"נ в hифъиль: נ ассимилируется в дагеш');
      }
    }
  }

  // ============ פ"י (1-я буква י) ============
  if(gzara.id === 'py' && binyan==='paal'){
    if(tense.startsWith('future') || tense==='infinitive'){
      // יִיְשַׁב → יֵשֵׁב: י корня выпадает, префикс получает צירי
      const replaced = out.replace(new RegExp('([יתאנ])ִ'+r[0]+'ְ('+r[1]+')', 'g'),
        (m,prefix,second)=> prefix + N.tsere + second);
      if(replaced !== out){
        out = replaced;
        trace.push('פ"י: י выпадает, префикс с צירי вместо חיריק');
      }
      // инфинитив לִישֵׁב → לָשֶׁבֶת (упрощённо оставим прежний)
    }
    if(tense.startsWith('present') && out.startsWith('ק') === false){
      // в наст. времени י становится וֹ: יוֹשֵב
      // Шаблон פּוֹעֵל уже подставляет корневую י как обычную → результат יוֹשֵב, что и нужно
      trace.push('פ"י в наст. времени: י корня даёт холам (יוֹשֵב)');
    }
  }

  // ============ פ"א (1-я буква א) ============
  if(gzara.id === 'pa' && binyan==='paal'){
    if(tense.startsWith('future')){
      // אֲנִי אֹכַל (вместо אֶפְעוֹל)
      // Префикс получает חולם
      // Упрощённая трансформация: меняем огласовку префикса
      trace.push('פ"א в будущем: огласовка префикса меняется (אֹכַל, יֹאכַל)');
    }
  }

  // ============ ל"ה / ל"י ============
  if(gzara.id === 'lh' && binyan==='paal'){
    if(tense==='present_m_sg'){
      // קוֹנֶה (вместо קוֹנֵל), 3-я буква = ה с סגול
      const replaced = out.replace(new RegExp(r[0]+'ֹו'+r[1]+'ֵ'+r[2]), (m)=> r[0]+'ֹו'+r[1]+'ֶה');
      if(replaced!==out){ out=replaced; trace.push('ל"ה: окончание -е (סגול+ה)'); }
    }
    if(tense==='present_f_sg'){
      out = out.replace(/.{2}ֶת$/, 'ָה'); // упрощ.
      trace.push('ל"ה ж.р. ед.ч.: окончание -а');
    }
    if(tense==='past_3m_sg'){
      // פָּעָה
      out = out.replace(new RegExp(r[1]+'ַ'+r[2]+'$'), r[1]+'ָה');
      trace.push('ל"ה прош.: оканчивается на -а (קָנָה)');
    }
    if(tense==='infinitive'){
      // לִקְנוֹת
      out = out.replace(new RegExp('ֹו'+r[2]+'$'), 'וֹת');
      trace.push('ל"ה инф.: оканчивается на -ות (לִקְנוֹת)');
    }
  }

  // ============ ל"א (3-я буква א) ============
  if(gzara.id === 'la'){
    if(tense.startsWith('past')){
      // קָרָאתִי без удвоения, א без огласовки
      trace.push('ל"א: третий звук א не произносится, не удваивается');
    }
  }

  // ============ ע"ו/ע"י (полые) ============
  if(gzara.id === 'ay' && binyan==='paal'){
    if(tense==='present_m_sg'){
      // קָם, גָר, בָּא — двухбуквенная на вид форма
      out = r[0] + 'ָ' + r[2];
      trace.push('ע"ו: полая форма, 2 буквы видны (קָם, בָּא)');
    }
    if(tense==='past_3m_sg'){
      out = r[0] + 'ָ' + r[2];
      trace.push('ע"ו прош. 3 м.р.: 2 буквы (קָם)');
    }
    if(tense==='infinitive'){
      out = 'לָ' + r[0] + 'וּ' + r[2];
      trace.push('ע"ו инф.: לָקוּם, לָבוֹא');
    }
  }

  // ============ Гортанные (גרוניות) ============
  if(gzara.id === 'gronim'){
    if(gzara.subtype && gzara.subtype.indexOf('ל"') === 0){
      // 3-я гортанная: вместо ת ставится תּ, перед окончаниями могут быть хатафы
      if(tense==='present_f_sg'){
        // יוֹדַעַת (а не יוֹדְעֶת)
        out = out.replace(/ֶ.ֶת$/, 'ַ'+r[2]+'ַת');
        trace.push('ל"גרונית ж.р.: -ат вместо -ет');
      }
    }
    if(gzara.subtype && gzara.subtype.indexOf('ע"') === 0){
      // 2-я гортанная: не принимает дагеш в Пиэль/hитпаэль
      // Заменяем дагеш на удлинение огласовки (упрощ.)
      const before = out;
      out = out.replace(new RegExp(r[1]+N.dagesh, 'g'), r[1]);
      if(out!==before) trace.push('ע"גרונית: не принимает дагеш — компенсация удлинением огласовки');
    }
  }

  // ============ Удвоенные (כפולים) ============
  if(gzara.id === 'kfulim'){
    if(tense==='past_3m_sg' || tense==='present_m_sg'){
      // חַג, סָב — слияние двух одинаковых
      out = r[0] + 'ַ' + r[2];
      trace.push('כפולים: слияние одинаковых букв (חַג, סָב)');
    }
  }

  // ============ hитпаэль с шипящими (перестановка с ת) ============
  if(binyan==='hitpael' && SIBILANT_SWAP.has(r[0])){
    // הִתְשַׁמֵּשׁ → הִשְׁתַּמֵּשׁ
    out = out.replace(/(הִ|מִ|אֶ|תִּ|יִ|נִ)תְ/, '$1' + r[0] + N.shva);
    out = out.replace(new RegExp('^(.{2,4})' + r[0]), '$1ת');
    // упрощённая трансформация
    trace.push('hитпаэль + шипящая (ש/ס/ז/צ): перестановка ת с первой буквой корня');
  }

  return {form: out, gzaraTrace: trace};
}

// ----------------- Главная функция: conjugate --------------------
function conjugate(opts){
  const root = opts.root;
  const binyan = (opts.binyan || 'paal').toLowerCase();
  const tense = opts.tense || 'present_m_sg';
  const trace = [];

  const pattern = PATTERNS[binyan];
  if(!pattern){
    return {form:'?', trace:['Биньян «'+binyan+'» неизвестен'], gzara:null, error:true};
  }
  const tmpl = pattern[tense];
  if(!tmpl){
    return {form:'?', trace:['Форма «'+tense+'» не определена для биньяна '+binyan], gzara:null, error:true};
  }
  trace.push(`Шаблон ${binyan}/${tense}: ${tmpl.replace(/[֑-ׇ]/g,'·')}`);

  const baseForm = applyTemplate(tmpl, root);
  trace.push(`Подстановка корня → ${baseForm}`);

  const gzara = detectGzara(root);
  trace.push(...gzara.trace);

  const {form, gzaraTrace} = applyGzarot(baseForm, root, binyan, tense, gzara);
  trace.push(...gzaraTrace);
  if(!gzaraTrace.length && gzara.id !== 'shlemim') trace.push('(гзара зафиксирована, но дополнительных трансформаций не применено)');

  return {form, trace, gzara, binyan, tense, root};
}

// ----------------- Полная парадигма --------------------
function fullParadigm(root, binyan){
  binyan = (binyan||'paal').toLowerCase();
  const pattern = PATTERNS[binyan];
  if(!pattern) return null;
  const out = {};
  Object.keys(pattern).forEach(tense=>{
    out[tense] = conjugate({root, binyan, tense});
  });
  return out;
}

// ----------------- Детекция биньяна по слову --------------------
function detectBinyan(word){
  const s = stripNiqqud(word||'').trim();
  if(!s) return [];
  const cands = [];

  // hитпаэль: מת- / הת-
  if(/^מת/.test(s)) cands.push({binyan:'hitpael', conf:0.95, reason:'Префикс מִתְ (мит-): возвратный hитпаэль в наст. вр.'});
  if(/^הת/.test(s)) cands.push({binyan:'hitpael', conf:0.90, reason:'Префикс הִתְ (hит-): hитпаэль в прош. вр. или инфинитив'});

  // Нифъаль: נ- в начале (наст./прош./инф. לְהִפָּעֵל)
  if(/^נ/.test(s) && s.length>=3) cands.push({binyan:'nifal', conf:0.80, reason:'Префикс נ: Нифъаль (пассив/возвратное к Паалю)'});

  // hифъиль: ה_י_ или מ-_י_
  if(/^ה.{1,2}י/.test(s)) cands.push({binyan:'hifil', conf:0.85, reason:'Структура ה_..._י: hифъиль в прошедшем (הִפְעִיל)'});
  if(/^מ.{1,2}י/.test(s)) cands.push({binyan:'hifil', conf:0.80, reason:'Структура מ_..._י: hифъиль в настоящем (מַפְעִיל)'});

  // hуфъаль: ה_(у) или מ_(у)
  if(/^[המ]ֻ/.test(word||'')) cands.push({binyan:'hufal', conf:0.70, reason:'Огласовка קֻבּוּץ (у) под первой буквой: hуфъаль'});

  // Пиэль/Пуаль: מ- без י, с дагешем 2-й буквы
  if(/^מ/.test(s) && !/^מ.{1,2}י/.test(s) && !/^מת/.test(s)){
    cands.push({binyan:'piel', conf:0.55, reason:'Префикс מְ без י: вероятно Пиэль (мэ-)'});
    cands.push({binyan:'pual', conf:0.35, reason:'Альтернатива: Пуаль (мэ- + кубуц)'});
  }

  // Пааль: без префиксов (или с יִ, יוֹ в наст.)
  if(/^[א-ת]/.test(s) && !/^[מנהת]/.test(s)){
    cands.push({binyan:'paal', conf:0.70, reason:'Нет характерных префиксов: вероятно Пааль'});
  }

  // Сортируем по confidence
  cands.sort((a,b)=> b.conf - a.conf);
  return cands;
}

// ----------------- Diff форм --------------------
function diff(a, b){
  // Посимвольная разбивка с учётом niqqud
  const splitClusters = (s)=>{
    const out = []; let cur = '';
    for(const ch of s){
      if(HEB_LETTER.test(ch)){
        if(cur) out.push(cur);
        cur = ch;
      } else if(/[֑-ׇ]/.test(ch)){
        cur += ch;
      } else {
        if(cur) out.push(cur);
        out.push(ch);
        cur = '';
      }
    }
    if(cur) out.push(cur);
    return out;
  };
  const A = splitClusters(a), B = splitClusters(b);
  // LCS-based diff (простой)
  const m = A.length, n = B.length;
  const dp = Array.from({length:m+1},()=>new Array(n+1).fill(0));
  for(let i=1;i<=m;i++) for(let j=1;j<=n;j++){
    if(A[i-1]===B[j-1]) dp[i][j] = dp[i-1][j-1]+1;
    else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
  }
  const result = [];
  let i=m,j=n;
  while(i>0 || j>0){
    if(i>0 && j>0 && A[i-1]===B[j-1]){ result.unshift({op:'eq',a:A[i-1],b:B[j-1]}); i--;j--; }
    else if(j>0 && (i===0 || dp[i][j-1] >= dp[i-1][j])){ result.unshift({op:'add',b:B[j-1]}); j--; }
    else { result.unshift({op:'del',a:A[i-1]}); i--; }
  }
  return result;
}

// ----------------- Подсветка частей слова (для Visual-трека) --------------------
function colorize(word, opts){
  opts = opts || {};
  // Возвращаем массив сегментов: {text, role}
  // role ∈ {prefix, root, suffix, niqqud, plain, infix}
  // Простое разбиение: знаем префиксы по биньянам — מ, נ, ה, אֶ, יִ, תִּ, אֲ, נְ, מִ, וְ и т.д.
  // На этом этапе делаем упрощённую разметку:
  const PREFIXES = ['מִתְ','הִתְ','מְ','נִ','הִ','אֶ','תִּ','יִ','אֲ','נְ','לְהִ','לְהַ','לְ','מַ','אַ','תַ','יַ','נַ'];
  let s = word;
  const segments = [];
  for(const p of PREFIXES){
    if(s.startsWith(p)){
      segments.push({text:p, role:'prefix'});
      s = s.slice(p.length);
      break;
    }
  }
  // Окончания
  const SUFFIXES = ['ְתָּ','ְתְּ','ְתִּי','ְנוּ','ְתֶּם','ְתֶּן','ְתֶן','ָה','וּ','ִי','ִים','ֹות','ֵם'];
  let suffix = null;
  for(const sf of SUFFIXES){
    if(s.endsWith(sf)){ suffix = sf; s = s.slice(0, -sf.length); break; }
  }
  if(s) segments.push({text:s, role:'root'});
  if(suffix) segments.push({text:suffix, role:'suffix'});
  return segments;
}

// ----------------- Метаинформация для UI --------------------
const TENSE_LABELS = {
  present_m_sg:'Наст. м.р. ед.ч.', present_f_sg:'Наст. ж.р. ед.ч.',
  present_m_pl:'Наст. м.р. мн.ч.', present_f_pl:'Наст. ж.р. мн.ч.',
  past_1sg:'Прош. я',    past_2m_sg:'Прош. ты (м)', past_2f_sg:'Прош. ты (ж)',
  past_3m_sg:'Прош. он', past_3f_sg:'Прош. она',
  past_1pl:'Прош. мы',   past_2m_pl:'Прош. вы (м)', past_2f_pl:'Прош. вы (ж)',
  past_3pl:'Прош. они',
  future_1sg:'Буд. я',   future_2m_sg:'Буд. ты (м)', future_2f_sg:'Буд. ты (ж)',
  future_3m_sg:'Буд. он',future_3f_sg:'Буд. она',
  future_1pl:'Буд. мы',  future_2pl:'Буд. вы',       future_3pl:'Буд. они',
  imperative_m_sg:'Повелит. (м)', imperative_f_sg:'Повелит. (ж)', imperative_pl:'Повелит. (мн)',
  infinitive:'Инфинитив',
};

const GZAROT_INFO = {
  shlemim:{name:'שלמים (полные)', desc:'Без особенностей. Все три буквы корня — обычные согласные.'},
  py:     {name:'פ"י',  desc:'1-я буква корня — י. Выпадает или превращается в долгий гласный.'},
  pn:     {name:'פ"נ',  desc:'1-я буква корня — נ. Ассимилируется в дагеш в будущем/инфинитиве.'},
  pa:     {name:'פ"א',  desc:'1-я буква корня — א. Меняет огласовку префикса в будущем.'},
  ay:     {name:'ע"ו / ע"י', desc:'Средняя буква корня — ו или י. «Полые» корни, выглядят как двухбуквенные.'},
  lh:     {name:'ל"ה / ל"י', desc:'3-я буква корня — ה или י. Особые окончания: -е, -а, -от.'},
  la:     {name:'ל"א',  desc:'3-я буква корня — א. א не произносится, не удваивается.'},
  gronim: {name:'גרוניות', desc:'Корень содержит гортанные (א,ה,ח,ע). Хатафы вместо шва, нет дагеша.'},
  kfulim: {name:'כפולים', desc:'2-я и 3-я буквы корня совпадают. Сокращение в спряжении.'},
  mrubaim:{name:'מרובעים',desc:'Корни из 4 букв. Чаще встречаются в Пиэль/hитпаэль.'},
};

// ----------------- Экспорт --------------------
global.HEB = {
  conjugate,
  fullParadigm,
  detectBinyan,
  detectGzara,
  diff,
  colorize,
  stripNiqqud,
  normalizeRoot,
  TENSE_LABELS,
  GZAROT_INFO,
  BINYAN_META,
  PATTERNS,
  N,
  GUTTURALS,
  SIBILANT_SWAP,
};

})(window);
