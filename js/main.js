/**
 * 恩派科技 - 企业官网营销网站交互脚本 (优化版)
 * 3D卡片效果 | 下拉菜单 | 滚动动画 | 响应式交互
 */

(function() {
    'use strict';

    // ============================================
    // 3D Card Tilt Effect (Mouse & Touch)
    // ============================================
    class Card3D {
        constructor(element) {
            this.element = element;
            this.inner = element.querySelector('.card-3d-inner') || element;
            this.glow = element.querySelector('.card-3d-glow');
            this.isTouch = window.matchMedia('(pointer: coarse)').matches;

            this.init();
        }

        init() {
            if (this.isTouch) {
                this.initTouch();
            } else {
                this.initMouse();
            }
        }

        initMouse() {
            this.element.addEventListener('mousemove', (e) => {
                const rect = this.element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -12;
                const rotateY = ((x - centerX) / centerX) * 12;

                this.inner.style.setProperty('--rx', `${rotateX}deg`);
                this.inner.style.setProperty('--ry', `${rotateY}deg`);

                if (this.glow) {
                    const mx = (x / rect.width) * 100;
                    const my = (y / rect.height) * 100;
                    this.glow.style.setProperty('--mx', `${mx}%`);
                    this.glow.style.setProperty('--my', `${my}%`);
                }

                this.element.classList.add('active');
            });

            this.element.addEventListener('mouseleave', () => {
                this.inner.style.setProperty('--rx', '0deg');
                this.inner.style.setProperty('--ry', '0deg');
                this.element.classList.remove('active');
            });
        }

        initTouch() {
            let startX, startY;

            this.element.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                this.element.classList.add('active');
            }, { passive: true });

            this.element.addEventListener('touchmove', (e) => {
                const rect = this.element.getBoundingClientRect();
                const x = e.touches[0].clientX - rect.left;
                const y = e.touches[0].clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;

                this.inner.style.setProperty('--rx', `${rotateX}deg`);
                this.inner.style.setProperty('--ry', `${rotateY}deg`);

                if (this.glow) {
                    const mx = (x / rect.width) * 100;
                    const my = (y / rect.height) * 100;
                    this.glow.style.setProperty('--mx', `${mx}%`);
                    this.glow.style.setProperty('--my', `${my}%`);
                }
            }, { passive: true });

            this.element.addEventListener('touchend', () => {
                setTimeout(() => {
                    this.inner.style.setProperty('--rx', '0deg');
                    this.inner.style.setProperty('--ry', '0deg');
                    this.element.classList.remove('active');
                }, 300);
            });
        }
    }

    // ============================================
    // Scroll Animation Observer
    // ============================================
    class ScrollAnimator {
        constructor() {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
        }

        observe(elements) {
            elements.forEach(el => this.observer.observe(el));
        }
    }

    // ============================================
    // Counter Animation
    // ============================================
    class CounterAnimation {
        constructor(element, target, duration = 2000) {
            this.element = element;
            this.target = target;
            this.duration = duration;
            this.started = false;
        }

        start() {
            if (this.started) return;
            this.started = true;

            const startTime = performance.now();
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / this.duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(easeOut * this.target);

                this.element.textContent = current.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.element.textContent = this.target.toLocaleString();
                }
            };

            requestAnimationFrame(animate);
        }
    }

    // ============================================
    // Navbar Scroll Effect
    // ============================================
    function initNavbar() {
        const navbar = document.querySelector('.navbar');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    // ============================================
    // Mobile Menu Toggle with Dropdown Support
    // ============================================
    function initMobileMenu() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');

        if (menuBtn && navLinks) {
            menuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                menuBtn.classList.toggle('active');

                const isExpanded = navLinks.classList.contains('active');
                menuBtn.setAttribute('aria-expanded', isExpanded);
            });

            // Handle mobile dropdown toggles
            document.querySelectorAll('.nav-item.dropdown').forEach(item => {
                const link = item.querySelector('a');
                const dropdown = item.querySelector('.dropdown-menu');

                if (link && dropdown) {
                    link.addEventListener('click', (e) => {
                        if (window.innerWidth <= 768) {
                            e.preventDefault();
                            dropdown.classList.toggle('active');
                            link.classList.toggle('active');
                        }
                    });
                }
            });

            // Close menu when clicking a link
            navLinks.querySelectorAll('a:not(.dropdown-toggle)').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    menuBtn.classList.remove('active');
                    menuBtn.setAttribute('aria-expanded', 'false');
                });
            });
        }
    }

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offset = 80;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ============================================
    // Hero 3D Card Effect
    // ============================================
    function initHero3D() {
        const heroCard = document.querySelector('.hero-3d-card');
        if (!heroCard) return;

        const isTouch = window.matchMedia('(pointer: coarse)').matches;

        if (isTouch) {
            if (window.DeviceOrientationEvent) {
                window.addEventListener('deviceorientation', (e) => {
                    const rotateX = (e.beta - 45) * 0.3;
                    const rotateY = e.gamma * 0.3;
                    heroCard.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
                }, { passive: true });
            }
        } else {
            const heroVisual = document.querySelector('.hero-visual');
            if (heroVisual) {
                heroVisual.addEventListener('mousemove', (e) => {
                    const rect = heroCard.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const rotateX = ((y - centerY) / centerY) * -8;
                    const rotateY = ((x - centerX) / centerX) * 8;

                    heroCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                });

                heroVisual.addEventListener('mouseleave', () => {
                    heroCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
                });
            }
        }
    }

    // ============================================
    // WhatsApp Link Generator
    // ============================================
    function initWhatsApp() {
        const whatsappBtns = document.querySelectorAll('[data-whatsapp]');
        const phone = '8613113922007';
        const message = encodeURIComponent('您好，我想咨询企业建站服务，5年1980元全包套餐。');

        whatsappBtns.forEach(btn => {
            btn.href = `https://wa.me/${phone}?text=${message}`;
            btn.target = '_blank';
            btn.rel = 'noopener noreferrer';
        });
    }

    // ============================================
    // WeChat QR Modal
    // ============================================
    function initWeChatModal() {
        const wechatBtns = document.querySelectorAll('[data-wechat]');

        wechatBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                showModal('微信咨询', '请添加微信：<strong>Lyrasol</strong><br><br>或扫描二维码添加好友', true);
            });
        });
    }

    function showModal(title, content, showQR = false) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';

        let qrHtml = '';
        if (showQR) {
            qrHtml = `<div class="qr-placeholder"><img src="/images/qr300.jpg" alt="扫一扫 添加微信好友"></div>`;
        }

        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <h3 style="font-size:1.3rem;font-weight:700;color:var(--gray-900);margin-bottom:16px;">${title}</h3>
                <p style="color:var(--gray-600);line-height:1.7;">${content}</p>
                ${qrHtml}
                <a href="weixin://" class="btn btn-primary" style="margin-top:16px;width:100%;">
                    <i class="fab fa-weixin"></i> 打开微信
                </a>
            </div>
        `;

        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => modal.remove());

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.contains(modal)) {
                modal.remove();
            }
        });
    }

    // ============================================
    // Lazy Loading Images
    // ============================================
    function initLazyLoad() {
        const lazyImages = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ============================================
    // FAQ Accordion
    // ============================================
    function initFAQ() {
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const item = question.parentElement;
                const isActive = item.classList.contains('active');

                // Close all other items
                document.querySelectorAll('.faq-item').forEach(faq => {
                    faq.classList.remove('active');
                });

                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // ============================================
    // Initialize Everything
    // ============================================
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize 3D cards
        document.querySelectorAll('.card-3d').forEach(card => {
            new Card3D(card);
        });

        // Initialize scroll animations
        const animator = new ScrollAnimator();
        animator.observe(document.querySelectorAll('.fade-in'));

        // Initialize counter animations
        const statNumbers = document.querySelectorAll('.stat-number[data-count]');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.count);
                    new CounterAnimation(entry.target, target).start();
                    counterObserver.unobserve(entry.target);
                }
            });
        });
        statNumbers.forEach(el => counterObserver.observe(el));

        // Initialize other features
        initNavbar();
        initMobileMenu();
        initSmoothScroll();
        initHero3D();
        initWhatsApp();
        initWeChatModal();
        initLazyLoad();
        initFAQ();
    });

    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.querySelectorAll('.card-3d').forEach(card => {
                card.classList.remove('active');
                const inner = card.querySelector('.card-3d-inner') || card;
                inner.style.setProperty('--rx', '0deg');
                inner.style.setProperty('--ry', '0deg');
            });
        }, 250);
    });

})();
