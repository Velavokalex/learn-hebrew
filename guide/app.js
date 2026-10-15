(function(){
"use strict";
const {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  createContext,
  useContext,
  useReducer
} = React;
const DATA = window.__APP_DATA__ || {
  manifest: {
    course_modules: [],
    tables: [],
    kornev: []
  },
  vocab: {
    words: [],
    binyans: [],
    gzarot: []
  },
  homework: []
};
const STORAGE_KEY = 'korni_progress_v1';
function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch (e) {
    return {};
  }
}
function saveProgress(p) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}
const AppCtx = createContext({});
function useRoute() {
  const [hash, setHash] = useState(window.location.hash || '#/');
  useEffect(() => {
    const f = () => setHash(window.location.hash || '#/');
    window.addEventListener('hashchange', f);
    return () => window.removeEventListener('hashchange', f);
  }, []);
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  return {
    hash,
    parts,
    navigate: p => {
      window.location.hash = '#/' + p;
    }
  };
}
function speak(text, lang = 'he-IL', rate = 0.85) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = rate;
    const v = window.speechSynthesis.getVoices().find(v => v.lang.startsWith('he')) || null;
    if (v) u.voice = v;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch (e) {
    console.warn('TTS error', e);
  }
}
function getSpeechRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  const r = new SR();
  r.lang = 'he-IL';
  r.continuous = false;
  r.interimResults = false;
  return r;
}
function levenshtein(a, b) {
  const m = a.length,
    n = b.length;
  if (!m) return n;
  if (!n) return m;
  const d = Array.from({
    length: m + 1
  }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  }
  return d[m][n];
}
function stripNiqqud(s) {
  return (s || '').replace(/[֑-ׇ]/g, '');
}
function similarity(a, b) {
  a = stripNiqqud(a).trim();
  b = stripNiqqud(b).trim();
  if (!a || !b) return 0;
  const d = levenshtein(a, b);
  return Math.max(0, 1 - d / Math.max(a.length, b.length));
}
function Sidebar({
  open,
  setOpen,
  route
}) {
  const links = [{
    p: '',
    t: 'Главная',
    i: '🏠'
  }, {
    p: 'track',
    t: 'Треки',
    i: '🧭',
    section: 'top'
  }, {
    p: 'course',
    t: 'Курс',
    i: '📚'
  }, {
    p: 'binyans',
    t: 'Биньяны',
    i: '🌳'
  }, {
    p: 'roots',
    t: 'Корни',
    i: '🌱'
  }, {
    p: 'dictionary',
    t: 'Словарь',
    i: '🔤'
  }, {
    p: 'tables',
    t: 'Таблицы',
    i: '📊'
  }, {
    p: 'practice',
    t: 'Тренажёр',
    i: '🎯'
  }, {
    p: 'homework',
    t: 'Домашки',
    i: '📝'
  }, {
    p: 'search',
    t: 'Поиск',
    i: '🔍'
  }];
  const cur = route.parts[0] || '';
  return React.createElement("aside", {
    className: "sidebar w-64 glass h-screen sticky top-0 p-4 flex flex-col gap-1 " + (open ? 'open' : '')
  }, React.createElement("div", {
    className: "mb-4"
  }, React.createElement("div", {
    className: "text-2xl font-bold gradient-text"
  }, "\u05E7\u05D5\u05B9\u05E8\u05B0\u05E0\u05B5\u05D9 \u05D4\u05B7\u05E2\u05B4\u05D1\u05B0\u05E8\u05B4\u05D9\u05EA"), React.createElement("div", {
    className: "text-xs text-gray-400 mt-1"
  }, "\u041A\u043E\u0440\u043D\u0438 \u0438\u0432\u0440\u0438\u0442\u0430 \xB7 \u0443\u0447\u0435\u0431\u043D\u0430\u044F \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0430")), React.createElement("button", {
    onClick: () => setOpen(false),
    className: "md:hidden self-end text-gray-400 text-sm mb-2"
  }, "\u2715 \u0437\u0430\u043A\u0440\u044B\u0442\u044C"), links.map(l => React.createElement("a", {
    key: l.p,
    href: '#/' + l.p,
    onClick: () => setOpen(false),
    className: 'nav-link px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition flex items-center gap-3 ' + (cur === l.p ? 'active' : '')
  }, React.createElement("span", {
    className: "text-lg"
  }, l.i), " ", l.t)), React.createElement("div", {
    className: "mt-auto pt-4 border-t border-white/10 text-xs text-gray-500"
  }, React.createElement("div", null, "\u041F\u043E\u0438\u0441\u043A: ", React.createElement("kbd", null, "Ctrl"), " + ", React.createElement("kbd", null, "K")), React.createElement("div", {
    className: "mt-1"
  }, "\u0423\u0440\u043E\u043A\u043E\u0432: ", DATA.manifest.stats?.lessons_total, " \xB7 \u0422\u0430\u0431\u043B\u0438\u0446: ", DATA.manifest.stats?.tables_total)));
}
function TopBar({
  setSidebar,
  openSearch
}) {
  return React.createElement("div", {
    className: "flex items-center justify-between p-4 glass border-b border-white/10 sticky top-0 z-30"
  }, React.createElement("div", {
    className: "flex items-center gap-3"
  }, React.createElement("button", {
    className: "md:hidden text-2xl",
    onClick: () => setSidebar(true)
  }, "\u2630"), React.createElement("div", {
    className: "text-sm text-gray-400"
  }, "\u0423\u0440\u043E\u0432\u0435\u043D\u044C \u0411\u0435\u0442 \xB7 \u043F\u043E \u043C\u0435\u0442\u043E\u0434\u0438\u043A\u0435 \u0434-\u0440\u0430 \u0418. \u0420\u0430\u043A\u043E\u0432\u0441\u043A\u043E\u0439")), React.createElement("button", {
    onClick: openSearch,
    className: "px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-sm flex items-center gap-2"
  }, React.createElement("span", null, "\uD83D\uDD0D"), React.createElement("span", {
    className: "hidden sm:inline"
  }, "\u041F\u043E\u0438\u0441\u043A"), " ", React.createElement("kbd", null, "Ctrl+K")));
}
function Home({
  progress,
  navigate
}) {
  const total = DATA.manifest.stats?.lessons_total || 0;
  const done = Object.keys(progress.lessons || {}).length;
  const lastLesson = progress.lastLesson;
  return React.createElement("div", {
    className: "p-6 max-w-6xl mx-auto"
  }, React.createElement("h1", {
    className: "text-4xl font-bold mb-2"
  }, "\u0428\u0430\u043B\u043E\u043C, ", React.createElement("span", {
    className: "gradient-text"
  }, "\u0443\u0447\u0438\u043C \u0438\u0432\u0440\u0438\u0442")), React.createElement("p", {
    className: "text-gray-400 mb-8"
  }, "132 \u0443\u0440\u043E\u043A\u0430 \u043A\u0443\u0440\u0441\u0430 \xAB\u041A\u043E\u0440\u043D\u0438 \u0438\u0432\u0440\u0438\u0442\u0430\xBB, 68 \u0433\u0440\u0430\u043C\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0445 \u0442\u0430\u0431\u043B\u0438\u0446, \u0438\u043D\u0442\u0435\u0440\u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0439 \u0433\u0430\u0439\u0434 \u043F\u043E \u0431\u0438\u043D\u044C\u044F\u043D\u0430\u043C \u0438 \u0448\u0435\u0441\u0442\u044C \u043C\u0435\u0445\u0430\u043D\u0438\u043A \u043F\u0440\u0430\u043A\u0442\u0438\u043A\u0438."), React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
  }, React.createElement("div", {
    className: "glass rounded-xl p-5 hover-lift"
  }, React.createElement("div", {
    className: "text-3xl mb-2"
  }, "\uD83D\uDCDA"), React.createElement("div", {
    className: "text-2xl font-bold"
  }, done, "/", total), React.createElement("div", {
    className: "text-sm text-gray-400"
  }, "\u0423\u0440\u043E\u043A\u043E\u0432 \u043F\u0440\u043E\u0439\u0434\u0435\u043D\u043E"), React.createElement("div", {
    className: "mt-2 h-2 bg-white/5 rounded-full overflow-hidden"
  }, React.createElement("div", {
    className: "h-full bg-gradient-to-r from-purple-500 to-pink-500",
    style: {
      width: (total ? done / total * 100 : 0) + '%'
    }
  }))), React.createElement("div", {
    className: "glass rounded-xl p-5 hover-lift"
  }, React.createElement("div", {
    className: "text-3xl mb-2"
  }, "\uD83C\uDFAF"), React.createElement("div", {
    className: "text-2xl font-bold"
  }, Object.keys(progress.words || {}).length), React.createElement("div", {
    className: "text-sm text-gray-400"
  }, "\u0421\u043B\u043E\u0432 \u0432 \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0439 \u043F\u0430\u043C\u044F\u0442\u0438")), React.createElement("div", {
    className: "glass rounded-xl p-5 hover-lift"
  }, React.createElement("div", {
    className: "text-3xl mb-2"
  }, "\uD83D\uDD25"), React.createElement("div", {
    className: "text-2xl font-bold"
  }, progress.streak || 0), React.createElement("div", {
    className: "text-sm text-gray-400"
  }, "\u0414\u043D\u0435\u0439 \u043F\u043E\u0434\u0440\u044F\u0434"))), lastLesson && React.createElement("div", {
    className: "glass rounded-xl p-5 mb-6 flex items-center justify-between"
  }, React.createElement("div", null, React.createElement("div", {
    className: "text-sm text-gray-400"
  }, "\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C"), React.createElement("div", {
    className: "font-semibold"
  }, lastLesson.title)), React.createElement("a", {
    href: '#/lesson/' + encodeURIComponent(lastLesson.id),
    className: "px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg"
  }, "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u2192")), React.createElement("div", {
    className: "glass rounded-xl p-5 mb-6 hover-lift",
    style: {
      background: 'linear-gradient(90deg, rgba(124,58,237,.18), rgba(236,72,153,.18))',
      borderColor: '#a78bfa'
    }
  }, React.createElement("div", {
    className: "flex items-center justify-between gap-4 flex-wrap"
  }, React.createElement("div", null, React.createElement("div", {
    className: "text-xs uppercase text-purple-300 mb-1"
  }, "\u041D\u043E\u0432\u043E\u0435"), React.createElement("div", {
    className: "text-xl font-bold"
  }, "\uD83E\uDDED \u0423\u0447\u0435\u0431\u043D\u044B\u0435 \u0442\u0440\u0435\u043A\u0438"), React.createElement("div", {
    className: "text-sm text-gray-300 mt-1"
  }, "3 \u0442\u0440\u0435\u043A\u0430 \u043F\u043E\u0434 \u0440\u0430\u0437\u043D\u044B\u0435 \u0442\u0438\u043F\u044B \u0432\u043E\u0441\u043F\u0440\u0438\u044F\u0442\u0438\u044F: ", React.createElement("strong", null, "Logical"), " (\u043A\u0430\u043A \u043A\u043E\u0434), ", React.createElement("strong", null, "Visual"), " (mind-map, \u0446\u0432\u0435\u0442\u0430), ", React.createElement("strong", null, "Kinesthetic"), " (drag-drop, \u043F\u0435\u0447\u0430\u0442\u044C).")), React.createElement("a", {
    href: "#/track",
    className: "px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded"
  }, "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u2192"))), React.createElement("h2", {
    className: "text-xl font-bold mb-4 mt-8"
  }, "\u0421 \u0447\u0435\u0433\u043E \u043D\u0430\u0447\u0430\u0442\u044C"), React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
  }, React.createElement(Card, {
    icon: "\uD83E\uDDEE",
    title: "Logical-\u0442\u0440\u0435\u043A",
    desc: "\u0418\u0432\u0440\u0438\u0442 \u043A\u0430\u043A \u043A\u043E\u0434: REPL, decision tree, diff",
    href: "#/track"
  }), React.createElement(Card, {
    icon: "\uD83D\uDCD6",
    title: "\u0412\u0441\u0435 \u0443\u0440\u043E\u043A\u0438",
    desc: "132 \u0443\u0440\u043E\u043A\u0430 \u043A\u0443\u0440\u0441\u0430 \u0432 \u0443\u0434\u043E\u0431\u043D\u043E\u043C \u043F\u043E\u0440\u044F\u0434\u043A\u0435",
    href: "#/course"
  }), React.createElement(Card, {
    icon: "\uD83C\uDF33",
    title: "\u0413\u0430\u0439\u0434 \u043F\u043E \u0431\u0438\u043D\u044C\u044F\u043D\u0430\u043C",
    desc: "\u0418\u043D\u0442\u0435\u0440\u0430\u043A\u0442\u0438\u0432\u043D\u0430\u044F \u0441\u0445\u0435\u043C\u0430, \u043A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0442\u043E\u0440 \u0441\u043B\u043E\u0432\u0430, \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0438\u0442\u0435\u043B\u044C",
    href: "#/binyans"
  }), React.createElement(Card, {
    icon: "\uD83C\uDF31",
    title: "\u041A\u043E\u0440\u043D\u0438",
    desc: "\u0418\u0441\u0441\u043B\u0435\u0434\u0443\u0439\u0442\u0435 \u0441\u043B\u043E\u0432\u0430, \u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043D\u043D\u044B\u0435 \u043E\u0442 \u043E\u0434\u043D\u043E\u0433\u043E \u043A\u043E\u0440\u043D\u044F",
    href: "#/roots"
  }), React.createElement(Card, {
    icon: "\uD83C\uDFAF",
    title: "\u0422\u0440\u0435\u043D\u0430\u0436\u0451\u0440",
    desc: "\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438, \u043A\u0432\u0438\u0437\u044B, \u0430\u0443\u0434\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435, \u043F\u0440\u043E\u0438\u0437\u043D\u043E\u0448\u0435\u043D\u0438\u0435",
    href: "#/practice"
  }), React.createElement(Card, {
    icon: "\uD83D\uDCDD",
    title: "\u0414\u043E\u043C\u0430\u0448\u043A\u0438",
    desc: "\u0423\u043F\u0440\u0430\u0436\u043D\u0435\u043D\u0438\u044F \u0438\u043D\u0442\u0435\u043D\u0441\u0438\u0432\u0430 \u0441 \u0430\u0432\u0442\u043E\u043F\u0440\u043E\u0432\u0435\u0440\u043A\u043E\u0439",
    href: "#/homework"
  }), React.createElement(Card, {
    icon: "\uD83D\uDCCA",
    title: "\u0413\u0440\u0430\u043C\u043C. \u0442\u0430\u0431\u043B\u0438\u0446\u044B",
    desc: "68 \u0442\u0430\u0431\u043B\u0438\u0446 \u0441\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u0439 \u043F\u043E \u0432\u0441\u0435\u043C \u0431\u0438\u043D\u044C\u044F\u043D\u0430\u043C",
    href: "#/tables"
  })));
}
function Card({
  icon,
  title,
  desc,
  href
}) {
  return React.createElement("a", {
    href: href,
    className: "glass rounded-xl p-5 hover-lift block"
  }, React.createElement("div", {
    className: "text-3xl mb-2"
  }, icon), React.createElement("div", {
    className: "font-semibold mb-1"
  }, title), React.createElement("div", {
    className: "text-sm text-gray-400"
  }, desc));
}
function CoursePage() {
  const [q, setQ] = useState('');
  const modules = DATA.manifest.course_modules;
  const filter = l => !q || l.title.toLowerCase().includes(q.toLowerCase()) || l.topics.includes(q.toLowerCase());
  return React.createElement("div", {
    className: "p-6 max-w-6xl mx-auto"
  }, React.createElement("h1", {
    className: "text-3xl font-bold mb-2"
  }, "\u041A\u0443\u0440\u0441 \xAB\u041A\u043E\u0440\u043D\u0438 \u0438\u0432\u0440\u0438\u0442\u0430\xBB"), React.createElement("p", {
    className: "text-gray-400 mb-4"
  }, "\u0423\u0440\u043E\u0432\u0435\u043D\u044C \u0411\u0435\u0442 \u2014 ", DATA.manifest.stats?.lessons_total, " \u0443\u0440\u043E\u043A\u043E\u0432, \u0440\u0430\u0437\u0431\u0438\u0442\u044B\u0445 \u043D\u0430 ", modules.length, " \u043C\u043E\u0434\u0443\u043B\u0435\u0439."), React.createElement("input", {
    type: "text",
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "\u0424\u0438\u043B\u044C\u0442\u0440 \u043F\u043E \u0442\u0435\u043C\u0435 \u0443\u0440\u043E\u043A\u0430\u2026",
    className: "w-full md:w-96 bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-6 outline-none focus:border-purple-500"
  }), modules.map(mod => {
    const list = mod.lessons.filter(filter);
    if (!list.length) return null;
    return React.createElement("details", {
      key: mod.module,
      open: true,
      className: "mb-4"
    }, React.createElement("summary", {
      className: "text-lg font-semibold py-2 px-3 bg-white/5 rounded-lg flex items-center justify-between hover:bg-white/10"
    }, React.createElement("span", null, "\u041C\u043E\u0434\u0443\u043B\u044C ", mod.module), React.createElement("span", {
      className: "text-xs text-gray-400"
    }, list.length, " ", list.length === 1 ? 'урок' : 'уроков')), React.createElement("div", {
      className: "lesson-grid mt-3"
    }, list.map(l => React.createElement(LessonCard, {
      key: l.id,
      l: l
    }))));
  }));
}
function LessonCard({
  l
}) {
  return React.createElement("a", {
    href: '#/lesson/' + encodeURIComponent(l.id),
    className: "glass rounded-xl p-4 hover-lift block"
  }, React.createElement("div", {
    className: "text-xs text-gray-500 mb-1"
  }, "\u041C\u043E\u0434\u0443\u043B\u044C ", l.module, " \xB7 \u0423\u0440\u043E\u043A ", l.lesson_num), React.createElement("div", {
    className: "font-semibold mb-2 leading-snug"
  }, l.title), React.createElement("div", {
    className: "flex flex-wrap gap-1"
  }, l.topics.slice(0, 3).map(t => React.createElement("span", {
    key: t,
    className: "chip"
  }, t))), React.createElement("div", {
    className: "text-xs text-gray-500 mt-3 flex gap-3"
  }, React.createElement("span", null, "\uD83D\uDDBC\uFE0F ", l.images.length), React.createElement("span", null, "\uD83D\uDD0A ", l.audios.length)));
}
function LessonViewer() {
  const route = useRoute();
  const id = decodeURIComponent(route.parts[1] || '');
  const lesson = useMemo(() => {
    let arr = [];
    DATA.manifest.course_modules.forEach(m => arr = arr.concat(m.lessons));
    arr = arr.concat(DATA.manifest.tables, DATA.manifest.kornev);
    return arr.find(x => x.id === id);
  }, [id]);
  const [tab, setTab] = useState('theory');
  const ctx = useContext(AppCtx);
  useEffect(() => {
    if (lesson) ctx.updateProgress(p => {
      p.lessons = p.lessons || {};
      p.lessons[lesson.id] = {
        ts: Date.now()
      };
      p.lastLesson = {
        id: lesson.id,
        title: lesson.title
      };
      return p;
    });
  }, [lesson?.id]);
  if (!lesson) return React.createElement("div", {
    className: "p-6"
  }, "\u0423\u0440\u043E\u043A \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.");
  const vocab = DATA.vocab.words.filter(w => {
    return w.lessons?.includes(lesson.lesson_num) || lesson.topics.some(t => w.topic === t);
  });
  const hw = DATA.homework.find(h => h.lesson_num === lesson.lesson_num);
  return React.createElement("div", {
    className: "max-w-6xl mx-auto p-6"
  }, React.createElement("div", {
    className: "mb-4 flex items-center gap-2 text-sm text-gray-400"
  }, React.createElement("a", {
    href: "#/course",
    className: "hover:text-white"
  }, "\u2190 \u0412\u0441\u0435 \u0443\u0440\u043E\u043A\u0438")), React.createElement("h1", {
    className: "text-3xl font-bold mb-2"
  }, lesson.title), React.createElement("div", {
    className: "text-sm text-gray-400 mb-4"
  }, "\u041C\u043E\u0434\u0443\u043B\u044C ", lesson.module, " \xB7 \u0423\u0440\u043E\u043A ", lesson.lesson_num, " \xB7 ", lesson.topics.map(t => React.createElement("span", {
    key: t,
    className: "chip mr-1"
  }, t))), React.createElement("div", {
    className: "flex gap-1 mb-4 border-b border-white/10"
  }, React.createElement(TabBtn, {
    id: "theory",
    cur: tab,
    setT: setTab
  }, "\uD83D\uDCD6 \u0422\u0435\u043E\u0440\u0438\u044F"), React.createElement(TabBtn, {
    id: "practice",
    cur: tab,
    setT: setTab
  }, "\uD83C\uDFAF \u041F\u0440\u0430\u043A\u0442\u0438\u043A\u0430 (", vocab.length, ")"), hw && React.createElement(TabBtn, {
    id: "homework",
    cur: tab,
    setT: setTab
  }, "\uD83D\uDCDD \u0414\u0417")), tab === 'theory' && React.createElement(TheoryView, {
    lesson: lesson
  }), tab === 'practice' && React.createElement(PracticeHub, {
    vocab: vocab,
    lesson: lesson
  }), tab === 'homework' && hw && React.createElement(HomeworkView, {
    hw: hw
  }));
}
function TabBtn({
  id,
  cur,
  setT,
  children
}) {
  return React.createElement("button", {
    onClick: () => setT(id),
    className: 'px-4 py-2 text-sm rounded-t-lg ' + (cur === id ? 'bg-white/10 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white')
  }, children);
}
function TheoryView({
  lesson
}) {
  const imgs = lesson.images || [];
  const auds = lesson.audios || [];
  const [cur, setCur] = useState(0);
  if (imgs.length === 0) {
    return React.createElement("div", {
      className: "glass rounded-xl p-8 text-center text-gray-400"
    }, React.createElement("div", {
      className: "text-4xl mb-2"
    }, "\uD83D\uDCC4"), React.createElement("div", null, "\u0412 \u044D\u0442\u043E\u043C \u0443\u0440\u043E\u043A\u0435 \u043D\u0435\u0442 \u043A\u0430\u0440\u0442\u0438\u043D\u043E\u043A-\u0441\u043B\u0430\u0439\u0434\u043E\u0432."), lesson.text_inline && React.createElement("div", {
      className: "mt-4 text-left text-sm max-h-96 overflow-y-auto p-3 bg-black/30 rounded"
    }, lesson.text_inline));
  }
  const audSrc = auds[cur] ? lesson.asset_base + auds[cur] : null;
  const imgSrc = lesson.asset_base + imgs[cur];
  return React.createElement("div", {
    className: "space-y-4"
  }, React.createElement("div", {
    className: "glass rounded-xl p-4"
  }, React.createElement("div", {
    className: "flex items-center justify-between mb-3"
  }, React.createElement("div", {
    className: "text-sm text-gray-400"
  }, "\u0421\u043B\u0430\u0439\u0434 ", cur + 1, " \u0438\u0437 ", imgs.length), React.createElement("div", {
    className: "flex gap-2"
  }, React.createElement("button", {
    onClick: () => setCur(c => Math.max(0, c - 1)),
    disabled: cur === 0,
    className: "px-3 py-1 bg-white/5 hover:bg-white/10 rounded disabled:opacity-30"
  }, "\u2190 \u041D\u0430\u0437\u0430\u0434"), React.createElement("button", {
    onClick: () => setCur(c => Math.min(imgs.length - 1, c + 1)),
    disabled: cur === imgs.length - 1,
    className: "px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded disabled:opacity-30"
  }, "\u0414\u0430\u043B\u0435\u0435 \u2192"))), React.createElement("img", {
    className: "lesson-img",
    src: imgSrc,
    alt: 'Слайд ' + (cur + 1),
    onError: e => {
      e.target.outerHTML = '<div class=\"p-8 text-center text-gray-400 bg-gray-900 rounded\">Изображение не загрузилось.<br>Путь: ' + imgSrc + '</div>';
    }
  }), audSrc && React.createElement("div", {
    className: "mt-3 flex items-center gap-3"
  }, React.createElement("audio", {
    controls: true,
    src: audSrc,
    className: "flex-1"
  }))), React.createElement("div", {
    className: "glass rounded-xl p-3 overflow-x-auto scroll-hide"
  }, React.createElement("div", {
    className: "flex gap-2"
  }, imgs.map((img, i) => React.createElement("button", {
    key: i,
    onClick: () => setCur(i),
    className: 'flex-shrink-0 w-16 h-16 rounded border-2 ' + (i === cur ? 'border-purple-500' : 'border-white/10 hover:border-white/30')
  }, React.createElement("img", {
    src: lesson.asset_base + img,
    alt: i + 1,
    className: "w-full h-full object-cover rounded"
  }))))));
}
function PracticeHub({
  vocab,
  lesson
}) {
  const [mode, setMode] = useState(null);
  const v = vocab.length ? vocab : DATA.vocab.words.slice(0, 30);
  if (v.length === 0) {
    return React.createElement("div", {
      className: "glass rounded-xl p-8 text-center text-gray-400"
    }, "\u0414\u043B\u044F \u044D\u0442\u043E\u0433\u043E \u0443\u0440\u043E\u043A\u0430 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0441\u043B\u043E\u0432\u0430\u0440\u044F. \u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0440\u0430\u0437\u0434\u0435\u043B \xAB\u0422\u0440\u0435\u043D\u0430\u0436\u0451\u0440\xBB \u0434\u043B\u044F \u043E\u0431\u0449\u0435\u0433\u043E \u043D\u0430\u0431\u043E\u0440\u0430.");
  }
  const modes = [{
    id: 'flash',
    name: 'Флеш-карточки',
    icon: '🃏',
    desc: 'Spaced repetition (SM-2)'
  }, {
    id: 'quiz',
    name: 'Квиз перевода',
    icon: '❓',
    desc: 'Выбери правильный перевод'
  }, {
    id: 'match',
    name: 'Соедини пары',
    icon: '🔗',
    desc: 'Иврит ↔ Русский'
  }, {
    id: 'build',
    name: 'Собери предложение',
    icon: '🧩',
    desc: 'Из перемешанных слов'
  }, {
    id: 'listen',
    name: 'Аудирование',
    icon: '👂',
    desc: 'Услышать → распознать'
  }, {
    id: 'speak',
    name: 'Произношение',
    icon: '🎙️',
    desc: 'Произнести → проверить'
  }];
  if (mode) {
    const M = {
      flash: FlashCards,
      quiz: QuizMode,
      match: MatchMode,
      build: BuildMode,
      listen: ListenMode,
      speak: SpeakMode
    }[mode];
    return React.createElement("div", null, React.createElement("button", {
      onClick: () => setMode(null),
      className: "mb-3 text-sm text-gray-400 hover:text-white"
    }, "\u2190 \u0412\u0441\u0435 \u043C\u0435\u0445\u0430\u043D\u0438\u043A\u0438"), React.createElement(M, {
      words: v
    }));
  }
  return React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
  }, modes.map(m => React.createElement("button", {
    key: m.id,
    onClick: () => setMode(m.id),
    className: "glass rounded-xl p-5 hover-lift text-left"
  }, React.createElement("div", {
    className: "text-3xl mb-2"
  }, m.icon), React.createElement("div", {
    className: "font-semibold"
  }, m.name), React.createElement("div", {
    className: "text-xs text-gray-400 mt-1"
  }, m.desc))));
}
function FlashCards({
  words
}) {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const ctx = useContext(AppCtx);
  const cur = words[i];
  const grade = q => {
    ctx.updateProgress(p => {
      p.words = p.words || {};
      const s = p.words[cur.id] || {
        ef: 2.5,
        n: 0,
        interval: 0,
        due: 0
      };
      if (q < 3) {
        s.n = 0;
        s.interval = 1;
      } else {
        s.n = (s.n || 0) + 1;
        if (s.n === 1) s.interval = 1;else if (s.n === 2) s.interval = 6;else s.interval = Math.round(s.interval * s.ef);
        s.ef = Math.max(1.3, s.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
      }
      s.due = Date.now() + s.interval * 86400000;
      p.words[cur.id] = s;
      return p;
    });
    setFlipped(false);
    setI(x => (x + 1) % words.length);
  };
  if (!cur) return null;
  return React.createElement("div", {
    className: "max-w-2xl mx-auto"
  }, React.createElement("div", {
    className: "text-center text-sm text-gray-400 mb-2"
  }, i + 1, " / ", words.length), React.createElement("div", {
    className: "card-flip h-72 mb-4",
    style: {
      cursor: 'pointer'
    },
    onClick: () => setFlipped(f => !f)
  }, React.createElement("div", {
    className: "card-flip-inner " + (flipped ? 'flipped' : ''),
    style: {
      height: '100%'
    }
  }, React.createElement("div", {
    className: "card-face glass"
  }, React.createElement("div", {
    className: "text-center"
  }, React.createElement("div", {
    className: "he-lg mb-3",
    style: {
      fontSize: '3em'
    }
  }, cur.he), React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      speak(cur.he);
    },
    className: "px-3 py-1 bg-white/5 rounded hover:bg-white/10 text-sm"
  }, "\uD83D\uDD0A \u041F\u0440\u043E\u0438\u0437\u043D\u0435\u0441\u0442\u0438"), cur.translit && React.createElement("div", {
    className: "text-gray-400 mt-2 text-sm"
  }, "[", cur.translit, "]"), React.createElement("div", {
    className: "text-xs text-gray-500 mt-4"
  }, "\u041D\u0430\u0436\u043C\u0438\u0442\u0435, \u0447\u0442\u043E\u0431\u044B \u043F\u0435\u0440\u0435\u0432\u0435\u0440\u043D\u0443\u0442\u044C"))), React.createElement("div", {
    className: "card-face card-back glass"
  }, React.createElement("div", {
    className: "text-center"
  }, React.createElement("div", {
    className: "text-3xl mb-2"
  }, cur.ru), cur.root && React.createElement("div", {
    className: "text-sm text-gray-400 he"
  }, "\u043A\u043E\u0440\u0435\u043D\u044C: ", cur.root), cur.binyan && React.createElement("div", {
    className: "text-sm text-gray-400 mt-1"
  }, "\u0431\u0438\u043D\u044C\u044F\u043D: ", cur.binyan))))), flipped && React.createElement("div", {
    className: "grid grid-cols-2 md:grid-cols-4 gap-2"
  }, React.createElement("button", {
    onClick: () => grade(0),
    className: "py-3 bg-red-600/30 hover:bg-red-600/50 rounded"
  }, "\uD83D\uDE23 \u041D\u0435 \u0437\u043D\u0430\u043B"), React.createElement("button", {
    onClick: () => grade(3),
    className: "py-3 bg-yellow-600/30 hover:bg-yellow-600/50 rounded"
  }, "\uD83E\uDD14 \u0421 \u0442\u0440\u0443\u0434\u043E\u043C"), React.createElement("button", {
    onClick: () => grade(4),
    className: "py-3 bg-blue-600/30 hover:bg-blue-600/50 rounded"
  }, "\uD83D\uDE42 \u0425\u043E\u0440\u043E\u0448\u043E"), React.createElement("button", {
    onClick: () => grade(5),
    className: "py-3 bg-green-600/30 hover:bg-green-600/50 rounded"
  }, "\uD83E\uDD29 \u041B\u0435\u0433\u043A\u043E")));
}
function QuizMode({
  words
}) {
  const [i, setI] = useState(0);
  const [choice, setChoice] = useState(null);
  const [score, setScore] = useState({
    correct: 0,
    total: 0
  });
  const cur = words[i];
  const options = useMemo(() => {
    if (!cur) return [];
    const wrong = [...DATA.vocab.words].filter(w => w.id !== cur.id && w.ru !== cur.ru).sort(() => Math.random() - 0.5).slice(0, 3);
    return [...wrong, cur].sort(() => Math.random() - 0.5);
  }, [i, cur?.id]);
  if (!cur) return null;
  const next = () => {
    setChoice(null);
    setI(x => (x + 1) % words.length);
  };
  return React.createElement("div", {
    className: "max-w-2xl mx-auto"
  }, React.createElement("div", {
    className: "text-center text-sm text-gray-400 mb-2"
  }, i + 1, " / ", words.length, " \xB7 \u041E\u0447\u043A\u0438: ", score.correct, "/", score.total), React.createElement("div", {
    className: "glass rounded-xl p-8 text-center mb-4"
  }, React.createElement("div", {
    className: "text-sm text-gray-400 mb-3"
  }, "\u041A\u0430\u043A \u043F\u0435\u0440\u0435\u0432\u043E\u0434\u0438\u0442\u0441\u044F?"), React.createElement("div", {
    className: "he-lg",
    style: {
      fontSize: '2.5em'
    }
  }, cur.he), React.createElement("button", {
    onClick: () => speak(cur.he),
    className: "mt-3 px-3 py-1 bg-white/5 rounded text-sm"
  }, "\uD83D\uDD0A")), React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-3"
  }, options.map((opt, k) => {
    const correct = opt.id === cur.id;
    const picked = choice === opt.id;
    let cls = 'glass hover:bg-white/10';
    if (choice) {
      if (correct) cls = 'bg-green-600/30 border-green-500';else if (picked) cls = 'bg-red-600/30 border-red-500';else cls = 'opacity-40';
    }
    return React.createElement("button", {
      key: k,
      disabled: !!choice,
      onClick: () => {
        setChoice(opt.id);
        setScore(s => ({
          correct: s.correct + (correct ? 1 : 0),
          total: s.total + 1
        }));
      },
      className: 'p-4 rounded-xl border border-white/10 text-left transition ' + cls
    }, opt.ru);
  })), choice && React.createElement("div", {
    className: "mt-4 text-center"
  }, React.createElement("button", {
    onClick: next,
    className: "px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded"
  }, "\u0414\u0430\u043B\u044C\u0448\u0435 \u2192")));
}
function MatchMode({
  words
}) {
  const N = Math.min(6, words.length);
  const [pool, setPool] = useState([]);
  const [sel, setSel] = useState(null);
  const [matched, setMatched] = useState({});
  const [errors, setErrors] = useState(0);
  const reshuffle = () => {
    const w = [...words].sort(() => Math.random() - 0.5).slice(0, N);
    const heItems = w.map(x => ({
      id: x.id,
      side: 'he',
      text: x.he
    }));
    const ruItems = w.map(x => ({
      id: x.id,
      side: 'ru',
      text: x.ru
    }));
    setPool([...heItems, ...ruItems].sort(() => Math.random() - 0.5));
    setMatched({});
    setSel(null);
    setErrors(0);
  };
  useEffect(reshuffle, []);
  const click = item => {
    if (matched[item.id]) return;
    if (!sel) {
      setSel(item);
      return;
    }
    if (sel.id === item.id && sel.side !== item.side) {
      setMatched(m => ({
        ...m,
        [item.id]: true
      }));
      setSel(null);
    } else if (sel.id === item.id && sel.side === item.side) {
      setSel(item);
    } else {
      setErrors(e => e + 1);
      setSel(null);
    }
  };
  const allDone = pool.length && Object.keys(matched).length === pool.length / 2;
  return React.createElement("div", {
    className: "max-w-3xl mx-auto"
  }, React.createElement("div", {
    className: "text-center text-sm text-gray-400 mb-4"
  }, "\u0421\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0439: ", Object.keys(matched).length, "/", N, " \xB7 \u041E\u0448\u0438\u0431\u043E\u043A: ", errors), allDone && React.createElement("div", {
    className: "bg-green-600/20 border border-green-500 rounded p-4 mb-4 text-center"
  }, "\uD83C\uDF89 \u0413\u043E\u0442\u043E\u0432\u043E! \u041E\u0448\u0438\u0431\u043E\u043A: ", errors, ".", React.createElement("button", {
    onClick: reshuffle,
    className: "ml-3 px-3 py-1 bg-purple-600 rounded"
  }, "\u0415\u0449\u0451 \u0440\u0430\u0443\u043D\u0434")), React.createElement("div", {
    className: "grid grid-cols-2 md:grid-cols-3 gap-3"
  }, pool.map((it, k) => {
    const done = matched[it.id];
    const selected = sel && sel === it;
    let cls = 'glass hover:bg-white/10';
    if (done) cls = 'bg-green-600/30 opacity-50';else if (selected) cls = 'bg-purple-600/40 border-purple-400';
    return React.createElement("button", {
      key: k,
      onClick: () => click(it),
      className: 'p-4 rounded-xl border border-white/10 transition ' + cls + (it.side === 'he' ? ' he' : '')
    }, it.text);
  })));
}
function BuildMode({
  words
}) {
  const verbs = words.filter(w => w.pos === 'verb');
  const pronouns = DATA.vocab.words.filter(w => w.pos === 'pronoun');
  const sentences = useMemo(() => {
    const list = [];
    verbs.forEach(v => {
      list.push({
        he: ['אֲנִי', v.he].join(' '),
        ru: 'Я ' + v.ru.replace(/^[а-я]+ /, ''),
        tokens: ['אֲנִי', v.he]
      });
    });
    return list.slice(0, 10);
  }, []);
  const [i, setI] = useState(0);
  const cur = sentences[i] || sentences[0];
  const [picked, setPicked] = useState([]);
  const [shuffled, setShuffled] = useState([]);
  const [result, setResult] = useState(null);
  useEffect(() => {
    if (!cur) return;
    setShuffled([...cur.tokens].sort(() => Math.random() - 0.5));
    setPicked([]);
    setResult(null);
  }, [i]);
  if (!cur) return React.createElement("div", {
    className: "text-gray-400 text-center p-8"
  }, "\u0412 \u044D\u0442\u043E\u043C \u043D\u0430\u0431\u043E\u0440\u0435 \u043C\u0430\u043B\u043E \u0433\u043B\u0430\u0433\u043E\u043B\u043E\u0432 \u0434\u043B\u044F \u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u0438 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0439.");
  const pick = (tok, idx) => {
    setPicked(p => [...p, tok]);
    setShuffled(s => s.filter((_, k) => k !== idx));
  };
  const unpick = idx => {
    const tok = picked[idx];
    setPicked(p => p.filter((_, k) => k !== idx));
    setShuffled(s => [...s, tok]);
  };
  const check = () => {
    const ok = picked.join(' ') === cur.tokens.join(' ');
    setResult(ok ? 'correct' : 'wrong');
  };
  const next = () => {
    setI(x => (x + 1) % sentences.length);
  };
  return React.createElement("div", {
    className: "max-w-3xl mx-auto"
  }, React.createElement("div", {
    className: "text-center text-sm text-gray-400 mb-2"
  }, i + 1, "/", sentences.length), React.createElement("div", {
    className: "glass rounded-xl p-5 mb-4"
  }, React.createElement("div", {
    className: "text-sm text-gray-400 mb-2"
  }, "\u0421\u043E\u0431\u0435\u0440\u0438\u0442\u0435 \u0444\u0440\u0430\u0437\u0443: \xAB", cur.ru, "\xBB"), React.createElement("div", {
    className: "min-h-[80px] border-2 border-dashed border-white/10 rounded-xl p-3 flex flex-wrap gap-2 he",
    dir: "rtl"
  }, picked.map((t, k) => React.createElement("button", {
    key: k,
    onClick: () => unpick(k),
    className: "px-3 py-2 bg-purple-600/30 rounded"
  }, t)))), React.createElement("div", {
    className: "flex flex-wrap gap-2 justify-center mb-4 he",
    dir: "rtl"
  }, shuffled.map((t, k) => React.createElement("button", {
    key: k,
    onClick: () => pick(t, k),
    className: "px-3 py-2 glass rounded hover:bg-white/10"
  }, t))), !result && shuffled.length === 0 && React.createElement("button", {
    onClick: check,
    className: "block mx-auto px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded"
  }, "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C"), result === 'correct' && React.createElement("div", {
    className: "bg-green-600/20 border border-green-500 rounded p-3 text-center"
  }, "\u2713 \u0412\u0435\u0440\u043D\u043E! ", React.createElement("button", {
    onClick: next,
    className: "ml-3 px-3 py-1 bg-purple-600 rounded"
  }, "\u0414\u0430\u043B\u044C\u0448\u0435")), result === 'wrong' && React.createElement("div", {
    className: "bg-red-600/20 border border-red-500 rounded p-3 text-center"
  }, "\u2717 \u041D\u0435 \u0442\u0430\u043A. \u041F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E: ", React.createElement("span", {
    className: "he"
  }, cur.tokens.join(' ')), " ", React.createElement("button", {
    onClick: next,
    className: "ml-3 px-3 py-1 bg-purple-600 rounded"
  }, "\u0414\u0430\u043B\u044C\u0448\u0435")));
}
function ListenMode({
  words
}) {
  const [i, setI] = useState(0);
  const cur = words[i];
  const [choice, setChoice] = useState(null);
  const options = useMemo(() => {
    if (!cur) return [];
    const wrong = [...words].filter(w => w.id !== cur.id).sort(() => Math.random() - 0.5).slice(0, 3);
    return [...wrong, cur].sort(() => Math.random() - 0.5);
  }, [i, cur?.id]);
  if (!cur) return null;
  return React.createElement("div", {
    className: "max-w-2xl mx-auto"
  }, React.createElement("div", {
    className: "text-center text-sm text-gray-400 mb-2"
  }, i + 1, " / ", words.length), React.createElement("div", {
    className: "glass rounded-xl p-8 text-center mb-4"
  }, React.createElement("div", {
    className: "text-sm text-gray-400 mb-3"
  }, "\u0427\u0442\u043E \u0432\u044B \u0441\u043B\u044B\u0448\u0438\u0442\u0435?"), React.createElement("button", {
    onClick: () => speak(cur.he),
    className: "text-6xl"
  }, "\uD83D\uDD0A"), React.createElement("div", {
    className: "text-xs text-gray-500 mt-2"
  }, "\u041D\u0430\u0436\u043C\u0438\u0442\u0435, \u0447\u0442\u043E\u0431\u044B \u0443\u0441\u043B\u044B\u0448\u0430\u0442\u044C \u0435\u0449\u0451 \u0440\u0430\u0437")), React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-3 he",
    dir: "rtl"
  }, options.map((opt, k) => {
    const correct = opt.id === cur.id;
    const picked = choice === opt.id;
    let cls = 'glass hover:bg-white/10';
    if (choice) {
      if (correct) cls = 'bg-green-600/30 border-green-500';else if (picked) cls = 'bg-red-600/30 border-red-500';else cls = 'opacity-40';
    }
    return React.createElement("button", {
      key: k,
      disabled: !!choice,
      onClick: () => setChoice(opt.id),
      className: 'p-4 rounded-xl border border-white/10 transition text-xl ' + cls
    }, opt.he);
  })), choice && React.createElement("div", {
    className: "mt-4 text-center"
  }, React.createElement("button", {
    onClick: () => {
      setChoice(null);
      setI(x => (x + 1) % words.length);
    },
    className: "px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded"
  }, "\u0414\u0430\u043B\u044C\u0448\u0435 \u2192")));
}
function SpeakMode({
  words
}) {
  const [i, setI] = useState(0);
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState(null);
  const recRef = useRef(null);
  const cur = words[i];
  const start = () => {
    const r = getSpeechRecognition();
    if (!r) {
      setResult({
        error: 'Распознавание речи недоступно в этом браузере. Используйте Chrome или Edge.'
      });
      return;
    }
    recRef.current = r;
    setResult(null);
    setListening(true);
    r.onresult = e => {
      const heard = e.results[0][0].transcript;
      const sim = similarity(heard, cur.he);
      setResult({
        heard,
        similarity: sim
      });
      setListening(false);
    };
    r.onerror = e => {
      setResult({
        error: 'Ошибка: ' + e.error
      });
      setListening(false);
    };
    r.onend = () => setListening(false);
    r.start();
  };
  if (!cur) return null;
  const score = result?.similarity != null ? Math.round(result.similarity * 100) : null;
  return React.createElement("div", {
    className: "max-w-2xl mx-auto"
  }, React.createElement("div", {
    className: "text-center text-sm text-gray-400 mb-2"
  }, i + 1, " / ", words.length), React.createElement("div", {
    className: "glass rounded-xl p-8 text-center mb-4"
  }, React.createElement("div", {
    className: "text-sm text-gray-400 mb-2"
  }, "\u041F\u0440\u043E\u0438\u0437\u043D\u0435\u0441\u0438\u0442\u0435 \u0432\u0441\u043B\u0443\u0445:"), React.createElement("div", {
    className: "he-lg",
    style: {
      fontSize: '3em'
    }
  }, cur.he), React.createElement("div", {
    className: "text-sm text-gray-400 mt-2"
  }, "[", cur.translit, "] \u2014 ", cur.ru), React.createElement("div", {
    className: "mt-4 flex justify-center gap-3"
  }, React.createElement("button", {
    onClick: () => speak(cur.he),
    className: "px-4 py-2 bg-white/5 hover:bg-white/10 rounded"
  }, "\uD83D\uDD0A \u041F\u043E\u0441\u043B\u0443\u0448\u0430\u0442\u044C \u043E\u0431\u0440\u0430\u0437\u0435\u0446"), React.createElement("button", {
    onClick: start,
    disabled: listening,
    className: 'px-4 py-2 rounded ' + (listening ? 'bg-red-600 pulse-ring' : 'bg-purple-600 hover:bg-purple-500')
  }, listening ? '🎙️ Слушаю…' : '🎙️ Записать'))), result && React.createElement("div", {
    className: "glass rounded-xl p-5 mb-4"
  }, result.error && React.createElement("div", {
    className: "text-red-300"
  }, result.error), result.heard && React.createElement(React.Fragment, null, React.createElement("div", {
    className: "text-sm text-gray-400"
  }, "\u0423\u0441\u043B\u044B\u0448\u0430\u043D\u043E:"), React.createElement("div", {
    className: "he text-2xl mb-2"
  }, result.heard), React.createElement("div", {
    className: "text-sm text-gray-400"
  }, "\u0421\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0435:"), React.createElement("div", {
    className: "h-3 bg-white/5 rounded-full overflow-hidden mb-1"
  }, React.createElement("div", {
    className: 'h-full ' + (score > 80 ? 'bg-green-500' : score > 50 ? 'bg-yellow-500' : 'bg-red-500'),
    style: {
      width: score + '%'
    }
  })), React.createElement("div", {
    className: "text-sm"
  }, score, "%"), React.createElement("div", {
    className: "mt-2 text-xs text-gray-400"
  }, score > 85 ? '🤩 Отлично!' : score > 65 ? '🙂 Неплохо.' : score > 40 ? '🤔 Стоит повторить.' : '😣 Попробуйте снова, медленнее.'))), React.createElement("div", {
    className: "text-center"
  }, React.createElement("button", {
    onClick: () => {
      setResult(null);
      setI(x => (x + 1) % words.length);
    },
    className: "px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded"
  }, "\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0435 \u2192")));
}
function BinyansPage() {
  const [sel, setSel] = useState(null);
  const [tab, setTab] = useState('family');
  return React.createElement("div", {
    className: "p-6 max-w-6xl mx-auto"
  }, React.createElement("h1", {
    className: "text-3xl font-bold mb-2"
  }, "\u0413\u0430\u0439\u0434 \u043F\u043E \u0431\u0438\u043D\u044C\u044F\u043D\u0430\u043C"), React.createElement("p", {
    className: "text-gray-400 mb-6"
  }, "\u0421\u0435\u043C\u044C \u043C\u043E\u0434\u0435\u043B\u0435\u0439 \u0433\u043B\u0430\u0433\u043E\u043B\u043E\u0432 \u0432 \u0438\u0432\u0440\u0438\u0442\u0435. \u041A\u0430\u0436\u0434\u044B\u0439 \u0431\u0438\u043D\u044C\u044F\u043D \u0437\u0430\u0434\u0430\u0451\u0442 \u043E\u0442\u0442\u0435\u043D\u043E\u043A \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F \u043A\u043E\u0440\u043D\u044F: \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0439/\u043F\u0430\u0441\u0441\u0438\u0432\u043D\u044B\u0439, \u043F\u0440\u043E\u0441\u0442\u043E\u0439/\u0443\u0441\u0438\u043B\u0435\u043D\u043D\u044B\u0439/\u043A\u0430\u0443\u0437\u0430\u0442\u0438\u0432\u043D\u044B\u0439."), React.createElement("div", {
    className: "flex gap-1 mb-6 border-b border-white/10 overflow-x-auto"
  }, React.createElement(TabBtn, {
    id: "family",
    cur: tab,
    setT: setTab
  }, "\uD83C\uDF33 \u0421\u0435\u043C\u044C\u044F \u0431\u0438\u043D\u044C\u044F\u043D\u043E\u0432"), React.createElement(TabBtn, {
    id: "builder",
    cur: tab,
    setT: setTab
  }, "\uD83D\uDEE0 \u041A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0442\u043E\u0440 \u0441\u043B\u043E\u0432\u0430"), React.createElement(TabBtn, {
    id: "detector",
    cur: tab,
    setT: setTab
  }, "\uD83D\uDD0D \u041E\u043F\u0440\u0435\u0434\u0435\u043B\u0438\u0442\u0435\u043B\u044C"), React.createElement(TabBtn, {
    id: "gzarot",
    cur: tab,
    setT: setTab
  }, "\uD83D\uDCD1 \u0413\u0437\u0430\u0440\u043E\u0442")), tab === 'family' && React.createElement(BinyanFamily, {
    sel: sel,
    setSel: setSel
  }), tab === 'builder' && React.createElement(RootBuilder, null), tab === 'detector' && React.createElement(BinyanDetector, null), tab === 'gzarot' && React.createElement(GzarotView, null));
}
function BinyanFamily({
  sel,
  setSel
}) {
  const map = {};
  DATA.vocab.binyans.forEach(b => {
    const k = b.voice + ':' + b.intensity;
    map[k] = b;
  });
  const voices = [{
    id: 'active',
    name: 'Активный',
    icon: '➡️'
  }, {
    id: 'passive_or_reflexive',
    name: 'Пассив/возврат',
    icon: '↩️'
  }, {
    id: 'passive',
    name: 'Пассив',
    icon: '⬅️'
  }, {
    id: 'reflexive',
    name: 'Возвратный',
    icon: '🔄'
  }];
  const intensities = [{
    id: 'simple',
    name: 'Простое'
  }, {
    id: 'intensive',
    name: 'Усиленное'
  }, {
    id: 'causative',
    name: 'Каузатив'
  }];
  return React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-3 gap-4"
  }, React.createElement("div", {
    className: "lg:col-span-2 glass rounded-xl p-5"
  }, React.createElement("h3", {
    className: "font-semibold mb-3"
  }, "\u041A\u0430\u0440\u0442\u0430 \u0441\u0435\u043C\u0435\u0439\u0441\u0442\u0432\u0430"), React.createElement("div", {
    className: "text-xs text-gray-400 mb-3"
  }, "\u041F\u043E \u0432\u0435\u0440\u0442\u0438\u043A\u0430\u043B\u0438 \u2014 \u0438\u043D\u0442\u0435\u043D\u0441\u0438\u0432\u043D\u043E\u0441\u0442\u044C \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F, \u043F\u043E \u0433\u043E\u0440\u0438\u0437\u043E\u043D\u0442\u0430\u043B\u0438 \u2014 \u0437\u0430\u043B\u043E\u0433."), React.createElement("table", {
    className: "w-full"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    className: "text-left text-xs text-gray-500 p-2"
  }), React.createElement("th", {
    className: "text-xs text-gray-400 p-2"
  }, "\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0439"), React.createElement("th", {
    className: "text-xs text-gray-400 p-2"
  }, "\u041F\u0430\u0441\u0441\u0438\u0432"), React.createElement("th", {
    className: "text-xs text-gray-400 p-2"
  }, "\u0412\u043E\u0437\u0432\u0440\u0430\u0442\u043D\u044B\u0439"))), React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", {
    className: "text-xs text-gray-400 p-2"
  }, "\u041F\u0440\u043E\u0441\u0442\u043E\u0435"), React.createElement("td", null, React.createElement(BinyanTile, {
    b: DATA.vocab.binyans.find(x => x.id === 'paal'),
    onClick: setSel
  })), React.createElement("td", null, React.createElement(BinyanTile, {
    b: DATA.vocab.binyans.find(x => x.id === 'nifal'),
    onClick: setSel,
    label: "\u041D\u0438\u0444\u044A\u0430\u043B\u044C"
  })), React.createElement("td", null)), React.createElement("tr", null, React.createElement("td", {
    className: "text-xs text-gray-400 p-2"
  }, "\u0423\u0441\u0438\u043B\u0435\u043D\u043D\u043E\u0435"), React.createElement("td", null, React.createElement(BinyanTile, {
    b: DATA.vocab.binyans.find(x => x.id === 'piel'),
    onClick: setSel
  })), React.createElement("td", null, React.createElement(BinyanTile, {
    b: DATA.vocab.binyans.find(x => x.id === 'pual'),
    onClick: setSel
  })), React.createElement("td", null, React.createElement(BinyanTile, {
    b: DATA.vocab.binyans.find(x => x.id === 'hitpael'),
    onClick: setSel
  }))), React.createElement("tr", null, React.createElement("td", {
    className: "text-xs text-gray-400 p-2"
  }, "\u041A\u0430\u0443\u0437\u0430\u0442\u0438\u0432"), React.createElement("td", null, React.createElement(BinyanTile, {
    b: DATA.vocab.binyans.find(x => x.id === 'hifil'),
    onClick: setSel
  })), React.createElement("td", null, React.createElement(BinyanTile, {
    b: DATA.vocab.binyans.find(x => x.id === 'hufal'),
    onClick: setSel
  })), React.createElement("td", null))))), React.createElement("div", {
    className: "glass rounded-xl p-5 min-h-[400px]"
  }, sel ? React.createElement(BinyanDetail, {
    b: sel
  }) : React.createElement("div", {
    className: "text-gray-400 text-center mt-12"
  }, React.createElement("div", {
    className: "text-4xl mb-3"
  }, "\uD83D\uDC46"), "\u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u043D\u0430 \u043B\u044E\u0431\u043E\u0439 \u0431\u0438\u043D\u044C\u044F\u043D \u0441\u043B\u0435\u0432\u0430, \u0447\u0442\u043E\u0431\u044B \u0443\u0432\u0438\u0434\u0435\u0442\u044C \u043C\u043E\u0434\u0435\u043B\u044C, \u043F\u0440\u0438\u043C\u0435\u0440\u044B \u0438 \u043B\u043E\u0433\u0438\u043A\u0443 \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u0438\u044F.")));
}
function BinyanTile({
  b,
  onClick,
  label
}) {
  if (!b) return null;
  return React.createElement("button", {
    onClick: () => onClick(b),
    className: "w-full p-3 rounded-lg text-center transition hover:scale-105",
    style: {
      background: b.color + '33',
      border: '1px solid ' + b.color
    }
  }, React.createElement("div", {
    className: "he text-2xl"
  }, b.name_he), React.createElement("div", {
    className: "text-xs"
  }, label || b.name_ru));
}
function BinyanDetail({
  b
}) {
  return React.createElement("div", null, React.createElement("div", {
    className: "mb-3",
    style: {
      borderLeft: '4px solid ' + b.color,
      paddingLeft: '12px'
    }
  }, React.createElement("div", {
    className: "he text-3xl"
  }, b.name_he), React.createElement("div", {
    className: "text-lg font-semibold"
  }, b.name_ru)), React.createElement("p", {
    className: "text-sm text-gray-300 mb-4"
  }, b.meaning), React.createElement("h4", {
    className: "text-xs uppercase text-gray-400 mb-2"
  }, "\u041A\u0430\u043A \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0438\u0442\u044C"), React.createElement("div", {
    className: "text-sm mb-4 bg-white/5 rounded p-3"
  }, b.how_to_detect), React.createElement("h4", {
    className: "text-xs uppercase text-gray-400 mb-2"
  }, "\u041C\u043E\u0434\u0435\u043B\u044C \u0441\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u044F"), React.createElement("table", {
    className: "heb-table w-full mb-4 text-sm"
  }, React.createElement("tbody", null, Object.entries(b.model).map(([k, v]) => React.createElement("tr", {
    key: k
  }, React.createElement("td", {
    className: "text-xs text-gray-400",
    style: {
      direction: 'ltr'
    }
  }, labelRu(k)), React.createElement("td", {
    className: "he"
  }, v))))), React.createElement("h4", {
    className: "text-xs uppercase text-gray-400 mb-2"
  }, "\u041F\u0440\u0438\u043C\u0435\u0440\u044B"), React.createElement("ul", {
    className: "space-y-1"
  }, b.examples.map((e, i) => React.createElement("li", {
    key: i,
    className: "text-sm"
  }, e))));
}
function labelRu(k) {
  return {
    present_m_sg: 'наст. м.р.',
    present_f_sg: 'наст. ж.р.',
    present_m_pl: 'наст. мн.м.',
    present_f_pl: 'наст. мн.ж.',
    past_3m_sg: 'прош. 3 м.р.',
    future_3m_sg: 'буд. 3 м.р.',
    infinitive: 'инфинитив'
  }[k] || k;
}
function RootBuilder() {
  const [root, setRoot] = useState('כ.ת.ב');
  const [bid, setBid] = useState('paal');
  const [tense, setTense] = useState('present_m_sg');
  const b = DATA.vocab.binyans.find(x => x.id === bid);
  const letters = root.replace(/[.\-\s]/g, '').split('');
  function applyRoot(model) {
    if (letters.length < 3) return model;
    return model.replace(/פ/, letters[0]).replace(/ע/, letters[1]).replace(/ל/, letters[2]);
  }
  return React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-2 gap-4"
  }, React.createElement("div", {
    className: "glass rounded-xl p-5"
  }, React.createElement("h3", {
    className: "font-semibold mb-3"
  }, "1. \u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u043E\u0440\u0435\u043D\u044C (3 \u0431\u0443\u043A\u0432\u044B)"), React.createElement("input", {
    type: "text",
    value: root,
    onChange: e => setRoot(e.target.value),
    className: "he text-2xl bg-white/5 border border-white/10 rounded px-3 py-2 w-full mb-4 text-center",
    placeholder: "\u05DB.\u05EA.\u05D1"
  }), React.createElement("div", {
    className: "text-xs text-gray-400 mb-3"
  }, "\u041F\u0440\u0438\u043C\u0435\u0440\u044B: \u05DB.\u05EA.\u05D1 (\u043F\u0438\u0441\u0430\u0442\u044C), \u05DC.\u05DE.\u05D3 (\u0443\u0447\u0438\u0442\u044C), \u05D3.\u05D1.\u05E8 (\u0433\u043E\u0432\u043E\u0440\u0438\u0442\u044C)"), React.createElement("h3", {
    className: "font-semibold mb-3 mt-5"
  }, "2. \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0431\u0438\u043D\u044C\u044F\u043D"), React.createElement("div", {
    className: "grid grid-cols-4 gap-2"
  }, DATA.vocab.binyans.map(x => React.createElement("button", {
    key: x.id,
    onClick: () => setBid(x.id),
    className: 'p-2 rounded text-xs ' + (bid === x.id ? 'ring-2 ring-white' : ''),
    style: {
      background: x.color + '33',
      border: '1px solid ' + x.color
    }
  }, React.createElement("div", {
    className: "he"
  }, x.name_he), React.createElement("div", null, x.name_ru)))), React.createElement("h3", {
    className: "font-semibold mb-3 mt-5"
  }, "3. \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0444\u043E\u0440\u043C\u0443"), React.createElement("select", {
    value: tense,
    onChange: e => setTense(e.target.value),
    className: "bg-white/5 border border-white/10 rounded px-3 py-2 w-full"
  }, Object.keys(b.model).map(k => React.createElement("option", {
    key: k,
    value: k
  }, labelRu(k))))), React.createElement("div", {
    className: "glass rounded-xl p-5"
  }, React.createElement("h3", {
    className: "font-semibold mb-2"
  }, "\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442"), React.createElement("div", {
    className: "bg-black/30 rounded-xl p-6 text-center my-4"
  }, React.createElement("div", {
    className: "text-xs text-gray-400 mb-2"
  }, "\u041C\u043E\u0434\u0435\u043B\u044C"), React.createElement("div", {
    className: "he text-2xl mb-3",
    style: {
      color: b.color
    }
  }, b.model[tense]), React.createElement("div", {
    className: "text-xs text-gray-400 mb-2"
  }, "\u2192 \u0421 \u043A\u043E\u0440\u043D\u0435\u043C ", letters.join('-'), ":"), React.createElement("div", {
    className: "he",
    style: {
      fontSize: '3em',
      color: '#fff'
    }
  }, applyRoot(b.model[tense])), React.createElement("button", {
    onClick: () => speak(applyRoot(b.model[tense])),
    className: "mt-3 px-3 py-1 bg-white/10 rounded text-sm"
  }, "\uD83D\uDD0A \u041F\u0440\u043E\u0438\u0437\u043D\u0435\u0441\u0442\u0438")), React.createElement("div", {
    className: "text-sm text-gray-300"
  }, React.createElement("div", {
    className: "font-semibold mb-1"
  }, "\u041A\u0430\u043A \u0447\u0438\u0442\u0430\u0442\u044C \u043C\u043E\u0434\u0435\u043B\u044C:"), React.createElement("ul", {
    className: "space-y-1 text-xs text-gray-400"
  }, React.createElement("li", null, "\u05E4 \u2014 \u043F\u0435\u0440\u0432\u0430\u044F \u0431\u0443\u043A\u0432\u0430 \u043A\u043E\u0440\u043D\u044F"), React.createElement("li", null, "\u05E2 \u2014 \u0432\u0442\u043E\u0440\u0430\u044F \u0431\u0443\u043A\u0432\u0430 \u043A\u043E\u0440\u043D\u044F"), React.createElement("li", null, "\u05DC \u2014 \u0442\u0440\u0435\u0442\u044C\u044F \u0431\u0443\u043A\u0432\u0430 \u043A\u043E\u0440\u043D\u044F"))), React.createElement("div", {
    className: "mt-4 text-xs text-gray-500"
  }, "\u26A0\uFE0F \u041A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0442\u043E\u0440 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u0431\u0430\u0437\u043E\u0432\u0443\u044E \u043C\u043E\u0434\u0435\u043B\u044C. \u0414\u043B\u044F \u0433\u0437\u0430\u0440\u043E\u0442 (\u05D2\u05E8\u05D5\u05E0\u05D9\u05D5\u05EA, \u05DC\"\u05D4 \u0438 \u0434\u0440.) \u043E\u0433\u043B\u0430\u0441\u043E\u0432\u043A\u0438 \u043C\u043E\u0433\u0443\u0442 \u043E\u0442\u043B\u0438\u0447\u0430\u0442\u044C\u0441\u044F \u2014 \u0441\u043C. \u0440\u0430\u0437\u0434\u0435\u043B \xAB\u0413\u0437\u0430\u0440\u043E\u0442\xBB.")));
}
function BinyanDetector() {
  const [word, setWord] = useState('מְדַבֵּר');
  const detect = w => {
    const s = stripNiqqud(w).trim();
    const candidates = [];
    if (/^מת/.test(s)) candidates.push({
      id: 'hitpael',
      conf: 0.9,
      reason: 'Префикс מִתְ (мит-) → hитпаэль (возвратное действие)'
    });else if (/^נ/.test(s)) candidates.push({
      id: 'nifal',
      conf: 0.85,
      reason: 'Префикс נ → Нифъаль (пассив/возвратное к Паалю)'
    });else if (/^מ/.test(s)) {
      candidates.push({
        id: 'piel',
        conf: 0.6,
        reason: 'Префикс מְ может быть Пиэль (мэ-, активный)'
      });
      candidates.push({
        id: 'pual',
        conf: 0.4,
        reason: 'Префикс מְ может быть Пуаль (му-, пассив)'
      });
      candidates.push({
        id: 'hifil',
        conf: 0.6,
        reason: 'Префикс מַ может быть hифъиль (ма-, каузатив)'
      });
      candidates.push({
        id: 'hufal',
        conf: 0.3,
        reason: 'Префикс מֻ может быть hуфъаль (му-, пассив каузатива)'
      });
    } else if (/^ה/.test(s)) candidates.push({
      id: 'hifil',
      conf: 0.7,
      reason: 'Префикс הִ в прошедшем — hифъиль'
    });else if (/^י/.test(s) && s.length > 3) candidates.push({
      id: 'paal',
      conf: 0.6,
      reason: 'Префикс יִ часто указывает на буд. время Пааль'
    });else candidates.push({
      id: 'paal',
      conf: 0.7,
      reason: 'Корень без префикса — вероятно Пааль (наст. время м.р.)'
    });
    return candidates.sort((a, b) => b.conf - a.conf);
  };
  const cands = detect(word);
  return React.createElement("div", {
    className: "max-w-3xl mx-auto"
  }, React.createElement("div", {
    className: "glass rounded-xl p-5 mb-4"
  }, React.createElement("h3", {
    className: "font-semibold mb-3"
  }, "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0433\u043B\u0430\u0433\u043E\u043B (\u0441 \u043E\u0433\u043B\u0430\u0441\u043E\u0432\u043A\u0430\u043C\u0438 \u0438\u043B\u0438 \u0431\u0435\u0437)"), React.createElement("input", {
    type: "text",
    value: word,
    onChange: e => setWord(e.target.value),
    className: "he text-3xl bg-white/5 border border-white/10 rounded px-4 py-3 w-full text-center",
    dir: "rtl"
  }), React.createElement("div", {
    className: "text-xs text-gray-400 mt-2"
  }, "\u041F\u0440\u0438\u043C\u0435\u0440\u044B: \u05DE\u05B0\u05D3\u05B7\u05D1\u05B5\u05BC\u05E8 (\u0433\u043E\u0432\u043E\u0440\u0438\u0442, \u041F\u0438\u044D\u043B\u044C), \u05DE\u05B7\u05EA\u05B0\u05D7\u05B4\u05D9\u05DC (\u043D\u0430\u0447\u0438\u043D\u0430\u0435\u0442, h\u0438\u0444\u044A\u0438\u043B\u044C), \u05E0\u05B4\u05DB\u05B0\u05E0\u05B8\u05E1 (\u0432\u0445\u043E\u0434\u0438\u0442, \u041D\u0438\u0444\u044A\u0430\u043B\u044C), \u05DE\u05B4\u05EA\u05B0\u05DC\u05B7\u05D1\u05B5\u05BC\u05E9\u05C1 (\u043E\u0434\u0435\u0432\u0430\u0435\u0442\u0441\u044F, h\u0438\u0442\u043F\u0430\u044D\u043B\u044C)")), React.createElement("h4", {
    className: "text-xs uppercase text-gray-400 mb-2"
  }, "\u0412\u043E\u0437\u043C\u043E\u0436\u043D\u044B\u0435 \u0431\u0438\u043D\u044C\u044F\u043D\u044B:"), React.createElement("div", {
    className: "space-y-2"
  }, cands.map((c, i) => {
    const b = DATA.vocab.binyans.find(x => x.id === c.id);
    return React.createElement("div", {
      key: i,
      className: "glass rounded-xl p-4 flex gap-4 items-center",
      style: {
        borderLeft: '4px solid ' + b.color
      }
    }, React.createElement("div", {
      className: "he text-3xl",
      style: {
        color: b.color
      }
    }, b.name_he), React.createElement("div", {
      className: "flex-1"
    }, React.createElement("div", {
      className: "font-semibold"
    }, b.name_ru), React.createElement("div", {
      className: "text-sm text-gray-400"
    }, c.reason)), React.createElement("div", {
      className: "text-right"
    }, React.createElement("div", {
      className: "text-xs text-gray-400"
    }, "\u0423\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C"), React.createElement("div", {
      className: "text-lg"
    }, Math.round(c.conf * 100), "%")));
  })));
}
function GzarotView() {
  return React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, DATA.vocab.gzarot.map(g => React.createElement("div", {
    key: g.id,
    className: "glass rounded-xl p-5"
  }, React.createElement("div", {
    className: "flex items-baseline justify-between mb-2"
  }, React.createElement("h3", {
    className: "font-semibold"
  }, g.name_ru), React.createElement("div", {
    className: "he chip-binyan chip"
  }, g.short)), React.createElement("p", {
    className: "text-sm text-gray-300 mb-3"
  }, g.desc), React.createElement("div", {
    className: "text-xs text-gray-400"
  }, "\u041F\u0440\u0438\u043C\u0435\u0440\u044B:"), React.createElement("div", {
    className: "he flex gap-2 mt-1"
  }, g.examples.join(' · ')))));
}
function RootsPage() {
  const byRoot = {};
  DATA.vocab.words.forEach(w => {
    if (w.root) {
      (byRoot[w.root] = byRoot[w.root] || []).push(w);
    }
  });
  const roots = Object.entries(byRoot).sort((a, b) => b[1].length - a[1].length);
  const [sel, setSel] = useState(roots[0]?.[0] || null);
  const cur = sel ? byRoot[sel] : [];
  return React.createElement("div", {
    className: "p-6 max-w-6xl mx-auto"
  }, React.createElement("h1", {
    className: "text-3xl font-bold mb-2"
  }, "\u041A\u043E\u0440\u043D\u0438"), React.createElement("p", {
    className: "text-gray-400 mb-6"
  }, "\u041A\u0430\u0436\u0434\u043E\u0435 \u0441\u043B\u043E\u0432\u043E \u0432 \u0438\u0432\u0440\u0438\u0442\u0435 \u043F\u043E\u0441\u0442\u0440\u043E\u0435\u043D\u043E \u0432\u043E\u043A\u0440\u0443\u0433 \u043A\u043E\u0440\u043D\u044F \u0438\u0437 3 (\u0438\u043D\u043E\u0433\u0434\u0430 4) \u0431\u0443\u043A\u0432. \u0418\u0437\u0443\u0447\u0430\u044F \u043A\u043E\u0440\u0435\u043D\u044C, \u0432\u044B \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442\u0435 \u0434\u043E\u0441\u0442\u0443\u043F \u043A \u0441\u0435\u043C\u044C\u0435 \u0440\u043E\u0434\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0445 \u0441\u043B\u043E\u0432."), React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-3 gap-4"
  }, React.createElement("div", {
    className: "glass rounded-xl p-3 max-h-[600px] overflow-y-auto"
  }, roots.map(([r, ws]) => React.createElement("button", {
    key: r,
    onClick: () => setSel(r),
    className: 'w-full text-left p-3 rounded mb-1 flex justify-between ' + (sel === r ? 'bg-purple-600/30' : 'hover:bg-white/5')
  }, React.createElement("span", {
    className: "he text-lg"
  }, r), React.createElement("span", {
    className: "text-xs text-gray-400"
  }, ws.length, " \u0441\u043B\u043E\u0432")))), React.createElement("div", {
    className: "lg:col-span-2 glass rounded-xl p-5"
  }, sel && React.createElement(React.Fragment, null, React.createElement("div", {
    className: "he text-5xl text-center mb-2"
  }, sel), React.createElement("div", {
    className: "text-center text-sm text-gray-400 mb-4"
  }, "\u041A\u043E\u0440\u0435\u043D\u044C \xB7 ", cur.length, " \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u043D\u044B\u0445 \u0441\u043B\u043E\u0432"), React.createElement("div", {
    className: "space-y-2"
  }, cur.map(w => React.createElement("div", {
    key: w.id,
    className: "bg-white/5 rounded-lg p-3 flex justify-between items-center"
  }, React.createElement("div", null, React.createElement("div", {
    className: "he text-xl"
  }, w.he), React.createElement("div", {
    className: "text-sm text-gray-400"
  }, w.ru, " \xB7 [", w.translit, "]")), React.createElement("div", {
    className: "text-right text-xs"
  }, w.binyan && React.createElement("div", {
    className: "chip"
  }, w.binyan), React.createElement("button", {
    onClick: () => speak(w.he),
    className: "mt-1 px-2 py-1 bg-white/5 rounded"
  }, "\uD83D\uDD0A")))))))));
}
function DictionaryPage() {
  const [q, setQ] = useState('');
  const [topic, setTopic] = useState('all');
  const words = useMemo(() => {
    const qn = stripNiqqud(q.toLowerCase().trim());
    return DATA.vocab.words.filter(w => {
      if (topic !== 'all' && w.topic !== topic) return false;
      if (!qn) return true;
      return stripNiqqud(w.he).toLowerCase().includes(qn) || (w.translit || '').toLowerCase().includes(qn) || w.ru.toLowerCase().includes(qn) || (w.root || '').includes(qn);
    });
  }, [q, topic]);
  const topics = ['all', ...new Set(DATA.vocab.words.map(w => w.topic))];
  return React.createElement("div", {
    className: "p-6 max-w-6xl mx-auto"
  }, React.createElement("h1", {
    className: "text-3xl font-bold mb-2"
  }, "\u0421\u043B\u043E\u0432\u0430\u0440\u044C"), React.createElement("p", {
    className: "text-gray-400 mb-4"
  }, DATA.vocab.words.length, " \u0441\u043B\u043E\u0432 \u0443\u0440\u043E\u0432\u043D\u044F \u0410\u043B\u0435\u0444\u2013\u0411\u0435\u0442."), React.createElement("div", {
    className: "flex gap-2 mb-4 flex-wrap"
  }, React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "\u041F\u043E\u0438\u0441\u043A: \u0438\u0432\u0440\u0438\u0442 / \u0442\u0440\u0430\u043D\u0441\u043B\u0438\u0442 / \u0440\u0443\u0441\u0441\u043A\u0438\u0439 / \u043A\u043E\u0440\u0435\u043D\u044C\u2026",
    className: "flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-purple-500"
  }), React.createElement("select", {
    value: topic,
    onChange: e => setTopic(e.target.value),
    className: "bg-white/5 border border-white/10 rounded-lg px-3 py-2"
  }, topics.map(t => React.createElement("option", {
    key: t,
    value: t
  }, t === 'all' ? 'все темы' : t)))), React.createElement("div", {
    className: "text-sm text-gray-400 mb-3"
  }, "\u041D\u0430\u0439\u0434\u0435\u043D\u043E: ", words.length), React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
  }, words.map(w => React.createElement("div", {
    key: w.id,
    className: "glass rounded-xl p-4 hover-lift"
  }, React.createElement("div", {
    className: "flex justify-between items-start mb-1"
  }, React.createElement("div", {
    className: "he text-2xl"
  }, w.he), React.createElement("button", {
    onClick: () => speak(w.he),
    className: "text-lg"
  }, "\uD83D\uDD0A")), React.createElement("div", {
    className: "text-sm text-gray-400"
  }, "[", w.translit, "]"), React.createElement("div", {
    className: "text-base mt-1"
  }, w.ru), React.createElement("div", {
    className: "flex gap-1 mt-2 flex-wrap"
  }, w.binyan && React.createElement("span", {
    className: "chip"
  }, w.binyan), w.root && React.createElement("span", {
    className: "chip he"
  }, w.root), React.createElement("span", {
    className: "chip"
  }, w.topic))))));
}
function TablesPage() {
  const [q, setQ] = useState('');
  const t = DATA.manifest.tables.filter(x => !q || x.title.toLowerCase().includes(q.toLowerCase()));
  return React.createElement("div", {
    className: "p-6 max-w-6xl mx-auto"
  }, React.createElement("h1", {
    className: "text-3xl font-bold mb-4"
  }, "\u0413\u0440\u0430\u043C\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0442\u0430\u0431\u043B\u0438\u0446\u044B"), React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "\u0424\u0438\u043B\u044C\u0442\u0440\u2026",
    className: "bg-white/5 border border-white/10 rounded px-3 py-2 w-full md:w-96 mb-4"
  }), React.createElement("div", {
    className: "lesson-grid"
  }, t.map(l => React.createElement(LessonCard, {
    key: l.id,
    l: l
  }))));
}
function PracticePage() {
  const all = DATA.vocab.words;
  return React.createElement("div", {
    className: "p-6 max-w-6xl mx-auto"
  }, React.createElement("h1", {
    className: "text-3xl font-bold mb-2"
  }, "\u0422\u0440\u0435\u043D\u0430\u0436\u0451\u0440"), React.createElement("p", {
    className: "text-gray-400 mb-6"
  }, "\u0428\u0435\u0441\u0442\u044C \u043C\u0435\u0445\u0430\u043D\u0438\u043A \u0438\u0437 \u043E\u0431\u0449\u0435\u0433\u043E \u0441\u043B\u043E\u0432\u0430\u0440\u044F (", all.length, " \u0441\u043B\u043E\u0432)."), React.createElement(PracticeHub, {
    vocab: all,
    lesson: null
  }));
}
function HomeworkPage() {
  const list = DATA.homework;
  return React.createElement("div", {
    className: "p-6 max-w-6xl mx-auto"
  }, React.createElement("h1", {
    className: "text-3xl font-bold mb-2"
  }, "\u0414\u043E\u043C\u0430\u0448\u043D\u0438\u0435 \u0437\u0430\u0434\u0430\u043D\u0438\u044F"), React.createElement("p", {
    className: "text-gray-400 mb-6"
  }, "\u0423\u043F\u0440\u0430\u0436\u043D\u0435\u043D\u0438\u044F \u0438\u043D\u0442\u0435\u043D\u0441\u0438\u0432\u0430 \xAB\u0411\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u044B\u0439 \u0438\u043D\u0442\u0435\u043D\u0441\u0438\u0432 \u0411\u0435\u0442\xBB. \u0422\u0435\u043A\u0441\u0442\u044B \u0414\u0417 \u0438\u0437\u0432\u043B\u0435\u0447\u0435\u043D\u044B \u0438\u0437 PDF, \u044D\u0442\u0430\u043B\u043E\u043D\u043D\u044B\u0435 \u0440\u0435\u0448\u0435\u043D\u0438\u044F \u0443\u0447\u0435\u043D\u0438\u043A\u043E\u0432 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u044B."), React.createElement("div", {
    className: "space-y-3"
  }, list.map(h => React.createElement(HomeworkView, {
    key: h.lesson_num,
    hw: h
  }))));
}
function HomeworkView({
  hw
}) {
  const [showSol, setShowSol] = useState(false);
  return React.createElement("details", {
    className: "glass rounded-xl p-4"
  }, React.createElement("summary", {
    className: "font-semibold py-2"
  }, "\u0423\u0440\u043E\u043A ", hw.lesson_num, " \xB7 ", hw.exercises_count, " \u0443\u043F\u0440\u0430\u0436\u043D\u0435\u043D\u0438\u0439"), React.createElement("div", {
    className: "mt-3 space-y-3"
  }, hw.exercises_preview.map((ex, i) => React.createElement(ExerciseChecker, {
    key: i,
    text: ex,
    solutions: hw.solutions,
    index: i
  }))), hw.solutions?.length > 0 && React.createElement("div", {
    className: "mt-4 pt-4 border-t border-white/10"
  }, React.createElement("button", {
    onClick: () => setShowSol(s => !s),
    className: "px-3 py-1 bg-white/5 rounded text-sm hover:bg-white/10"
  }, showSol ? 'Скрыть' : 'Показать', " \u044D\u0442\u0430\u043B\u043E\u043D\u043D\u044B\u0435 \u0440\u0435\u0448\u0435\u043D\u0438\u044F (", hw.solutions.length, ")"), showSol && React.createElement("div", {
    className: "mt-3 space-y-2"
  }, hw.solutions.map((s, i) => React.createElement("details", {
    key: i,
    className: "bg-black/30 rounded p-3"
  }, React.createElement("summary", {
    className: "text-sm"
  }, s.file), React.createElement("pre", {
    className: "text-xs mt-2 whitespace-pre-wrap text-gray-300"
  }, s.text))))));
}
function ExerciseChecker({
  text,
  solutions,
  index
}) {
  const [ans, setAns] = useState('');
  const [check, setCheck] = useState(null);
  const doCheck = () => {
    if (!solutions || !solutions.length) {
      setCheck({
        ok: null,
        msg: 'Эталонных решений для этого ДЗ нет. Сравните с разбором на видео или с примерами в теории урока.'
      });
      return;
    }
    const myHe = new Set(ans.match(/[֐-׿]+/g) || []);
    let bestMatch = 0;
    let bestText = '';
    solutions.forEach(s => {
      const refHe = new Set(s.text.match(/[֐-׿]+/g) || []);
      let m = 0;
      refHe.forEach(w => {
        if (myHe.has(w)) m++;
      });
      if (m > bestMatch) {
        bestMatch = m;
        bestText = s.file;
      }
    });
    if (bestMatch === 0) {
      setCheck({
        ok: false,
        msg: 'В вашем ответе не нашли ивритских слов из эталонов. Попробуйте писать ответы на иврите.'
      });
    } else {
      setCheck({
        ok: true,
        msg: `Совпадает ${bestMatch} ивритских слов с решением «${bestText}». Это хороший сигнал — но финальный разбор лучше посмотреть на видео.`
      });
    }
  };
  return React.createElement("div", {
    className: "bg-white/5 rounded-lg p-3"
  }, React.createElement("div", {
    className: "text-xs text-gray-400 mb-1"
  }, "\u0423\u043F\u0440\u0430\u0436\u043D\u0435\u043D\u0438\u0435 ", index + 1), React.createElement("pre", {
    className: "text-sm whitespace-pre-wrap text-gray-200 mb-2"
  }, text), React.createElement("textarea", {
    value: ans,
    onChange: e => setAns(e.target.value),
    rows: 3,
    placeholder: "\u0412\u0430\u0448 \u043E\u0442\u0432\u0435\u0442 (\u043C\u043E\u0436\u043D\u043E \u043D\u0430 \u0438\u0432\u0440\u0438\u0442\u0435 \u0438/\u0438\u043B\u0438 \u0440\u0443\u0441\u0441\u043A\u043E\u043C)\u2026",
    className: "w-full bg-black/30 border border-white/10 rounded p-2 text-sm"
  }), React.createElement("button", {
    onClick: doCheck,
    className: "mt-2 px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded text-sm"
  }, "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C"), check && React.createElement("div", {
    className: 'mt-2 p-2 rounded text-sm ' + (check.ok === true ? 'bg-green-600/20' : 'bg-yellow-600/20')
  }, check.msg));
}
function SearchModal({
  open,
  onClose
}) {
  const [q, setQ] = useState('');
  const ref = useRef();
  useEffect(() => {
    if (open && ref.current) ref.current.focus();
  }, [open]);
  if (!open) return null;
  const qn = stripNiqqud(q.toLowerCase());
  let lessons = [];
  if (qn) {
    DATA.manifest.course_modules.forEach(m => m.lessons.forEach(l => {
      if (l.title.toLowerCase().includes(qn)) lessons.push(l);
    }));
  }
  const words = qn ? DATA.vocab.words.filter(w => stripNiqqud(w.he).includes(qn) || (w.translit || '').toLowerCase().includes(qn) || w.ru.toLowerCase().includes(qn)).slice(0, 15) : [];
  return React.createElement("div", {
    className: "fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-20",
    onClick: onClose
  }, React.createElement("div", {
    className: "glass rounded-xl w-full max-w-2xl p-4 mx-4",
    onClick: e => e.stopPropagation()
  }, React.createElement("input", {
    ref: ref,
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u0443\u0440\u043E\u043A\u0430\u043C, \u0441\u043B\u043E\u0432\u0430\u043C, \u043A\u043E\u0440\u043D\u044F\u043C\u2026",
    className: "w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-lg outline-none focus:border-purple-500"
  }), React.createElement("div", {
    className: "mt-4 max-h-96 overflow-y-auto"
  }, lessons.length > 0 && React.createElement("div", {
    className: "text-xs uppercase text-gray-400 mb-2"
  }, "\u0423\u0440\u043E\u043A\u0438"), lessons.slice(0, 8).map(l => React.createElement("a", {
    key: l.id,
    href: '#/lesson/' + encodeURIComponent(l.id),
    onClick: onClose,
    className: "block p-2 hover:bg-white/5 rounded"
  }, React.createElement("div", {
    className: "text-sm"
  }, l.title), React.createElement("div", {
    className: "text-xs text-gray-500"
  }, "\u041C\u043E\u0434\u0443\u043B\u044C ", l.module, " \xB7 \u0423\u0440\u043E\u043A ", l.lesson_num))), words.length > 0 && React.createElement("div", {
    className: "text-xs uppercase text-gray-400 mb-2 mt-3"
  }, "\u0421\u043B\u043E\u0432\u0430"), words.map(w => React.createElement("div", {
    key: w.id,
    className: "p-2 hover:bg-white/5 rounded flex justify-between items-center"
  }, React.createElement("div", null, React.createElement("span", {
    className: "he text-xl"
  }, w.he), React.createElement("span", {
    className: "text-sm text-gray-400 ml-3"
  }, w.ru)), React.createElement("button", {
    onClick: () => speak(w.he),
    className: "text-lg"
  }, "\uD83D\uDD0A"))), qn && !lessons.length && !words.length && React.createElement("div", {
    className: "text-gray-400 text-center py-6"
  }, "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E"), !qn && React.createElement("div", {
    className: "text-gray-500 text-sm text-center py-6"
  }, "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0437\u0430\u043F\u0440\u043E\u0441 \u0434\u043B\u044F \u043F\u043E\u0438\u0441\u043A\u0430 \u043F\u043E 132 \u0443\u0440\u043E\u043A\u0430\u043C \u0438 135 \u0441\u043B\u043E\u0432\u0430\u043C."))));
}
function App() {
  const route = useRoute();
  const [progress, setProgress] = useState(loadProgress());
  const [sidebar, setSidebar] = useState(false);
  const [search, setSearch] = useState(false);
  const updateProgress = fn => {
    setProgress(p => {
      const np = fn({
        ...p
      });
      saveProgress(np);
      return np;
    });
  };
  useEffect(() => {
    const h = e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearch(true);
      }
      if (e.key === 'Escape') setSearch(false);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);
  const cur = route.parts[0] || '';
  const TR = window.HEB_TRACKS || {};
  let page;
  if (cur === '') page = React.createElement(Home, {
    progress: progress,
    navigate: route.navigate
  });else if (cur === 'course') page = React.createElement(CoursePage, null);else if (cur === 'lesson') page = React.createElement(LessonViewer, null);else if (cur === 'binyans') page = React.createElement(BinyansPage, null);else if (cur === 'roots') page = React.createElement(RootsPage, null);else if (cur === 'dictionary') page = React.createElement(DictionaryPage, null);else if (cur === 'tables') page = React.createElement(TablesPage, null);else if (cur === 'practice') page = React.createElement(PracticePage, null);else if (cur === 'homework') page = React.createElement(HomeworkPage, null);else if (cur === 'track') {
    const sub = route.parts[1];
    if (!sub) page = TR.TrackHub ? React.createElement(TR.TrackHub, null) : React.createElement("div", {
      className: "p-6"
    }, "\u0422\u0440\u0435\u043A\u0438 \u0437\u0430\u0433\u0440\u0443\u0436\u0430\u044E\u0442\u0441\u044F\u2026");else if (sub === 'repl') page = React.createElement(TR.ReplPage, null);else if (sub === 'tree') page = React.createElement(TR.DecisionTreePage, null);else if (sub === 'diff') page = React.createElement(TR.DiffPage, null);else if (sub === 'mindmap') page = React.createElement(TR.MindMapPage, null);else if (sub === 'colorize') page = React.createElement(TR.ColorizePage, null);else if (sub === 'paradigm') page = React.createElement(TR.AnimatedConjugationPage, null);else if (sub === 'builder') page = React.createElement(TR.DragDropPage, null);else if (sub === 'typing') page = React.createElement(TR.TypingRacePage, null);else if (sub === 'connect') page = React.createElement(TR.ConnectLinesPage, null);else page = React.createElement("div", {
      className: "p-6"
    }, "\u0420\u0430\u0437\u0434\u0435\u043B \u0442\u0440\u0435\u043A\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.");
  } else if (cur === 'search') page = React.createElement("div", {
    className: "p-6 max-w-4xl mx-auto"
  }, React.createElement("h1", {
    className: "text-2xl font-bold mb-4"
  }, "\u041F\u043E\u0438\u0441\u043A"), React.createElement("button", {
    onClick: () => setSearch(true),
    className: "px-4 py-2 bg-purple-600 rounded"
  }, "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043F\u043E\u0438\u0441\u043A"));else page = React.createElement("div", {
    className: "p-6"
  }, "\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430.");
  return React.createElement(AppCtx.Provider, {
    value: {
      progress,
      updateProgress
    }
  }, React.createElement("div", {
    className: "flex min-h-screen"
  }, React.createElement(Sidebar, {
    open: sidebar,
    setOpen: setSidebar,
    route: route
  }), React.createElement("div", {
    className: "flex-1 main"
  }, React.createElement(TopBar, {
    setSidebar: setSidebar,
    openSearch: () => setSearch(true)
  }), page)), React.createElement(SearchModal, {
    open: search,
    onClose: () => setSearch(false)
  }));
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App, null));
})();
