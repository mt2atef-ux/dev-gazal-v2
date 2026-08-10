/* ===================================================
   United Taste — Strategic Dashboard
   app.js — Navigation, Charts, Tab Togglers
   =================================================== */

'use strict';

/* ===================================================
   1. CONSTANTS & DATA
   =================================================== */
const SECTION_META = {
    overview: {
        title: 'نظرة عامة — محفظة البراندات والملخص التنفيذي',
        desc: 'المطبخ المركزي الموحد يدير 6 علامات تجارية متكاملة بكفاءة إنتاجية قصوى'
    },
    axis1: {
        title: 'المحور الأول: التسجيل كمورد (Vendor Registration)',
        desc: 'إعتماد + HoReCa + ملف التأهيل الموحد (Vendor Deck) + مؤشرات الأداء'
    },
    channels: {
        title: 'المحور الثاني: هندسة قنوات البيع الخمسة',
        desc: 'إدارة شاملة لـ 5 قنوات بيعية مستقلة — Retail · MT · Cash Van · Outlet · B2B'
    },
    axis3: {
        title: 'المحور الثالث: شهادة المحتوى المحلي والقيمة الوطنية',
        desc: 'استراتيجية المحتوى المحلي لتعزيز التنافسية في المناقصات الحكومية'
    },
    growth: {
        title: 'المحور الرابع: التوسع الشامل، الشراكات الاستراتيجية، والنمو',
        desc: '3 مسارات للنمو — الانتشار الوطني + التحول لـ FMCG + الإدراج المالي'
    },
    kpis: {
        title: 'مؤشرات الأداء التشغيلية والبيانات السنوية',
        desc: 'تحليل بياني للأهداف الشهرية والتراكم السنوي عبر القنوات الخمسة'
    },
    consultant: {
        title: 'المحور الخامس: هيكلية الاتفاق المالي والمهني',
        desc: 'النموذج الهجين (Retainer + Success Fee) ومؤشرات أداء المستشار'
    }
};

/* Monthly KPI data per channel */
const MONTHLY_DATA = {
    labels: ['ش1', 'ش2', 'ش3', 'ش4', 'ش5', 'ش6', 'ش7', 'ش8', 'ش9', 'ش10', 'ش11', 'ش12'],
    retail:   [1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    modern:   [1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    b2b:      [1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    geo:      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    contract: [1, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 1]
};

/* Chart brand colors */
const CHART_COLORS = {
    choco:  'rgba(61, 31, 30, 0.85)',
    gold:   'rgba(197, 160, 89, 0.85)',
    warm:   'rgba(184, 116, 40, 0.85)',
    blue:   'rgba(43, 95, 138, 0.85)',
    green:  'rgba(45, 122, 58, 0.85)',
    cream:  'rgba(229, 208, 158, 0.85)',
};

/* ===================================================
   2. NAVIGATION
   =================================================== */
function initNavigation() {
    const menuItems = document.querySelectorAll('.menu-item[data-target]');
    const sections  = document.querySelectorAll('.dashboard-section');
    const sectionTitle = document.getElementById('section-title');
    const sectionDesc  = document.getElementById('section-desc');

    menuItems.forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            const target = item.dataset.target;

            // Update active menu item
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Show corresponding section
            sections.forEach(s => s.classList.remove('active-section'));
            const targetSection = document.getElementById('section-' + target);
            if (targetSection) targetSection.classList.add('active-section');

            // Update header text
            if (SECTION_META[target]) {
                if (sectionTitle) sectionTitle.textContent = SECTION_META[target].title;
                if (sectionDesc)  sectionDesc.textContent  = SECTION_META[target].desc;
            }

            // Initialize charts when KPI section activated
            if (target === 'kpis') {
                setTimeout(initCharts, 100);
            }

            // Scroll to top
            const mainContent = document.querySelector('.main-content');
            if (mainContent) mainContent.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

/* ===================================================
   3. CHANNEL TAB TOGGLE
   =================================================== */
function initChannelTabs() {
    const tabBtns  = document.querySelectorAll('.channel-tab-btn[data-channel]');
    const contents = document.querySelectorAll('.channel-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const channelId = btn.dataset.channel;

            tabBtns.forEach(b  => b.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active-channel'));

            btn.classList.add('active');
            const target = document.getElementById(channelId);
            if (target) target.classList.add('active-channel');
        });
    });
}

/* ===================================================
   4. DARK MODE TOGGLE
   =================================================== */
function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    const stored = localStorage.getItem('ut-theme') || 'light';
    if (stored === 'dark') applyDark();

    btn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('ut-theme', 'light');
            btn.innerHTML = '<i class="fa-solid fa-moon"></i><span>الوضع الداكن</span>';
        } else {
            applyDark();
        }
    });

    function applyDark() {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('ut-theme', 'dark');
        btn.innerHTML = '<i class="fa-solid fa-sun"></i><span>الوضع الفاتح</span>';
    }
}

/* ===================================================
   5. LIVE DATE
   =================================================== */
function initDate() {
    const el = document.getElementById('live-date');
    if (!el) return;
    const now = new Date();
    const opts = { year: 'numeric', month: 'long', day: 'numeric', calendar: 'gregory' };
    el.textContent = now.toLocaleDateString('ar-SA', opts);
}

/* ===================================================
   6. CHARTS
   =================================================== */
