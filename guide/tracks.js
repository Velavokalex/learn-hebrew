"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
/* =================================================================
 * Учебные треки: Logical / Visual / Kinesthetic
 * Подключается отдельным <script type="text/babel" src="tracks.jsx">
 * Использует глобальный объект window.HEB (grammar engine)
 * и window.__APP_DATA__
 * Экспортирует страницы в window.HEB_TRACKS = {...}
 * ================================================================= */
var HEB = window.HEB;
var TR_DATA = window.__APP_DATA__;
var _React = React,
  useState = _React.useState,
  useEffect = _React.useEffect,
  useRef = _React.useRef,
  useMemo = _React.useMemo,
  useCallback = _React.useCallback;

/* =========================== HELPERS ============================ */
function speak2(text) {
  var rate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.85;
  try {
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'he-IL';
    u.rate = rate;
    var v = window.speechSynthesis.getVoices().find(function (v) {
      return v.lang.startsWith('he');
    });
    if (v) u.voice = v;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch (e) {}
}

/* =========================== LOGICAL #1: REPL ============================ */
function ReplPage() {
  var _useState = useState('כ.ת.ב'),
    _useState2 = _slicedToArray(_useState, 2),
    root = _useState2[0],
    setRoot = _useState2[1];
  var _useState3 = useState('paal'),
    _useState4 = _slicedToArray(_useState3, 2),
    binyan = _useState4[0],
    setBinyan = _useState4[1];
  var _useState5 = useState('present_m_sg'),
    _useState6 = _slicedToArray(_useState5, 2),
    tense = _useState6[0],
    setTense = _useState6[1];
  var _useState7 = useState([]),
    _useState8 = _slicedToArray(_useState7, 2),
    history = _useState8[0],
    setHistory = _useState8[1];
  var result = useMemo(function () {
    if (!HEB) return null;
    return HEB.conjugate({
      root: root,
      binyan: binyan,
      tense: tense
    });
  }, [root, binyan, tense]);
  var run = function run() {
    setHistory(function (h) {
      return [{
        root: root,
        binyan: binyan,
        tense: tense,
        result: result
      }].concat(_toConsumableArray(h)).slice(0, 8);
    });
  };
  if (!HEB) return /*#__PURE__*/React.createElement("div", {
    className: "p-6"
  }, "\u0413\u0440\u0430\u043C\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0434\u0432\u0438\u0436\u043E\u043A \u043D\u0435 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D.");
  var binyans = Object.keys(HEB.PATTERNS);
  var tenses = result ? Object.keys(HEB.PATTERNS[binyan]) : [];
  return /*#__PURE__*/React.createElement("div", {
    className: "p-6 max-w-6xl mx-auto"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-bold mb-2"
  }, "REPL \u2014 \u0438\u0432\u0440\u0438\u0442 \u043A\u0430\u043A \u043A\u043E\u0434"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-400 mb-6"
  }, "\u0412\u0432\u043E\u0434 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u043E\u0432 \u2192 \u0432\u044B\u0432\u043E\u0434 \u0444\u043E\u0440\u043C\u044B \u2192 \u043F\u043E\u0448\u0430\u0433\u043E\u0432\u0430\u044F \u0442\u0440\u0430\u0441\u0441\u0438\u0440\u043E\u0432\u043A\u0430 \u043F\u0440\u0438\u043C\u0435\u043D\u0451\u043D\u043D\u044B\u0445 \u043F\u0440\u0430\u0432\u0438\u043B."), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass rounded-xl p-5 font-mono text-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-gray-400 mb-3"
  }, "// \u041F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u044B \u0444\u0443\u043D\u043A\u0446\u0438\u0438"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-purple-400"
  }, "root"), ": ", /*#__PURE__*/React.createElement("input", {
    value: root,
    onChange: function onChange(e) {
      return setRoot(e.target.value);
    },
    className: "bg-black/30 border border-white/10 rounded px-2 py-1 he ml-2",
    dir: "rtl",
    style: {
      fontSize: '1.2em'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-purple-400"
  }, "binyan"), ": ", /*#__PURE__*/React.createElement("select", {
    value: binyan,
    onChange: function onChange(e) {
      return setBinyan(e.target.value);
    },
    className: "bg-black/30 border border-white/10 rounded px-2 py-1 ml-2"
  }, binyans.map(function (b) {
    return /*#__PURE__*/React.createElement("option", {
      key: b,
      value: b
    }, b, " (", HEB.BINYAN_META[b].name_ru, ")");
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-purple-400"
  }, "tense"), ": ", /*#__PURE__*/React.createElement("select", {
    value: tense,
    onChange: function onChange(e) {
      return setTense(e.target.value);
    },
    className: "bg-black/30 border border-white/10 rounded px-2 py-1 ml-2"
  }, tenses.map(function (t) {
    return /*#__PURE__*/React.createElement("option", {
      key: t,
      value: t
    }, t, " (", HEB.TENSE_LABELS[t], ")");
  })))), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 bg-black/40 rounded p-3 text-xs whitespace-pre-wrap"
  }, "conjugate({\n  root:   \"".concat(root, "\",\n  binyan: \"").concat(binyan, "\",\n  tense:  \"").concat(tense, "\"\n})")), /*#__PURE__*/React.createElement("button", {
    onClick: run,
    className: "mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded"
  }, "\u25B6 \u0417\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C")), /*#__PURE__*/React.createElement("div", {
    className: "glass rounded-xl p-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs uppercase text-gray-400 mb-2"
  }, "\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442"), result && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "bg-black/40 rounded p-4 text-center my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "he",
    style: {
      fontSize: '3.5em',
      color: HEB.BINYAN_META[binyan].color
    }
  }, result.form), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return speak2(result.form);
    },
    className: "mt-2 px-3 py-1 bg-white/5 rounded text-sm"
  }, "\uD83D\uDD0A \u041F\u0440\u043E\u0438\u0437\u043D\u0435\u0441\u0442\u0438")), /*#__PURE__*/React.createElement("div", {
    className: "text-xs uppercase text-gray-400 mb-2 mt-4"
  }, "\u0413\u0437\u0430\u0440\u0430: ", /*#__PURE__*/React.createElement("span", {
    className: "text-yellow-400 normal-case"
  }, result.gzara.id, " ", result.gzara.subtype || '')), /*#__PURE__*/React.createElement("div", {
    className: "text-xs uppercase text-gray-400 mb-2 mt-4"
  }, "\u0422\u0440\u0430\u0441\u0441\u0438\u0440\u043E\u0432\u043A\u0430"), /*#__PURE__*/React.createElement("div", {
    className: "bg-black/40 rounded p-3 font-mono text-xs space-y-1 max-h-80 overflow-y-auto"
  }, result.trace.map(function (t, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "flex gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-gray-500"
    }, (i + 1).toString().padStart(2, '0')), /*#__PURE__*/React.createElement("span", {
      className: "text-gray-300"
    }, t));
  }))))), history.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "mt-6 glass rounded-xl p-5"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-semibold mb-3"
  }, "\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u0432\u044B\u0437\u043E\u0432\u043E\u0432"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1 font-mono text-xs"
  }, history.map(function (h, i) {
    var _h$result;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "flex items-center justify-between p-2 hover:bg-white/5 rounded"
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
      className: "text-purple-400"
    }, h.binyan), "(", h.root, ", ", h.tense, ")"), /*#__PURE__*/React.createElement("span", {
      className: "he text-lg"
    }, "\u2192 ", (_h$result = h.result) === null || _h$result === void 0 ? void 0 : _h$result.form));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mt-6"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm uppercase text-gray-400 mb-2"
  }, "\u0411\u044B\u0441\u0442\u0440\u044B\u0435 \u043F\u0440\u0438\u043C\u0435\u0440\u044B"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 flex-wrap"
  }, [['כ.ת.ב', 'paal', 'past_3m_sg'], ['ד.ב.ר', 'piel', 'present_m_sg'], ['ת.ח.ל', 'hifil', 'past_1sg'], ['ל.ב.ש', 'hitpael', 'future_3m_sg'], ['ק.נ.ה', 'paal', 'infinitive'], ['ב.ו.א', 'paal', 'present_m_sg']].map(function (p, i) {
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: function onClick() {
        setRoot(p[0]);
        setBinyan(p[1]);
        setTense(p[2]);
      },
      className: "px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-xs"
    }, p[0], " \xB7 ", p[1], " \xB7 ", p[2]);
  }))));
}

