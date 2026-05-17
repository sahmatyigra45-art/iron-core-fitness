document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1500);
    }

    // Header scroll effect
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu
    const menuToggle = document.querySelector('.menu-toggle');
    const navMobile = document.querySelector('.nav-mobile');
    const overlay = document.querySelector('.overlay');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMobile.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = navMobile.classList.contains('active') ? 'hidden' : '';
        });

        overlay.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMobile.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        document.querySelectorAll('.nav-mobile a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMobile.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate').forEach(el => {
        observer.observe(el);
    });

    // Toast notifications
    function showToast(message, type = 'success') {
        const container = document.querySelector('.toast-container') || createToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
            <span>${message}</span>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function createToastContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }

    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('ironcore_cart')) || [];

    function updateCartCount() {
        const count = document.querySelector('.cart-count');
        if (count) {
            count.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
            count.style.display = cart.length ? 'flex' : 'none';
        }
    }

    function addToCart(name, price, image) {
        const existing = cart.find(item => item.name === name);
        if (existing) {
            existing.qty++;
        } else {
            cart.push({ name, price, image, qty: 1 });
        }
        localStorage.setItem('ironcore_cart', JSON.stringify(cart));
        updateCartCount();
        showToast(`${name} добавлен в корзину`);
    }

    function removeFromCart(name) {
        cart = cart.filter(item => item.name !== name);
        localStorage.setItem('ironcore_cart', JSON.stringify(cart));
        updateCartCount();
        renderCartModal();
    }

    function renderCartModal() {
        const modalBody = document.querySelector('.cart-items');
        if (!modalBody) return;

        if (cart.length === 0) {
            modalBody.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:40px 0;">Корзина пуста</p>';
            document.querySelector('.cart-total-price').textContent = '0 ₴';
            return;
        }

        let total = 0;
        modalBody.innerHTML = cart.map(item => {
            total += item.price * item.qty;
            return `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.price} ₴ × ${item.qty}</p>
                    </div>
                    <button class="cart-item-remove" onclick="window.removeCartItem('${item.name}')">×</button>
                </div>
            `;
        }).join('');

        document.querySelector('.cart-total-price').textContent = total + ' ₴';
    }

    window.removeCartItem = function(name) {
        removeFromCart(name);
    };

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.shop-card');
            const name = card.querySelector('.product-name').textContent;
            const price = parseInt(card.querySelector('.product-price').textContent);
            const image = card.querySelector('.product-img img').src;
            addToCart(name, price, image);
        });
    });

    // Cart modal
    const cartBtn = document.querySelector('.cart-btn');
    const cartModal = document.getElementById('cart-modal');

    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', () => {
            renderCartModal();
            cartModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        cartModal.querySelector('.modal-close').addEventListener('click', () => {
            cartModal.classList.remove('active');
            document.body.style.overflow = '';
        });

        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    updateCartCount();

    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            const isActive = item.classList.contains('active');

            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            const container = btn.closest('.tabs-container');

            container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            container.querySelector(`#${tabId}`).classList.add('active');
        });
    });

    // Form validation
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;

            form.querySelectorAll('[required]').forEach(field => {
                const group = field.closest('.form-group');
                if (!field.value.trim()) {
                    valid = false;
                    group.classList.add('error');
                } else {
                    group.classList.remove('error');
                }
            });

            if (valid) {
                showToast('Форма успешно отправлена! Мы свяжемся с вами в ближайшее время.');
                form.reset();
            } else {
                showToast('Пожалуйста, заполните все обязательные поля', 'error');
            }
        });

        form.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('input', () => {
                field.closest('.form-group')?.classList.remove('error');
            });
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Gallery lightbox (simple)
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (!img) return;

            const lightbox = document.createElement('div');
            lightbox.style.cssText = `
                position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.95);
                display:flex;align-items:center;justify-content:center;
                cursor:pointer;opacity:0;transition:opacity 0.3s;
            `;
            lightbox.innerHTML = `<img src="${img.src}" style="max-width:90%;max-height:90%;object-fit:contain;border:2px solid var(--border);">`;
            document.body.appendChild(lightbox);

            requestAnimationFrame(() => lightbox.style.opacity = '1');
            document.body.style.overflow = 'hidden';

            lightbox.addEventListener('click', () => {
                lightbox.style.opacity = '0';
                setTimeout(() => {
                    lightbox.remove();
                    document.body.style.overflow = '';
                }, 300);
            });
        });
    });

    // BMI Calculator (if exists)
    const bmiForm = document.getElementById('bmi-form');
    if (bmiForm) {
        bmiForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const height = parseFloat(document.getElementById('bmi-height').value) / 100;
            const weight = parseFloat(document.getElementById('bmi-weight').value);

            if (height > 0 && weight > 0) {
                const bmi = (weight / (height * height)).toFixed(1);
                let status = '';
                let color = '';

                if (bmi < 18.5) { status = 'Недостаточный вес'; color = '#ffd600'; }
                else if (bmi < 25) { status = 'Норма'; color = '#00c853'; }
                else if (bmi < 30) { status = 'Избыточный вес'; color = '#ff9100'; }
                else { status = 'Ожирение'; color = '#ff2a2a'; }

                document.getElementById('bmi-result').innerHTML = `
                    <div style="text-align:center;padding:30px;background:var(--gray);border-radius:var(--radius);border:1px solid var(--border);">
                        <div style="font-size:3rem;font-weight:900;color:var(--primary);margin-bottom:8px;">${bmi}</div>
                        <div style="font-size:1.2rem;font-weight:700;color:${color};margin-bottom:8px;">${status}</div>
                        <p style="color:var(--text-muted);font-size:0.9rem;">ИМТ = ${bmi} кг/м²</p>
                    </div>
                `;
            }
        });
    }

    // Current year in footer
    document.querySelectorAll('.current-year').forEach(el => {
        el.textContent = new Date().getFullYear();
    });

    // Active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-desktop a, .nav-mobile a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});
