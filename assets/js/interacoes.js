// ============================================================
// interacoes.js
// Arquivo responsável por todas as interações visuais do site
// Inclui: Navbar, Animações de scroll, Carrosséis dos biomas,
//         Termômetro animado, 5 R's interativos e Quiz
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================
    // PARTE 1: NAVBAR E MENU MOBILE
    // ==========================================================

    // Efeito de fundo na navbar ao rolar a página
    const navbar = document.getElementById('navbar');

    // Calcula a altura da seção hero para a animação mobile
    const heroSection = document.getElementById('home');

    function updateNavbar() {
        const scrollY = window.scrollY;

        // Navbar background (desktop + mobile)
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Animação mobile: logo centralizada → esquerda + hamburger fade in
        if (window.innerWidth <= 820 && heroSection) {
            // A animação vai do topo até o fim do hero (quando o vídeo sai de vista)
            const heroBottom = heroSection.offsetHeight;
            // Começa a animar após 40px de scroll, termina quando o hero sai da tela
            const animStart = 40;
            const animEnd = heroBottom - navbar.offsetHeight;
            const progress = Math.min(1, Math.max(0, (scrollY - animStart) / (animEnd - animStart)));

            navbar.style.setProperty('--logo-shift', progress.toFixed(3));
            navbar.style.setProperty('--burger-opacity', progress.toFixed(3));
            navbar.style.setProperty('--burger-pointer', progress > 0.05 ? 'auto' : 'none');
        } else {
            // Desktop ou após resize: limpa as variáveis
            navbar.style.removeProperty('--logo-shift');
            navbar.style.removeProperty('--burger-opacity');
            navbar.style.removeProperty('--burger-pointer');
        }
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });
    window.addEventListener('resize', updateNavbar);
    updateNavbar(); // estado inicial

    // Toggle do menu mobile ao clicar no botão hamburger
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            hamburgerBtn.classList.toggle('is-open', isOpen);
            hamburgerBtn.setAttribute('aria-expanded', isOpen);
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburgerBtn.classList.remove('is-open');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }


    // ==========================================================
    // PARTE 2: ANIMAÇÕES DE SCROLL (Fade-in, Slide-in)
    // ==========================================================

    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };

    const animateObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => animateObserver.observe(el));


    // ==========================================================
    // PARTE 3: CARROSSÉIS DOS BIOMAS
    // ==========================================================

    const carouselsData = {
        'amazonas': { current: 0, count: 3 },
        'cerrado':  { current: 0, count: 3 },
        'pantanal': { current: 0, count: 3 }
    };

    // Função global chamada pelos botões no HTML (onclick)
    window.moveCarousel = function(id, direction) {
        const data = carouselsData[id];
        if (!data) return;
        
        data.current += direction;
        if (data.current < 0) data.current = data.count - 1;
        else if (data.current >= data.count) data.current = 0;
        
        const inner = document.getElementById('inner-' + id);
        if (inner) {
            inner.style.transform = 'translateX(-' + (data.current * 100) + '%)';
        }
    };

    // Avanço automático a cada 5 segundos
    setInterval(() => {
        window.moveCarousel('amazonas', 1);
        window.moveCarousel('cerrado', 1);
        window.moveCarousel('pantanal', 1);
    }, 5000);




    // ==========================================================
    // PARTE 5: OS 5 R'S DA RECICLAGEM (Hover interativo)
    // ==========================================================

    const rsData = {
        repensar:   { title: "Repensar",   desc: "Avalie cada vício de consumo e pondere se sua compra é realmente necessária.",              color: "var(--accent-blue)"   },
        recusar:    { title: "Recusar",    desc: "Diga um forte 'não' à oferta de plásticos de uso inteiramente único.",                       color: "var(--accent-red)"    },
        reduzir:    { title: "Reduzir",    desc: "Diminua drasticamente a taxa de rotatividade dos seus produtos.",                            color: "var(--accent-orange)" },
        reutilizar: { title: "Reutilizar", desc: "Crie com engenhosidade e almeje alongar ao máximo o tempo de utilidade.",                    color: "var(--accent-yellow)" },
        reciclar:   { title: "Reciclar",   desc: "Devolução da matéria polimerizada em inovações moldadas e novos produtos.",                  color: "var(--primary-green)" }
    };

    const nodes = document.querySelectorAll('.circle-node');
    const infoTitle = document.querySelector('#circle-info h3');
    const infoDesc = document.querySelector('#circle-info p');

    if (nodes.length && infoTitle && infoDesc) {
        nodes.forEach(node => {
            node.addEventListener('mouseenter', () => {
                const rKey = node.getAttribute('data-r');
                if (rsData[rKey]) {
                    infoTitle.textContent = rsData[rKey].title;
                    infoTitle.style.color = rsData[rKey].color;
                    infoDesc.textContent = rsData[rKey].desc;
                }
            });
            node.addEventListener('mouseleave', () => {
                infoTitle.textContent = "Passe o mouse";
                infoTitle.style.color = "var(--primary-green)";
                infoDesc.textContent = "Descubra os 5 R's";
            });
        });
    }


    // ==========================================================
    // PARTE 6: QUIZ DE SUSTENTABILIDADE
    // ==========================================================

    // --- Dados do Quiz (perguntas, opções e resposta correta) ---
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

    // --- Elementos do DOM ---
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
        const buttons = optionsContainer.querySelectorAll('button');
        buttons.forEach(b => b.disabled = true);
        feedbackText.style.display = 'block';

        if (selectedIndex === quizData[currentQuestion].correct) {
            btn.classList.add('correct');
            score++;
            feedbackText.textContent = "Acertou! 🎉";
            feedbackText.className = "mt-2 text-green";
        } else {
            btn.classList.add('wrong');
            buttons[quizData[currentQuestion].correct].classList.add('correct');
            feedbackText.textContent = "Errou! 😥";
            feedbackText.className = "mt-2 text-red";
        }

        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < quizData.length) {
                loadQuestion();
            } else {
                quizQuestion.style.display = 'none';
                quizResult.style.display = 'block';
                scoreText.textContent = score;
            }
        }, 1500);
    }

    if (startBtn) startBtn.addEventListener('click', startQuiz);
    if (restartBtn) restartBtn.addEventListener('click', startQuiz);
});