/* =========================== LOGICAL #2: DECISION TREE ============================ */
var DECISION_TREE = {
  id: 'start',
  q: 'Есть ли у глагола префикс?',
  options: [{
    label: 'מִתְ или הִתְ (мит-/hит-)',
    next: {
      id: 'hitpael_check',
      q: 'Гласные между корневыми буквами — патах + цере (а-е)?',
      options: [{
        label: 'Да',
        leaf: {
          binyan: 'hitpael',
          reason: 'מִתְפַּעֵל — hитпаэль (возвратное усиленное действие)'
        }
      }, {
        label: 'Не уверен',
        leaf: {
          binyan: 'hitpael',
          reason: 'Префикс מת/הת сильно указывает на hитпаэль'
        }
      }]
    }
  }, {
    label: 'נִ (ни-) в начале',
    next: {
      id: 'nifal_check',
      q: 'Без удвоения второй буквы корня?',
      options: [{
        label: 'Да, простое спряжение',
        leaf: {
          binyan: 'nifal',
          reason: 'נִ + корень → Нифъаль (пассив/возвратное к Паалю)'
        }
      }, {
        label: 'Есть удвоение',
        leaf: {
          binyan: 'nifal',
          reason: 'Возможно, Нифъаль в будущем времени (יִפָּעֵל)'
        }
      }]
    }
  }, {
    label: 'מְ (мэ-)',
    next: {
      id: 'me_check',
      q: 'Гласные между корневыми — патах + цере (мэ-па-эль)?',
      options: [{
        label: 'Да: мэ-патах-цере',
        leaf: {
          binyan: 'piel',
          reason: 'מְפַעֵל — Пиэль (усиленное действие)'
        }
      }, {
        label: 'Кубуц (у) + камац',
        leaf: {
          binyan: 'pual',
          reason: 'מְפֻעָל — Пуаль (пассив Пиэля)'
        }
      }, {
        label: 'Не уверен',
        leaf: {
          binyan: 'piel',
          reason: 'Чаще всего префикс מְ = Пиэль'
        }
      }]
    }
  }, {
    label: 'מַ (ма-)',
    next: {
      id: 'ma_check',
      q: 'Есть ли י (йуд) перед последней буквой корня?',
      options: [{
        label: 'Да: מַ_ִי_',
        leaf: {
          binyan: 'hifil',
          reason: 'מַפְעִיל — hифъиль (каузатив активный)'
        }
      }, {
        label: 'Нет: מֻ_ָ_',
        leaf: {
          binyan: 'hufal',
          reason: 'מֻפְעָל — hуфъаль (пассив каузатива)'
        }
      }]
    }
  }, {
    label: 'הִ (hи-)',
    next: {
      id: 'hi_check',
      q: 'Есть ли י (йуд) перед последней буквой корня?',
      options: [{
        label: 'Да: הִ_ְ_ִי_',
        leaf: {
          binyan: 'hifil',
          reason: 'הִפְעִיל — прошедшее время hифъиля'
        }
      }, {
        label: 'Нет',
        leaf: {
          binyan: 'nifal',
          reason: 'הִ + корень в будущем/инфинитиве → Нифъаль (לְהִפָּעֵל)'
        }
      }]
    }
  }, {
    label: 'Нет видимых префиксов',
    next: {
      id: 'no_prefix',
      q: 'Огласовки между корневыми — холам + цере (ко-тель)?',
      options: [{
        label: 'Да (קוֹטֵל)',
        leaf: {
          binyan: 'paal',
          reason: 'פּוֹעֵל — Пааль, наст. время (биноний)'
        }
      }, {
        label: 'Камац + патах (פָּעַל)',
        leaf: {
          binyan: 'paal',
          reason: 'פָּעַל — Пааль, прошедшее время 3 м.р.'
        }
      }, {
        label: 'С дагешем во 2-й букве',
        leaf: {
          binyan: 'piel',
          reason: 'פִּעֵל — Пиэль, прошедшее время 3 м.р.'
        }
      }]
    }
  }]
};
function DecisionTreePage() {
  var _useState9 = useState([DECISION_TREE]),
    _useState0 = _slicedToArray(_useState9, 2),
    path = _useState0[0],
    setPath = _useState0[1];
  var _useState1 = useState(null),
    _useState10 = _slicedToArray(_useState1, 2),
    result = _useState10[0],
    setResult = _useState10[1];
  var _useState11 = useState(''),
    _useState12 = _slicedToArray(_useState11, 2),
    word = _useState12[0],
    setWord = _useState12[1];
  var choose = function choose(opt) {
    if (opt.leaf) {
      setResult(opt.leaf);
      return;
    }
    setPath(function (p) {
      return [].concat(_toConsumableArray(p), [opt.next]);
    });
  };
  var reset = function reset() {
    setPath([DECISION_TREE]);
    setResult(null);
  };
  var back = function back() {
    if (path.length > 1) setPath(function (p) {
      return p.slice(0, -1);
    });
    setResult(null);
  };
  var cur = path[path.length - 1];
  return /*#__PURE__*/React.createElement("div", {
    className: "p-6 max-w-4xl mx-auto"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-bold mb-2"
  }, "Decision tree \u2014 \u043A\u0430\u043A\u043E\u0439 \u0431\u0438\u043D\u044C\u044F\u043D?"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-400 mb-4"
  }, "\u0414\u0435\u0440\u0435\u0432\u043E \u0440\u0435\u0448\u0435\u043D\u0438\u0439: \u043E\u0442\u0432\u0435\u0447\u0430\u0439\u0442\u0435 \u043D\u0430 \u0432\u043E\u043F\u0440\u043E\u0441\u044B \u2014 \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C \u0441\u043A\u0430\u0436\u0435\u0442, \u043A\u0430\u043A\u043E\u0439 \u0431\u0438\u043D\u044C\u044F\u043D \u0438 \u043F\u043E\u0447\u0435\u043C\u0443."), /*#__PURE__*/React.createElement("div", {
    className: "glass rounded-xl p-3 mb-4 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("input", {
    value: word,
    onChange: function onChange(e) {
      return setWord(e.target.value);
    },
    dir: "rtl",
    className: "he flex-1 bg-transparent border-none outline-none text-2xl",
    placeholder: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0433\u043B\u0430\u0433\u043E\u043B (\u043E\u043F\u0446.)"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return speak2(word);
    },
    className: "text-xl"
  }, "\uD83D\uDD0A")), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-400"
  }, "\u0428\u0430\u0433: ", path.length), /*#__PURE__*/React.createElement("button", {
    onClick: back,
    disabled: path.length === 1,
    className: "text-xs text-gray-400 hover:text-white disabled:opacity-30"
  }, "\u2190 \u041D\u0430\u0437\u0430\u0434"), /*#__PURE__*/React.createElement("button", {
    onClick: reset,
    className: "text-xs text-gray-400 hover:text-white"
  }, "\u21BA \u0421\u043D\u0430\u0447\u0430\u043B\u0430")), !result && /*#__PURE__*/React.createElement("div", {
    className: "glass rounded-xl p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-lg font-semibold mb-4"
  }, cur.q), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-3"
  }, cur.options.map(function (opt, i) {
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: function onClick() {
        return choose(opt);
      },
      className: "p-4 bg-white/5 hover:bg-purple-600/30 border border-white/10 rounded-xl text-left"
    }, opt.label);
  }))), result && /*#__PURE__*/React.createElement("div", {
    className: "glass rounded-xl p-6 text-center",
    style: {
      borderTop: '4px solid ' + HEB.BINYAN_META[result.binyan].color
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs uppercase text-gray-400 mb-2"
  }, "\u0411\u0438\u043D\u044C\u044F\u043D \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0451\u043D"), /*#__PURE__*/React.createElement("div", {
    className: "he-lg",
    style: {
      fontSize: '3em',
      color: HEB.BINYAN_META[result.binyan].color
    }
  }, HEB.BINYAN_META[result.binyan].name_he), /*#__PURE__*/React.createElement("div", {
    className: "text-2xl mt-1"
  }, HEB.BINYAN_META[result.binyan].name_ru), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 text-gray-300"
  }, result.reason), /*#__PURE__*/React.createElement("button", {
    onClick: reset,
    className: "mt-4 px-4 py-2 bg-purple-600 rounded"
  }, "\u0415\u0449\u0451 \u0440\u0430\u0437")), path.length > 1 && /*#__PURE__*/React.createElement("div", {
    className: "mt-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs uppercase text-gray-400 mb-2"
  }, "\u041F\u0443\u0442\u044C \u0440\u0435\u0448\u0435\u043D\u0438\u044F"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1"
  }, path.slice(0, -1).map(function (n, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "text-xs text-gray-500 font-mono"
    }, "[", i + 1, "] ", n.q);
  }))));
}

