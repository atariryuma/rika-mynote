/**
 * 理科マイノート - Enhanced UX Script
 * Works with MkDocs Material's navigation.instant via document$ observable.
 */

// ============================================================================
// Unit schedule data (for "今週の単元" detection)
// ============================================================================

const SCHEDULE_5 = [
  { unit: "理科開き",         slug: "rika-biraki",              start: "04-07", end: "04-11" },
  { unit: "天気の変化",       slug: "tenki-no-henka",           start: "04-14", end: "05-16" },
  { unit: "植物の発芽と成長", slug: "shokubutsu-hatsuga-seicho", start: "05-19", end: "06-20" },
  { unit: "メダカのたんじょう", slug: "medaka-no-tanjo",         start: "06-23", end: "07-11" },
  { unit: "台風と気象情報",   slug: "taifu-to-kisho",           start: "09-01", end: "09-19" },
  { unit: "流れる水のはたらき", slug: "nagareru-mizu",           start: "09-22", end: "10-24" },
  { unit: "もののとけ方",     slug: "mono-no-tokekata",         start: "10-27", end: "12-05" },
  { unit: "振り子の運動",     slug: "furiko-no-undo",           start: "12-08", end: "01-23" },
  { unit: "電流と電磁石",     slug: "denryu-to-denjishaku",     start: "01-26", end: "02-27" },
  { unit: "人のたんじょう",   slug: "hito-no-tanjo",            start: "03-02", end: "03-20" },
];

const SCHEDULE_6 = [
  { unit: "理科開き",                   slug: "rika-biraki",        start: "04-07", end: "04-11" },
  { unit: "地球と私たちのくらし",       slug: "unit1",              start: "04-14", end: "04-18" },
  { unit: "物の燃え方と空気",           slug: "mono-no-moekata",    start: "04-21", end: "05-16" },
  { unit: "動物の体のつくりとはたらき", slug: "unit3",              start: "05-19", end: "06-13" },
  { unit: "植物の体のつくりとはたらき", slug: "unit4",              start: "06-16", end: "07-04" },
  { unit: "生き物どうしのかかわり",     slug: "unit5",              start: "07-07", end: "07-18" },
  { unit: "月の形と太陽",               slug: "unit6",              start: "09-01", end: "10-03" },
  { unit: "大地のつくり",               slug: "unit7",              start: "10-06", end: "10-31" },
  { unit: "変わり続ける大地",           slug: "unit8",              start: "11-02", end: "11-20" },
  { unit: "てこのはたらきとしくみ",     slug: "unit9",              start: "11-24", end: "12-19" },
  { unit: "水溶液の性質とはたらき",     slug: "unit10",             start: "01-08", end: "02-06" },
  { unit: "電気と私たちのくらし",       slug: "unit11",             start: "02-09", end: "03-06" },
  { unit: "地球に生きる",               slug: "unit12",             start: "03-09", end: "03-20" },
];

// ============================================================================
// Utilities
// ============================================================================

function todayKey() {
  const now = new Date();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${m}-${d}`;
}

function inRange(start, end, current) {
  // Handles year wrap (e.g., Dec -> Feb)
  if (start <= end) return current >= start && current <= end;
  return current >= start || current <= end;
}

function currentUnits() {
  const k = todayKey();
  return {
    g5: SCHEDULE_5.filter((u) => inRange(u.start, u.end, k)),
    g6: SCHEDULE_6.filter((u) => inRange(u.start, u.end, k)),
  };
}

function isHomepage() {
  const p = window.location.pathname;
  // Matches "/rika-mynote/", "/rika-mynote/index.html", or just "/"
  return /\/(index\.html)?$/.test(p) || p.endsWith("/rika-mynote/");
}

function baseURL() {
  // mkdocs sets canonical URL at base; fallback to root
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    try {
      const u = new URL(canonical.href);
      return u.pathname.replace(/\/[^/]*$/, "/");
    } catch (_) {}
  }
  // Infer from current URL - strip trailing page
  const parts = window.location.pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "/";
  // If last part is a page file, remove it
  if (/\.html?$/.test(parts[parts.length - 1])) parts.pop();
  return "/" + parts.join("/") + (parts.length ? "/" : "");
}

// ============================================================================
// 1. Populate "今週の単元" container on homepage
// ============================================================================

function renderThisWeek() {
  const container = document.getElementById("this-week-container");
  if (!container) return;

  const { g5, g6 } = currentUnits();
  const base = baseURL();

  if (g5.length === 0 && g6.length === 0) {
    container.innerHTML = `
      <p class="this-week-empty">現在、進行中の単元はありません（休暇期間の可能性があります）</p>
    `;
    return;
  }

  const renderList = (grade, items, gradeSlug) =>
    items
      .map(
        (u) => `
      <a href="${base}${gradeSlug}/${u.slug}/plan/" class="this-week-item">
        <span class="this-week-grade">${grade}</span>
        <span class="this-week-unit">${u.unit}</span>
        <span class="this-week-period">${u.start.replace("-", "/")} 〜 ${u.end.replace("-", "/")}</span>
      </a>`
      )
      .join("");

  container.innerHTML = `
    <div class="this-week-list">
      ${renderList("5年", g5, "5nen")}
      ${renderList("6年", g6, "6nen")}
    </div>
  `;
}

// ============================================================================
// 2. Highlight "this week" units in sidebar nav
// ============================================================================

function highlightThisWeekInNav() {
  const { g5, g6 } = currentUnits();
  const all = [...g5.map((u) => u.slug), ...g6.map((u) => u.slug)];
  if (all.length === 0) return;

  document.querySelectorAll(".md-nav__link").forEach((link) => {
    const href = link.getAttribute("href") || "";
    for (const slug of all) {
      if (href.includes(`/${slug}/`)) {
        link.classList.add("this-week");
        break;
      }
    }
  });
}

// ============================================================================
// 3. Quick-nav FAB
// ============================================================================

function initQuickNav() {
  if (document.querySelector(".quick-nav-fab")) return; // avoid duplicates

  const base = baseURL();
  const { g5, g6 } = currentUnits();
  const currentUnit = g5[0] || g6[0];
  const currentGrade = g5[0] ? "5nen" : g6[0] ? "6nen" : null;

  const fab = document.createElement("button");
  fab.className = "quick-nav-fab";
  fab.setAttribute("aria-label", "クイックナビゲーション");
  fab.setAttribute("title", "クイックナビ (?)");
  fab.textContent = "⚡";

  const panel = document.createElement("div");
  panel.className = "quick-nav-panel";
  panel.innerHTML = `
    <div class="quick-nav-header">
      <h3>クイックナビ</h3>
      <button class="quick-nav-close" aria-label="閉じる">×</button>
    </div>
    <div class="quick-nav-body">
      ${
        currentUnit && currentGrade
          ? `<a href="${base}${currentGrade}/${currentUnit.slug}/plan/" class="quick-nav-item">📌 今週: ${currentUnit.unit}</a>`
          : ""
      }
      <a href="${base}" class="quick-nav-item">🏠 ホーム</a>
      <a href="${base}5nen/" class="quick-nav-item">5️⃣ 5年</a>
      <a href="${base}6nen/" class="quick-nav-item">6️⃣ 6年</a>
      <a href="${base}research/overview/" class="quick-nav-item">🔬 校内研究</a>
      <a href="${base}resources/" class="quick-nav-item">📚 リソース</a>
    </div>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  fab.addEventListener("click", (e) => {
    e.stopPropagation();
    panel.classList.toggle("active");
  });

  panel.querySelector(".quick-nav-close").addEventListener("click", () => {
    panel.classList.remove("active");
  });

  document.addEventListener("click", (e) => {
    if (!fab.contains(e.target) && !panel.contains(e.target)) {
      panel.classList.remove("active");
    }
  });
}

