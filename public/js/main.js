(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav-list');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
  }

  var year = document.querySelectorAll('[data-year]');
  for (var i = 0; i < year.length; i++) {
    year[i].textContent = new Date().getFullYear();
  }

  var helpBtn = document.getElementById('helpBtn');
  var helpModal = document.getElementById('helpModal');
  var helpClose = document.getElementById('helpModalClose');
  if (helpBtn && helpModal) {
    helpBtn.addEventListener('click', function (e) {
      e.preventDefault();
      helpModal.classList.add('open');
    });
    if (helpClose) {
      helpClose.addEventListener('click', function () {
        helpModal.classList.remove('open');
      });
    }
    helpModal.addEventListener('click', function (e) {
      if (e.target === helpModal) {
        helpModal.classList.remove('open');
      }
    });
  }

  var helpForm = document.getElementById('helpForm');
  if (helpForm) {
    helpForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('helpName').value.trim();
      var phone = document.getElementById('helpPhone').value.trim();
      var email = document.getElementById('helpEmail').value.trim();
      var message = document.getElementById('helpMessage').value.trim();
      var text = 'New Enquiry - How We May Help You\n\n' +
        'Name: ' + name + '\n' +
        'Contact No.: ' + phone + '\n' +
        'Email ID: ' + email + '\n' +
        'Description: ' + message;
      window.open('https://wa.me/918287372155?text=' + encodeURIComponent(text), '_blank');
      helpForm.reset();
      helpModal.classList.remove('open');
    });
  }

  var carousels = document.querySelectorAll('.carousel[data-carousel]');
  for (var c = 0; c < carousels.length; c++) {
    setupCarousel(carousels[c]);
  }

  function setupCarousel(carousel) {
    var track = carousel.querySelector('.carousel-track');
    var prev = carousel.querySelector('.carousel-prev');
    var next = carousel.querySelector('.carousel-next');
    if (!track) { return; }

    var card = track.firstElementChild;
    var timer = null;
    var intervalMs = 1000;

    function stepSize() {
      if (!card) { return 300; }
      var gap = parseFloat(getComputedStyle(track).gap || '0') || 0;
      return card.offsetWidth + gap;
    }

    function autoScroll() {
      var step = stepSize();
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - step * 0.5) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: step, behavior: 'smooth' });
      }
    }

    function start() {
      stop();
      timer = setInterval(autoScroll, intervalMs);
    }

    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        track.scrollBy({ left: -stepSize(), behavior: 'smooth' });
        start();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        track.scrollBy({ left: stepSize(), behavior: 'smooth' });
        start();
      });
    }

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('touchstart', stop, { passive: true });

    start();
  }
})();
