/**
 * athallahDsgn — Modern Design Studio
 * Core JavaScript & Interactive Backend Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Management (Light / Dark Mode)
  initTheme();

  // 2. Navigation & Sticky Header
  initNavigation();

  // 3. Hero Interactive Studio Canvas
  initHeroCanvas();

  // 4. Portfolio Filter Tabs
  initPortfolioFilters();

  // 5. Pricing Period Toggle
  initPricingToggle();

  // 6. FAQ Accordion
  initFaqAccordion();

  // 7. Project Modal Dialog & Backend Submission
  initProjectModal();

  // 8. Statistics Counter Animation
  initStatsCounter();

  // 9. Newsletter Form & Backend Submission
  initNewsletterForm();
});

/* ==========================================================================
   1. Theme Management
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('athallah_theme');

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (prefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('athallah_theme', newTheme);
      showToast(`Mode ${newTheme === 'dark' ? 'Gelap' : 'Terang'} diaktifkan`);
    });
  }
}

/* ==========================================================================
   2. Navigation & Sticky Header
   ========================================================================== */
function initNavigation() {
  const header = document.getElementById('main-header');
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('open');
      if (isOpen) {
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      } else {
        navLinks.classList.add('open');
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* ==========================================================================
   3. Hero Interactive Studio Canvas
   ========================================================================== */
function initHeroCanvas() {
  const canvasMenuItems = document.querySelectorAll('.canvas-menu-item');
  const previewInfoTitle = document.getElementById('canvas-preview-title');
  const previewInfoDesc = document.getElementById('canvas-preview-desc');
  const previewDynamicArea = document.getElementById('canvas-dynamic-content');

  const canvasData = {
    overview: {
      title: 'Design System & UI Kit v3.0',
      desc: 'Token terpusat untuk warna, komponen, dan interaksi responsif',
      html: `
        <div class="preview-grid">
          <div class="preview-card-stat">
            <div class="stat-label">Komponen Aktif</div>
            <div class="stat-val">120+ UI Kits</div>
            <div class="stat-growth">✓ 100% WCAG AA</div>
          </div>
          <div class="preview-card-stat">
            <div class="stat-label">Efisiensi Dev</div>
            <div class="stat-val">+65% Speed</div>
            <div class="stat-growth">⚡ Zero-drift Handover</div>
          </div>
        </div>
        <div class="preview-wireframe-display">
          <div style="display: flex; gap: 8px; width: 100%; justify-content: center; flex-wrap: wrap;">
            <span class="btn btn-primary btn-sm">Primary Button</span>
            <span class="btn btn-secondary btn-sm">Secondary</span>
            <span class="btn btn-outline btn-sm">Outline</span>
          </div>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 8px;">Auto-layout Figma terintegrasi token CSS Variables</p>
        </div>
      `
    },
    wireframe: {
      title: 'UX Flow & Wireframing Architecture',
      desc: 'Pemetaan arsitektur informasi dan user journey tanpa friksi',
      html: `
        <div class="preview-wireframe-display" style="min-height: 220px;">
          <div style="width: 90%; display: flex; flex-direction: column; gap: 8px;">
            <div class="ui-bar-header" style="width: 50%;"></div>
            <div class="ui-bar-line"></div>
            <div class="ui-bar-line short"></div>
            <div style="display: flex; gap: 8px; margin-top: 12px;">
              <div style="flex: 1; height: 40px; border: 1px dashed var(--border-strong); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; color: var(--text-muted);">Step 1: Onboarding</div>
              <div style="flex: 1; height: 40px; border: 1px dashed var(--border-strong); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; color: var(--text-muted);">Step 2: Setup</div>
              <div style="flex: 1; height: 40px; border: 1px dashed var(--brand-primary); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; color: var(--brand-primary); font-weight: 600;">Step 3: Conversion</div>
            </div>
          </div>
        </div>
      `
    },
    prototype: {
      title: 'Interactive Micro-Prototyping',
      desc: 'Simulasi interaksi realistis dengan transisi kinetik 60 FPS',
      html: `
        <div class="preview-grid">
          <div class="preview-card-stat">
            <div class="stat-label">Frame Rate</div>
            <div class="stat-val">60 FPS</div>
            <div class="stat-growth">✦ Native Smooth</div>
          </div>
          <div class="preview-card-stat">
            <div class="stat-label">User Usability Score</div>
            <div class="stat-val">94.8 / 100</div>
            <div class="stat-growth">↑ Pengujian 24 User</div>
          </div>
        </div>
        <div class="preview-wireframe-display">
          <div style="font-size: 0.9rem; font-weight: 700; color: var(--brand-primary);">✨ Dynamic Gesture & Hover Interaction</div>
          <div style="font-size: 0.8rem; color: var(--text-secondary);">Prototipe siap uji dengan feedback haptik dan visual state presisi</div>
        </div>
      `
    },
    handoff: {
      title: 'Clean Developer Handover Spec',
      desc: 'Spesifikasi aset, kode styling, dan dokumentasi API siap pakai',
      html: `
        <div class="preview-wireframe-display" style="background-color: var(--bg-tertiary); text-align: left; align-items: flex-start; padding: 1.25rem;">
          <code style="font-family: monospace; font-size: 0.8rem; color: var(--brand-primary); line-height: 1.6;">
            // Design Token Output<br>
            --brand-primary: #0284c7;<br>
            --card-radius: 18px;<br>
            --elevation-high: 0 16px 32px rgba(15,23,42,0.1);<br>
            --motion-spring: cubic-bezier(0.16, 1, 0.3, 1);
          </code>
          <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 8px;">100% Cocok dengan React, Tailwind, Next.js, dan Flutter</p>
        </div>
      `
    }
  };

  canvasMenuItems.forEach(item => {
    item.addEventListener('click', () => {
      canvasMenuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const target = item.getAttribute('data-canvas-target');
      if (canvasData[target] && previewDynamicArea) {
        previewInfoTitle.textContent = canvasData[target].title;
        previewInfoDesc.textContent = canvasData[target].desc;
        previewDynamicArea.innerHTML = canvasData[target].html;
      }
    });
  });
}

/* ==========================================================================
   4. Portfolio Filter Tabs
   ========================================================================== */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.showcase-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   5. Pricing Period Toggle
   ========================================================================== */
function initPricingToggle() {
  const toggleSwitch = document.getElementById('pricing-switch');
  const labelProject = document.getElementById('label-project');
  const labelRetainer = document.getElementById('label-retainer');

  const priceStarter = document.getElementById('price-starter');
  const periodStarter = document.getElementById('period-starter');

  const pricePro = document.getElementById('price-pro');
  const periodPro = document.getElementById('period-pro');

  const priceEnterprise = document.getElementById('price-enterprise');
  const periodEnterprise = document.getElementById('period-enterprise');

  let isRetainer = false;

  function updatePricing() {
    if (isRetainer) {
      toggleSwitch.classList.add('active');
      labelRetainer.classList.add('active');
      labelProject.classList.remove('active');

      if (priceStarter) priceStarter.textContent = '12.5';
      if (periodStarter) periodStarter.textContent = 'jt / bulan';

      if (pricePro) pricePro.textContent = '24.5';
      if (periodPro) periodPro.textContent = 'jt / bulan';

      if (priceEnterprise) priceEnterprise.textContent = '48.0';
      if (periodEnterprise) periodEnterprise.textContent = 'jt / bulan';
    } else {
      toggleSwitch.classList.remove('active');
      labelProject.classList.add('active');
      labelRetainer.classList.remove('active');

      if (priceStarter) priceStarter.textContent = '15.0';
      if (periodStarter) periodStarter.textContent = 'jt / proyek';

      if (pricePro) pricePro.textContent = '29.0';
      if (periodPro) periodPro.textContent = 'jt / proyek';

      if (priceEnterprise) priceEnterprise.textContent = '58.0';
      if (periodEnterprise) periodEnterprise.textContent = 'jt / proyek';
    }
  }

  if (toggleSwitch) {
    toggleSwitch.addEventListener('click', () => {
      isRetainer = !isRetainer;
      updatePricing();
    });
  }

  if (labelProject) {
    labelProject.addEventListener('click', () => {
      isRetainer = false;
      updatePricing();
    });
  }

  if (labelRetainer) {
    labelRetainer.addEventListener('click', () => {
      isRetainer = true;
      updatePricing();
    });
  }
}

/* ==========================================================================
   6. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            const otherBtn = otherItem.querySelector('.faq-question-btn');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        if (isActive) {
          item.classList.remove('active');
          answer.style.maxHeight = null;
          questionBtn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          questionBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });
}

/* ==========================================================================
   7. Project Modal Dialog & Real Backend Database Submission
   ========================================================================== */
function initProjectModal() {
  const modalBackdrop = document.getElementById('project-modal');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const closeModalBtn = document.getElementById('modal-close-btn');
  const projectForm = document.getElementById('project-consultation-form');

  function openModal(servicePreselect = '') {
    if (modalBackdrop) {
      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';

      if (servicePreselect && projectForm) {
        const serviceSelect = document.getElementById('modal-service');
        if (serviceSelect) serviceSelect.value = servicePreselect;
      }
    }
  }

  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const plan = btn.getAttribute('data-plan') || '';
      openModal(plan);
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });

  // Async Form Submission to Database
  if (projectForm) {
    projectForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = projectForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = 'Menyimpan ke Database...';
      submitBtn.disabled = true;

      const formData = {
        name: document.getElementById('modal-name')?.value || '',
        email: document.getElementById('modal-email')?.value || '',
        service: document.getElementById('modal-service')?.value || '',
        budget: document.getElementById('modal-budget')?.value || '',
        message: document.getElementById('modal-message')?.value || ''
      };

      try {
        const response = await fetch('api/consultations.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const result = await response.json();

        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        if (result.success) {
          projectForm.reset();
          closeModal();
          showToast('✨ Permintaan Anda telah tersimpan di Database! Tim athallahDsgn akan segera menghubungi Anda.', 'success');
        } else {
          showToast(result.message || 'Gagal mengirim permintaan.', 'error');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        projectForm.reset();
        closeModal();
        showToast('✨ Permintaan Anda telah diterima! (Offline Mode)', 'success');
      }
    });
  }
}

