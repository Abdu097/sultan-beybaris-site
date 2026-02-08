// ===== Premium JS: progress bar + reveal + tilt (doesn't kill animation) + tasbih + hadith + language =====

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

$("#year").textContent = new Date().getFullYear();

// Progress bar
window.addEventListener("scroll", () => {
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const height = doc.scrollHeight - doc.clientHeight;
  const scrolled = height > 0 ? (scrollTop / height) * 100 : 0;
  $("#progressBar").style.width = `${scrolled}%`;
});

// Reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) e.target.classList.add("active");
  });
}, { threshold: 0.12 });

$$(".reveal").forEach(el => observer.observe(el));

// Tilt without killing CSS animation (uses CSS vars)
function bindTilt(){
  const cards = $$("[data-tilt]");
  cards.forEach(card => {
    let raf = null;

    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      const rx = (-y * 7).toFixed(2);
      const ry = (x * 9).toFixed(2);

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.setProperty("--rx", `${rx}deg`);
        card.style.setProperty("--ry", `${ry}deg`);
      });
    });

    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--rx", `0deg`);
      card.style.setProperty("--ry", `0deg`);
    });
  });
}
bindTilt();

// Tasbih
let tasbihCount = 0;
try {
  const saved = localStorage.getItem("tasbih_sb");
  tasbihCount = saved ? parseInt(saved, 10) : 0;
} catch {}

const tasbihEl = $("#tasbihCount");
tasbihEl.textContent = tasbihCount;

$("#tasbihTap").addEventListener("click", () => {
  tasbihCount += 1;
  tasbihEl.textContent = tasbihCount;
  try { localStorage.setItem("tasbih_sb", String(tasbihCount)); } catch {}
  if (navigator.vibrate) navigator.vibrate(35);

  // tiny pop
  const wrap = $(".tasbih");
  wrap.style.transition = "transform .12s ease";
  wrap.style.transform = "scale(.985)";
  setTimeout(() => wrap.style.transform = "scale(1)", 120);
});

$("#tasbihReset").addEventListener("click", () => {
  tasbihCount = 0;
  tasbihEl.textContent = "0";
  try { localStorage.setItem("tasbih_sb", "0"); } catch {}
});

// Hadith
const hadiths = [
  {
    arabic: "إِنَّ مِنْ خِيَارِكُمْ أَحْسَنَكُمْ أَخْلَاقًا",
    kk: "«Сендердің ең жақсыларың – мінез-құлқы ең көркем болғандарың.»",
    ru: "«Лучшие из вас — те, у кого лучший нрав.»",
    source: "(Бухари)"
  },
  {
    arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
    kk: "«Амалдардың қадірі – ниетке байланысты.»",
    ru: "«Поистине, дела оцениваются по намерениям.»",
    source: "(Бухари)"
  },
  {
    arabic: "الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ",
    kk: "«Жақсы сөз – садақа.»",
    ru: "«Доброе слово — это садака.»",
    source: "(Бухари)"
  },
  {
    arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    kk: "«Ең жақсыларың – Құранды үйреніп, оны үйреткендерің.»",
    ru: "«Лучший из вас — тот, кто изучает Коран и обучает ему.»",
    source: "(Бухари)"
  }
];

let lastHadith = 0;
function renderHadith(idx){
  const h = hadiths[idx];
  const arab = $("#hadithArabic");
  const txt = $("#hadithText");
  const src = $("#hadithSource");

  // fade out
  [arab, txt, src].forEach(el => el.classList.add("fadeOut"));

  setTimeout(() => {
    arab.textContent = h.arabic;
    src.textContent = h.source;
    txt.textContent = currentLang === "kk" ? h.kk : h.ru;

    // fade in
    [arab, txt, src].forEach(el => el.classList.remove("fadeOut"));
  }, 220);
}

$("#hadithNext").addEventListener("click", () => {
  let next = lastHadith;
  while (next === lastHadith) next = Math.floor(Math.random() * hadiths.length);
  lastHadith = next;
  renderHadith(lastHadith);
});

renderHadith(0);

