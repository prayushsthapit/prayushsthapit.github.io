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

// Three.js 3D particle field in the hero
(function () {
  var canvas = document.getElementById('net-bg');
  if (!canvas || !window.WebGLRenderingContext) return;
  var header = document.getElementById('home');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 700) return;

  function themeHex() {
    var c = getComputedStyle(document.body).getPropertyValue('--color-secondary').trim();
    return /^#[0-9a-f]{6}$/i.test(c) ? c : '#27ae60';
  }

  import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js')
    .then(function (THREE) {
      var renderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
      } catch (e) { return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
      camera.position.z = 9;

      var COUNT = 320;
      var positions = new Float32Array(COUNT * 3);
      for (var i = 0; i < COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 24;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      }
      var geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      var mat = new THREE.PointsMaterial({ color: themeHex(), size: 0.07, transparent: true, opacity: 0.75 });
      var points = new THREE.Points(geo, mat);
      scene.add(points);

      var tx = 0, ty = 0, mx = 0, my = 0;
      header.addEventListener('mousemove', function (e) {
        var r = canvas.getBoundingClientRect();
        tx = (e.clientX - r.left) / r.width - 0.5;
        ty = (e.clientY - r.top) / r.height - 0.5;
      });
      header.addEventListener('mouseleave', function () { tx = 0; ty = 0; });

      var themeBtn = document.querySelector('.theme-btn');
      if (themeBtn) themeBtn.addEventListener('click', function () {
        setTimeout(function () { mat.color.set(themeHex()); }, 60);
      });

      function resize() {
        var w = header.clientWidth, h = header.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }

      var running = false, raf = null;
      function tick() {
        if (!running) return;
        points.rotation.y += 0.0011;
        points.rotation.x += 0.0004;
        mx += (tx - mx) * 0.05;
        my += (ty - my) * 0.05;
        camera.position.x = mx * 2;
        camera.position.y = -my * 1.4;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      }
      function start() { if (!running) { running = true; tick(); } }
      function stop() { running = false; if (raf) cancelAnimationFrame(raf); }

      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          entries[0].isIntersecting ? start() : stop();
        }).observe(header);
      }

      var rt;
      window.addEventListener('resize', function () {
        clearTimeout(rt);
        rt = setTimeout(function () {
          if (window.innerWidth < 700) { stop(); }
          else { resize(); start(); }
        }, 200);
      });

      resize();
      start();
    })
    .catch(function () { /* CDN unreachable: hero simply stays static */ });
})();
