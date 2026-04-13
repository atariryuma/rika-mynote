/**
 * MkDocs Material - Extra JavaScript for Science Teaching Notebook
 * Features: This Week Highlight, Progress Tracker, Quick Navigation, Smooth Transitions,
 * Last Updated, Keyboard Shortcuts
 */

// Unit schedules for 5年 and 6年
const schedule5 = [
  { unit: "理科開き", start: "04-07", end: "04-11" },
  { unit: "天気の変化", start: "04-14", end: "05-16" },
  { unit: "植物の発芽と成長", start: "05-19", end: "06-20" },
  { unit: "メダカのたんじょう", start: "06-23", end: "07-11" },
  { unit: "台風と気象情報", start: "06-09", end: "06-20" },
  { unit: "流れる水のはたらき", start: "09-01", end: "10-10" },
  { unit: "もののとけ方", start: "10-14", end: "11-21" },
  { unit: "振り子の運動", start: "11-25", end: "12-19" },
  { unit: "電流と電磁石", start: "01-08", end: "02-14" },
  { unit: "人のたんじょう", start: "02-17", end: "03-13" }
];

const schedule6 = [
  { unit: "理科開き", start: "04-07", end: "04-11" },
  { unit: "地球と私たちのくらし", start: "04-14", end: "04-18" },
  { unit: "物の燃え方と空気", start: "04-21", end: "05-16" },
  { unit: "動物の体のつくりとはたらき", start: "05-19", end: "06-13" },
  { unit: "植物の体のつくりとはたらき", start: "06-16", end: "07-04" },
  { unit: "生き物どうしのかかわり", start: "07-07", end: "07-18" },
  { unit: "月の形と太陽", start: "09-01", end: "10-03" },
  { unit: "大地のつくり", start: "10-06", end: "11-07" },
  { unit: "変わり続ける大地", start: "10-27", end: "11-14" },
  { unit: "てこのはたらきとしくみ", start: "11-17", end: "12-19" },
  { unit: "水溶液の性質とはたらき", start: "12-08", end: "02-06" },
  { unit: "電気と私たちのくらし", start: "02-09", end: "03-06" },
  { unit: "地球に生きる", start: "03-09", end: "03-20" }
];

/**
 * Get current active units based on today's date
 */
function getCurrentUnits() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const date = String(today.getDate()).padStart(2, '0');
  const currentDate = `${month}-${date}`;

  function isInRange(start, end, current) {
    // Handle year wrap-around (e.g., Jan to Dec)
    if (start <= end) {
      return current >= start && current <= end;
    } else {
      return current >= start || current <= end;
    }
  }

  const active5 = schedule5.filter(u => isInRange(u.start, u.end, currentDate));
  const active6 = schedule6.filter(u => isInRange(u.start, u.end, currentDate));

  return { active5, active6 };
}

/**
 * 1. Auto "This Week" Highlight
 */
function initThisWeekHighlight() {
  const { active5, active6 } = getCurrentUnits();
  const activeUnits = [...active5, ...active6].map(u => u.unit);

  if (activeUnits.length === 0) return;

  // Find and highlight navigation items
  const navLinks = document.querySelectorAll('a[href*="/"]');
  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    activeUnits.forEach(unit => {
      if (href.includes(unit.replace(/\s+/g, '-'))) {
        link.closest('li') && link.closest('li').classList.add('this-week');
        link.classList.add('this-week');
      }
    });
  });

  // Inject "今週の単元" banner if on relevant page
  const contentArea = document.querySelector('main') || document.querySelector('article');
  if (contentArea && activeUnits.length > 0) {
    const banner = document.createElement('div');
    banner.className = 'this-week-banner';
    banner.innerHTML = `
      <div class="this-week-content">
        <strong>📚 今週の単元:</strong> ${activeUnits.join(', ')}
      </div>
    `;
    contentArea.insertBefore(banner, contentArea.firstChild);
  }
}

/**
 * 2. Progress Tracker
 */