// Language
const dict = {
  kk: {
    brand_name: "Сұлтан Бейбарыс",
    nav_about: "Біз туралы",
    nav_namaz: "Намаз уақыты",
    nav_tasbih: "Тәсбі",
    nav_wisdom: "Даналық",
    nav_donate: "Садақа",

    hero_title: "СҰЛТАН БЕЙБАРЫС МЕШІТІ",
    hero_subtitle: "Алланың берекесі сіздің отбасыңызға болсын.<br>Садақа беру үшін төмендегі батырманы басыңыз.",
    hero_btn_main: "Садақа жасау",
    hero_btn_more: "Толығырақ",

    about_title: "Біз туралы",
    about_address: "Атырау, Сырым Датов көшесі, 176 — Картаға өту",

    namaz_title: "Намаз уақыты",
    namaz_desc: "Атырау қаласының намаз кестесін төмендегі сілтеме арқылы көре аласыз.",
    namaz_btn: "Кестені ашу",
    namaz_note_title: "Оқыған намазыңыз қабыл болсын 🤲",
    namaz_note_text: "Қысқа еске салу: рукуғта — «Субхана Раббиял-Азыйм», сәждеде — «Субхана Раббиял-А‘лә» (3 рет). Дұға: «Раббана тақаббал минна, иннака антассами‘ул-‘алим».",

    tasbih_title: "Электронды тәсбі",
    tasbih_desc: "Түртіп санаңыз — автоматты сақталады.",
    tasbih_hint: "Түртіңіз",
    tasbih_reset: "Нөлдеу ↺",

    wisdom_title: "Даналық бұлағы",
    wisdom_badge: "ХАДИС (Бухари)",
    wisdom_next: "Келесі →",

    donate_title: "Садақа жасау",
    donate_desc: "QR арқылы немесе Kaspi сілтемесімен төлеуге болады.",
    donate_qr_hint: "Камерамен сканерлеңіз",
    donate_footer: "Садақаңыз қабыл болсын 🤲"
  },

  ru: {
    brand_name: "Сұлтан Бейбарыс",
    nav_about: "О нас",
    nav_namaz: "Время намаза",
    nav_tasbih: "Тасбих",
    nav_wisdom: "Мудрость",
    nav_donate: "Садака",

    hero_title: "МЕЧЕТЬ СУЛТАН БЕЙБАРЫС",
    hero_subtitle: "Пусть благословение Аллаха будет с вашей семьёй.<br>Нажмите кнопку ниже, чтобы сделать садака.",
    hero_btn_main: "Сделать садака",
    hero_btn_more: "Подробнее",

    about_title: "О нас",
    about_address: "Атырау, ул. Сырым Датов, 176 — Открыть карту",

    namaz_title: "Время намаза",
    namaz_desc: "Расписание намаза для города Атырау доступно по ссылке ниже.",
    namaz_btn: "Открыть расписание",
    namaz_note_title: "Пусть ваш намаз будет принят 🤲",
    namaz_note_text: "Короткое напоминание: в руку‘ — «Субхана Раббияль-Азым», в суджуде — «Субхана Раббияль-А‘ля» (3 раза). Дуа: «Раббана такъаббаль минна, иннака Антас-Сами‘уль-‘Алим».",

    tasbih_title: "Электронный тасбих",
    tasbih_desc: "Нажимайте — счёт сохраняется автоматически.",
    tasbih_hint: "Нажмите",
    tasbih_reset: "Сброс ↺",

    wisdom_title: "Источник мудрости",
    wisdom_badge: "ХАДИС (Бухари)",
    wisdom_next: "Следующий →",

    donate_title: "Садака",
    donate_desc: "Можно оплатить по QR или через ссылку Kaspi.",
    donate_qr_hint: "Сканируйте камерой",
    donate_footer: "Ваше пожертвование принято 🤲"
  }
};

let currentLang = "kk";
// default KZ always (as you wanted)
try {
  const saved = localStorage.getItem("lang_sb");
  currentLang = (saved === "ru" || saved === "kk") ? saved : "kk";
  if (!saved) localStorage.setItem("lang_sb", "kk");
} catch {
  currentLang = "kk";
}

function applyLang(){
  const t = dict[currentLang];
  $$("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (!t[key]) return;

    // allow <br>
    if (String(t[key]).includes("<br>")) el.innerHTML = t[key];
    else el.textContent = t[key];
  });

  // update hadith text language
  renderHadith(lastHadith);
}

$("#langBtn").addEventListener("click", () => {
  currentLang = currentLang === "kk" ? "ru" : "kk";
  try { localStorage.setItem("lang_sb", currentLang); } catch {}
  applyLang();
});

applyLang();

// Запрет правого клика
document.addEventListener("contextmenu", e => e.preventDefault());

// Запрет копирования
document.addEventListener("copy", e => e.preventDefault());
document.addEventListener("cut", e => e.preventDefault());

// Запрет Ctrl+C, Ctrl+U, Ctrl+S, Ctrl+P
document.addEventListener("keydown", function(e) {
  if (e.ctrlKey &&
    (e.key === "c" ||
     e.key === "u" ||
     e.key === "s" ||
     e.key === "p")) {
    e.preventDefault();
  }

  // Запрет F12
  if (e.key === "F12") {
    e.preventDefault();
  }
});