/* =========================== LOGICAL #3: DIFF FORMS ============================ */
function DiffPage() {
  var _useState13 = useState('כ.ת.ב'),
    _useState14 = _slicedToArray(_useState13, 2),
    rootA = _useState14[0],
    setRootA = _useState14[1];
  var _useState15 = useState('כ.ת.ב'),
    _useState16 = _slicedToArray(_useState15, 2),
    rootB = _useState16[0],
    setRootB = _useState16[1];
  var _useState17 = useState('paal'),
    _useState18 = _slicedToArray(_useState17, 2),
    bA = _useState18[0],
    setBA = _useState18[1];
  var _useState19 = useState('piel'),
    _useState20 = _slicedToArray(_useState19, 2),
    bB = _useState20[0],
    setBB = _useState20[1];
  var _useState21 = useState('past_3m_sg'),
    _useState22 = _slicedToArray(_useState21, 2),
    tA = _useState22[0],
    setTA = _useState22[1];
  var _useState23 = useState('past_3m_sg'),
    _useState24 = _slicedToArray(_useState23, 2),
    tB = _useState24[0],
    setTB = _useState24[1];
  var A = useMemo(function () {
    return HEB.conjugate({
      root: rootA,
      binyan: bA,
      tense: tA
    });
  }, [rootA, bA, tA]);
  var B = useMemo(function () {
    return HEB.conjugate({
      root: rootB,
      binyan: bB,
      tense: tB
    });
  }, [rootB, bB, tB]);
  var dd = useMemo(function () {
    return HEB.diff(A.form, B.form);
  }, [A.form, B.form]);
  var binyans = Object.keys(HEB.PATTERNS);
  var tenses = Object.keys(HEB.PATTERNS[bA] || HEB.PATTERNS.paal);
  return /*#__PURE__*/React.createElement("div", {
    className: "p-6 max-w-5xl mx-auto"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-bold mb-2"
  }, "Diff \u2014 \u043F\u043E\u0441\u0438\u043C\u0432\u043E\u043B\u044C\u043D\u043E\u0435 \u0441\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u0435"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-400 mb-6"
  }, "\u041F\u043E\u043A\u0430\u0436\u0443, \u043A\u0430\u043A\u0438\u0435 \u0431\u0443\u043A\u0432\u044B \u0438 \u043E\u0433\u043B\u0430\u0441\u043E\u0432\u043A\u0438 \u0438\u0437\u043C\u0435\u043D\u0438\u043B\u0438\u0441\u044C \u043C\u0435\u0436\u0434\u0443 \u0434\u0432\u0443\u043C\u044F \u0444\u043E\u0440\u043C\u0430\u043C\u0438."), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
  }, /*#__PURE__*/React.createElement(FormPicker, {
    label: "\u0424\u043E\u0440\u043C\u0430 A",
    root: rootA,
    setRoot: setRootA,
    binyan: bA,
    setBinyan: setBA,
    tense: tA,
    setTense: setTA,
    binyans: binyans,
    tenses: tenses,
    color: "#7dd3fc"
  }), /*#__PURE__*/React.createElement(FormPicker, {
    label: "\u0424\u043E\u0440\u043C\u0430 B",
    root: rootB,
    setRoot: setRootB,
    binyan: bB,
    setBinyan: setBB,
    tense: tB,
    setTense: setTB,
    binyans: binyans,
    tenses: Object.keys(HEB.PATTERNS[bB] || HEB.PATTERNS.paal),
    color: "#f0abfc"
  })), /*#__PURE__*/React.createElement("div", {
    className: "glass rounded-xl p-5 mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs uppercase text-gray-400 mb-3"
  }, "\u0421\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u0435"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center gap-8 text-3xl flex-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "he",
    style: {
      color: '#7dd3fc'
    }
  }, A.form), /*#__PURE__*/React.createElement("div", {
    className: "text-gray-400"
  }, "vs"), /*#__PURE__*/React.createElement("div", {
    className: "he",
    style: {
      color: '#f0abfc'
    }
  }, B.form)), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 text-xs uppercase text-gray-400 mb-2"
  }, "Diff \u043F\u043E \u043A\u043B\u0430\u0441\u0442\u0435\u0440\u0430\u043C"), /*#__PURE__*/React.createElement("div", {
    className: "he flex flex-wrap justify-center gap-1 text-2xl bg-black/30 rounded p-3",
    dir: "rtl"
  }, dd.map(function (d, i) {
    if (d.op === 'eq') return /*#__PURE__*/React.createElement("span", {
      key: i,
      className: "opacity-50"
    }, d.a);
    if (d.op === 'del') return /*#__PURE__*/React.createElement("span", {
      key: i,
      className: "bg-red-600/50 px-1 rounded"
    }, d.a);
    if (d.op === 'add') return /*#__PURE__*/React.createElement("span", {
      key: i,
      className: "bg-green-600/50 px-1 rounded"
    }, d.b);
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 text-xs text-gray-400 flex gap-4 justify-center"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDD35 \u043E\u0434\u0438\u043D\u0430\u043A\u043E\u0432\u044B\u0435 \u0441\u0438\u043C\u0432\u043E\u043B\u044B"), /*#__PURE__*/React.createElement("span", null, "\uD83D\uDD34 \u0443\u0434\u0430\u043B\u0451\u043D\u043D\u044B\u0435 (\u0442\u043E\u043B\u044C\u043A\u043E \u0432 A)"), /*#__PURE__*/React.createElement("span", null, "\uD83D\uDFE2 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0435 (\u0442\u043E\u043B\u044C\u043A\u043E \u0432 B)"))), /*#__PURE__*/React.createElement("div", {
    className: "glass rounded-xl p-5"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-semibold mb-3"
  }, "\u041F\u043E\u0447\u0435\u043C\u0443 \u0440\u0430\u0437\u043D\u044B\u0435 \u0444\u043E\u0440\u043C\u044B?"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-cyan-300 mb-1"
  }, "\u0424\u043E\u0440\u043C\u0430 A: ", HEB.BINYAN_META[bA].name_ru, " \xB7 ", HEB.TENSE_LABELS[tA]), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-400 space-y-1"
  }, A.trace.slice(0, 4).map(function (t, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i
    }, "\u2022 ", t);
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-pink-300 mb-1"
  }, "\u0424\u043E\u0440\u043C\u0430 B: ", HEB.BINYAN_META[bB].name_ru, " \xB7 ", HEB.TENSE_LABELS[tB]), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-400 space-y-1"
  }, B.trace.slice(0, 4).map(function (t, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i
    }, "\u2022 ", t);
  }))))));
}
function FormPicker(_ref) {
  var label = _ref.label,
    root = _ref.root,
    setRoot = _ref.setRoot,
    binyan = _ref.binyan,
    setBinyan = _ref.setBinyan,
    tense = _ref.tense,
    setTense = _ref.setTense,
    binyans = _ref.binyans,
    tenses = _ref.tenses,
    color = _ref.color;
  var r = useMemo(function () {
    return HEB.conjugate({
      root: root,
      binyan: binyan,
      tense: tense
    });
  }, [root, binyan, tense]);
  return /*#__PURE__*/React.createElement("div", {
    className: "glass rounded-xl p-4",
    style: {
      borderLeft: '4px solid ' + color
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs uppercase text-gray-400 mb-2"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("input", {
    value: root,
    onChange: function onChange(e) {
      return setRoot(e.target.value);
    },
    dir: "rtl",
    className: "he bg-white/5 border border-white/10 rounded px-2 py-1 w-full text-xl"
  }), /*#__PURE__*/React.createElement("select", {
    value: binyan,
    onChange: function onChange(e) {
      return setBinyan(e.target.value);
    },
    className: "bg-white/5 border border-white/10 rounded px-2 py-1 w-full"
  }, binyans.map(function (b) {
    return /*#__PURE__*/React.createElement("option", {
      key: b,
      value: b
    }, HEB.BINYAN_META[b].name_ru);
  })), /*#__PURE__*/React.createElement("select", {
    value: tense,
    onChange: function onChange(e) {
      return setTense(e.target.value);
    },
    className: "bg-white/5 border border-white/10 rounded px-2 py-1 w-full"
  }, tenses.map(function (t) {
    return /*#__PURE__*/React.createElement("option", {
      key: t,
      value: t
    }, HEB.TENSE_LABELS[t]);
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 bg-black/30 rounded p-3 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "he",
    style: {
      fontSize: '2.5em',
      color: color
    }
  }, r.form)));
}

