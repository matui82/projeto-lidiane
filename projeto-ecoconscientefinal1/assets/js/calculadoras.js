// ============================================================
// calculadoras.js
// Arquivo responsável por TODA a lógica das Calculadoras
// (Pegada de Carbono + Consumo de Água)
// Inclui: dados/fórmulas de cálculo + interface + animações
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================
    // PARTE 1: FÓRMULAS DE CÁLCULO (antigo "Model")
    // ==========================================================

    // --- Fórmula da Pegada de Carbono ---
    // Recebe km/semana, valor da dieta e valor de energia
    // Retorna o total anual de CO2 em toneladas
    function calcularCarbono(kmPerWeek, dietValue, energyValue) {
        const transportCO2 = (kmPerWeek * 52 * 0.12) / 1000;
        const totalCO2 = (transportCO2 + dietValue + energyValue).toFixed(1);
        return parseFloat(totalCO2);
    }

    // --- Fórmula do Consumo de Água ---
    // Recebe os inputs do formulário e retorna consumo atual,
    // consumo sustentável e economia possível
    function calcularAgua(inputs) {
        const {
            showerTime, showerFreq,
            faucetFreq, faucetTime,
            flushFreq, flushLiters,
            washerFreq, washerLiters,
            dishwasherFreq
        } = inputs;

        // Consumo diário (Litros)
        const showerDaily  = showerTime * showerFreq * 12;
        const faucetDaily  = faucetFreq * faucetTime * 12;
        const flushDaily   = flushFreq * flushLiters;
        const washerDaily  = (washerFreq * washerLiters) / 7;
        const dishwashDaily = (dishwasherFreq * 13) / 7;

        const totalDaily = showerDaily + faucetDaily + flushDaily + washerDaily + dishwashDaily;

        // Baseline sustentável
        const ecoShower  = 5 * showerFreq * 12;
        const ecoFaucet  = faucetFreq * 1 * 6; // Aerador reduz para ~6L/min
        const ecoFlush   = flushFreq * 4;      // Dual flush
        const ecoWasher  = washerDaily;        // Mesma frequência, carga cheia
        const ecoDish    = dishwashDaily;      // Mesma frequência

        const ecoDaily   = ecoShower + ecoFaucet + ecoFlush + ecoWasher + ecoDish;
        
        return {
            totalDaily,
            totalMonthly: totalDaily * 30,
            totalYearly: totalDaily * 365,
            ecoDaily,
            ecoMonthly: ecoDaily * 30,
            ecoYearly: ecoDaily * 365,
            saveDaily: totalDaily - ecoDaily,
            saveMonthly: (totalDaily - ecoDaily) * 30
        };
    }


    // ==========================================================
    // PARTE 2: INTERFACE E INTERAÇÃO (antigo "Controller")
    // ==========================================================

    // --- Utilitários ---

    // Configura grupos de botões de seleção (ex: dieta, energia)
    function setupCalcOptions(groupId, selectedClass) {
        const container = document.getElementById(groupId);
        if (!container) return;
        const buttons = container.querySelectorAll('.calc-btn');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove(selectedClass));
                btn.classList.add(selectedClass);
            });
        });
    }

    // Animação de contagem numérica (o número sobe de 0 até o valor final)
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


    // ---------------------------------------------------
    // CALCULADORA DE CARBONO
    // ---------------------------------------------------

    const slider = document.getElementById('transport-slider');
    const kmValue = document.getElementById('km-value');

    if (slider && kmValue) {
        slider.addEventListener('input', function () {
            kmValue.textContent = this.value + ' km';
        });
    }

    setupCalcOptions('diet-options', 'calc-selected');
    setupCalcOptions('energy-options', 'calc-selected');

    const btnCalculate = document.getElementById('btn-calculate');
    if (btnCalculate) {
        btnCalculate.addEventListener('click', () => {
            const kmPerWeek = parseFloat(slider.value);
            
            const dietSelected = document.querySelector('#diet-options .calc-selected');
            const dietCO2 = dietSelected ? parseFloat(dietSelected.dataset.value) : 2.5;

            const energySelected = document.querySelector('#energy-options .calc-selected');
            const energyCO2 = energySelected ? parseFloat(energySelected.dataset.value) : 2.0;

            // Chama a fórmula de cálculo definida na PARTE 1
            const totalCO2 = calcularCarbono(kmPerWeek, dietCO2, energyCO2);

            document.getElementById('calculator-form').style.display = 'none';
            document.getElementById('results').style.display = 'block';

            animateValue("result-co2", 0, totalCO2, 1000);

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

    function resetCalculator() {
        document.getElementById('calculator-form').style.display = 'block';
        document.getElementById('results').style.display = 'none';
        document.getElementById('result-co2').style.color = 'var(--accent-blue)';
    }

    const btnResetCalc = document.getElementById('btn-reset-calc');
    if (btnResetCalc) {
        btnResetCalc.addEventListener('click', resetCalculator);
    }


    // ---------------------------------------------------
    // CALCULADORA DE ÁGUA
    // ---------------------------------------------------

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

    setupCalcOptions('flush-type-options', 'water-selected');
    setupCalcOptions('washer-size-options', 'water-selected');

    const btnCalcWater = document.getElementById('btn-calc-water');
    if (btnCalcWater) {
        btnCalcWater.addEventListener('click', () => {
            const inputs = {
                showerTime: parseFloat(document.getElementById('shower-time').value),
                showerFreq: parseFloat(document.getElementById('shower-freq').value),
                faucetFreq: parseFloat(document.getElementById('faucet-freq').value),
                faucetTime: parseFloat(document.getElementById('faucet-time').value),
                flushFreq: parseFloat(document.getElementById('flush-freq').value),
                washerFreq: parseFloat(document.getElementById('washer-freq').value),
                dishwasherFreq: parseFloat(document.getElementById('dishwasher-freq').value),
                flushLiters: parseFloat(document.querySelector('#flush-type-options .water-selected')?.dataset.value || 6),
                washerLiters: parseFloat(document.querySelector('#washer-size-options .water-selected')?.dataset.value || 120)
            };

            // Chama a fórmula de cálculo definida na PARTE 1
            const results = calcularAgua(inputs);

            // Tarifa média SABESP: ~R$ 11,80 por m³ = R$ 0.0118/L
            const moneyMonthly = (results.saveMonthly * 0.0118).toFixed(2).replace('.', ',');

            document.getElementById('water-form').style.display = 'none';
            document.getElementById('water-results').style.display = 'block';

            function animateWaterValue(id, endVal) {
                const el = document.getElementById(id);
                if (!el) return;
                let start = null;
                const duration = 900;
                const step = (ts) => {
                    if (!start) start = ts;
                    const progress = Math.min((ts - start) / duration, 1);
                    const eased = progress * (2 - progress);
                    el.textContent = Math.round(eased * endVal);
                    if (progress < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
            }

            animateWaterValue('wr-day', results.totalDaily);
            animateWaterValue('wr-eco-day', results.ecoDaily);
            animateWaterValue('wr-save-day', results.saveDaily);

            setTimeout(() => {
                document.getElementById('wr-month').textContent = Math.round(results.totalMonthly).toLocaleString('pt-BR');
                document.getElementById('wr-year').textContent  = Math.round(results.totalYearly).toLocaleString('pt-BR');
                document.getElementById('wr-eco-month').textContent = Math.round(results.ecoMonthly).toLocaleString('pt-BR');
                document.getElementById('wr-eco-year').textContent  = Math.round(results.ecoYearly).toLocaleString('pt-BR');
                document.getElementById('wr-save-money').textContent = moneyMonthly;

                const badge = document.getElementById('water-badge');
                const msg   = document.getElementById('water-badge-msg');
                if (results.totalDaily < 110) {
                    badge.style.backgroundColor = 'rgba(0, 210, 106, 0.15)';
                    badge.style.color = 'var(--primary-green)';
                    msg.textContent = 'Parabéns! Seu consumo está abaixo da média brasileira (110 L/dia).';
                } else if (results.totalDaily < 200) {
                    badge.style.backgroundColor = 'rgba(255, 149, 0, 0.15)';
                    badge.style.color = 'var(--accent-orange)';
                    msg.textContent = 'Atenção: Seu consumo está na média. Há espaço para melhorar!';
                } else {
                    badge.style.backgroundColor = 'rgba(255, 59, 48, 0.15)';
                    badge.style.color = 'var(--accent-red)';
                    msg.textContent = 'Alerta: Consumo elevado! Adote as dicas abaixo para reduzir.';
                }
            }, 800);

            document.getElementById('water-results').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    const btnResetWater = document.getElementById('btn-reset-water');
    if (btnResetWater) {
        btnResetWater.addEventListener('click', () => {
            document.getElementById('water-form').style.display = 'block';
            document.getElementById('water-results').style.display = 'none';
        });
    }
});
