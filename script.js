/**
 * A&A Wood Flooring, Inc. | USA
 * Production-Ready JavaScript Engine
 * 
 * Features:
 * 1. Estimator Calculator with preliminary disclaimer & form synchronization
 * 2. Form submission via FormSubmit AJAX with validation, anti-spam, and graceful fallback
 * 3. Direct WhatsApp messaging with complete customer lead parameters
 * 4. FAQ Accordion with accessible ARIA state management
 * 5. Project Portfolio Filtering with smooth micro-transitions
 * 6. Mobile Drawer Navigation & Backdrop Control
 * 7. Google Analytics 4 (GA4) Event Dispatcher
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // ========================================================================
  // GA4 Event Tracking Helper (Safe execution without throwing errors)
  // ========================================================================
  function trackEvent(eventName, eventParams) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, eventParams || {});
    }
  }

  // Track phone clicks
  document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
    link.addEventListener('click', function () {
      trackEvent('click_phone', { phone_number: link.getAttribute('href') });
    });
  });

  // Track email clicks
  document.querySelectorAll('a[href^="mailto:"]').forEach(function (link) {
    link.addEventListener('click', function () {
      trackEvent('click_email', { email_address: link.getAttribute('href') });
    });
  });

  // ========================================================================
  // 1. Cost Estimator Calculator & Form Synchronization
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
    if (sfNum && Number(sfNum.value) !== sqft) sfNum.value = sqft;

    const minTotal = priceRates[0] * sqft;
    const maxTotal = priceRates[1] * sqft;
    if (outDisplay) {
      outDisplay.textContent = `${formatMoney(minTotal)} – ${formatMoney(maxTotal)}`;
    }
  }

  if (rng && svc) {
    rng.addEventListener('input', function () {
      calculateEstimate();
      trackEvent('use_estimator', { action: 'slider_change', sqft: rng.value });
    });
    svc.addEventListener('change', function () {
      calculateEstimate();
      trackEvent('use_estimator', { action: 'service_change', service: getSelectedServiceName() });
    });
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
      trackEvent('use_estimator', { action: 'preset_click', sqft: val });
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
        const estSummary = `[Preliminary Estimate] Selected Service: ${svcName} | Size: ${sqft} sq ft | Projected Investment: ${priceText}\n`;
        if (!notesTextarea.value.includes('[Preliminary Estimate]')) {
          notesTextarea.value = estSummary + notesTextarea.value;
        }
      }

      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        formEl.classList.add('highlighted');
        setTimeout(function () {
          formEl.classList.remove('highlighted');
        }, 2500);
      }

      trackEvent('use_estimator', { action: 'lock_estimate', sqft: sqft, service: svcName });
    });
  }

  // Run initial calculation
  calculateEstimate();

  // ========================================================================
  // 2. Project Portfolio Category Filters
  // ========================================================================
  const filterButtons = document.querySelectorAll('#flt button');
  const projectCards = document.querySelectorAll('#pj .card');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) { b.classList.remove('on'); });
      btn.classList.add('on');

      const filterCat = btn.dataset.f;

      projectCards.forEach(function (card) {
        const cardCat = card.dataset.c;
        if (!filterCat || cardCat === filterCat) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          setTimeout(function () {
            card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });

      trackEvent('filter_projects', { category: filterCat || 'all' });
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
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
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
  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileNav);
  });

  // ========================================================================
  // 4. FAQ Accordion Interaction
  // ========================================================================
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.closest('.faq-item');
      if (!item) return;

      const isOpen = item.classList.contains('open');

      // Optional: Collapse siblings for clean accordion
      document.querySelectorAll('.faq-item').forEach(function (otherItem) {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', (!isOpen).toString());

      if (!isOpen) {
        trackEvent('view_faq', { question: btn.textContent.trim() });
      }
    });
  });

  // ========================================================================
  // 5. Contact Form Handling (FormSubmit AJAX + Fallback)
  // ========================================================================
  const contactForm = document.getElementById('f');
  const whatsappBtn = document.getElementById('btn-whatsapp');
  const formFeedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('btn-submit');

  function getFormData() {
    const getVal = function (id) {
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
      notes: getVal('nt'),
      honey: getVal('hp_field') // Honeypot anti-spam
    };
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const d = getFormData();

      // Bot spam check
      if (d.honey && d.honey.length > 0) {
        console.warn('Spam detected via honeypot.');
        return;
      }

      // Basic client-side validation
      if (!d.name || !d.phone || !d.location) {
        alert('Please fill out all required fields: Name, Phone Number, and Project Location.');
        return;
      }

      // Enter loading state
      if (submitBtn) {
        submitBtn.classList.add('is-loading');
        submitBtn.disabled = true;
      }

      // Prepare payload for FormSubmit AJAX endpoint
      const payload = {
        name: d.name,
        phone: d.phone,
        email: d.email || 'Not provided',
        property_type: d.property,
        location: d.location,
        square_footage: d.area ? d.area + ' sq ft' : 'Not specified',
        notes: d.notes || 'None',
        _subject: `New Free Estimate Request - ${d.name} (${d.location})`,
        _template: 'table'
      };

      // Send to FormSubmit endpoint asynchronously
      fetch('https://formsubmit.co/ajax/aawoodflooring22@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (submitBtn) {
          submitBtn.classList.remove('is-loading');
          submitBtn.disabled = false;
        }

        if (formFeedback) {
          formFeedback.classList.remove('error');
          formFeedback.classList.add('show');
          formFeedback.innerHTML = `✅ <b>Thank you, ${d.name}!</b> Your estimate request has been received.<br>An estimator will review your details and call you at <b>${d.phone}</b> to schedule your complimentary visit.`;
          formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        trackEvent('generate_lead', {
          method: 'formsubmit_ajax',
          location: d.location,
          service: d.property
        });

        contactForm.reset();
        calculateEstimate();
      })
      .catch(function (error) {
        console.error('Form submission network error:', error);
        if (submitBtn) {
          submitBtn.classList.remove('is-loading');
          submitBtn.disabled = false;
        }

        // Graceful fallback to mailto
        if (formFeedback) {
          formFeedback.classList.add('show', 'error');
          formFeedback.innerHTML = `⚠️ <b>Note:</b> Submission could not reach server. Opening email draft as backup, or contact us directly at <a href="tel:+19179304105"><b>(917) 930-4105</b></a> or via WhatsApp.`;
        }

        const subject = `Free Estimate Request - ${d.name} (${d.location})`;
        const body =
          `A&A Wood Floors Estimate Request:\n\n` +
          `• Name: ${d.name}\n` +
          `• Phone: ${d.phone}\n` +
          `• Email: ${d.email}\n` +
          `• Location: ${d.location}\n` +
          `• Property Type: ${d.property}\n` +
          `• Approx Area: ${d.area} sq ft\n\n` +
          `• Project Details:\n${d.notes}\n`;

        window.location.href = `mailto:aawoodflooring22@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      });
    });
  }

  // ========================================================================
  // 6. Direct WhatsApp Lead Submission
  // ========================================================================
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function () {
      const d = getFormData();
      const text =
        `Hello A&A Wood Floors! I would like to request a free on-site estimate:\n\n` +
        `• Name: ${d.name || '[My Name]'}\n` +
        `• Phone: ${d.phone || '[My Phone]'}\n` +
        `• Location: ${d.location || '[City / ZIP]'}\n` +
        `• Property: ${d.property || 'Residential'}\n` +
        `• Approx Area: ${d.area ? d.area + ' sq ft' : 'To be measured'}\n` +
        (d.notes ? `• Details: ${d.notes}\n` : '');

      const waUrl = `https://wa.me/19179304105?text=${encodeURIComponent(text)}`;
      trackEvent('click_whatsapp', {
        action: 'send_quote_whatsapp',
        has_details: Boolean(d.name)
      });
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }
});