/* =========================== VISUAL #1: MIND-MAP CORNYA ============================ */
function MindMapPage() {
  var _useState25 = useState('כ.ת.ב'),
    _useState26 = _slicedToArray(_useState25, 2),
    root = _useState26[0],
    setRoot = _useState26[1];
  var svgRef = useRef();
  var binyans = Object.keys(HEB.PATTERNS);
  // Соберём формы для всех биньянов
  var data = useMemo(function () {
    var children = binyans.map(function (b) {
      var para = HEB.fullParadigm(root, b);
      var meta = HEB.BINYAN_META[b];
      var forms = ['present_m_sg', 'past_3m_sg', 'future_3m_sg', 'infinitive'].filter(function (t) {
        return para[t];
      }).map(function (t) {
        return {
          name: para[t].form,
          tense: t,
          meta: meta
        };
      });
      return {
        name: meta.name_he,
        forms: forms,
        color: meta.color,
        key: b
      };
    });
    return children;
  }, [root]);
  useEffect(function () {
    if (!window.d3 || !svgRef.current) return;
    var d3 = window.d3;
    var svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    var W = svgRef.current.clientWidth,
      H = 500;
    var cx = W / 2,
      cy = H / 2;

    // Центральный круг — корень
    svg.append('circle').attr('cx', cx).attr('cy', cy).attr('r', 45).attr('fill', '#1e1b4b').attr('stroke', '#a78bfa').attr('stroke-width', 2);
    svg.append('text').attr('x', cx).attr('y', cy + 10).attr('text-anchor', 'middle').attr('font-size', 22).attr('fill', '#fff').attr('font-family', 'Frank Ruhl Libre,serif').text(HEB.normalizeRoot(root).join('.'));
    var N = data.length;
    data.forEach(function (b, i) {
      var angle = Math.PI * 2 * i / N - Math.PI / 2;
      var bx = cx + Math.cos(angle) * 180;
      var by = cy + Math.sin(angle) * 180;
      // Линия от корня к биньяну
      svg.append('line').attr('x1', cx).attr('y1', cy).attr('x2', bx).attr('y2', by).attr('stroke', b.color).attr('stroke-width', 2).attr('opacity', 0.6);
      // Круг биньяна
      svg.append('circle').attr('cx', bx).attr('cy', by).attr('r', 32).attr('fill', b.color + '33').attr('stroke', b.color).attr('stroke-width', 2).style('cursor', 'pointer').on('click', function () {
        window.location.hash = '#/binyans';
      });
      svg.append('text').attr('x', bx).attr('y', by + 8).attr('text-anchor', 'middle').attr('font-size', 18).attr('fill', '#fff').attr('font-family', 'Frank Ruhl Libre,serif').text(b.name);

      // Формы вокруг биньяна (4 формы)
      var Fn = b.forms.length;
      b.forms.forEach(function (f, fi) {
        var fAngle = angle + (fi - (Fn - 1) / 2) * 0.35;
        var fx = bx + Math.cos(fAngle) * 95;
        var fy = by + Math.sin(fAngle) * 95;
        svg.append('line').attr('x1', bx).attr('y1', by).attr('x2', fx).attr('y2', fy).attr('stroke', b.color).attr('stroke-width', 1).attr('opacity', 0.3);
        var g = svg.append('g').style('cursor', 'pointer').on('click', function () {
          return speak2(f.name);
        });
        g.append('rect').attr('x', fx - 45).attr('y', fy - 12).attr('width', 90).attr('height', 24).attr('rx', 12).attr('fill', '#1f2937').attr('stroke', b.color).attr('stroke-width', 1);
        g.append('text').attr('x', fx).attr('y', fy + 5).attr('text-anchor', 'middle').attr('font-size', 13).attr('fill', '#fff').attr('font-family', 'Frank Ruhl Libre,serif').text(f.name);
      });
    });
  }, [data]);
  return /*#__PURE__*/React.createElement("div", {
    className: "p-6 max-w-6xl mx-auto"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-bold mb-2"
  }, "Mind-map \u043A\u043E\u0440\u043D\u044F"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-400 mb-4"
  }, "\u041A\u043E\u0440\u0435\u043D\u044C \u0432 \u0446\u0435\u043D\u0442\u0440\u0435 \u2192 \u043B\u0443\u0447\u0438 \u043A \u0431\u0438\u043D\u044C\u044F\u043D\u0430\u043C \u2192 \u0444\u043E\u0440\u043C\u044B. \u041A\u043B\u0438\u043A \u043F\u043E \u0444\u043E\u0440\u043C\u0435 \u2014 \u043E\u0437\u0432\u0443\u0447\u043A\u0430."), /*#__PURE__*/React.createElement("div", {
    className: "glass rounded-xl p-4 mb-4 flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("span", null, "\u041A\u043E\u0440\u0435\u043D\u044C:"), /*#__PURE__*/React.createElement("input", {
    value: root,
    onChange: function onChange(e) {
      return setRoot(e.target.value);
    },
    dir: "rtl",
    className: "he text-2xl bg-white/5 border border-white/10 rounded px-3 py-1"
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-gray-400"
  }, "\u041F\u0440\u0438\u043C\u0435\u0440\u044B: \u05DB.\u05EA.\u05D1, \u05DC.\u05DE.\u05D3, \u05D3.\u05D1.\u05E8, \u05E9.\u05DE.\u05E8, \u05E2.\u05E9.\u05D4")), /*#__PURE__*/React.createElement("div", {
    className: "glass rounded-xl p-2"
  }, /*#__PURE__*/React.createElement("svg", {
    ref: svgRef,
    width: "100%",
    height: "500"
  })));
}