function initProgressTracker() {
  function calculateProgress(schedule, gradeName) {
    let totalPages = 0;
    let completedPages = 0;

    schedule.forEach(unit => {
      // Each unit has 3 pages: Plan, Do&Check, Action
      const pages = ['Plan', 'Do&Check', 'Action'];
      pages.forEach(page => {
        totalPages++;
        // Check if page content has "記録待ち" (stub indicator)
        // This is a simplified check; in production, you'd scan actual page content
        const selector = `a[href*="${unit.unit.replace(/\s+/g, '-')}"][href*="${page.toLowerCase()}"]`;
        const link = document.querySelector(selector);
        if (link && !link.textContent.includes('記録待ち')) {
          completedPages++;
        }
      });
    });

    const percentage = totalPages > 0 ? Math.round((completedPages / totalPages) * 100) : 0;
    return { totalPages, completedPages, percentage };
  }

  const progress5 = calculateProgress(schedule5, '5年');
  const progress6 = calculateProgress(schedule6, '6年');

  // Display on homepage
  const homepage = document.querySelector('.md-content') || document.querySelector('main');
  if (homepage && !homepage.querySelector('.progress-summary')) {
    const progressHTML = document.createElement('div');
    progressHTML.className = 'progress-summary';
    progressHTML.innerHTML = `
      <div class="progress-container">
        <div class="progress-item">
          <h3>5年 進捗状況</h3>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress5.percentage}%"></div>
          </div>
          <p>${progress5.percentage}% (${progress5.completedPages}/${progress5.totalPages})</p>
        </div>
        <div class="progress-item">
          <h3>6年 進捗状況</h3>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress6.percentage}%"></div>
          </div>
          <p>${progress6.percentage}% (${progress6.completedPages}/${progress6.totalPages})</p>
        </div>
      </div>
    `;
    const insertPoint = homepage.querySelector('h1') || homepage.firstChild;
    if (insertPoint) {
      insertPoint.parentNode.insertBefore(progressHTML, insertPoint.nextSibling);
    }
  }
}

/**
 * 3. Quick Navigation Widget (FAB)
 */
