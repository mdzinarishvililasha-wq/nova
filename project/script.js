/**
 * LUMINA MODERN LANDING PAGE
 * Core Interaction & Animation Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. THEME TOGGLE (DARK / LIGHT MODE)
  initThemeToggle();

  // 2. STICKY HEADER & ACTIVE SCROLLSPY
  initHeaderScroll();

  // 3. MOBILE MENU DRAWER
  initMobileMenu();

  // 4. HERO ANIMATED ROTATING / TYPEWRITER TEXT
  initHeroTypewriter();

  // 5. 3D TILT EFFECT ON HERO MOCKUP CARD
  init3DTiltMockup();

  // 6. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  initScrollReveal();

  // 7. ANIMATED NUMBER COUNTERS
  initNumberCounters();

  // 8. BENTO CARD MOUSE SPOTLIGHT EFFECT
  initSpotlightCards();

  // 9. INTERACTIVE PLATFORM TABS
  initPlatformTabs();

  // 10. INTERACTIVE LATENCY SLIDER SIMULATOR
  initLatencySimulator();

  // 11. PRICING BILLING SWITCH (MONTHLY / ANNUALLY)
  initPricingToggle();

  // 12. FAQ ACCORDION
  initFaqAccordion();

  // 13. INTERACTIVE HERO DEMO BUTTON & SIMULATION
  initHeroOptimizationSim();

  // 14. INTERACTIVE MODAL SANDBOX
  initDemoModal();

  // 15. BUTTON CLICK RIPPLE EFFECT
  initRippleEffect();

  // 16. NEWSLETTER & CTAs TOAST FEEDBACK
  initFormInteractions();

  // 17. BACK TO TOP BUTTON
  initBackToTop();

  // 18. COPY CODE SNIPPET BADGE
  initCopyCodeSnippet();
});

/* ==========================================================================
   1. THEME TOGGLE
   ========================================================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  const html = document.documentElement;
  const savedTheme = localStorage.getItem('lumina-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('lumina-theme', newTheme);
    
    showToast(`Switched to ${newTheme} mode`, '🌓');
  });
}

/* ==========================================================================
   2. STICKY HEADER & SCROLLSPY
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Header blur shadow change
    if (scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scrollspy: update active nav link
    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  }, { passive: true });

  // Smooth scroll click handler for desktop and mobile links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Close mobile drawer if open
        closeMobileDrawer();
      }
    });
  });
}

/* ==========================================================================
   3. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');

  if (!mobileToggle || !mobileDrawer) return;

  function toggleDrawer() {
    const isOpen = mobileDrawer.classList.toggle('open');
    drawerOverlay.classList.toggle('active', isOpen);
    mobileToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  mobileToggle.addEventListener('click', toggleDrawer);
  drawerOverlay.addEventListener('click', closeMobileDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
      closeMobileDrawer();
    }
  });
}

function closeMobileDrawer() {
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const mobileToggle = document.getElementById('mobileToggle');

  if (mobileDrawer && mobileDrawer.classList.contains('open')) {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   4. HERO TYPEWRITER / ROTATING TEXT
   ========================================================================== */
function initHeroTypewriter() {
  const typewriterEl = document.getElementById('typewriterText');
  if (!typewriterEl) return;

  const phrases = [
    'Infinite Speed',
    'Effortless Precision',
    'Limitless Vision',
    'Intelligent Magic'
  ];

  let phraseIndex = 0;
  let charIndex = phrases[0].length;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      typewriterEl.textContent = currentPhrase.substring(0, charIndex);
      typingSpeed = 50;
    } else {
      charIndex++;
      typewriterEl.textContent = currentPhrase.substring(0, charIndex);
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2200; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pause before typing next word
    }

    setTimeout(type, typingSpeed);
  }

  // Start rotation after initial display pause
  setTimeout(type, 2000);
}

/* ==========================================================================
   5. 3D TILT EFFECT ON HERO MOCKUP CARD
   ========================================================================== */