/* =========================== VISUAL #2: COLORIZE ============================ */
function ColorizePage() {
  var _useState27 = useState('מְדַבֵּר אַתָּה תְּמִיד הָעִבְרִית עִם הָחָבֶר שֶׁלִּי'),
    _useState28 = _slicedToArray(_useState27, 2),
    text = _useState28[0],
    setText = _useState28[1];
  var segments = useMemo(function () {
    var parts = text.split(/(\s+)/);
    return parts.map(function (w, i) {
      if (/^\s+$/.test(w)) return {
        ws: w
      };
      return {
        word: w,
        segs: HEB.colorize(w)
      };
    });
  }, [text]);
  var COLORS = {
    prefix: '#a78bfa',
    root: '#34d399',
    suffix: '#fbbf24',
    plain: '#e5e7eb'
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "p-6 max-w-5xl mx-auto"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-bold mb-2"
  }, "\u0426\u0432\u0435\u0442\u043E-\u043A\u043E\u0434\u0438\u0440\u043E\u0432\u043A\u0430 \u0441\u043B\u043E\u0432\u0430"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-400 mb-4"
  }, "\u041A\u0430\u0436\u0434\u044B\u0439 \u0441\u0435\u0433\u043C\u0435\u043D\u0442 \u0441\u043B\u043E\u0432\u0430 \u0432\u044B\u0434\u0435\u043B\u0435\u043D \u0441\u0432\u043E\u0438\u043C \u0446\u0432\u0435\u0442\u043E\u043C. \u041F\u043E\u043C\u043E\u0433\u0430\u0435\u0442 \u0431\u044B\u0441\u0442\u0440\u043E \u0443\u0432\u0438\u0434\u0435\u0442\u044C \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0443."), /*#__PURE__*/React.createElement("div", {
    className: "glass rounded-xl p-4 mb-4"
  }, /*#__PURE__*/React.createElement("textarea", {
    value: text,
    onChange: function onChange(e) {
      return setText(e.target.value);
    },
    dir: "rtl",
    rows: 3,
    className: "he w-full text-2xl bg-white/5 border border-white/10 rounded p-3 outline-none focus:border-purple-500"
  })), /*#__PURE__*/React.createElement("div", {
    className: "glass rounded-xl p-6 he text-3xl leading-loose",
    dir: "rtl",
    style: {
      minHeight: '150px'
    }
  }, segments.map(function (it, i) {
    if (it.ws) return /*#__PURE__*/React.createElement("span", {
      key: i
    }, it.ws);
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      className: "mx-1"
    }, it.segs.map(function (s, j) {
      return /*#__PURE__*/React.createElement("span", {
        key: j,
        style: {
          color: COLORS[s.role] || '#e5e7eb',
          borderBottom: '2px solid ' + (COLORS[s.role] || 'transparent') + '66'
        }
      }, s.text);
    }));
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 flex gap-4 text-sm"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: COLORS.prefix
    }
  }, "\u25A0"), " \u041F\u0440\u0435\u0444\u0438\u043A\u0441"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: COLORS.root
    }
  }, "\u25A0"), " \u041E\u0441\u043D\u043E\u0432\u0430"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: COLORS.suffix
    }
  }, "\u25A0"), " \u041E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u0435")));
}

/* =========================== VISUAL #3: ANIMATED CONJUGATION ============================ */
function AnimatedConjugationPage() {
  var _useState29 = useState('כ.ת.ב'),
    _useState30 = _slicedToArray(_useState29, 2),
    root = _useState30[0],
    setRoot = _useState30[1];
  var _useState31 = useState('paal'),
    _useState32 = _slicedToArray(_useState31, 2),
    binyan = _useState32[0],
    setBinyan = _useState32[1];
  var para = useMemo(function () {
    return HEB.fullParadigm(root, binyan);
  }, [root, binyan]);
  var _useState33 = useState(null),
    _useState34 = _slicedToArray(_useState33, 2),
    hovered = _useState34[0],
    _setHovered = _useState34[1];
  var binyans = Object.keys(HEB.PATTERNS);
  var tenseGroups = {
    'Настоящее': ['present_m_sg', 'present_f_sg', 'present_m_pl', 'present_f_pl'],
    'Прошедшее': ['past_3m_sg', 'past_3f_sg', 'past_2m_sg', 'past_2f_sg', 'past_1sg', 'past_3pl', 'past_1pl', 'past_2m_pl', 'past_2f_pl'],
    'Будущее': ['future_3m_sg', 'future_3f_sg', 'future_2m_sg', 'future_2f_sg', 'future_1sg', 'future_3pl', 'future_1pl', 'future_2pl'],
    'Прочие': ['infinitive', 'imperative_m_sg', 'imperative_f_sg', 'imperative_pl']
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "p-6 max-w-6xl mx-auto"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-bold mb-2"
  }, "\u041F\u043E\u043B\u043D\u0430\u044F \u043F\u0430\u0440\u0430\u0434\u0438\u0433\u043C\u0430 \u0441\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u044F"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-400 mb-4"
  }, "\u0412\u0441\u0435 \u0444\u043E\u0440\u043C\u044B \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u043E\u0433\u043E \u0431\u0438\u043D\u044C\u044F\u043D\u0430 \u0441 \u0437\u0430\u0434\u0430\u043D\u043D\u044B\u043C \u043A\u043E\u0440\u043D\u0435\u043C. \u041F\u0440\u0438 \u043D\u0430\u0432\u0435\u0434\u0435\u043D\u0438\u0438 \u2014 \u043F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0430 \u043A\u043E\u0440\u043D\u044F \u0432 \u0444\u043E\u0440\u043C\u0435."), /*#__PURE__*/React.createElement("div", {
    className: "glass rounded-xl p-4 mb-4 flex items-center gap-3 flex-wrap"
  }, /*#__PURE__*/React.createElement("span", null, "\u041A\u043E\u0440\u0435\u043D\u044C:"), /*#__PURE__*/React.createElement("input", {
    value: root,
    onChange: function onChange(e) {
      return setRoot(e.target.value);
    },
    dir: "rtl",
    className: "he text-2xl bg-white/5 border border-white/10 rounded px-3 py-1 w-32"
  }), /*#__PURE__*/React.createElement("span", null, "\u0411\u0438\u043D\u044C\u044F\u043D:"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1"
  }, binyans.map(function (b) {
    return /*#__PURE__*/React.createElement("button", {
      key: b,
      onClick: function onClick() {
        return setBinyan(b);
      },
      className: "px-3 py-1 rounded text-sm",
      style: {
        background: binyan === b ? HEB.BINYAN_META[b].color : HEB.BINYAN_META[b].color + '33',
        border: '1px solid ' + HEB.BINYAN_META[b].color,
        color: binyan === b ? '#fff' : '#e5e7eb'
      }
    }, HEB.BINYAN_META[b].name_ru);
  }))), Object.entries(tenseGroups).map(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
      groupName = _ref3[0],
      tenses = _ref3[1];
    var has = tenses.filter(function (t) {
      return para[t];
    });
    if (!has.length) return null;
    return /*#__PURE__*/React.createElement("div", {
      key: groupName,
      className: "mb-4"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "text-sm uppercase text-gray-400 mb-2"
    }, groupName), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"
    }, has.map(function (t) {
      return /*#__PURE__*/React.createElement(ConjugationCell, {
        key: t,
        tense: t,
        result: para[t],
        binyan: binyan,
        hovered: hovered === t,
        setHovered: function setHovered() {
          return _setHovered(t);
        },
        clearHovered: function clearHovered() {
          return _setHovered(null);
        }
      });
    })));
  }));
}
function ConjugationCell(_ref4) {
  var tense = _ref4.tense,
    result = _ref4.result,
    binyan = _ref4.binyan,
    hovered = _ref4.hovered,
    setHovered = _ref4.setHovered,
    clearHovered = _ref4.clearHovered;
  var meta = HEB.BINYAN_META[binyan];
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: setHovered,
    onMouseLeave: clearHovered,
    className: "glass rounded-xl p-3 hover-lift cursor-pointer transition",
    onClick: function onClick() {
      return speak2(result.form);
    },
    style: hovered ? {
      boxShadow: '0 0 0 2px ' + meta.color
    } : null
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-400 mb-1"
  }, HEB.TENSE_LABELS[tense]), /*#__PURE__*/React.createElement("div", {
    className: "he text-2xl",
    style: {
      color: meta.color
    }
  }, result.form), hovered && result.gzara.id !== 'shlemim' && /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-yellow-400 mt-1"
  }, "\u26A0 \u0433\u0437\u0430\u0440\u0430: ", result.gzara.id));
}