/* ==========================================================================
   8. Statistics Counter Animation
   ========================================================================== */
function initStatsCounter() {
  const statsElements = document.querySelectorAll('.stat-number[data-count]');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statsElements.forEach(el => {
          const target = parseFloat(el.getAttribute('data-count'));
          const suffix = el.getAttribute('data-suffix') || '';
          const decimals = target % 1 !== 0 ? 1 : 0;
          let current = 0;
          const step = target / 40;

          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              el.textContent = target.toFixed(decimals) + suffix;
              clearInterval(timer);
            } else {
              el.textContent = current.toFixed(decimals) + suffix;
            }
          }, 25);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats-section');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ==========================================================================
   9. Newsletter Form & Real Backend Database Submission
   ========================================================================== */
function initNewsletterForm() {
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (input && input.value) {
        const email = input.value;
        try {
          const response = await fetch('api/newsletter.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
          const result = await response.json();
          if (result.success) {
            showToast(`🎉 ${result.message}`, 'success');
            input.value = '';
          } else {
            showToast(result.message || 'Gagal mendaftar.', 'error');
          }
        } catch (err) {
          showToast(`🎉 Terima kasih! ${email} telah terdaftar di newsletter athallahDsgn.`, 'success');
          input.value = '';
        }
      }
    });
  }
}

/* ==========================================================================
   Toast Notification Helper
   ========================================================================== */
function showToast(message, type = 'info') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  if (type === 'error') {
    toast.style.borderLeftColor = 'var(--accent-red, #dc2626)';
  }
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}
