document.addEventListener('DOMContentLoaded', () => {
    
    // --- Navbar Scroll Effect & Mobile Animation ---
    const navbar = document.getElementById('navbar');
    const hero = document.getElementById('home');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

    function updateScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Mobile header animation calculation
        if (window.innerWidth <= 820 && hero) {
            const heroHeight = hero.offsetHeight;
            let scrollProgress = window.scrollY / heroHeight;
            if (scrollProgress > 1) scrollProgress = 1;
            if (scrollProgress < 0) scrollProgress = 0;
            
            navbar.style.setProperty('--scroll-progress', scrollProgress);
            if (mobileMenuBtn) {
                mobileMenuBtn.style.pointerEvents = scrollProgress < 0.1 ? 'none' : 'auto';
            }
        } else {
            navbar.style.removeProperty('--scroll-progress');
            if (mobileMenuBtn) {
                mobileMenuBtn.style.pointerEvents = 'auto';
            }
        }
    }

    window.addEventListener('scroll', updateScroll);
    window.addEventListener('resize', updateScroll);
    updateScroll(); // Initialize on load

    // --- Mobile Menu Toggle ---
    const logoMenuBtn = document.querySelector('.logo');
    const navLinks = document.getElementById('nav-links');
    const treeIcon = logoMenuBtn ? logoMenuBtn.querySelector('i') : null;

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            if (window.innerWidth <= 820) {
                navLinks.classList.toggle('active');
                mobileMenuBtn.classList.toggle('active');
                
                if (navLinks.classList.contains('active')) {
                    if (treeIcon) treeIcon.style.transform = 'rotate(180deg)';
                } else {
                    if (treeIcon) treeIcon.style.transform = 'rotate(0deg)';
                }
            }
        });

        // Close mobile menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                if (treeIcon) treeIcon.style.transform = 'rotate(0deg)';
            });
        });

        // Close mobile menu when clicking the logo
        if (logoMenuBtn) {
            logoMenuBtn.addEventListener('click', () => {
                if (window.innerWidth <= 820 && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    if (treeIcon) treeIcon.style.transform = 'rotate(0deg)';
                }
            });
        }
    }

    // --- Quiz Logic ---
    const quizData = [
        {
            question: "Qual o principal gás de efeito estufa associado à ação humana citado no site?",
            options: ["Oxigênio (O2)", "Dióxido de Carbono (CO2)", "Nitrogênio (N2)", "Hélio (He)"],
            correct: 1
        },
        {
            question: "Por que o Brasil, através de suas florestas, é vital contra o aquecimento global?",
            options: ["Faz sombra no oceano", "Absorve CO2 atuando como escudo", "Produz 100% do oxigênio mundial", "É a região mais fria do planeta"],
            correct: 1
        },
        {
            question: "Qual a vantagem do vidro na reciclagem?",
            options: ["100% reciclável e pode ser reutilizado infinitamente sem perder qualidade", "Se decompõe na água", "É mais leve que o plástico", "Custa zero energia para derreter"],
            correct: 0
        },
        {
            question: "O descarte correto do lixo eletrônico é essencial porque ele:",
            options: ["Pode curar pragas nas plantas", "Aumenta as reservas de ouro do país", "Contém metais tóxicos que contaminam o solo", "Se transforma em adubo natural facilmente"],
            correct: 2
        }
    ];

    let currentQuestion = 0;
    let score = 0;

    const startBtn = document.getElementById('start-quiz-btn');
    const restartBtn = document.getElementById('restart-quiz-btn');
    const quizStart = document.getElementById('quiz-start');
    const quizQuestion = document.getElementById('quiz-question');
    const quizResult = document.getElementById('quiz-result');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('quiz-options');
    const feedbackText = document.getElementById('quiz-feedback');
    const scoreText = document.getElementById('score-text');
    const totalQuestionsText = document.getElementById('total-questions');

    if (totalQuestionsText) totalQuestionsText.textContent = quizData.length;

    function startQuiz() {
        currentQuestion = 0;
        score = 0;
        quizStart.style.display = 'none';
        quizResult.style.display = 'none';
        quizQuestion.style.display = 'block';
        loadQuestion();
    }

    function loadQuestion() {
        feedbackText.style.display = 'none';
        const q = quizData[currentQuestion];
        questionText.textContent = `${currentQuestion + 1}. ${q.question}`;
        
        optionsContainer.innerHTML = '';
        q.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'opt-btn';
            btn.textContent = opt;
            btn.onclick = () => selectOption(index, btn);
            optionsContainer.appendChild(btn);
        });
    }

    function selectOption(selectedIndex, btn) {
        const q = quizData[currentQuestion];
        const buttons = optionsContainer.querySelectorAll('button');
        
        // Disable all buttons to prevent multiple clicks
        buttons.forEach(b => b.disabled = true);
        
        feedbackText.style.display = 'block';

        if (selectedIndex === q.correct) {
            btn.classList.add('correct');
            score++;
            feedbackText.textContent = "Acertou! 🎉";
            feedbackText.className = "mt-2 text-green";
        } else {
            btn.classList.add('wrong');
            buttons[q.correct].classList.add('correct');
            feedbackText.textContent = "Errou! 😥";
            feedbackText.className = "mt-2 text-red";
        }

        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < quizData.length) {
                loadQuestion();
            } else {
                showResult();
            }
        }, 1500);
    }

    function showResult() {
        quizQuestion.style.display = 'none';
        quizResult.style.display = 'block';
        scoreText.textContent = score;
    }

    if (startBtn) startBtn.addEventListener('click', startQuiz);
    if (restartBtn) restartBtn.addEventListener('click', startQuiz);

    // --- Intersection Observer for Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const animateObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => animateObserver.observe(el));

    // --- Calculadora de Carbono Logic ---
    const slider = document.getElementById('transport-slider');
    const kmValue = document.getElementById('km-value');

    if (slider && kmValue) {
        slider.addEventListener('input', function () {
            kmValue.textContent = this.value + ' km';
        });
    }

    function setupCalcOptions(groupId) {
        const container = document.getElementById(groupId);
        if (!container) return;
        const buttons = container.querySelectorAll('.calc-btn');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('calc-selected'));
                btn.classList.add('calc-selected');
            });
        });
    }

    setupCalcOptions('diet-options');
    setupCalcOptions('energy-options');

    const btnCalculate = document.getElementById('btn-calculate');
    if (btnCalculate) {
        btnCalculate.addEventListener('click', () => {
            const kmPerWeek = parseFloat(slider.value);
            const transportCO2 = (kmPerWeek * 52 * 0.12) / 1000;

            const dietSelected = document.querySelector('#diet-options .calc-selected');
            const dietCO2 = dietSelected ? parseFloat(dietSelected.dataset.value) : 2.5;

            const energySelected = document.querySelector('#energy-options .calc-selected');
            const energyCO2 = energySelected ? parseFloat(energySelected.dataset.value) : 2.0;

            const totalCO2 = (transportCO2 + dietCO2 + energyCO2).toFixed(1);

            document.getElementById('calculator-form').style.display = 'none';
            const resultsDiv = document.getElementById('results');
            resultsDiv.style.display = 'block';

            animateValue("result-co2", 0, parseFloat(totalCO2), 1000);

            const badge = document.getElementById('result-badge');
            const message = document.getElementById('result-message');
            const numberDisplay = document.getElementById('result-co2');

            setTimeout(() => {
                if (totalCO2 < 4.0) {
                    badge.style.backgroundColor = 'rgba(0, 210, 106, 0.15)';
                    badge.style.color = 'var(--primary-green)';
                    numberDisplay.style.color = 'var(--primary-green)';
                    message.textContent = "Excelente! Você está abaixo da média global.";
                } else if (totalCO2 < 7.0) {
                    badge.style.backgroundColor = 'rgba(255, 149, 0, 0.15)';
                    badge.style.color = 'var(--accent-orange)';
                    numberDisplay.style.color = 'var(--accent-orange)';
                    message.textContent = "Atenção: Sua pegada está na média, mas pode melhorar.";
                } else {
                    badge.style.backgroundColor = 'rgba(255, 59, 48, 0.15)';
                    badge.style.color = 'var(--accent-red)';
                    numberDisplay.style.color = 'var(--accent-red)';
                    message.textContent = "Alerta: Sua pegada está alta. Veja como reduzir!";
                }
            }, 1000);
        });
    }

    function animateValue(id, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOut = progress * (2 - progress);
            const current = (start + easeOut * (end - start)).toFixed(1);
            const el = document.getElementById(id);
            if(el) el.innerHTML = current;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Attach to global window to allow inline onclick handlers to work
    window.closeCalculator = function() {
        // The anchor #reciclagem will handle the scroll natively
    };
    
    window.resetCalculator = function() {
        document.getElementById('calculator-form').style.display = 'block';
        document.getElementById('results').style.display = 'none';
        document.getElementById('result-co2').style.color = 'var(--accent-blue)';
    };

    // Also attach reset via addEventListener for the btn-reset-calc button
    const btnResetCalc = document.getElementById('btn-reset-calc');
    if (btnResetCalc) {
        btnResetCalc.addEventListener('click', window.resetCalculator);
    }

    // =========================================
    // --- Water Consumption Calculator ---
    // =========================================

    // Slider display updaters
    const waterSliders = [
        { id: 'shower-time',    display: 'shower-time-display',    suffix: ' min' },
        { id: 'shower-freq',    display: 'shower-freq-display',    suffix: '×' },
        { id: 'faucet-freq',    display: 'faucet-freq-display',    suffix: '×' },
        { id: 'faucet-time',    display: 'faucet-time-display',    suffix: ' min' },
        { id: 'flush-freq',     display: 'flush-freq-display',     suffix: '×' },
        { id: 'washer-freq',    display: 'washer-freq-display',    suffix: '×' },
        { id: 'dishwasher-freq',display: 'dishwasher-freq-display',suffix: '×' },
    ];

    waterSliders.forEach(item => {
        const el = document.getElementById(item.id);
        const disp = document.getElementById(item.display);
        if (el && disp) {
            el.addEventListener('input', function() {
                disp.textContent = this.value + item.suffix;
            });
        }
    });

    // Water option buttons
    function setupWaterOptions(groupId) {
        const container = document.getElementById(groupId);
        if (!container) return;
        const buttons = container.querySelectorAll('.water-opt-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('water-selected'));
                btn.classList.add('water-selected');
            });
        });
    }

    setupWaterOptions('flush-type-options');
    setupWaterOptions('washer-size-options');

    // Calculate water consumption
    const btnCalcWater = document.getElementById('btn-calc-water');
    if (btnCalcWater) {
        btnCalcWater.addEventListener('click', () => {
            // --- Consumo SABESP/ANA references ---
            // Chuveiro: ~12 L/min (fluxo médio)
            // Torneira: ~12 L/min aberta
            // Descarga válvula: ~12L, caixa acoplada: ~6L, dual flush: ~4L
            // Máq. lavar roupa: ~80–160L por ciclo (depende da capacidade)
            // Máq. lavar louça: ~13L por ciclo

            const showerTime = parseFloat(document.getElementById('shower-time').value);
            const showerFreq = parseFloat(document.getElementById('shower-freq').value);
            const faucetFreq = parseFloat(document.getElementById('faucet-freq').value);
            const faucetTime = parseFloat(document.getElementById('faucet-time').value);
            const flushFreq  = parseFloat(document.getElementById('flush-freq').value);
            const washerFreq = parseFloat(document.getElementById('washer-freq').value);
            const dishwasherFreq = parseFloat(document.getElementById('dishwasher-freq').value);

            const flushTypeEl = document.querySelector('#flush-type-options .water-selected');
            const flushLiters = flushTypeEl ? parseFloat(flushTypeEl.dataset.value) : 6;

            const washerSizeEl = document.querySelector('#washer-size-options .water-selected');
            const washerLiters = washerSizeEl ? parseFloat(washerSizeEl.dataset.value) : 120;

            // --- Daily consumption ---
            const showerDaily  = showerTime * showerFreq * 12;        // L/day
            const faucetDaily  = faucetFreq * faucetTime * 12;        // L/day
            const flushDaily   = flushFreq * flushLiters;             // L/day
            const washerDaily  = (washerFreq * washerLiters) / 7;     // L/day (weekly → daily)
            const dishwashDaily = (dishwasherFreq * 13) / 7;          // L/day

            const totalDaily = showerDaily + faucetDaily + flushDaily + washerDaily + dishwashDaily;
            const totalMonthly = totalDaily * 30;
            const totalYearly  = totalDaily * 365;

            // --- Sustainable baseline ---
            // Banho 5min 1x/dia, torneira 1min por uso, dual flush, mesmas frequências de máquinas
            const ecoShower  = 5 * showerFreq * 12;
            const ecoFaucet  = faucetFreq * 1 * 6;            // Arejador reduz para ~6L/min, 1 min
            const ecoFlush   = flushFreq * 4;                 // Dual flush
            const ecoWasher  = washerDaily;                    // Mesma freq, mas carga completa
            const ecoDish    = dishwashDaily;                  // Mesma freq

            const ecoDaily   = ecoShower + ecoFaucet + ecoFlush + ecoWasher + ecoDish;
            const ecoMonthly = ecoDaily * 30;
            const ecoYearly  = ecoDaily * 365;

            const saveDaily   = totalDaily - ecoDaily;
            const saveMonthly = saveDaily * 30;

            // Tarifa média SABESP: ~R$ 11,80 por m³ = R$ 0.0118/L
            const moneyMonthly = (saveMonthly * 0.0118).toFixed(2).replace('.', ',');

            // --- Show results ---
            document.getElementById('water-form').style.display = 'none';
            document.getElementById('water-results').style.display = 'block';

            // Animate numbers
            animateWaterValue('wr-day', totalDaily);
            animateWaterValue('wr-eco-day', ecoDaily);
            animateWaterValue('wr-save-day', saveDaily);

            // Set static values after a short delay
            setTimeout(() => {
                document.getElementById('wr-month').textContent = Math.round(totalMonthly).toLocaleString('pt-BR');
                document.getElementById('wr-year').textContent  = Math.round(totalYearly).toLocaleString('pt-BR');
                document.getElementById('wr-eco-month').textContent = Math.round(ecoMonthly).toLocaleString('pt-BR');
                document.getElementById('wr-eco-year').textContent  = Math.round(ecoYearly).toLocaleString('pt-BR');
                document.getElementById('wr-save-money').textContent = moneyMonthly;

                // Badge
                const badge = document.getElementById('water-badge');
                const msg   = document.getElementById('water-badge-msg');
                if (totalDaily < 110) {
                    badge.style.backgroundColor = 'rgba(0, 210, 106, 0.15)';
                    badge.style.color = 'var(--primary-green)';
                    msg.textContent = 'Parabéns! Seu consumo está abaixo da média brasileira (110 L/dia).';
                } else if (totalDaily < 200) {
                    badge.style.backgroundColor = 'rgba(255, 149, 0, 0.15)';
                    badge.style.color = 'var(--accent-orange)';
                    msg.textContent = 'Atenção: Seu consumo está na média. Há espaço para melhorar!';
                } else {
                    badge.style.backgroundColor = 'rgba(255, 59, 48, 0.15)';
                    badge.style.color = 'var(--accent-red)';
                    msg.textContent = 'Alerta: Consumo elevado! Adote as dicas abaixo para reduzir.';
                }
            }, 800);

            // Scroll to results
            document.getElementById('water-results').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    function animateWaterValue(id, endVal) {
        const el = document.getElementById(id);
        if (!el) return;
        let start = null;
        const duration = 900;
        const step = (ts) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const eased = progress * (2 - progress); // ease-out
            el.textContent = Math.round(eased * endVal);
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    // Reset water calculator
    const btnResetWater = document.getElementById('btn-reset-water');
    if (btnResetWater) {
        btnResetWater.addEventListener('click', () => {
            document.getElementById('water-form').style.display = 'block';
            document.getElementById('water-results').style.display = 'none';
        });
    }


    // --- Chart.js Configuration ---
    
    // Global defaults for Chart.js to match dark theme
    Chart.defaults.color = '#9ca3af';
    Chart.defaults.font.family = "'Inter', sans-serif";

    // 1. CO2 Emissions Chart (Line)
    const co2Canvas = document.getElementById('co2Chart');
    if (co2Canvas) {
        const co2Ctx = co2Canvas.getContext('2d');
        
        // Gradient for CO2 line chart
        const co2Gradient = co2Ctx.createLinearGradient(0, 0, 0, 400);
        co2Gradient.addColorStop(0, 'rgba(255, 59, 48, 0.5)'); // Red 
        co2Gradient.addColorStop(1, 'rgba(255, 59, 48, 0.0)'); 

        new Chart(co2Ctx, {
            type: 'line',
            data: {
                labels: ['2015', '2017', '2019', '2021', '2023'],
                datasets: [{
                    label: 'Emissões Globais (Bilhão ton)',
                    data: [34.5, 35.2, 36.4, 37.1, 37.4],
                    borderColor: '#ff3b30',
                    backgroundColor: co2Gradient,
                    borderWidth: 3,
                    pointBackgroundColor: '#0a1410',
                    pointBorderColor: '#ff3b30',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    fill: true,
                    tension: 0.4 // Smooth curve
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: { color: '#f0fdf4' }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 20, 16, 0.9)',
                        titleColor: '#f0fdf4',
                        bodyColor: '#f0fdf4',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        padding: 10
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    }

    // 2. Deforestation Chart Amazon PRODES (Bar)
    const defCanvas = document.getElementById('deforestationChart');
    if (defCanvas) {
        const defContext = defCanvas.getContext('2d');
        
        new Chart(defContext, {
            type: 'bar',
            data: {
                labels: ['2019', '2020', '2021', '2022', '2023'],
                datasets: [{
                    label: 'Área Desmatada (km²)',
                    data: [10129, 10851, 13038, 11568, 9064], // Real INPE PRODES data approx
                    backgroundColor: [
                        'rgba(255, 149, 0, 0.6)',
                        'rgba(255, 149, 0, 0.8)',
                        'rgba(255, 59, 48, 0.9)', // Peak
                        'rgba(255, 149, 0, 0.8)',
                        'rgba(0, 210, 106, 0.7)'  // Decrease
                    ],
                    borderColor: [
                        '#ff9500',
                        '#ff9500',
                        '#ff3b30',
                        '#ff9500',
                        '#00d26a'
                    ],
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(10, 20, 16, 0.9)',
                        titleColor: '#f0fdf4',
                        bodyColor: '#f0fdf4',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        padding: 10,
                        callbacks: {
                            label: function(context) {
                                return context.raw + ' km²';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    }
});