/* =========================== KINESTHETIC #1: DRAG-DROP BUILDER ============================ */
function DragDropPage() {
  var _useState35 = useState('כ.ת.ב'),
    _useState36 = _slicedToArray(_useState35, 2),
    root = _useState36[0],
    setRoot = _useState36[1];
  var _useState37 = useState('paal'),
    _useState38 = _slicedToArray(_useState37, 2),
    binyan = _useState38[0],
    setBinyan = _useState38[1];
  var _useState39 = useState('past_3m_sg'),
    _useState40 = _slicedToArray(_useState39, 2),
    tense = _useState40[0],
    setTense = _useState40[1];
  var _useState41 = useState([null, null, null]),
    _useState42 = _slicedToArray(_useState41, 2),
    slots = _useState42[0],
    setSlots = _useState42[1];
  var _useState43 = useState(null),
    _useState44 = _slicedToArray(_useState43, 2),
    dragLetter = _useState44[0],
    setDragLetter = _useState44[1];
  var target = HEB.conjugate({
    root: root,
    binyan: binyan,
    tense: tense
  });
  var letters = HEB.normalizeRoot(root);
  var binyans = Object.keys(HEB.PATTERNS);
  var tenses = Object.keys(HEB.PATTERNS[binyan] || HEB.PATTERNS.paal);
  var pickFromBank = function pickFromBank(l) {
    return setDragLetter(l);
  };
  var dropTo = function dropTo(idx) {
    if (!dragLetter) return;
    setSlots(function (s) {
      var ns = _toConsumableArray(s);
      ns[idx] = dragLetter;
      return ns;
    });
    setDragLetter(null);
  };
  var clearSlot = function clearSlot(idx) {
    return setSlots(function (s) {
      var ns = _toConsumableArray(s);
      ns[idx] = null;
      return ns;
    });
  };
  var reset = function reset() {
    setSlots([null, null, null]);
    setDragLetter(null);
  };
  var allFilled = slots.every(Boolean);
  var correct = allFilled && JSON.stringify(slots) === JSON.stringify(letters);

  // Готовим шаблон — заменим маркеры на пустые слоты
  var tmpl = HEB.PATTERNS[binyan][tense];
  var renderTemplate = function renderTemplate() {
    var result = [];
    var _loop = function _loop(_i) {
      var ch = tmpl[_i];
      if (ch === '1' || ch === '2' || ch === '3') {
        var idx = parseInt(ch) - 1;
        // соберём огласовки после
        var niqqud = '';
        var j = _i + 1;
        while (j < tmpl.length && /[֑-ׇ]/.test(tmpl[j])) {
          niqqud += tmpl[j];
          j++;
        }
        result.push(/*#__PURE__*/React.createElement("span", {
          key: _i,
          onClick: function onClick() {
            return slots[idx] ? clearSlot(idx) : dropTo(idx);
          },
          onMouseUp: function onMouseUp() {
            return dropTo(idx);
          },
          className: "inline-block mx-1 px-2 py-1 rounded border-2 border-dashed cursor-pointer transition",
          style: {
            borderColor: slots[idx] ? HEB.BINYAN_META[binyan].color : '#6b7280',
            minWidth: '40px',
            textAlign: 'center'
          }
        }, slots[idx] ? slots[idx] + niqqud : /*#__PURE__*/React.createElement("span", {
          className: "text-gray-500"
        }, "_", idx + 1)));
        _i = j - 1;
      } else {
        result.push(/*#__PURE__*/React.createElement("span", {
          key: _i
        }, ch));
      }
      i = _i;
    };
    for (var i = 0; i < tmpl.length; i++) {
      _loop(i);
    }
    return result;
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "p-6 max-w-5xl mx-auto"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-bold mb-2"
  }, "\u041A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0442\u043E\u0440 \u0441\u043B\u043E\u0432\u0430"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-400 mb-6"
  }, "\u041F\u0435\u0440\u0435\u0442\u0430\u0449\u0438\u0442\u0435 \u0431\u0443\u043A\u0432\u044B \u043A\u043E\u0440\u043D\u044F \u0432 \u0441\u043B\u043E\u0442\u044B \u043C\u043E\u0434\u0435\u043B\u0438 \u0431\u0438\u043D\u044C\u044F\u043D\u0430. \u0426\u0435\u043B\u044C \u2014 \u0441\u043E\u0431\u0440\u0430\u0442\u044C \u0444\u043E\u0440\u043C\u0443."), /*#__PURE__*/React.createElement("div", {
    className: "glass rounded-xl p-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-400 mb-1"
  }, "\u041A\u043E\u0440\u0435\u043D\u044C"), /*#__PURE__*/React.createElement("input", {
    value: root,
    onChange: function onChange(e) {
      setRoot(e.target.value);
      reset();
    },
    dir: "rtl",
    className: "he text-2xl bg-white/5 border border-white/10 rounded px-3 py-1 w-full text-center"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-400 mb-1"
  }, "\u0411\u0438\u043D\u044C\u044F\u043D"), /*#__PURE__*/React.createElement("select", {
    value: binyan,
    onChange: function onChange(e) {
      setBinyan(e.target.value);
      reset();
    },
    className: "bg-white/5 border border-white/10 rounded px-2 py-1 w-full"
  }, binyans.map(function (b) {
    return /*#__PURE__*/React.createElement("option", {
      key: b,
      value: b
    }, HEB.BINYAN_META[b].name_ru);
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-400 mb-1"
  }, "\u0424\u043E\u0440\u043C\u0430"), /*#__PURE__*/React.createElement("select", {
    value: tense,
    onChange: function onChange(e) {
      setTense(e.target.value);
      reset();
    },
    className: "bg-white/5 border border-white/10 rounded px-2 py-1 w-full"
  }, tenses.map(function (t) {
    return /*#__PURE__*/React.createElement("option", {
      key: t,
      value: t
    }, HEB.TENSE_LABELS[t]);
  })))), /*#__PURE__*/React.createElement("div", {
    className: "glass rounded-xl p-8 mb-4 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs uppercase text-gray-400 mb-3"
  }, "\u0421\u043E\u0431\u0435\u0440\u0438\u0442\u0435 \u0444\u043E\u0440\u043C\u0443"), /*#__PURE__*/React.createElement("div", {
    className: "he-lg",
    style: {
      fontSize: '3em',
      direction: 'rtl'
    }
  }, renderTemplate()), dragLetter && /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-purple-300 mt-3"
  }, "\u041F\u0435\u0440\u0435\u0442\u0430\u0441\u043A\u0438\u0432\u0430\u0439\u0442\u0435 \xAB", dragLetter, "\xBB \u2014 \u043D\u0430\u0436\u043C\u0438\u0442\u0435 \u043D\u0430 \u0441\u043B\u043E\u0442, \u0447\u0442\u043E\u0431\u044B \u0432\u0441\u0442\u0430\u0432\u0438\u0442\u044C.")), /*#__PURE__*/React.createElement("div", {
    className: "glass rounded-xl p-4 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs uppercase text-gray-400 mb-3"
  }, "\u0411\u0443\u043A\u0432\u044B \u043A\u043E\u0440\u043D\u044F"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3 justify-center"
  }, letters.map(function (l, i) {
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: function onClick() {
        return pickFromBank(l);
      },
      className: 'he px-5 py-3 rounded-xl text-3xl border-2 transition ' + (dragLetter === l ? 'bg-purple-600 border-purple-400' : 'bg-white/5 border-white/10 hover:bg-white/10')
    }, l);
  }))), allFilled && /*#__PURE__*/React.createElement("div", {
    className: 'glass rounded-xl p-5 text-center ' + (correct ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500')
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-gray-400 mb-2"
  }, correct ? '✓ Верно!' : '✗ Не совсем — попробуйте ещё раз'), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-400 mb-1"
  }, "\u042D\u0442\u0430\u043B\u043E\u043D:"), /*#__PURE__*/React.createElement("div", {
    className: "he text-3xl",
    style: {
      color: HEB.BINYAN_META[binyan].color
    }
  }, target.form), /*#__PURE__*/React.createElement("button", {
    onClick: reset,
    className: "mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded"
  }, "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C")));
}

