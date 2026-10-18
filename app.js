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
  var PEI_OUTLINE = [[-63.9892,46.3936],[-64.1350,46.4164],[-64.1058,46.4455],[-64.1133,46.5347],[-64.0580,46.5694],[-64.0714,46.6358],[-64.1333,46.5914],[-64.2236,46.6297],[-64.3875,46.6208],[-64.4167,46.6811],[-64.2269,46.9061],[-63.9989,47.0617],[-63.9675,46.8917],[-64.0917,46.7786],[-64.0675,46.7492],[-63.9747,46.7425],[-63.9808,46.7142],[-63.8822,46.6456],[-63.9042,46.6039],[-63.8325,46.6172],[-63.8333,46.5775],[-63.9375,46.4766],[-63.8317,46.5164],[-63.8117,46.4953],[-63.8408,46.4644],[-63.7094,46.4375],[-63.7003,46.4664],[-63.7400,46.4961],[-63.7005,46.5155],[-63.7233,46.5436],[-63.6472,46.5672],[-63.4908,46.5247],[-63.4969,46.4883],[-63.4547,46.4617],[-63.4225,46.4958],[-63.4575,46.5100],[-63.3203,46.4928],[-63.2389,46.3997],[-63.2108,46.4292],[-62.5875,46.4253],[-62.6925,46.4561],[-62.4772,46.4778],[-62.1664,46.4861],[-61.9706,46.4569],[-62.1733,46.3494],[-62.2858,46.3775],[-62.2722,46.3383],[-62.3578,46.3558],[-62.3347,46.3119],[-62.4006,46.3069],[-62.3597,46.2828],[-62.3739,46.2622],[-62.4950,46.2714],[-62.4372,46.2517],[-62.4247,46.2155],[-62.5853,46.2322],[-62.4981,46.1825],[-62.5894,46.2064],[-62.5683,46.1866],[-62.6039,46.1772],[-62.5342,46.1678],[-62.5422,46.1225],[-62.4783,46.1208],[-62.5139,46.1422],[-62.4730,46.1503],[-62.4469,46.0905],[-62.5739,46.0347],[-62.4592,46.0064],[-62.7467,45.9483],[-62.8828,45.9955],[-62.9350,46.0456],[-62.8961,46.0650],[-63.0308,46.0608],[-62.9225,46.0925],[-62.8681,46.1347],[-62.8853,46.1558],[-62.9592,46.1286],[-62.9442,46.1900],[-62.9850,46.1958],[-62.9839,46.1739],[-63.1222,46.2117],[-62.9628,46.3200],[-63.1228,46.2372],[-63.1950,46.2700],[-63.1725,46.2242],[-63.2731,46.1953],[-63.2192,46.1819],[-63.1731,46.2111],[-63.1406,46.1864],[-63.2617,46.1380],[-63.4814,46.2178],[-63.5919,46.2119],[-63.6986,46.2492],[-63.8128,46.3322],[-63.7856,46.3400],[-63.8008,46.3728],[-63.7147,46.3542],[-63.7656,46.3803],[-63.7450,46.3947],[-63.8900,46.3975],[-63.9297,46.4250],[-63.9892,46.3936]];

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

        // --- textured Earth globe with real PEI boundary (hero only) ---
        if (S.isHero) {
          var globeGroup = new THREE.Group();
          var globeMat = new THREE.MeshBasicMaterial({ color: themeHex(), wireframe: true, transparent: true, opacity: 0.25 });
          var globeMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), globeMat);
          globeGroup.add(globeMesh);
          // swap wireframe for the real Earth map once it loads
          new THREE.TextureLoader().load(
            'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/textures/planets/earth_atmos_2048.jpg',
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
          // PEI anchor: 46.4N, 63.3W (unit sphere)
          var phi = (90 - 46.4) * Math.PI / 180, theta = (-63.3 + 180) * Math.PI / 180;
          var mp = new THREE.Vector3(
            -Math.sin(phi) * Math.cos(theta),
            Math.cos(phi),
            Math.sin(phi) * Math.sin(theta)
          );
          S.peiLocal = mp;
          // real PEI boundary drawn on the globe surface
          var outlineMat = new THREE.LineBasicMaterial({ color: themeHex(), transparent: true, opacity: 0.55 });
          var outlinePts = PEI_OUTLINE.map(function (ll) {
            var ph = (90 - ll[1]) * Math.PI / 180, th = (ll[0] + 180) * Math.PI / 180;
            return new THREE.Vector3(
              -1.012 * Math.sin(ph) * Math.cos(th),
              1.012 * Math.cos(ph),
              1.012 * Math.sin(ph) * Math.sin(th)
            );
          });
          globeGroup.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(outlinePts), outlineMat));
          // steady location dot
          var markerMat = new THREE.MeshBasicMaterial({ color: themeHex() });
          var marker = new THREE.Mesh(new THREE.SphereGeometry(0.045, 14, 14), markerMat);
          marker.position.copy(mp).multiplyScalar(1.012);
          globeGroup.add(marker);
          // shockwave rings fired on flare
          var shocks = [];
          for (var sh_i = 0; sh_i < 3; sh_i++) {
            var shMat = new THREE.MeshBasicMaterial({ color: themeHex(), transparent: true, opacity: 0, side: THREE.DoubleSide });
            var shRing = new THREE.Mesh(new THREE.RingGeometry(0.05, 0.065, 32), shMat);
            shRing.position.copy(mp).multiplyScalar(1.02);
            shRing.lookAt(mp.clone().multiplyScalar(2));
            globeGroup.add(shRing);
            shocks.push({ mesh: shRing, mat: shMat, life: 2 });
            S.tintMats.push(shMat);
          }
          // floating "PRINCE EDWARD ISLAND" label, fades in while excited
          var labelCanvas = document.createElement('canvas');
          labelCanvas.width = 512; labelCanvas.height = 128;
          var lg = labelCanvas.getContext('2d');
          lg.textAlign = 'center'; lg.textBaseline = 'middle';
          lg.shadowColor = 'rgba(0,0,0,0.9)'; lg.shadowBlur = 12;
          lg.fillStyle = '#ffffff';
          lg.font = 'bold 36px Arial, sans-serif';
          lg.fillText('PRINCE EDWARD ISLAND', 256, 46);
          lg.font = '26px Arial, sans-serif';
          lg.fillStyle = themeHex();
          lg.fillText('CANADA', 256, 94);
          var labelTex = new THREE.CanvasTexture(labelCanvas);
          labelTex.colorSpace = THREE.SRGBColorSpace;
          var labelMat = new THREE.SpriteMaterial({ map: labelTex, transparent: true, opacity: 0, depthTest: false });
          var label = new THREE.Sprite(labelMat);
          label.scale.set(1.6, 0.4, 1);
          label.position.copy(mp).multiplyScalar(1.7);
          globeGroup.add(label);
          scene.add(globeGroup);
          S.globe = globeGroup; S.marker = marker;
          S.outlineMat = outlineMat; S.shocks = shocks;
          S.labelMat = labelMat;
          S.tintMats.push(globeMat, markerMat, outlineMat);
          // responsive corner placement: fully in frame, top-right
          S.placeGlobe = function () {
            var dist = 9 - (-2.5);
            var halfH = Math.tan(camera.fov * Math.PI / 360) * dist;
            var halfW = halfH * camera.aspect;
            var r = Math.min(isMobile ? 1.35 : 1.9, halfH * 0.30);
            globeGroup.scale.setScalar(r);
            globeGroup.position.set(halfW * 0.60, halfH * 0.52, -2.5);
          };
          S.placeGlobe();
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
          if (S.placeGlobe) S.placeGlobe();
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

      // PEI text triggers: globe (hero) spins to PEI, map (contact) opens Google Maps,
      // popup (about) is handled by the PEI info module below
      document.querySelectorAll('.pei-trigger').forEach(function (el) {
        var mode = el.getAttribute('data-pei') || 'globe';
        if (mode === 'map') {
          el.addEventListener('pointerenter', flarePEI);
          el.addEventListener('click', function () {
            window.open('https://www.google.com/maps/search/?api=1&query=Prince+Edward+Island,+Canada', '_blank', 'noopener');
          });
          return;
        }
        if (mode === 'popup') return;
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
            var outlineTarget = (peiHover || peiExcite > 0.3) ? 1 : 0.55;
            S.outlineMat.opacity += (outlineTarget - S.outlineMat.opacity) * Math.min(1, dt * 5);
            var labelTarget = peiExcite > 0.25 ? 0.95 : 0;
            S.labelMat.opacity += (labelTarget - S.labelMat.opacity) * Math.min(1, dt * 6);
            S.shocks.forEach(function (sh) {
              if (sh.life < 0) { sh.life += dt; return; }
              if (sh.life >= 1) { sh.mat.opacity = 0; return; }
              sh.life += dt * 0.85;
              var sc = 1 + sh.life * 9;
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

// PEI info popup (About section trigger)
(function () {
  var overlay = document.createElement('div');
  overlay.className = 'pei-modal-overlay';
  overlay.innerHTML =
    '<div class="pei-modal" role="dialog" aria-label="About Prince Edward Island">' +
      '<button class="pei-modal-close" aria-label="Close">&times;</button>' +
      '<h3><span class="pin">\uD83D\uDCCC</span> Prince Edward Island</h3>' +
      '<p class="pei-modal-sub">Canada\u2019s island province \u2014 home</p>' +
      '<div class="pei-gallery">' +
        '<img loading="lazy" alt="Confederation Bridge" src="https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a7/Confederation_Bridge%2C_Prince_Edward_Island%2C_Canada.jpg/960px-Confederation_Bridge%2C_Prince_Edward_Island%2C_Canada.jpg">' +
        '<img loading="lazy" alt="Red sand beach" src="https://thumb.wikimedia.org/wikipedia/commons/thumb/3/30/Red_sand_beach_in_Prince_Edward_Island_-_panoramio.jpg/960px-Red_sand_beach_in_Prince_Edward_Island_-_panoramio.jpg">' +
        '<img loading="lazy" alt="Charlottetown waterfront" src="https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Charlottetown_Waterfront%2C_Charlottetown_-_panoramio.jpg/960px-Charlottetown_Waterfront%2C_Charlottetown_-_panoramio.jpg">' +
      '</div>' +
      '<ul>' +
        '<li>Canada\u2019s smallest province \u2014 about 5,660 km\u00B2 with roughly 175,000 people.</li>' +
        '<li>Capital: Charlottetown. Linked to New Brunswick by the 12.9 km Confederation Bridge.</li>' +
        '<li>Famous for red-sand beaches, potatoes, and as the home of <em>Anne of Green Gables</em>.</li>' +
      '</ul>' +
      '<p class="pei-credit">Photos: Wikimedia Commons</p>' +
    '</div>';
  document.body.appendChild(overlay);

  function open() { overlay.classList.add('open'); }
  function close() { overlay.classList.remove('open'); }

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay || e.target.closest('.pei-modal-close')) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });

  var t;
  document.querySelectorAll('.pei-trigger[data-pei="popup"]').forEach(function (el) {
    el.addEventListener('pointerenter', function () {
      clearTimeout(t);
      t = setTimeout(open, 350);
    });
    el.addEventListener('click', function () {
      clearTimeout(t);
      open();
    });
  });
})();
