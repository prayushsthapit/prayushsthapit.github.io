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

// Three.js: particle fields + textured Earth globe, spins PEI into view on hover
(function () {
  if (!window.WebGLRenderingContext) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var canvases = document.querySelectorAll('.fx-canvas');
  if (!canvases.length) return;
  var isMobile = window.innerWidth < 700;
  var peiExcite = 0, peiHover = false;
  var heroScene = null;

  function themeHex() {
    var c = getComputedStyle(document.body).getPropertyValue('--color-secondary').trim();
    return /^#[0-9a-f]{6}$/i.test(c) ? c : '#27ae60';
  }

  function flarePEI() {
    peiExcite = 1;
    if (heroScene && heroScene.shocks) {
      heroScene.shocks.forEach(function (sh, idx) { sh.life = -idx * 0.16; });
    }
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
          visible: false, mx: 0, my: 0, tx: 0, ty: 0,
          scrollY: 0, scrollT: 0, isHero: host.id === 'home',
          tintMats: [mat], shocks: null, peiLocal: null
        };

        // --- textured Earth globe with PEI marker (hero only) ---
        if (S.isHero) {
          var globeGroup = new THREE.Group();
          var gr = isMobile ? 2.2 : 3.2;
          var globeMat = new THREE.MeshBasicMaterial({ color: themeHex(), wireframe: true, transparent: true, opacity: 0.22 });
          var globeMesh = new THREE.Mesh(new THREE.SphereGeometry(gr, 48, 32), globeMat);
          globeGroup.add(globeMesh);
          // swap wireframe for the real Earth map once it loads
          new THREE.TextureLoader().load(
            'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/textures/planets/earth_atmos_2048.jpg',
            function (tex) {
              tex.colorSpace = THREE.SRGBColorSpace;
              tex.anisotropy = 4;
              globeMesh.material = new THREE.MeshBasicMaterial({ map: tex });
              var ti = S.tintMats.indexOf(globeMat);
              if (ti > -1) S.tintMats.splice(ti, 1);
            },
            undefined,
            function () { /* texture failed: keep wireframe fallback */ }
          );
          // PEI: 46.4N, 63.3W
          var phi = (90 - 46.4) * Math.PI / 180, theta = (-63.3 + 180) * Math.PI / 180;
          var mp = new THREE.Vector3(
            -gr * Math.sin(phi) * Math.cos(theta),
            gr * Math.cos(phi),
            gr * Math.sin(phi) * Math.sin(theta)
          );
          S.peiLocal = mp;
          var markerMat = new THREE.MeshBasicMaterial({ color: themeHex() });
          var marker = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 14), markerMat);
          marker.position.copy(mp);
          globeGroup.add(marker);
          var ringMat = new THREE.MeshBasicMaterial({ color: themeHex(), transparent: true, opacity: 0.6, side: THREE.DoubleSide });
          var ring = new THREE.Mesh(new THREE.RingGeometry(0.18, 0.23, 32), ringMat);
          ring.position.copy(mp);
          ring.lookAt(mp.clone().multiplyScalar(2));
          globeGroup.add(ring);
          var shocks = [];
          for (var sh_i = 0; sh_i < 3; sh_i++) {
            var shMat = new THREE.MeshBasicMaterial({ color: themeHex(), transparent: true, opacity: 0, side: THREE.DoubleSide });
            var shRing = new THREE.Mesh(new THREE.RingGeometry(0.18, 0.24, 32), shMat);
            shRing.position.copy(mp);
            shRing.lookAt(mp.clone().multiplyScalar(2));
            globeGroup.add(shRing);
            shocks.push({ mesh: shRing, mat: shMat, life: 2 });
            S.tintMats.push(shMat);
          }
          // floating "PEI" label, fades in while excited
          var labelCanvas = document.createElement('canvas');
          labelCanvas.width = 256; labelCanvas.height = 128;
          var lg = labelCanvas.getContext('2d');
          lg.textAlign = 'center'; lg.textBaseline = 'middle';
          lg.shadowColor = 'rgba(0,0,0,0.9)'; lg.shadowBlur = 10;
          lg.fillStyle = '#ffffff';
          lg.font = 'bold 52px Arial, sans-serif';
          lg.fillText('PEI', 128, 44);
          lg.font = '28px Arial, sans-serif';
          lg.fillStyle = themeHex();
          lg.fillText('CANADA', 128, 92);
          var labelTex = new THREE.CanvasTexture(labelCanvas);
          labelTex.colorSpace = THREE.SRGBColorSpace;
          var labelMat = new THREE.SpriteMaterial({ map: labelTex, transparent: true, opacity: 0, depthTest: false });
          var label = new THREE.Sprite(labelMat);
          label.scale.set(1.7, 0.85, 1);
          label.position.copy(mp).multiplyScalar(1.45);
          globeGroup.add(label);
          globeGroup.position.set(0, 0.4, -2.5);
          scene.add(globeGroup);
          S.globe = globeGroup; S.marker = marker; S.ring = ring;
          S.ringMat = ringMat; S.shocks = shocks;
          S.labelMat = labelMat;
          S.tintMats.push(markerMat, ringMat);
          heroScene = S;
        }

        host.addEventListener('mousemove', function (e) {
          var r = canvas.getBoundingClientRect();
          S.tx = (e.clientX - r.left) / r.width - 0.5;
          S.ty = (e.clientY - r.top) / r.height - 0.5;
        });
        host.addEventListener('mouseleave', function () { S.tx = 0; S.ty = 0; });

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

      // PEI text: hover spins the globe to PEI + flares the marker; click jumps to hero
      document.querySelectorAll('.pei-trigger').forEach(function (el) {
        el.addEventListener('pointerenter', function () { peiHover = true; flarePEI(); });
        el.addEventListener('pointerleave', function () { peiHover = false; });
        el.addEventListener('click', function () {
          var homeSection = document.getElementById('home');
          var homeBtn = document.querySelector('.control[data-id="home"]');
          if (homeSection && !homeSection.classList.contains('active') && homeBtn) {
            homeBtn.click();
            setTimeout(flarePEI, 650);
            setTimeout(flarePEI, 1400);
          } else {
            flarePEI();
          }
        });
      });

      var themeBtn = document.querySelector('.theme-btn');
      if (themeBtn) themeBtn.addEventListener('click', function () {
        setTimeout(function () {
          var c = themeHex();
          scenes.forEach(function (S) {
            S.tintMats.forEach(function (m) { m.color.set(c); });
          });
        }, 60);
      });

      function onScroll() {
        var vh = window.innerHeight;
        scenes.forEach(function (S) {
          var r = S.host.getBoundingClientRect();
          var prog = (r.top + r.height / 2 - vh / 2) / vh;
          S.scrollT = Math.max(-1, Math.min(1, prog));
        });
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      var rt;
      window.addEventListener('resize', function () {
        clearTimeout(rt);
        rt = setTimeout(function () { scenes.forEach(function (S) { S.resize(); }); }, 200);
      });

      var last = performance.now();
      (function loop(now) {
        requestAnimationFrame(loop);
        var dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        peiExcite = Math.max(0, peiExcite - dt * 0.45);
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
          if (S.globe) {
            // spin PEI into view while hovered/excited, else slow auto-rotate
            if ((peiHover || peiExcite > 0.35) && S.peiLocal) {
              var want = Math.atan2(-S.peiLocal.x, S.peiLocal.z);
              var cur = S.globe.rotation.y;
              var delta = ((want - cur + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
              S.globe.rotation.y = cur + delta * Math.min(1, dt * 2.5);
            } else {
              S.globe.rotation.y += dt * 0.06;
            }
            var pt = now * 0.003;
            var spd = 1.6 + peiExcite * 3.2;
            var amp = 1 + peiExcite * 0.9;
            var puls = Math.abs(Math.sin(pt * spd));
            var rs = (1 + 0.45 * puls) * amp;
            S.ring.scale.set(rs, rs, 1);
            S.ringMat.opacity = Math.max(0.12, 0.6 * puls);
            var ms = 1 + peiExcite * 0.9;
            S.marker.scale.set(ms, ms, ms);
            var labelTarget = peiExcite > 0.25 ? 0.95 : 0;
            S.labelMat.opacity += (labelTarget - S.labelMat.opacity) * Math.min(1, dt * 6);
            S.shocks.forEach(function (sh) {
              if (sh.life < 0) { sh.life += dt; return; }
              if (sh.life >= 1) { sh.mat.opacity = 0; return; }
              sh.life += dt * 0.85;
              var sc = 1 + sh.life * 7;
              sh.mesh.scale.set(sc, sc, 1);
              sh.mat.opacity = 0.8 * Math.max(0, 1 - sh.life);
            });
          }
          S.mx += (S.tx - S.mx) * 0.05;
          S.my += (S.ty - S.my) * 0.05;
          S.scrollY += (S.scrollT - S.scrollY) * 0.06;
          S.camera.position.x = S.mx * 2;
          S.camera.position.y = -S.my * 1.4 + S.scrollY * 2.1;
          S.camera.lookAt(S.scene.position);
          S.renderer.render(S.scene, S.camera);
        }
      })(last);
    })
    .catch(function () { /* CDN unreachable: site simply stays static */ });
})();