/* =========================== KINESTHETIC #2: TYPING RACE ============================ */
var HEB_KEYBOARD = {
  // QWERTY → иврит (стандартная раскладка)
  'q': '/',
  'w': '\'',
  'e': 'ק',
  'r': 'ר',
  't': 'א',
  'y': 'ט',
  'u': 'ו',
  'i': 'ן',
  'o': 'ם',
  'p': 'פ',
  'a': 'ש',
  's': 'ד',
  'd': 'ג',
  'f': 'כ',
  'g': 'ע',
  'h': 'י',
  'j': 'ח',
  'k': 'ל',
  'l': 'ך',
  ';': 'ף',
  'z': 'ז',
  'x': 'ס',
  'c': 'ב',
  'v': 'ה',
  'b': 'נ',
  'n': 'מ',
  'm': 'צ',
  ',': 'ת',
  '.': 'ץ',
  '/': '.'
};
function TypingRacePage() {
  var phrases = [{
    he: 'אֲנִי כּוֹתֵב סֵפֶר',
    ru: 'Я пишу книгу'
  }, {
    he: 'הוּא לוֹמֵד עִבְרִית',
    ru: 'Он учит иврит'
  }, {
    he: 'הִיא קוֹנָה לֶחֶם בַּחֲנוּת',
    ru: 'Она покупает хлеб в магазине'
  }, {
    he: 'מָה שְׁלוֹמְךָ הַיּוֹם',
    ru: 'Как у тебя дела сегодня'
  }, {
    he: 'אֲנַחְנוּ הוֹלְכִים לַחָתֻנָּה',
    ru: 'Мы идём на свадьбу'
  }];
  var _useState45 = useState(0),
    _useState46 = _slicedToArray(_useState45, 2),
    i = _useState46[0],
    setI = _useState46[1];
  var _useState47 = useState(''),
    _useState48 = _slicedToArray(_useState47, 2),
    input = _useState48[0],
    setInput = _useState48[1];
  var _useState49 = useState(null),
    _useState50 = _slicedToArray(_useState49, 2),
    start = _useState50[0],
    setStart = _useState50[1];
  var cur = phrases[i];
  var target = HEB.stripNiqqud(cur.he);
  useEffect(function () {
    if (input.length === 1 && !start) setStart(Date.now());
    if (input === target) {
      // round complete
    }
  }, [input]);
  var elapsed = start ? (Date.now() - start) / 1000 : 0;
  var wpm = input ? Math.round(input.length / 5 / (elapsed / 60)) : 0;

  // подсветка ошибок
  var chars = target.split('').map(function (c, k) {
    var typed = input[k];
    if (typed == null) return {
      c: c,
      state: 'pending'
    };
    if (typed === c) return {
      c: c,
      state: 'ok'
    };
    return {
      c: c,
      state: 'err',
      typed: typed
    };
  });
  var next = function next() {
    setI(function (x) {
      return (x + 1) % phrases.length;
    });
    setInput('');
    setStart(null);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "p-6 max-w-4xl mx-auto"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-bold mb-2"
  }, "Typing race"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-400 mb-4"
  }, "\u041F\u0435\u0447\u0430\u0442\u0430\u0439\u0442\u0435 \u0438\u0432\u0440\u0438\u0442\u0441\u043A\u0438\u0439 \u0442\u0435\u043A\u0441\u0442. \u0412\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \u0438\u0432\u0440\u0438\u0442\u0441\u043A\u0443\u044E \u0440\u0430\u0441\u043A\u043B\u0430\u0434\u043A\u0443 \u0438\u043B\u0438 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u044D\u043A\u0440\u0430\u043D\u043D\u0443\u044E \u043A\u043B\u0430\u0432\u0438\u0430\u0442\u0443\u0440\u0443 \u0432\u043D\u0438\u0437\u0443."), /*#__PURE__*/React.createElement("div", {
    className: "glass rounded-xl p-5 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-400 mb-2"
  }, "\u041F\u0435\u0440\u0435\u0432\u043E\u0434: ", cur.ru), /*#__PURE__*/React.createElement("div", {
    className: "he text-3xl mb-3",
    dir: "rtl"
  }, cur.he), /*#__PURE__*/React.createElement("div", {
    className: "he text-2xl bg-black/30 rounded p-3",
    dir: "rtl"
  }, chars.map(function (c, k) {
    return /*#__PURE__*/React.createElement("span", {
      key: k,
      style: {
        color: c.state === 'ok' ? '#34d399' : c.state === 'err' ? '#ef4444' : '#6b7280',
        backgroundColor: c.state === 'err' ? '#7f1d1d44' : 'transparent',
        borderBottom: k === input.length ? '2px solid #a78bfa' : 'none'
      }
    }, c.c);
  })), /*#__PURE__*/React.createElement("input", {
    value: input,
    onChange: function onChange(e) {
      return setInput(e.target.value);
    },
    dir: "rtl",
    className: "he w-full mt-3 bg-white/5 border border-white/10 rounded p-3 text-2xl outline-none focus:border-purple-500",
    placeholder: "\u041D\u0430\u0447\u043D\u0438\u0442\u0435 \u043F\u0435\u0447\u0430\u0442\u0430\u0442\u044C \u0437\u0434\u0435\u0441\u044C\u2026",
    autoFocus: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-4 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass rounded p-3 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-400"
  }, "\u0412\u0440\u0435\u043C\u044F"), /*#__PURE__*/React.createElement("div", {
    className: "text-xl"
  }, elapsed.toFixed(1), " c")), /*#__PURE__*/React.createElement("div", {
    className: "glass rounded p-3 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-400"
  }, "\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C"), /*#__PURE__*/React.createElement("div", {
    className: "text-xl"
  }, wpm, " WPM")), /*#__PURE__*/React.createElement("div", {
    className: "glass rounded p-3 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-400"
  }, "\u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441"), /*#__PURE__*/React.createElement("div", {
    className: "text-xl"
  }, Math.round(input.length / target.length * 100), "%"))), input === target && /*#__PURE__*/React.createElement("div", {
    className: "glass rounded-xl p-4 bg-green-600/20 text-center mb-4"
  }, "\uD83C\uDF89 \u0413\u043E\u0442\u043E\u0432\u043E \u0437\u0430 ", elapsed.toFixed(1), " c! \u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C: ", wpm, " WPM", /*#__PURE__*/React.createElement("button", {
    onClick: next,
    className: "ml-4 px-4 py-1 bg-purple-600 rounded"
  }, "\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0430\u044F")), /*#__PURE__*/React.createElement("div", {
    className: "glass rounded-xl p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs uppercase text-gray-400 mb-3"
  }, "\u0418\u0432\u0440\u0438\u0442\u0441\u043A\u0430\u044F \u0440\u0430\u0441\u043A\u043B\u0430\u0434\u043A\u0430"), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-400 mb-3"
  }, "\u0421\u0432\u0435\u0440\u0445\u0443 \u2014 \u043B\u0430\u0442\u0438\u043D\u0438\u0446\u0430 (\u0447\u0442\u043E \u043D\u0430\u0436\u0438\u043C\u0430\u0442\u044C), \u0441\u043D\u0438\u0437\u0443 \u2014 \u0438\u0432\u0440\u0438\u0442\u0441\u043A\u0430\u044F \u0431\u0443\u043A\u0432\u0430."), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-rows-3 gap-2"
  }, ['qwertyuiop', 'asdfghjkl;', 'zxcvbnm,./'].map(function (row, ri) {
    return /*#__PURE__*/React.createElement("div", {
      key: ri,
      className: "flex gap-1 justify-center"
    }, row.split('').map(function (k) {
      return /*#__PURE__*/React.createElement("div", {
        key: k,
        className: "flex flex-col items-center w-12 h-14 bg-white/5 border border-white/10 rounded"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-xs text-gray-400 mt-1"
      }, k.toUpperCase()), /*#__PURE__*/React.createElement("div", {
        className: "he text-xl"
      }, HEB_KEYBOARD[k]));
    }));
  }))));
}

