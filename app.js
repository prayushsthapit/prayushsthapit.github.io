(function () {
    [...document.querySelectorAll(".control")].forEach(button => {
        button.addEventListener("click", function() {
            document.querySelector(".active-btn").classList.remove("active-btn");
            this.classList.add("active-btn");
            document.querySelector(".active").classList.remove("active");
            document.getElementById(button.dataset.id).classList.add("active");
        })
    });
    document.querySelector(".theme-btn").addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
    })
})();

// Custom validation message for the contact form email field
(function () {
    var email = document.querySelector('.contact-form input[name="email"]');
    if (!email) return;
    email.addEventListener("invalid", function () {
        email.setCustomValidity("Enter a valid email address");
    });
    email.addEventListener("input", function () {
        email.setCustomValidity("");
    });
})();

// Submit the contact form in the background so visitors stay on the page
(function () {
    var form = document.querySelector('.contact-form');
    if (!form) return;
    var successBox = document.querySelector('.form-success');
    var sendAnother = document.querySelector('.form-success .send-another');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        var data = {
            name: form.querySelector('[name="name"]').value,
            email: form.querySelector('[name="email"]').value,
            subject: form.querySelector('[name="subject"]').value,
            message: form.querySelector('[name="message"]').value,
            _subject: 'New message from your portfolio',
            _captcha: 'false',
            _honey: ''
        };
        fetch('https://formsubmit.co/ajax/prayushsthapit2@gmail.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(function (response) {
            if (!response.ok) throw new Error('send failed');
            return response.json();
        })
        .then(function () {
            form.hidden = true;
            if (successBox) {
                successBox.hidden = false;
                successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            form.reset();
        })
        .catch(function () {
            alert('Something went wrong sending your message. Please try again.');
        });
    });

    if (sendAnother) {
        sendAnother.addEventListener('click', function () {
            if (successBox) successBox.hidden = true;
            form.hidden = false;
        });
    }
})();

// Make entire portfolio cards clickable (not just the small GitHub icon)
document.querySelectorAll('.portfolio-item').forEach(function (card) {
    var link = card.querySelector('.portfolio-info .icons a');
    if (!link) return;
    card.style.cursor = 'pointer';
    card.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        window.open(link.href, '_blank');
    });
});

// Particle network hero background (lightweight canvas, no dependencies)
(function () {
  var canvas = document.getElementById('net-bg');
  if (!canvas) return;
  var header = document.getElementById('home');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 700) return;

  var ctx = canvas.getContext('2d');
  var W, H, parts = [], raf = null, running = false;
  var mouse = { x: -9999, y: -9999 };
  var rgb = [39, 174, 96];
  var DPR = Math.min(window.devicePixelRatio || 1, 2);

  function readThemeColor() {
    var c = getComputedStyle(document.body).getPropertyValue('--color-secondary').trim();
    var m = /^#([0-9a-f]{6})$/i.exec(c);
    if (m) {
      var n = parseInt(m[1], 16);
      rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
  }

  function resize() {
    W = header.clientWidth; H = header.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    var count = Math.min(85, Math.floor(W * H / 17000));
    parts = [];
    for (var i = 0; i < count; i++) {
      parts.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 1
      });
    }
  }

  function link(x1, y1, x2, y2, max, alpha) {
    var dx = x1 - x2, dy = y1 - y2, d = Math.sqrt(dx * dx + dy * dy);
    if (d < max && d > 0.01) {
      var a = (1 - d / max) * alpha;
      ctx.strokeStyle = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + a.toFixed(3) + ')';
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    }
  }

  function step() {
    ctx.clearRect(0, 0, W, H);
    var i, j, p;
    for (i = 0; i < parts.length; i++) {
      p = parts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    }
    ctx.lineWidth = 1;
    for (i = 0; i < parts.length; i++) {
      p = parts[i];
      for (j = i + 1; j < parts.length; j++) link(p.x, p.y, parts[j].x, parts[j].y, 130, 0.32);
      link(p.x, p.y, mouse.x, mouse.y, 160, 0.45);
      ctx.fillStyle = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',0.75)';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
    }
    raf = requestAnimationFrame(step);
  }

  function start() { if (!running) { running = true; raf = requestAnimationFrame(step); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  header.addEventListener('mousemove', function (e) {
    var r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  header.addEventListener('mouseleave', function () { mouse.x = -9999; mouse.y = -9999; });

  var themeBtn = document.querySelector('.theme-btn');
  if (themeBtn) themeBtn.addEventListener('click', function () { setTimeout(readThemeColor, 50); });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries[0].isIntersecting ? start() : stop();
    }).observe(header);
  }

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      if (window.innerWidth < 700) { stop(); ctx.clearRect(0, 0, W || 0, H || 0); }
      else { resize(); start(); }
    }, 200);
  });

  readThemeColor();
  resize();
  start();
})();
