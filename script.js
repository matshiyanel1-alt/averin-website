(function () {
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');

  function onScroll() {
    nav.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  var form = document.getElementById('accessForm');
  var note = document.getElementById('formNote');
  var thanks = document.getElementById('formThanks');
  var button = form && form.querySelector('button[type=submit]');

  function setNote(text, state) {
    note.textContent = text;
    note.className = 'form-note' + (state ? ' is-' + state : '');
  }

  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = form.email.value.trim();
    var company = form.company.value.trim();
    if (!email || email.indexOf('@') < 1) {
      setNote('Please enter a work email address.', 'error');
      form.email.focus();
      return;
    }
    if (!company) {
      setNote('Please tell us the name of your firm or business.', 'error');
      form.company.focus();
      return;
    }
    if (form['bot-field'] && form['bot-field'].value) {
      return;
    }
    button.disabled = true;
    setNote('Sending…');
    var body = new URLSearchParams(new FormData(form)).toString();
    fetch(form.getAttribute('action') || '/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    }).then(function (res) {
      if (!res.ok) throw new Error('status ' + res.status);
      form.hidden = true;
      thanks.hidden = false;
      thanks.querySelector('[data-company]').textContent = company;
      thanks.focus();
    }).catch(function () {
      button.disabled = false;
      setNote('That did not go through. Email lu@averin.co.za and we will set up the call by hand.', 'error');
    });
  });

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