/* =========================== KINESTHETIC #3: CONNECT LINES ============================ */
function ConnectLinesPage() {
  var words = TR_DATA.vocab.words.slice(0, 8);
  var _useState51 = useState({}),
    _useState52 = _slicedToArray(_useState51, 2),
    pairs = _useState52[0],
    setPairs = _useState52[1]; // wordId -> matched
  var _useState53 = useState(null),
    _useState54 = _slicedToArray(_useState53, 2),
    dragFrom = _useState54[0],
    setDragFrom = _useState54[1];
  var _useState55 = useState(null),
    _useState56 = _slicedToArray(_useState55, 2),
    linePos = _useState56[0],
    setLinePos = _useState56[1];
  var containerRef = useRef();
  var heRefs = useRef({});
  var ruRefs = useRef({});
  var shuffledRu = useMemo(function () {
    return _toConsumableArray(words).sort(function () {
      return Math.random() - 0.5;
    });
  }, [words]);
  var startDrag = function startDrag(id, e) {
    e.preventDefault();
    setDragFrom(id);
    var rect = containerRef.current.getBoundingClientRect();
    setLinePos({
      x1: e.clientX - rect.left,
      y1: e.clientY - rect.top,
      x2: e.clientX - rect.left,
      y2: e.clientY - rect.top
    });
  };
  var onMove = function onMove(e) {
    if (!dragFrom) return;
    var rect = containerRef.current.getBoundingClientRect();
    setLinePos(function (p) {
      return _objectSpread(_objectSpread({}, p), {}, {
        x2: e.clientX - rect.left,
        y2: e.clientY - rect.top
      });
    });
  };
  var tryDrop = function tryDrop(ruId) {
    if (!dragFrom) return;
    if (dragFrom === ruId) {
      setPairs(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, _defineProperty({}, ruId, true));
      });
    }
    setDragFrom(null);
    setLinePos(null);
  };
  var done = Object.keys(pairs).length === words.length;
  return /*#__PURE__*/React.createElement("div", {
    className: "p-6 max-w-4xl mx-auto"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-bold mb-2"
  }, "Connect-lines"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-400 mb-4"
  }, "\u0417\u0430\u0436\u043C\u0438\u0442\u0435 \u0441\u043B\u043E\u0432\u043E \u043D\u0430 \u0438\u0432\u0440\u0438\u0442\u0435, \u043F\u0440\u043E\u0442\u044F\u043D\u0438\u0442\u0435 \u043B\u0438\u043D\u0438\u044E \u043A \u043F\u0435\u0440\u0435\u0432\u043E\u0434\u0443 \u0438 \u043E\u0442\u043F\u0443\u0441\u0442\u0438\u0442\u0435."), done && /*#__PURE__*/React.createElement("div", {
    className: "glass rounded-xl p-4 bg-green-600/20 mb-4 text-center"
  }, "\uD83C\uDF89 \u0412\u0441\u0435 \u0441\u043B\u043E\u0432\u0430 \u0441\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u044B!"), /*#__PURE__*/React.createElement("div", {
    ref: containerRef,
    onMouseMove: onMove,
    onMouseUp: function onMouseUp() {
      setDragFrom(null);
      setLinePos(null);
    },
    className: "glass rounded-xl p-6 relative",
    style: {
      minHeight: '500px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, words.map(function (w) {
    return /*#__PURE__*/React.createElement("div", {
      key: w.id,
      ref: function ref(el) {
        return heRefs.current[w.id] = el;
      },
      onMouseDown: function onMouseDown(e) {
        return startDrag(w.id, e);
      },
      className: 'he text-2xl bg-white/5 border border-white/10 rounded p-3 cursor-pointer text-center ' + (pairs[w.id] ? 'opacity-40' : 'hover:bg-white/10')
    }, w.he);
  })), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, shuffledRu.map(function (w) {
    return /*#__PURE__*/React.createElement("div", {
      key: w.id,
      ref: function ref(el) {
        return ruRefs.current[w.id] = el;
      },
      onMouseUp: function onMouseUp() {
        return tryDrop(w.id);
      },
      className: 'text-lg bg-white/5 border border-white/10 rounded p-3 text-center ' + (pairs[w.id] ? 'bg-green-600/30' : '')
    }, w.ru);
  }))), linePos && /*#__PURE__*/React.createElement("svg", {
    className: "absolute inset-0 pointer-events-none",
    width: "100%",
    height: "100%"
  }, /*#__PURE__*/React.createElement("line", {
    x1: linePos.x1,
    y1: linePos.y1,
    x2: linePos.x2,
    y2: linePos.y2,
    stroke: "#a78bfa",
    strokeWidth: "3",
    strokeDasharray: "5,5"
  }))));
}

/* =========================== HUB: TRACK SWITCHER ============================ */
function TrackHub() {
  var tracks = [{
    id: 'logical',
    name: 'Logical',
    icon: '🧮',
    desc: 'Иврит как код: REPL, decision tree, diff',
    pages: [{
      path: 'repl',
      name: 'REPL — спряжение по параметрам',
      icon: '▶'
    }, {
      path: 'tree',
      name: 'Decision tree: какой биньян?',
      icon: '🌲'
    }, {
      path: 'diff',
      name: 'Diff — сравнение двух форм',
      icon: '⇄'
    }]
  }, {
    id: 'visual',
    name: 'Visual',
    icon: '🎨',
    desc: 'Mind-map, цвета, анимации',
    pages: [{
      path: 'mindmap',
      name: 'Mind-map корня',
      icon: '🌐'
    }, {
      path: 'colorize',
      name: 'Цвето-кодировка слова',
      icon: '🎨'
    }, {
      path: 'paradigm',
      name: 'Полная парадигма',
      icon: '📊'
    }]
  }, {
    id: 'kinesthetic',
    name: 'Kinesthetic',
    icon: '🤲',
    desc: 'Drag-drop, печать, соединение',
    pages: [{
      path: 'builder',
      name: 'Конструктор слова',
      icon: '🧱'
    }, {
      path: 'typing',
      name: 'Typing race',
      icon: '⌨️'
    }, {
      path: 'connect',
      name: 'Соединение линиями',
      icon: '🔗'
    }]
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "p-6 max-w-6xl mx-auto"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-bold mb-2"
  }, "\u0423\u0447\u0435\u0431\u043D\u044B\u0435 \u0442\u0440\u0435\u043A\u0438"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-400 mb-6"
  }, "3 \u0442\u0440\u0435\u043A\u0430 \u043F\u043E\u0434 \u0440\u0430\u0437\u043D\u044B\u0435 \u0442\u0438\u043F\u044B \u0432\u043E\u0441\u043F\u0440\u0438\u044F\u0442\u0438\u044F. \u0412\u0441\u0435 \u043E\u043F\u0438\u0440\u0430\u044E\u0442\u0441\u044F \u043D\u0430 \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u0433\u0440\u0430\u043C\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0434\u0432\u0438\u0436\u043E\u043A."), /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, tracks.map(function (tr) {
    return /*#__PURE__*/React.createElement("div", {
      key: tr.id,
      className: "glass rounded-xl p-5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3 mb-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-4xl"
    }, tr.icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "text-xl font-bold"
    }, tr.name), /*#__PURE__*/React.createElement("div", {
      className: "text-sm text-gray-400"
    }, tr.desc))), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-1 md:grid-cols-3 gap-3"
    }, tr.pages.map(function (p) {
      return /*#__PURE__*/React.createElement("a", {
        key: p.path,
        href: '#/track/' + p.path,
        className: "bg-white/5 hover:bg-white/10 rounded-lg p-3 flex items-center gap-2"
      }, /*#__PURE__*/React.createElement("span", {
        className: "text-2xl"
      }, p.icon), " ", p.name);
    })));
  })));
}
window.HEB_TRACKS = {
  TrackHub: TrackHub,
  ReplPage: ReplPage,
  DecisionTreePage: DecisionTreePage,
  DiffPage: DiffPage,
  MindMapPage: MindMapPage,
  ColorizePage: ColorizePage,
  AnimatedConjugationPage: AnimatedConjugationPage,
  DragDropPage: DragDropPage,
  TypingRacePage: TypingRacePage,
  ConnectLinesPage: ConnectLinesPage
};