function initQuickNav() {
  const { active5, active6 } = getCurrentUnits();
  const currentUnit = active5[0]?.unit || active6[0]?.unit;

  // Create FAB button
  const fab = document.createElement('button');
  fab.className = 'quick-nav-fab';
  fab.innerHTML = '⚡';
  fab.setAttribute('aria-label', 'Quick Navigation');
  fab.setAttribute('title', 'Quick Navigation (Press ?)');

  // Create quick nav panel
  const panel = document.createElement('div');
  panel.className = 'quick-nav-panel';
  panel.innerHTML = `
    <div class="quick-nav-header">
      <h3>クイックナビ</h3>
      <button class="quick-nav-close">&times;</button>
    </div>
    <div class="quick-nav-body">
      ${currentUnit ? `<a href="#" class="quick-nav-item">📌 今週: ${currentUnit}</a>` : ''}
      <a href="index.html" class="quick-nav-item">🏠 ホーム</a>
      <a href="#" class="quick-nav-item">5️⃣ 5年</a>
      <a href="#" class="quick-nav-item">6️⃣ 6年</a>
      <button class="quick-nav-item" id="theme-toggle">🌙 ダークモード</button>
    </div>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  // Toggle panel visibility
  fab.addEventListener('click', () => {
    panel.classList.toggle('active');
  });

  const closeBtn = panel.querySelector('.quick-nav-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      panel.classList.remove('active');
    });
  }

  // Dark mode toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.documentElement.setAttribute(
        'data-md-color-scheme',
        document.documentElement.getAttribute('data-md-color-scheme') === 'dark' ? 'light' : 'dark'
      );
    });
  }

  // Close panel when clicking outside
  document.addEventListener('click', (e) => {
    if (!fab.contains(e.target) && !panel.contains(e.target)) {
      panel.classList.remove('active');
    }
  });
}

/**
 * 4. Smooth Page Transitions
 */
function initSmoothTransitions() {
  const content = document.querySelector('main') || document.querySelector('article');
  if (content) {
    content.style.opacity = '0';
    content.style.transition = 'opacity 0.3s ease-in';
    setTimeout(() => {
      content.style.opacity = '1';
    }, 50);
  }
}

/**
 * 5. Auto-generated "Last Updated" footer
 */
function initLastUpdated() {
  const footer = document.querySelector('.md-footer') || document.querySelector('footer');
  if (footer && !footer.querySelector('.last-updated')) {
    const today = new Date();
    const dateStr = today.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    const updateInfo = document.createElement('div');
    updateInfo.className = 'last-updated';
    updateInfo.innerHTML = `<small>最終更新: ${dateStr}</small>`;
    footer.appendChild(updateInfo);
  }
}

/**
 * 6. Keyboard Shortcuts
 */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ignore if typing in input/textarea
    if (
      e.target.tagName === 'INPUT' ||
      e.target.tagName === 'TEXTAREA' ||
      e.ctrlKey ||
      e.metaKey
    ) {
      return;
    }

    switch (e.key.toLowerCase()) {
      case 'h':
        // Go home
        window.location.href = 'index.html';
        e.preventDefault();
        break;
      case '5':
        // Go to 5年
        const link5 = document.querySelector('a[href*="5"]');
        if (link5) link5.click();
        e.preventDefault();
        break;
      case '6':
        // Go to 6年
        const link6 = document.querySelector('a[href*="6"]');
        if (link6) link6.click();
        e.preventDefault();
        break;
      case 'n':
        // Next page
        const nextBtn = document.querySelector('a.md-footer__link--next');
        if (nextBtn) nextBtn.click();
        e.preventDefault();
        break;
      case 'p':
        // Previous page
        const prevBtn = document.querySelector('a.md-footer__link--prev');
        if (prevBtn) prevBtn.click();
        e.preventDefault();
        break;
      case '?':
        // Show keyboard help
        showKeyboardHelp();
        e.preventDefault();
        break;
    }
  });
}

/**
 * Show keyboard shortcuts help
 */
function showKeyboardHelp() {
  const existing = document.querySelector('.keyboard-help');
  if (existing) {
    existing.remove();
    return;
  }

  const helpPanel = document.createElement('div');
  helpPanel.className = 'keyboard-help';
  helpPanel.innerHTML = `
    <div class="keyboard-help-content">
      <h3>キーボードショートカット</h3>
      <ul>
        <li><kbd>h</kbd> - ホームに戻る</li>
        <li><kbd>5</kbd> - 5年に移動</li>
        <li><kbd>6</kbd> - 6年に移動</li>
        <li><kbd>n</kbd> - 次のページ</li>
        <li><kbd>p</kbd> - 前のページ</li>
        <li><kbd>?</kbd> - このヘルプを表示</li>
      </ul>
      <button class="keyboard-help-close">&times;</button>
    </div>
  `;
  document.body.appendChild(helpPanel);

  const closeBtn = helpPanel.querySelector('.keyboard-help-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      helpPanel.remove();
    });
  }

  // Auto-close after 5 seconds
  setTimeout(() => {
    if (document.body.contains(helpPanel)) {
      helpPanel.remove();
    }
  }, 5000);
}

/**
 * Initialize all features using MkDocs Material's instant loading pattern
 */
document.addEventListener('DOMContentLoaded', () => {
  try {
    initThisWeekHighlight();
    initProgressTracker();
    initQuickNav();
    initSmoothTransitions();
    initLastUpdated();
    initKeyboardShortcuts();
  } catch (error) {
    console.error('Error initializing extra features:', error);
  }
});

// Handle MkDocs Material instant loading (for smooth page transitions)
if (typeof document$ !== 'undefined') {
  document$.subscribe(() => {
    try {
      initThisWeekHighlight();
      initSmoothTransitions();
      initLastUpdated();
    } catch (error) {
      console.error('Error in instant loading callback:', error);
    }
  });
}
