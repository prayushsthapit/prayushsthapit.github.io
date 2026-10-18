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

// Three.js 3D particle fields on every section + click bursts
(function () {
  if (!window.WebGLRenderingContext) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var canvases = document.querySelectorAll('.fx-canvas');
  if (!canvases.length) return;
  var isMobile = window.innerWidth < 700;

  function themeHex() {
    var c = getComputedStyle(document.body).getPropertyValue('--color-secondary').trim();
    return /^#[0-9a-f]{6}$/i.test(c) ? c : '#27ae60';
  }

  import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js')
    .then(function (THREE) {
      var scenes = [];

      canvases.forEach(function (canvas) {
        var host = canvas.parentElement;
        var renderer;
        try {
          renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: !isMobile });
        } catch (e) { return; }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
        camera.position.z = 9;

        var COUNT = isMobile ? 110 : 260;
        var positions = new Float32Array(COUNT * 3);
        var vels = new Float32Array(COUNT * 3);
        for (var i = 0; i < COUNT; i++) {
          positions[i * 3] = (Math.random() - 0.5) * 24;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        var geo = new THREE.BufferGeometry();
        var posAttr = new THREE.BufferAttribute(positions, 3);
        geo.setAttribute('position', posAttr);
        var mat = new THREE.PointsMaterial({ color: themeHex(), size: 0.07, transparent: true, opacity: 0.7 });
        var points = new THREE.Points(geo, mat);
        scene.add(points);

        var S = {
          host: host, renderer: renderer, scene: scene, camera: camera,
          points: points, mat: mat, posAttr: posAttr,
          positions: positions, vels: vels, COUNT: COUNT,
          visible: false, mx: 0, my: 0, tx: 0, ty: 0
        };

        host.addEventListener('mousemove', function (e) {
          var r = canvas.getBoundingClientRect();
          S.tx = (e.clientX - r.left) / r.width - 0.5;
          S.ty = (e.clientY - r.top) / r.height - 0.5;
        });
        host.addEventListener('mouseleave', function () { S.tx = 0; S.ty = 0; });

        // click/tap burst: fling nearby particles outward
        host.addEventListener('pointerdown', function (e) {
          var r = canvas.getBoundingClientRect();
          var wx = ((e.clientX - r.left) / r.width - 0.5) * 24;
          var wy = -((e.clientY - r.top) / r.height - 0.5) * 15;
          for (var k = 0; k < COUNT; k++) {
            var dx = positions[k * 3] - wx, dy = positions[k * 3 + 1] - wy;
            var d = Math.sqrt(dx * dx + dy * dy);
            if (d < 4 && d > 0.01) {
              var f = (1 - d / 4) * 0.4;
              vels[k * 3] += dx / d * f;
              vels[k * 3 + 1] += dy / d * f;
            }
          }
        });

        S.resize = function () {
          var w = host.clientWidth, h = host.clientHeight;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };

        if ('IntersectionObserver' in window) {
          new IntersectionObserver(function (entries) {
            S.visible = entries[0].isIntersecting;
          }, { threshold: 0.05 }).observe(host);
        } else {
          S.visible = true;
        }

        scenes.push(S);
        S.resize();
      });

      var themeBtn = document.querySelector('.theme-btn');
      if (themeBtn) themeBtn.addEventListener('click', function () {
        setTimeout(function () {
          var c = themeHex();
          scenes.forEach(function (S) { S.mat.color.set(c); });
        }, 60);
      });

      var rt;
      window.addEventListener('resize', function () {
        clearTimeout(rt);
        rt = setTimeout(function () {
          scenes.forEach(function (S) { S.resize(); });
        }, 200);
      });

      var last = performance.now();
      (function loop(now) {
        requestAnimationFrame(loop);
        var dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        for (var s = 0; s < scenes.length; s++) {
          var S = scenes[s];
          if (!S.visible) continue;
          S.points.rotation.y += dt * 0.07;
          S.points.rotation.x += dt * 0.025;
          for (var k = 0; k < S.COUNT; k++) {
            S.vels[k * 3] *= 0.96; S.vels[k * 3 + 1] *= 0.96; S.vels[k * 3 + 2] *= 0.96;
            S.positions[k * 3] += S.vels[k * 3] * dt * 8;
            S.positions[k * 3 + 1] += S.vels[k * 3 + 1] * dt * 8;
            S.positions[k * 3 + 2] += S.vels[k * 3 + 2] * dt * 8;
          }
          S.posAttr.needsUpdate = true;
          S.mx += (S.tx - S.mx) * 0.05;
          S.my += (S.ty - S.my) * 0.05;
          S.camera.position.x = S.mx * 2;
          S.camera.position.y = -S.my * 1.4;
          S.camera.lookAt(S.scene.position);
          S.renderer.render(S.scene, S.camera);
        }
      })(last);
    })
    .catch(function () { /* CDN unreachable: site simply stays static */ });
})();
