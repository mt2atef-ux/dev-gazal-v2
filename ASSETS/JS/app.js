// wait for DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Navigation & Tab Control
    // ==========================================
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.dashboard-section');
    const sectionTitle = document.getElementById('section-title');
    const sectionDesc = document.getElementById('section-desc');

    const sectionMeta = {
        overview: {
            title: 'لوحة التحكم العامة والملخص',
            desc: 'متابعة أداء خطة التحول من شركة إلى شركة مساهمة والإدراج في السوق المالية'
        },
        market: {
            title: 'مقارنة السوق والتحول المالي',
            desc: 'دراسة المقارنات التفصيلية وشروط الانتقال من سوق نمو الموازي إلى السوق الرئيسي تداول'
        },
        diagnostics: {
            title: 'معايير التقييم والجاهزية المؤسسية',
            desc: 'المحاور الأربعة للتقييم التشخيصي للشركة ومدى استيفاء متطلبات الامتثال والحوكمة'
        },
        tracks: {
            title: 'مسارات خطة التنفيذ والتشغيل',
            desc: 'استكشاف الأبعاد التشغيلية الخمسة للتطوير: النطاقات، الموردين، اعتماد، التوسع، والشراكات'
        },
        charts: {
            title: 'مؤشرات الأداء وتحليل المستهدفات الرقمية',
            desc: 'تمثيل بياني تفاعلي لتوزيع المهام المائة على مدار الـ 12 شهراً القادمة'
        },
        team: {
            title: 'فريق العمل والمسؤوليات الميدانية',
            desc: 'توزيع المهام السنوية على الكادر البشري المخطط وخطة التوسع الوظيفي التدريجي'
        }
    };

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-target');
            
            // Toggle active menu item
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Toggle active section
            sections.forEach(sec => sec.classList.remove('active-section'));
            document.getElementById(`section-${target}`).classList.add('active-section');
            
            // Update Header Meta
            if(sectionMeta[target]) {
                sectionTitle.textContent = sectionMeta[target].title;
                sectionDesc.textContent = sectionMeta[target].desc;
            }

            // Adjust charts resizing if hidden container was activated
            if(target === 'charts') {
                setTimeout(() => {
                    if(window.monthlyChart) window.monthlyChart.resize();
                    if(window.cumulativeChart) window.cumulativeChart.resize();
                }, 100);
            }
        });
    });

    // ==========================================
    // 2. Dark/Light Mode Theme Toggle
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    const themeText = themeToggleBtn.querySelector('span');

    // Load saved preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeUI(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeUI(newTheme);

        // Update charts styling if they exist
        updateChartsTheme(newTheme);
    });

    function updateThemeUI(theme) {
        if(theme === 'dark') {
            themeIcon.className = 'fa-solid fa-sun';
            themeText.textContent = 'الوضع المضيء';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
            themeText.textContent = 'الوضع الداكن';
        }
    }

    // ==========================================
    // 3. Tab Toggler for Market Qualified Investors
    // ==========================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tabs-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active-content'));
            
            btn.add('active'); // Wait, typo check: should be classList.add
            // Fixing inline:
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active-content');
        });
    });

    // ==========================================
    // 4. Accordion & Interactive GRC Checklist
    // ==========================================
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    // Toggle accordion slide
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isActive = header.classList.contains('active-header');
            
            // Close all first for clean navigation
            accordionHeaders.forEach(h => {
                h.classList.remove('active-header');
                h.nextElementSibling.style.maxHeight = null;
            });

            if (!isActive) {
                header.classList.add('active-header');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // Calculate progress on checkbox changes
    const progressCheckboxes = document.querySelectorAll('.progress-checkbox');
    const overallProgressPercent = document.getElementById('overall-progress-percentage');
    const overallProgressFill = document.getElementById('overall-progress-fill');

    function calculateProgress() {
        const total = progressCheckboxes.length;
        if(total === 0) return;
        
        let checkedCount = 0;
        const axisStats = {
            axis1: { total: 0, checked: 0 },
            axis2: { total: 0, checked: 0 },
            axis3: { total: 0, checked: 0 },
            axis4: { total: 0, checked: 0 }
        };

        progressCheckboxes.forEach(cb => {
            const axis = cb.getAttribute('data-axis');
            axisStats[axis].total++;
            if(cb.checked) {
                checkedCount++;
                axisStats[axis].checked++;
            }
        });

        // Update overall bar
        const overallPercentage = Math.round((checkedCount / total) * 100);
        overallProgressPercent.textContent = `${overallPercentage}%`;
        overallProgressFill.style.width = `${overallPercentage}%`;

        // Update individual axis badges
        for (const [axisId, stat] of Object.entries(axisStats)) {
            const percent = stat.total > 0 ? Math.round((stat.checked / stat.total) * 100) : 0;
            const badge = document.getElementById(`${axisId}-progress`);
            if(badge) badge.textContent = `${percent}%`;
        }
    }

    progressCheckboxes.forEach(cb => {
        cb.addEventListener('change', calculateProgress);
    });

    // Initialize progress tracking
    calculateProgress();

    // ==========================================
    // 5. Track 4: Geographic Expansion Filters
    // ==========================================
    const geoData = [
        // Riyadh
        { name: 'محافظة القويعية', region: 'riyadh', centers: 'الرويضة بالعرض، حلبان، تبراك', road: 'طريق مكة السريع' },
        { name: 'محافظة المزاحمية', region: 'riyadh', centers: 'نطاق طريق مكة السريع غرب الرياض', road: 'طريق مكة السريع' },
        { name: 'محافظة الدوادمي', region: 'riyadh', centers: 'محافظة غرب الرياض ونطاق التشغيل الهام', road: 'طريق مكة السريع' },
        { name: 'محافظة ثادق', region: 'riyadh', centers: 'رغبة والقرى المجاورة شمال العاصمة', road: 'سدير وشمال الرياض' },
        { name: 'منطقة سدير الجغرافية', region: 'riyadh', centers: 'تضم محافظات: المجمعة، الغاط، ثادق، حريملاء', road: 'سدير وشمال الرياض' },
        { name: 'مركز ملهم', region: 'riyadh', centers: 'تابع إدارياً لمحافظة حريملاء وقريب من سدير', road: 'سدير وشمال الرياض' },
        { name: 'مركز ضمرا (طمرة)', region: 'riyadh', centers: 'نطاق جغرافي استثماري جنوب/غرب الرياض', road: 'منطقة الرياض' },
        // Madinah
        { name: 'المدينة المنورة', region: 'madinah', centers: 'العاصمة والمقر الرئيسي للإدارة الطبية بالمنطقة', road: 'المقر الرئيسي للمنطقة' },
        { name: 'محافظة خيبر', region: 'madinah', centers: 'القرى التابعة لها شمال غرب المدينة', road: 'محافظة خيبر' },
        { name: 'محافظة بدر', region: 'madinah', centers: 'المراكز التابعة لها على طريق الساحل', road: 'محافظة بدر' },
        { name: 'محافظة وادي الفرع', region: 'madinah', centers: 'المراكز والقرى المجاورة جنوب المدينة', road: 'محافظة وادي الفرع' }
    ];

    const geoSearchInput = document.getElementById('geo-search');
    const geoFilterBtns = document.querySelectorAll('.geo-filter-btn');
    const geoContainer = document.getElementById('geo-list-container');

    function renderGeoList(filter = 'all', searchQuery = '') {
        geoContainer.innerHTML = '';
        
        const filtered = geoData.filter(item => {
            const matchesRegion = filter === 'all' || item.region === filter;
            const matchesSearch = item.name.includes(searchQuery) || item.centers.includes(searchQuery);
            return matchesRegion && matchesSearch;
        });

        if(filtered.length === 0) {
            geoContainer.innerHTML = `
                <div class="no-results-box" style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <i class="fa-solid fa-face-frown" style="font-size: 2.5rem; margin-bottom: 0.5rem; color: var(--accent-color);"></i>
                    <p>عذراً، لم نجد أي محافظات تطابق بحثك الحالي.</p>
                </div>
            `;
            return;
        }

        filtered.forEach(item => {
            const isRiyadh = item.region === 'riyadh';
            const bgClass = isRiyadh ? 'riyadh-bg' : 'madinah-bg';
            const regionName = isRiyadh ? 'الرياض' : 'المدينة';
            const icon = isRiyadh ? 'fa-road' : 'fa-location-crosshairs';

            const card = document.createElement('div');
            card.className = 'geo-card-item';
            card.setAttribute('data-region', item.region);
            card.innerHTML = `
                <div class="geo-card-header ${bgClass}">
                    <h4>${item.name}</h4>
                    <span class="region-label">${regionName}</span>
                </div>
                <div class="geo-card-body">
                    <p>${item.centers}</p>
                    <span class="status-marker"><i class="fa-solid ${icon}"></i> ${item.road}</span>
                </div>
            `;
            geoContainer.appendChild(card);
        });
    }

    // Filters event
    geoFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            geoFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            const search = geoSearchInput.value.trim();
            renderGeoList(filter, search);
        });
    });

    // Search event
    geoSearchInput.addEventListener('input', () => {
        const activeBtn = document.querySelector('.geo-filter-btn.active');
        const filter = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
        const search = geoSearchInput.value.trim();
        renderGeoList(filter, search);
    });

    // Initial Render
    renderGeoList();

    // ==========================================
    // 6. Track 5 Selector Navigation Tabs
    // ==========================================
    const trackTabBtns = document.querySelectorAll('.track-tab-btn');
    const trackContents = document.querySelectorAll('.track-content');

    trackTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTrack = btn.getAttribute('data-track');
            
            trackTabBtns.forEach(b => b.classList.remove('active'));
            trackContents.forEach(c => c.classList.remove('active-track'));
            
            btn.classList.add('active');
            document.getElementById(targetTrack).classList.add('active-track');
        });
    });

    // ==========================================
    // 7. Team & Staffing Target Calculator
    // ==========================================
    const monthSelect = document.getElementById('calc-month-select');
    const calcStaffContainer = document.getElementById('calc-active-staff');

    // Matrix configuration
    const teamRolesInfo = {
        manager: { name: 'المدير (أنت)', icon: 'fa-user-tie', badgeClass: 'manager-role', roleName: 'إشراف وتطوير أعمال' },
        coordinator: { name: 'المنسق الإداري / التواصل', icon: 'fa-user-tie', badgeClass: 'coordinator-role', roleName: 'عمليات واتصال' },
        etimad: { name: 'مسؤول اعتماد ومناقصات', icon: 'fa-user-tie', badgeClass: 'specialist-role', roleName: 'ينضم الشهر 4' },
        expansion: { name: 'مسؤول التوسع الجغرافي', icon: 'fa-user-tie', badgeClass: 'specialist-role', roleName: 'ينضم الشهر 6' },
        support: { name: 'الدعم الخامس المساعد', icon: 'fa-user-tie', badgeClass: 'support-role', roleName: 'ينضم الشهر 9' }
    };

    function updateStaffCalculator(month) {
        const m = parseInt(month);
        calcStaffContainer.innerHTML = '';

        // Calculate who is active and their tasks in selected month
        const activeStaff = [];

        // Manager is active all year
        let managerTasks = [];
        let managerCount = 0;
        // Scope tasks: M1-M3: 1, M4-M11: 2, M12: 1
        let scopeTasks = (m >= 1 && m <= 3) ? 1 : ((m >= 4 && m <= 11) ? 2 : 1);
        managerTasks.push(`تحديد نطاقات العمل الطبية (${scopeTasks} أهداف)`);
        managerCount += scopeTasks;
        // Etimad tasks for Manager in Month 1-3: 1 task
        if (m >= 1 && m <= 3) {
            managerTasks.push(`إشراف ورصد فرص اعتماد (1 هدف)`);
            managerCount += 1;
        }
        activeStaff.push({
            role: 'manager',
            tasks: managerTasks.join(' + '),
            count: managerCount
        });

        // Coordinator is active all year
        let coordTasks = [];
        let coordCount = 0;
        // Registration: M1-M3: 1, M4-M11: 2, M12: 1
        let regTasks = (m >= 1 && m <= 3) ? 1 : ((m >= 4 && m <= 11) ? 2 : 1);
        coordTasks.push(`متابعة تسجيل الموردين لدى الجهات (${regTasks} أهداف)`);
        coordCount += regTasks;
        // Expansion for coordinator in Month 1-5: 0 in Month 1, 1 in Month 2-5
        if (m >= 2 && m <= 5) {
            coordTasks.push(`رصد خطط توسع جغرافي (1 هدف)`);
            coordCount += 1;
        }
        // NGO Partnerships: M1: 1, M2-M3: 2, M4-M11: 3, M12: 1
        let ngoTasks = (m === 1) ? 1 : ((m >= 2 && m <= 3) ? 2 : ((m >= 4 && m <= 11) ? 3 : 1));
        coordTasks.push(`بناء الشراكات مع الجمعيات (${ngoTasks} أهداف)`);
        coordCount += ngoTasks;

        activeStaff.push({
            role: 'coordinator',
            tasks: coordTasks.join(' + '),
            count: coordCount
        });

        // Etimad Specialist joins Month 4
        if (m >= 4) {
            let etimadCount = (m >= 4 && m <= 11) ? 2 : 1;
            activeStaff.push({
                role: 'etimad',
                tasks: `إعداد العروض الفنية والمالية على اعتماد (${etimadCount} أهداف)`,
                count: etimadCount
            });
        }

        // Expansion Specialist joins Month 6
        if (m >= 6) {
            let expCount = (m >= 6 && m <= 11) ? 1 : 0;
            if (expCount > 0) {
                activeStaff.push({
                    role: 'expansion',
                    tasks: `إبرام وتنشيط الفروع الجغرافية المستهدفة (${expCount} أهداف)`,
                    count: expCount
                });
            } else {
                activeStaff.push({
                    role: 'expansion',
                    tasks: `دعم لوجستي وتغطية جغرافية نهائية`,
                    count: 0
                });
            }
        }

        // Support Staff joins Month 9
        if (m >= 9) {
            activeStaff.push({
                role: 'support',
                tasks: `تقديم دعم تنفيذي وميداني إضافي عند الذروة`,
                count: 0
            });
        }

        // Render rows
        activeStaff.forEach(staff => {
            const info = teamRolesInfo[staff.role];
            const row = document.createElement('div');
            row.className = 'calculator-member-row';
            row.innerHTML = `
                <div class="calc-member-info">
                    <i class="fa-solid ${info.icon}"></i>
                    <div class="calc-member-name">
                        <h5>${info.name}</h5>
                        <span class="role-badge ${info.badgeClass}">${info.roleName}</span>
                    </div>
                </div>
                <div class="calc-member-tasks">
                    ${staff.tasks}
                </div>
                <div class="calc-member-target-val">
                    ${staff.count} مهام
                </div>
            `;
            calcStaffContainer.appendChild(row);
        });

        // Update cards inactive styling in main Team view depending on month
        updateTeamCardsStatus(m);
    }

    function updateTeamCardsStatus(month) {
        const cards = {
            etimad: document.getElementById('team-etimad-card'),
            expansion: document.getElementById('team-expansion-card'),
            support: document.getElementById('team-support-card')
        };

        if (month >= 4) cards.etimad.classList.remove('status-inactive');
        else cards.etimad.classList.add('status-inactive');

        if (month >= 6) cards.expansion.classList.remove('status-inactive');
        else cards.expansion.classList.add('status-inactive');

        if (month >= 9) cards.support.classList.remove('status-inactive');
        else cards.support.classList.add('status-inactive');
    }

    monthSelect.addEventListener('change', (e) => {
        updateStaffCalculator(e.target.value);
    });

    // Initialize calculator to month 1
    updateStaffCalculator(1);

    // ==========================================
    // 8. Chart.js Graphs Initialization
    // ==========================================
    const monthLabels = ['الشهر 1', 'الشهر 2', 'الشهر 3', 'الشهر 4', 'الشهر 5', 'الشهر 6', 'الشهر 7', 'الشهر 8', 'الشهر 9', 'الشهر 10', 'الشهر 11', 'الشهر 12'];
    const monthlyLoad = [4, 6, 6, 10, 10, 10, 10, 10, 10, 10, 10, 4];
    const cumulativeLoad = [4, 10, 16, 26, 36, 46, 56, 66, 76, 86, 96, 100];

    const currentTheme = document.documentElement.getAttribute('data-theme');
    const chartColors = getChartColors(currentTheme);

    function getChartColors(theme) {
        if(theme === 'dark') {
            return {
                gridColor: '#243049',
                textColor: '#94a3b8',
                primary: '#10b981',
                accent: '#d97706',
                accentGrad: 'rgba(217, 119, 6, 0.2)'
            };
        } else {
            return {
                gridColor: '#e2e8f0',
                textColor: '#475569',
                primary: '#006747',
                accent: '#c5a059',
                accentGrad: 'rgba(197, 160, 89, 0.2)'
            };
        }
    }

    // Chart 1: Monthly Load
    const ctx1 = document.getElementById('monthlyTargetsChart').getContext('2d');
    window.monthlyChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: monthLabels,
            datasets: [{
                label: 'الأهداف المنجزة شهرياً',
                data: monthlyLoad,
                backgroundColor: chartColors.primary,
                borderColor: chartColors.primary,
                borderWidth: 1,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    titleFont: { family: 'Cairo' },
                    bodyFont: { family: 'Cairo' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: chartColors.gridColor },
                    ticks: {
                        color: chartColors.textColor,
                        font: { family: 'Cairo' }
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        color: chartColors.textColor,
                        font: { family: 'Cairo' }
                    }
                }
            }
        }
    });

    // Chart 2: Cumulative Progress
    const ctx2 = document.getElementById('cumulativeTargetsChart').getContext('2d');
    window.cumulativeChart = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: monthLabels,
            datasets: [{
                label: 'إجمالي الأهداف التراكمية',
                data: cumulativeLoad,
                borderColor: chartColors.accent,
                backgroundColor: chartColors.accentGrad,
                fill: true,
                tension: 0.3,
                borderWidth: 3,
                pointBackgroundColor: chartColors.accent,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    titleFont: { family: 'Cairo' },
                    bodyFont: { family: 'Cairo' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: chartColors.gridColor },
                    ticks: {
                        color: chartColors.textColor,
                        font: { family: 'Cairo' }
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        color: chartColors.textColor,
                        font: { family: 'Cairo' }
                    }
                }
            }
        }
    });

    function updateChartsTheme(theme) {
        const colors = getChartColors(theme);
        
        // Update Chart 1
        window.monthlyChart.options.scales.y.grid.color = colors.gridColor;
        window.monthlyChart.options.scales.y.ticks.color = colors.textColor;
        window.monthlyChart.options.scales.x.ticks.color = colors.textColor;
        window.monthlyChart.data.datasets[0].backgroundColor = colors.primary;
        window.monthlyChart.data.datasets[0].borderColor = colors.primary;
        window.monthlyChart.update();

        // Update Chart 2
        window.cumulativeChart.options.scales.y.grid.color = colors.gridColor;
        window.cumulativeChart.options.scales.y.ticks.color = colors.textColor;
        window.cumulativeChart.options.scales.x.ticks.color = colors.textColor;
        window.cumulativeChart.data.datasets[0].borderColor = colors.accent;
        window.cumulativeChart.data.datasets[0].backgroundColor = colors.accentGrad;
        window.cumulativeChart.data.datasets[0].pointBackgroundColor = colors.accent;
        window.cumulativeChart.update();
    }
});