// ============================================================================
// 4. Keyboard shortcuts
// ============================================================================

function initKeyboardShortcuts() {
  if (window.__rikaShortcutsBound) return;
  window.__rikaShortcutsBound = true;

  document.addEventListener("keydown", (e) => {
    if (
      e.target.tagName === "INPUT" ||
      e.target.tagName === "TEXTAREA" ||
      e.target.isContentEditable ||
      e.ctrlKey ||
      e.metaKey ||
      e.altKey
    ) return;

    const base = baseURL();
    switch (e.key) {
      case "?":
      case "/":
        if (e.key === "?") {
          e.preventDefault();
          showKeyboardHelp();
        }
        break;
      case "g":
        // Vim-style "g h" -> home. Wait for next key briefly.
        window.__rikaKeyG = true;
        setTimeout(() => (window.__rikaKeyG = false), 800);
        break;
      case "h":
        if (window.__rikaKeyG) {
          e.preventDefault();
          window.location.href = base;
          window.__rikaKeyG = false;
        }
        break;
      case "5":
        if (window.__rikaKeyG) {
          e.preventDefault();
          window.location.href = base + "5nen/";
          window.__rikaKeyG = false;
        }
        break;
      case "6":
        if (window.__rikaKeyG) {
          e.preventDefault();
          window.location.href = base + "6nen/";
          window.__rikaKeyG = false;
        }
        break;
    }
  });
}

function showKeyboardHelp() {
  const existing = document.querySelector(".keyboard-help");
  if (existing) {
    existing.remove();
    return;
  }
  const modal = document.createElement("div");
  modal.className = "keyboard-help";
  modal.innerHTML = `
    <div class="keyboard-help-content">
      <button class="keyboard-help-close" aria-label="閉じる">×</button>
      <h3>キーボードショートカット</h3>
      <ul>
        <li><kbd>g</kbd> <kbd>h</kbd> ホームへ</li>
        <li><kbd>g</kbd> <kbd>5</kbd> 5年へ</li>
        <li><kbd>g</kbd> <kbd>6</kbd> 6年へ</li>
        <li><kbd>s</kbd> 検索（Material標準）</li>
        <li><kbd>?</kbd> このヘルプを表示</li>
      </ul>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector(".keyboard-help-close").addEventListener("click", () => modal.remove());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });
  setTimeout(() => {
    if (document.body.contains(modal)) modal.remove();
  }, 8000);
}

// ============================================================================
// 5. Initialization (MkDocs Material instant-loading friendly)
// ============================================================================

function onPageReady() {
  try {
    renderThisWeek();
    highlightThisWeekInNav();
    initQuickNav();
  } catch (err) {
    console.error("[rika-mynote] page init error:", err);
  }
}

// One-time bindings (keyboard, etc.)
function onFirstLoad() {
  try {
    initKeyboardShortcuts();
  } catch (err) {
    console.error("[rika-mynote] first-load error:", err);
  }
}

if (typeof document$ !== "undefined") {
  // MkDocs Material's instant-loading observable fires on every page render
  document$.subscribe(onPageReady);
  onFirstLoad();
} else {
  document.addEventListener("DOMContentLoaded", () => {
    onFirstLoad();
    onPageReady();
  });
}
