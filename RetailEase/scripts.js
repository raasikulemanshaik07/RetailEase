document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Animated Counter
    const counters = document.querySelectorAll('.counter');
    const delay = 200;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const speed = target / delay;

            const updateCount = () => {
                const count = +counter.innerText.replace(/[^0-9]/g, '');
                if (count < target) {
                    const newCount = Math.ceil(count + speed);
                    counter.innerText = counter.innerText.replace(/[0-9,]+/, newCount.toLocaleString('en-IN'));
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = counter.innerText.replace(/[0-9,]+/, target.toLocaleString('en-IN'));
                }
            };

            updateCount();
        });
    };

    // Trigger counter animation when section is in view
    const dashboardSection = document.getElementById('dashboard');
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !animated) {
            animateCounters();
            animated = true;
        }
    }, { threshold: 0.5 });

    if (dashboardSection) {
        observer.observe(dashboardSection);
    }

    // Chart.js Implementations
    const salesCtx = document.getElementById('salesChart');
    const categoryCtx = document.getElementById('categoryChart');

    if (salesCtx && categoryCtx) {
        // Generate past 30 days virtual data
        const dates = [];
        const salesData = [];

        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates.push(`${d.getDate()}/${d.getMonth() + 1}`);

            // Randomize sales data realistically, slightly trending up over the month
            const baseSales = 8000 + (30 - i) * 150;
            salesData.push(baseSales + Math.floor(Math.random() * 4000) - 2000);
        }

        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Daily Revenue (₹)',
                    data: salesData,
                    borderColor: '#0d6efd',
                    backgroundColor: 'rgba(13, 110, 253, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0,
                    pointHoverRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { borderDash: [5, 5], color: '#e2e8f0' },
                        ticks: {
                            callback: function (value) {
                                return '₹' + (value / 1000) + 'k';
                            }
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { maxTicksLimit: 7 }
                    }
                }
            }
        });

        // Virtual "Sold Items" Categories Pie Chart
        new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Analgesics', 'Antibiotics', 'Vitamins', 'Cough & Cold', 'Others'],
                datasets: [{
                    data: [35, 20, 15, 15, 15],
                    backgroundColor: [
                        '#0d6efd',
                        '#10b981',
                        '#f59e0b',
                        '#8b5cf6',
                        '#94a3b8'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            padding: 15,
                            font: { size: 11 }
                        }
                    }
                }
            }
        });
    }
});
