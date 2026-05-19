// ============================================================
// graficos.js
// Arquivo responsável pelos gráficos do site (Chart.js)
// Inclui: Gráfico de Desmatamento da Amazônia (Barras)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    if (typeof Chart === 'undefined') return;

    Chart.defaults.color = '#9ca3af';
    Chart.defaults.font.family = "'Inter', sans-serif";

    // --- GRÁFICO: Desmatamento da Amazônia - PRODES (Barras) ---
    const defCanvas = document.getElementById('deforestationChart');
    if (defCanvas) {
        new Chart(defCanvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['2019', '2020', '2021', '2022', '2023'],
                datasets: [{
                    label: 'Área Desmatada (km²)',
                    data: [10129, 10851, 13038, 11568, 9064],
                    backgroundColor: [
                        'rgba(255, 149, 0, 0.6)', 'rgba(255, 149, 0, 0.8)',
                        'rgba(255, 59, 48, 0.9)', 'rgba(255, 149, 0, 0.8)',
                        'rgba(0, 210, 106, 0.7)'
                    ],
                    borderColor: ['#ff9500', '#ff9500', '#ff3b30', '#ff9500', '#00d26a'],
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
                            label: function(context) { return context.raw + ' km²'; }
                        }
                    }
                },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }
});
