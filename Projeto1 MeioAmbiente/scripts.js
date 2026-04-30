document.addEventListener('DOMContentLoaded', () => {
    
    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle via Logo ---
    const logoMenuBtn = document.querySelector('.logo');
    const navLinks = document.getElementById('nav-links');
    const treeIcon = logoMenuBtn ? logoMenuBtn.querySelector('i') : null;

    if (logoMenuBtn && navLinks) {
        logoMenuBtn.addEventListener('click', (e) => {
            if (window.innerWidth <= 820) {
                e.preventDefault(); // Prevent navigating instantly on mobile
                navLinks.classList.toggle('active');
                
                if (navLinks.classList.contains('active')) {
                    treeIcon.style.transform = 'rotate(180deg)';
                } else {
                    treeIcon.style.transform = 'rotate(0deg)';
                }
            }
        });

        // Close mobile menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                if (treeIcon) treeIcon.style.transform = 'rotate(0deg)';
            });
        });
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
