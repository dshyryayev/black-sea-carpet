/* Black Sea Carpet Cleaning — site behaviour. No dependencies. */
(function () {
  'use strict';

  var PHONE = '236-982-2141';
  var EMAIL = 'blackseacarpetcleaning@gmail.com';

  /* ------------------------------------------------------- mobile nav ---- */

  var nav = document.getElementById('nav');
  var toggle = document.getElementById('nav-toggle');

  function setNav(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setNav(false);
        toggle.focus();
      }
    });

    // Reset state when resizing up into the desktop layout.
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024) setNav(false);
    });
  }

  /* --------------------------------------------- before & after filter --- */

  var filterBar = document.getElementById('filters');
  var gallery = document.getElementById('gallery');
  var galleryEmpty = document.getElementById('gallery-empty');

  if (filterBar && gallery) {
    var shots = Array.prototype.slice.call(gallery.querySelectorAll('.shot'));

    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter');
      if (!btn) return;

      var wanted = btn.dataset.filter;

      filterBar.querySelectorAll('.filter').forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });

      var shown = 0;
      shots.forEach(function (shot) {
        var match = wanted === 'all' || shot.dataset.category === wanted;
        shot.hidden = !match;
        if (match) shown++;
      });

      if (galleryEmpty) galleryEmpty.hidden = shown > 0;
    });
  }

  /* ------------------------------------------------------ faq accordion -- */
  /* Markup is <details>, so this works without JS; JS only enforces
     single-expand behaviour to match the original. */

  var faqList = document.getElementById('faq-list');
  if (faqList) {
    var items = Array.prototype.slice.call(faqList.querySelectorAll('.faq-item'));
    items.forEach(function (item) {
      item.addEventListener('toggle', function () {
        if (!item.open) return;
        items.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      });
    });
  }

  /* --------------------------------------------------------- quote form -- */

  var form = document.getElementById('quote-form');
  var status = document.getElementById('form-status');

  function showError(input, message) {
    var msg = form.querySelector('[data-error-for="' + input.id + '"]');
    if (msg) {
      msg.textContent = message;
      msg.hidden = !message;
    }
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }

  function validate() {
    var problems = [];

    var name = form.elements.name;
    showError(name, '');
    if (!name.value.trim()) {
      showError(name, 'Please enter your name.');
      problems.push(name);
    }

    var phone = form.elements.phone;
    showError(phone, '');
    var digits = phone.value.replace(/\D/g, '');
    if (!phone.value.trim()) {
      showError(phone, 'Please enter a phone number so we can reach you.');
      problems.push(phone);
    } else if (digits.length < 10) {
      showError(phone, 'That phone number looks too short.');
      problems.push(phone);
    }

    var email = form.elements.email;
    showError(email, '');
    if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      showError(email, 'Please check that email address.');
      problems.push(email);
    }

    return problems;
  }

  function buildBody() {
    var f = form.elements;
    var lines = [
      'Name: ' + f.name.value.trim(),
      'Phone: ' + f.phone.value.trim(),
      'Email: ' + (f.email.value.trim() || '—'),
      'City / Area: ' + (f.city.value.trim() || '—'),
      'Service Needed: ' + (f.service.value || '—'),
      'Rooms / Items: ' + (f.rooms.value.trim() || '—'),
      'Approx. Square Footage: ' + (f.sqft.value.trim() || '—'),
      'Preferred Date: ' + (f.date.value || '—'),
      '',
      'Message:',
      f.message.value.trim() || '—'
    ];

    var files = f.photos.files;
    if (files && files.length) {
      lines.push('', 'Photos selected (' + files.length + ') — please attach or text to ' + PHONE + ':');
      Array.prototype.forEach.call(files, function (file) {
        lines.push('  • ' + file.name);
      });
    }

    return lines.join('\n');
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form-status';

      var problems = validate();
      if (problems.length) {
        status.textContent = 'Please fix the highlighted fields.';
        status.classList.add('is-error');
        problems[0].focus();
        return;
      }

      var subject = 'Free quote request — ' + form.elements.name.value.trim();
      var href = 'mailto:' + EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(buildBody());

      window.location.href = href;

      status.textContent = 'Opening your email app — press send to deliver the request. ' +
        'If nothing opens, call or text ' + PHONE + '.';
      status.classList.add('is-ok');
    });

    // Clear an error as soon as the visitor starts fixing it.
    form.addEventListener('input', function (e) {
      if (e.target.getAttribute('aria-invalid') === 'true') showError(e.target, '');
    });
  }
})();