let chartsInitialized = false;
let monthlyChart = null;
let cumulativeChart = null;

function initCharts() {
    if (chartsInitialized) return;
    chartsInitialized = true;

    initMonthlyChart();
    initCumulativeChart();
}

function initMonthlyChart() {
    const ctx = document.getElementById('monthlyTargetsChart');
    if (!ctx) return;

    const totalByMonth = MONTHLY_DATA.labels.map((_, i) =>
        MONTHLY_DATA.retail[i] +
        MONTHLY_DATA.modern[i] +
        MONTHLY_DATA.b2b[i] +
        MONTHLY_DATA.geo[i] +
        MONTHLY_DATA.contract[i]
    );

    monthlyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: MONTHLY_DATA.labels,
            datasets: [
                {
                    label: 'تجزئة وفروع',
                    data: MONTHLY_DATA.retail,
                    backgroundColor: CHART_COLORS.choco,
                    borderRadius: 4,
                    borderSkipped: false,
                },
                {
                    label: 'بيع عريض MT',
                    data: MONTHLY_DATA.modern,
                    backgroundColor: CHART_COLORS.gold,
                    borderRadius: 4,
                    borderSkipped: false,
                },
                {
                    label: 'مبيعات B2B',
                    data: MONTHLY_DATA.b2b,
                    backgroundColor: CHART_COLORS.warm,
                    borderRadius: 4,
                    borderSkipped: false,
                },
                {
                    label: 'التوسع الجغرافي',
                    data: MONTHLY_DATA.geo,
                    backgroundColor: CHART_COLORS.blue,
                    borderRadius: 4,
                    borderSkipped: false,
                },
                {
                    label: 'التعاقد B2B',
                    data: MONTHLY_DATA.contract,
                    backgroundColor: CHART_COLORS.green,
                    borderRadius: 4,
                    borderSkipped: false,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { family: 'Cairo', size: 11 },
                        boxWidth: 12,
                        padding: 16,
                        color: getComputedStyle(document.documentElement)
                              .getPropertyValue('--text-secondary').trim() || '#5a3c38'
                    }
                },
                tooltip: {
                    rtl: true,
                    titleFont: { family: 'Cairo' },
                    bodyFont: { family: 'Cairo' }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: { font: { family: 'Cairo', size: 11 } },
                    grid: { display: false }
                },
                y: {
                    stacked: true,
                    ticks: { font: { family: 'Cairo', size: 11 }, stepSize: 2 },
                    grid: { color: 'rgba(0,0,0,0.05)' }
                }
            }
        }
    });
}

function initCumulativeChart() {
    const ctx = document.getElementById('cumulativeTargetsChart');
    if (!ctx) return;

    const monthly = MONTHLY_DATA.labels.map((_, i) =>
        MONTHLY_DATA.retail[i] +
        MONTHLY_DATA.modern[i] +
        MONTHLY_DATA.b2b[i] +
        MONTHLY_DATA.geo[i] +
        MONTHLY_DATA.contract[i]
    );

    const cumulative = [];
    monthly.reduce((acc, val, i) => {
        cumulative[i] = acc + val;
        return cumulative[i];
    }, 0);

    cumulativeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: MONTHLY_DATA.labels,
            datasets: [
                {
                    label: 'التراكم السنوي',
                    data: cumulative,
                    borderColor: CHART_COLORS.gold,
                    backgroundColor: 'rgba(197,160,89,0.10)',
                    borderWidth: 3,
                    pointBackgroundColor: CHART_COLORS.choco,
                    pointBorderColor: CHART_COLORS.gold,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'الهدف الشهري',
                    data: monthly,
                    borderColor: CHART_COLORS.choco,
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointBackgroundColor: '#fff',
                    pointBorderColor: CHART_COLORS.choco,
                    pointRadius: 4,
                    fill: false,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { family: 'Cairo', size: 11 },
                        boxWidth: 12,
                        padding: 16,
                        color: getComputedStyle(document.documentElement)
                              .getPropertyValue('--text-secondary').trim() || '#5a3c38'
                    }
                },
                tooltip: {
                    rtl: true,
                    titleFont: { family: 'Cairo' },
                    bodyFont: { family: 'Cairo' }
                }
            },
            scales: {
                x: {
                    ticks: { font: { family: 'Cairo', size: 11 } },
                    grid: { display: false }
                },
                y: {
                    ticks: { font: { family: 'Cairo', size: 11 } },
                    grid: { color: 'rgba(0,0,0,0.05)' }
                }
            }
        }
    });
}

/* ===================================================
   7. PROGRESS BAR ANIMATION (on load)
   =================================================== */
function animateProgressBars() {
    const fills = document.querySelectorAll('.progress-fill');
    fills.forEach(fill => {
        const target = fill.dataset.width || '0';
        setTimeout(() => {
            fill.style.width = target + '%';
        }, 300);
    });
}

/* ===================================================
   8. CARD HOVER MICRO-ANIMATION
   =================================================== */
function initCardAnimations() {
    const cards = document.querySelectorAll('.brand-card, .axis-step-card, .growth-path-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    cards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(18px)';
        card.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
        observer.observe(card);
    });
}

/* ===================================================
   9. INIT
   =================================================== */
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initChannelTabs();
    initThemeToggle();
    initDate();
    animateProgressBars();
    // Slight delay to let DOM settle before animating
    setTimeout(initCardAnimations, 100);
});