function init3DTiltMockup() {
  const card = document.getElementById('mockupCard');
  if (!card) return;

  // Only apply tilt on pointer devices with hover capability
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const container = card.parentElement;

    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Rotation range: -6deg to +6deg
      const rotateX = ((centerY - y) / centerY) * 7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(10px)`;
    });

    container.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  }
}

/* ==========================================================================
   6. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-fade, .reveal-up, .reveal-scale');

  if (!('IntersectionObserver' in window)) {
    // Fallback for browsers without observer
    revealElements.forEach(el => el.classList.add('reveal-active'));
    return;
  }

  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   7. ANIMATED NUMBER COUNTERS
   ========================================================================== */
function initNumberCounters() {
  const counters = document.querySelectorAll('.counter-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target'));
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        const suffix = el.getAttribute('data-suffix') || '';
        
        animateCounter(el, target, decimals, suffix, 1800);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target, decimals, suffix, duration) {
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    
    // Smooth easeOutQuart curve
    const easeProgress = 1 - Math.pow(1 - progress, 4);
    const currentVal = easeProgress * target;

    element.textContent = currentVal.toFixed(decimals) + suffix;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = target.toFixed(decimals) + suffix;
    }
  }

  window.requestAnimationFrame(step);
}

/* ==========================================================================
   8. SPOTLIGHT CARDS MOUSE TRACKER
   ========================================================================== */
function initSpotlightCards() {
  const cards = document.querySelectorAll('.spotlight-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   9. INTERACTIVE PLATFORM TABS
   ========================================================================== */
function initPlatformTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');

      // Update button active state
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Update panel visibility
      tabPanels.forEach(panel => {
        if (panel.id === targetTabId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  // Sandbox trigger buttons inside tabs
  document.querySelectorAll('.interactive-demo-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const feature = btn.getAttribute('data-feature');
      showToast(`Initiating interactive sandbox for [${feature}]...`, '🚀');
      openModal();
    });
  });
}

/* ==========================================================================
   10. LATENCY SLIDER PLAYGROUND
   ========================================================================== */
function initLatencySimulator() {
  const slider = document.getElementById('latencyRange');
  const badge = document.getElementById('sliderValueText');
  const nodes = document.querySelectorAll('.cluster-node');

  if (!slider || !badge) return;

  slider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    const calculatedLatency = Math.round(7 + (val * 0.12));
    badge.textContent = `${val}% Load (${calculatedLatency}ms)`;

    // Update node states dynamically based on load
    nodes.forEach((node, i) => {
      const jitter = Math.round(calculatedLatency + (i * 2) - 3);
      const city = node.textContent.split(':')[0];
      node.textContent = `${city}: ${jitter}ms`;

      if (val > 85) {
        node.style.color = 'var(--accent-amber)';
      } else {
        node.style.color = 'var(--accent-emerald)';
      }
    });
  });
}

/* ==========================================================================
   11. PRICING BILLING SWITCH
   ========================================================================== */
function initPricingToggle() {
  const billingSwitch = document.getElementById('billingSwitch');
  const priceElements = document.querySelectorAll('.price-val');

  if (!billingSwitch || !priceElements.length) return;

  billingSwitch.addEventListener('change', () => {
    const isAnnual = billingSwitch.checked;

    priceElements.forEach(priceEl => {
      const targetVal = isAnnual 
        ? priceEl.getAttribute('data-annual')
        : priceEl.getAttribute('data-monthly');

      // Subtle scale-fade transition
      priceEl.style.transform = 'translateY(-6px)';
      priceEl.style.opacity = '0.3';

      setTimeout(() => {
        priceEl.textContent = targetVal;
        priceEl.style.transform = 'translateY(0)';
        priceEl.style.opacity = '1';
      }, 150);
    });

    showToast(isAnnual ? '20% Annual discount activated!' : 'Switched to monthly billing', '🏷️');
  });

  // Select Plan button handlers
  document.querySelectorAll('.select-plan-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const planName = btn.getAttribute('data-plan');
      showToast(`Selected ${planName} plan! Redirecting to checkout...`, '✨');
    });
  });
}

/* ==========================================================================
   12. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items for clean single-expanded view
      accordionItems.forEach(other => {
        other.classList.remove('active');
        other.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   13. HERO MOCKUP OPTIMIZATION SIMULATION
   ========================================================================== */
function initHeroOptimizationSim() {
  const optimizeBtn = document.getElementById('triggerOptimizeBtn');
  const latencyVal = document.getElementById('demoLatency');
  const concurrencyVal = document.getElementById('demoConcurrency');
  const throughputVal = document.getElementById('demoThroughput');
  const pills = document.querySelectorAll('.pill-btn');

  // Interactive pill filter switches
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const range = pill.getAttribute('data-range');

      if (range === 'live') {
        if (latencyVal) latencyVal.textContent = '14.2 ms';
        if (concurrencyVal) concurrencyVal.textContent = '99.98%';
        if (throughputVal) throughputVal.textContent = '2.4M req/s';
      } else if (range === '24h') {
        if (latencyVal) latencyVal.textContent = '11.8 ms';
        if (concurrencyVal) concurrencyVal.textContent = '99.99%';
        if (throughputVal) throughputVal.textContent = '18.6M req/s';
      } else {
        if (latencyVal) latencyVal.textContent = '12.4 ms';
        if (concurrencyVal) concurrencyVal.textContent = '99.95%';
        if (throughputVal) throughputVal.textContent = '142M req/s';
      }

      showToast(`Showing telemetry for: ${range.toUpperCase()}`, '📈');
    });
  });

  if (!optimizeBtn) return;

  optimizeBtn.addEventListener('click', () => {
    optimizeBtn.disabled = true;
    const originalText = optimizeBtn.querySelector('span').textContent;
    optimizeBtn.querySelector('span').textContent = 'Optimizing...';

    // Simulate pulse on chart line
    const chartLine = document.querySelector('.chart-line');
    if (chartLine) {
      chartLine.style.animation = 'none';
      setTimeout(() => {
        chartLine.style.animation = 'drawChartLine 1.5s ease-out forwards';
      }, 10);
    }

    setTimeout(() => {
      if (latencyVal) latencyVal.textContent = '8.4 ms';
      if (throughputVal) throughputVal.textContent = '3.8M req/s';
      optimizeBtn.disabled = false;
      optimizeBtn.querySelector('span').textContent = originalText;
      showToast('Optimization complete: Latency lowered to 8.4ms!', '⚡');
    }, 900);
  });
}

/* ==========================================================================
   14. INTERACTIVE DEMO MODAL
   ========================================================================== */
function initDemoModal() {
  const modal = document.getElementById('demoModal');
  const openBtn = document.getElementById('openDemoBtn');
  const closeBtn = document.getElementById('closeModalBtn');
  const secCloseBtn = document.getElementById('modalSecondaryClose');
  const simulateBtn = document.getElementById('modalSimulateBtn');
  const statusText = document.getElementById('modalStatusText');

  if (!modal) return;

  window.openModal = function() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (secCloseBtn) secCloseBtn.addEventListener('click', closeModal);

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Escape key handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Modal interactive canvas nodes
  const nodes = document.querySelectorAll('.canvas-node');
  nodes.forEach(node => {
    node.addEventListener('click', () => {
      node.classList.add('pulsing');
      if (statusText) {
        statusText.textContent = `Pinging ${node.textContent.trim()}... Latency: 4ms. Response verified.`;
      }
      setTimeout(() => node.classList.remove('pulsing'), 800);
    });
  });

  if (simulateBtn) {
    simulateBtn.addEventListener('click', () => {
      nodes.forEach((n, idx) => {
        setTimeout(() => n.classList.add('pulsing'), idx * 200);
        setTimeout(() => n.classList.remove('pulsing'), (idx * 200) + 700);
      });
      if (statusText) {
        statusText.textContent = 'Spike of 500,000 req/s simulated. Edge nodes auto-scaled successfully!';
      }
      showToast('Simulation complete: 0 dropped packets', '🛡️');
    });
  }
}

/* ==========================================================================
   15. BUTTON RIPPLE EFFECT
   ========================================================================== */
function initRippleEffect() {
  const rippleBtns = document.querySelectorAll('.ripple-btn');

  rippleBtns.forEach(button => {
    button.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple-circle');

      const existingRipple = this.querySelector('.ripple-circle');
      if (existingRipple) existingRipple.remove();

      this.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  });
}

/* ==========================================================================
   16. NEWSLETTER & CTAs FORM INTERACTIONS
   ========================================================================== */
function initFormInteractions() {
  const form = document.getElementById('newsletterForm');
  const emailInput = document.getElementById('emailInput');

  if (form && emailInput) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();

      if (email && email.includes('@')) {
        showToast(`Welcome aboard! Confirmation sent to ${email}`, '🎉');
        emailInput.value = '';
      } else {
        showToast('Please provide a valid work email address.', '⚠️');
      }
    });
  }
}

/* ==========================================================================
   17. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   18. COPY CODE SNIPPET BADGE
   ========================================================================== */
function initCopyCodeSnippet() {
  const badge = document.getElementById('copyCodeBadge');
  if (!badge) return;

  badge.addEventListener('click', () => {
    const textToCopy = '<Lumina.Component mode="adaptive" />';
    navigator.clipboard.writeText(textToCopy).then(() => {
      badge.textContent = 'Copied!';
      showToast('Component code copied to clipboard!', '📋');
      setTimeout(() => {
        badge.textContent = 'Copy Snippet';
      }, 2000);
    }).catch(() => {
      badge.textContent = 'Copied!';
      setTimeout(() => {
        badge.textContent = 'Copy Snippet';
      }, 2000);
    });
  });
}

/* ==========================================================================
   TOAST HELPER NOTIFICATION SYSTEM
   ========================================================================== */
function showToast(message, icon = '✨') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

  container.appendChild(toast);

  // Automatically remove toast element after animation completes
  setTimeout(() => {
    if (toast.parentElement) toast.remove();
  }, 3500);
}
