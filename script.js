/**
 * A&A Wood Floors - Main Script
 * Features:
 * - Real-time Estimator Calculator & Form Synch
 * - Project Filter by Category
 * - Mobile Drawer Navigation
 * - Bilingual Support (English / Spanish)
 * - Lead Capture (Email & Direct WhatsApp)
 */

document.addEventListener('DOMContentLoaded', function () {
  // ========================================================================
  // 1. Cost Estimator Calculator
  // ========================================================================
  const rng = document.getElementById('rng');
  const sfNum = document.getElementById('sf-num');
  const svc = document.getElementById('svc');
  const sfDisplay = document.getElementById('sf');
  const outDisplay = document.getElementById('out');
  const lockBtn = document.getElementById('btn-lock-est');

  function formatMoney(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function getSelectedServiceName() {
    if (!svc || svc.selectedIndex < 0) return 'Flooring Service';
    return svc.options[svc.selectedIndex].text;
  }

  function calculateEstimate() {
    if (!svc || !rng) return;
    const priceRates = svc.value.split(',').map(Number);
    const sqft = Number(rng.value) || 0;

    if (sfDisplay) sfDisplay.textContent = sqft.toLocaleString('en-US');
    if (sfNum && sfNum.value != sqft) sfNum.value = sqft;

    const minTotal = priceRates[0] * sqft;
    const maxTotal = priceRates[1] * sqft;
    if (outDisplay) {
      outDisplay.textContent = `${formatMoney(minTotal)} – ${formatMoney(maxTotal)}`;
    }
  }

  if (rng && svc) {
    rng.addEventListener('input', calculateEstimate);
    svc.addEventListener('change', calculateEstimate);
  }

  if (sfNum) {
    sfNum.addEventListener('input', function () {
      let val = Number(sfNum.value);
      if (val < 0) val = 0;
      if (rng) rng.value = Math.min(val, 4000);
      calculateEstimate();
    });
  }

  // Quick Preset Chips (200, 1200, 3500)
  document.querySelectorAll('.est .chips button').forEach(function (button) {
    button.addEventListener('click', function () {
      const val = Number(button.dataset.v);
      if (rng) rng.value = val;
      if (sfNum) sfNum.value = val;
      calculateEstimate();
    });
  });

  // Lock In Estimate -> Pre-fill Contact Form
  if (lockBtn) {
    lockBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const sqft = rng ? rng.value : '850';
      const svcName = getSelectedServiceName();
      const priceText = outDisplay ? outDisplay.textContent : '';

      const areaInput = document.getElementById('ar');
      const notesTextarea = document.getElementById('nt');
      const formEl = document.getElementById('f');

      if (areaInput) areaInput.value = sqft;
      if (notesTextarea) {
        notesTextarea.value = `[Estimator Selection] Service: ${svcName} | Size: ${sqft} sq ft | Estimated range: ${priceText}\n` + notesTextarea.value;
      }

      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        formEl.classList.add('highlighted');
        setTimeout(() => formEl.classList.remove('highlighted'), 2400);
      }
    });
  }

  // Initial calculation
  calculateEstimate();

  // ========================================================================
  // 2. Project Portfolio Category Filters
  // ========================================================================
  const filterButtons = document.querySelectorAll('#flt button');
  const projectCards = document.querySelectorAll('#pj .card');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(b => b.classList.remove('on'));
      btn.classList.add('on');

      const filterCat = btn.dataset.f;

      projectCards.forEach(function (card) {
        const cardCat = card.dataset.c;
        if (!filterCat || cardCat === filterCat) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ========================================================================
  // 3. Mobile Navigation Drawer & Backdrop
  // ========================================================================
  const nav = document.querySelector('nav');
  const navToggle = document.getElementById('nav-toggle');
  const navBackdrop = document.getElementById('nav-backdrop');
  const navLinks = document.querySelectorAll('nav ul a');

  function toggleMobileNav() {
    if (!nav) return;
    const isOpen = nav.classList.toggle('open');
    if (navToggle) {
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    }
    if (navBackdrop) {
      navBackdrop.classList.toggle('active', isOpen);
    }
  }

  function closeMobileNav() {
    if (nav && nav.classList.contains('open')) {
      nav.classList.remove('open');
      if (navToggle) {
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
      if (navBackdrop) {
        navBackdrop.classList.remove('active');
      }
    }
  }

  if (navToggle) navToggle.addEventListener('click', toggleMobileNav);
  if (navBackdrop) navBackdrop.addEventListener('click', closeMobileNav);
  navLinks.forEach(link => link.addEventListener('click', closeMobileNav));

  // ========================================================================
  // 4. Contact Form Handling & Direct WhatsApp Integration
  // ========================================================================
  const contactForm = document.getElementById('f');
  const whatsappBtn = document.getElementById('btn-whatsapp');
  const formFeedback = document.getElementById('form-feedback');

  function getFormData() {
    const getVal = id => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };

    return {
      property: getVal('pt'),
      name: getVal('nm'),
      phone: getVal('ph'),
      email: getVal('em'),
      location: getVal('lc'),
      area: getVal('ar'),
      notes: getVal('nt')
    };
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const d = getFormData();

      if (!d.name || !d.phone || !d.location) {
        alert('Please fill out all required fields marked with * (Name, Phone, Location).');
        return;
      }

      // Display positive confirmation feedback banner
      if (formFeedback) {
        formFeedback.classList.add('show');
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Construct clean mailto URI
      const subject = `Free Estimate Request - ${d.name} (${d.location})`;
      const body =
        `A&A Wood Floors Estimate Request:\n\n` +
        `• Name: ${d.name}\n` +
        `• Phone: ${d.phone}\n` +
        `• Email: ${d.email || 'Not provided'}\n` +
        `• Property Type: ${d.property}\n` +
        `• Location: ${d.location}\n` +
        `• Approx Area: ${d.area ? d.area + ' sq ft' : 'Not specified'}\n\n` +
        `• Project Notes / Estimator Details:\n${d.notes || 'None'}\n`;

      const mailtoUrl = `mailto:aawoodflooring22@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 400);
    });
  }

  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function () {
      const d = getFormData();
      const text =
        `Hello A&A Wood Floors! I'd like to request a free estimate:\n\n` +
        `*Name:* ${d.name || '[My Name]'}\n` +
        `*Phone:* ${d.phone || '[My Phone]'}\n` +
        `*Location:* ${d.location || '[City / ZIP]'}\n` +
        `*Area:* ${d.area ? d.area + ' sq ft' : 'To be measured'}\n` +
        `*Property:* ${d.property || 'Residential'}\n` +
        (d.notes ? `*Notes:* ${d.notes}` : '');

      const waUrl = `https://wa.me/19179304105?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // ========================================================================
  // 5. Bilingual Support (English / Spanish)
  // ========================================================================
  const i18n = {
    en: {
      topBanner: '🚀 Now booking spring installs across NY • NJ • CT.',
      topQuoteLink: 'Get your free quote →',
      navHome: 'Home',
      navServices: 'Services',
      navHow: 'How It Works',
      navCredentials: 'Credentials',
      navEstimator: 'Estimator',
      navProjects: 'Projects',
      navTestimonials: 'Testimonials',
      navAbout: 'About',
      navContact: 'Contact',
      navQuoteBtn: 'Free Quote',
      heroTag: 'QUALITY • DESIGN • DURABILITY',
      heroTitle: 'HARDWOOD FLOORING, <span>HERRINGBONE</span> & DUSTLESS SANDING',
      heroDesc: 'We’re the most trusted flooring crew in the Tri-State area: licensed, insured, and 10+ years of craftsmanship.',
      heroCtaQuote: 'Get a Free Quote',
      heroCtaServices: 'Our Services',
      heroCtaCall: 'Call (917) 930-4105',
      estTitle: 'Estimate your investment in seconds',
      estDesc: 'Real-time projection based on current Tri-State materials and labor. Final quote confirmed on-site.',
      estLockBtn: 'Lock In This Free Estimate',
      projTitle: 'Our work. Your inspiration.',
      filterAll: 'All Projects',
      filterHerringbone: 'Herringbone',
      filterHardwood: 'Hardwood',
      filterSanding: 'Dustless Sanding',
      filterLvp: 'Vinyl Plank',
      filterRepairs: 'Repairs',
      formTitle: 'Request a free on-site estimate',
      formSubmitBtn: 'Request Free Estimate ✉️',
      formWhatsAppBtn: 'Send via WhatsApp 💬'
    },
    es: {
      topBanner: '🚀 Agendando instalaciones de primavera en NY • NJ • CT.',
      topQuoteLink: 'Cotiza gratis aquí →',
      navHome: 'Inicio',
      navServices: 'Servicios',
      navHow: 'Cómo Funciona',
      navCredentials: 'Credenciales',
      navEstimator: 'Calculadora',
      navProjects: 'Proyectos',
      navTestimonials: 'Testimonios',
      navAbout: 'Nosotros',
      navContact: 'Contacto',
      navQuoteBtn: 'Cotizar Gratis',
      heroTag: 'CALIDAD • DISEÑO • DURABILIDAD',
      heroTitle: 'PISOS DE MADERA, <span>HERRINGBONE</span> Y LIJADO SIN POLVO',
      heroDesc: 'El equipo de pisos más confiable en NY, NJ y CT: con licencia, asegurados y más de 10 años de experiencia artesanal.',
      heroCtaQuote: 'Cotización Gratis',
      heroCtaServices: 'Nuestros Servicios',
      heroCtaCall: 'Llamar (917) 930-4105',
      estTitle: 'Calcula tu inversión en segundos',
      estDesc: 'Estimación en tiempo real según costos de materiales y mano de obra. Cotización final confirmada en tu domicilio.',
      estLockBtn: 'Fijar Esta Cotización Gratuita',
      projTitle: 'Nuestros proyectos. Tu inspiración.',
      filterAll: 'Todos los Proyectos',
      filterHerringbone: 'Herringbone',
      filterHardwood: 'Madera Maciza',
      filterSanding: 'Lijado sin Polvo',
      filterLvp: 'Vinil Impermeable',
      filterRepairs: 'Reparaciones',
      formTitle: 'Solicita una visita técnica gratuita',
      formSubmitBtn: 'Solicitar Cotización ✉️',
      formWhatsAppBtn: 'Enviar por WhatsApp 💬'
    }
  };

  const btnEn = document.getElementById('btn-en');
  const btnEs = document.getElementById('btn-es');

  function setLanguage(lang) {
    if (!i18n[lang]) return;
    localStorage.setItem('aa_wood_lang', lang);

    if (btnEn) btnEn.classList.toggle('active', lang === 'en');
    if (btnEs) btnEs.classList.toggle('active', lang === 'es');

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (i18n[lang][key]) {
        el.innerHTML = i18n[lang][key];
      }
    });
  }

  if (btnEn) btnEn.addEventListener('click', () => setLanguage('en'));
  if (btnEs) btnEs.addEventListener('click', () => setLanguage('es'));

  // Restore saved language or default to en
  const savedLang = localStorage.getItem('aa_wood_lang') || 'en';
  if (savedLang === 'es') {
    setLanguage('es');
  }
});
