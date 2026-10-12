/* Deepavali Open House & Housewarming — page behaviour */
(function () {
  'use strict';
  var C = window.INVITE || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function load(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  /* ---------- fill text from config ---------- */
  $$('[data-c]').forEach(function (n) {
    var v = C[n.getAttribute('data-c')];
    if (v) n.textContent = v; else if (n.matches('p')) n.hidden = true;
  });

  function paragraphs(target, lines, animateWords) {
    (lines || []).forEach(function (line, li) {
      var p = el('p');
      if (animateWords) {
        line.split(' ').forEach(function (w, wi) {
          var s = el('span', null, w);
          s.style.animationDelay = (li * 0.55 + wi * 0.07) + 's';
          p.appendChild(s); p.appendChild(document.createTextNode(' '));
        });
      } else p.textContent = line;
      target.appendChild(p);
    });
  }
  paragraphs($('#storyText'), C.story, false);

  /* ---------- sparkles in background ---------- */
  (function () {
    if (reduceMotion) return;
    var box = $('#sparkles');
    for (var i = 0; i < 26; i++) {
      var s = el('i');
      s.style.left = Math.random() * 100 + '%';
      s.style.animationDuration = 9 + Math.random() * 12 + 's';
      s.style.animationDelay = -Math.random() * 20 + 's';
      s.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
      var size = 2 + Math.random() * 3;
      s.style.width = s.style.height = size + 'px';
      box.appendChild(s);
    }
  })();

  /* ---------- fireworks / crackers ---------- */
  var FW = (function () {
    var cv = $('#fireworks'), ctx = cv.getContext('2d');
    var parts = [], rockets = [], raf = null, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var palettes = [
      ['#fff1bf', '#e8c26a', '#ffb703'],
      ['#ff9f1c', '#ffd166', '#fff1bf'],
      ['#ff4d6d', '#ffb3c6', '#e8c26a'],
      ['#c77dff', '#e0aaff', '#fff1bf'],
      ['#4cc9f0', '#bde0fe', '#e8c26a'],
      ['#80ed99', '#e8c26a', '#fff1bf']
    ];
    function size() { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size(); addEventListener('resize', size);

    function burst(x, y, big) {
      var pal = palettes[(Math.random() * palettes.length) | 0];
      var n = big ? 90 : 60, speed = big ? 6 : 4.5;
      for (var i = 0; i < n; i++) {
        var a = (Math.PI * 2 * i) / n + Math.random() * 0.1;
        var v = speed * (0.45 + Math.random() * 0.6);
        parts.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, decay: 0.010 + Math.random() * 0.012,
          color: pal[(Math.random() * pal.length) | 0], r: 1.4 + Math.random() * 1.6, trail: [] });
      }
      // crackle sparks
      for (var j = 0; j < 24; j++) {
        parts.push({ x: x, y: y, vx: (Math.random() - .5) * 3, vy: (Math.random() - .5) * 3, life: 1, decay: 0.02 + Math.random() * 0.02,
          color: '#fffbe0', r: 0.9, crackle: true, trail: [] });
      }
      run();
    }
    function launch(x, targetY) {
      x = x == null ? innerWidth * (0.15 + Math.random() * 0.7) : x;
      targetY = targetY == null ? innerHeight * (0.12 + Math.random() * 0.3) : targetY;
      rockets.push({ x: x, y: innerHeight + 10, ty: targetY, vy: -(9 + Math.random() * 3), vx: (Math.random() - .5) * 1.2 });
      run();
    }
    function show(count, spread) {
      if (reduceMotion) return;
      for (var i = 0; i < count; i++) setTimeout(function () { launch(); }, i * (spread || 280) + Math.random() * 150);
    }
    function frame() {
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.globalCompositeOperation = 'lighter';
      for (var i = rockets.length - 1; i >= 0; i--) {
        var r = rockets[i];
        r.x += r.vx; r.y += r.vy; r.vy *= 0.985;
        ctx.fillStyle = '#ffd166';
        ctx.beginPath(); ctx.arc(r.x, r.y, 2.2, 0, 7); ctx.fill();
        ctx.fillStyle = 'rgba(255,159,28,.45)';
        ctx.beginPath(); ctx.arc(r.x - r.vx, r.y - r.vy * 1.6, 1.6, 0, 7); ctx.fill();
        if (r.y <= r.ty || r.vy > -2) { rockets.splice(i, 1); burst(r.x, r.y, Math.random() < .35); }
      }
      for (var k = parts.length - 1; k >= 0; k--) {
        var p = parts[k];
        p.trail.push(p.x, p.y); if (p.trail.length > 10) p.trail.splice(0, 2);
        p.vx *= 0.975; p.vy = p.vy * 0.975 + 0.06; p.x += p.vx; p.y += p.vy; p.life -= p.decay;
        if (p.life <= 0) { parts.splice(k, 1); continue; }
        var alpha = p.crackle ? (Math.random() < .5 ? p.life : 0) : p.life;
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = p.color; ctx.lineWidth = p.r;
        if (p.trail.length >= 4) {
          ctx.beginPath(); ctx.moveTo(p.trail[0], p.trail[1]); ctx.lineTo(p.x, p.y); ctx.stroke();
        }
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (parts.length || rockets.length) raf = requestAnimationFrame(frame);
      else { raf = null; ctx.clearRect(0, 0, innerWidth, innerHeight); }
    }
    function run() { if (!raf) raf = requestAnimationFrame(frame); }
    return { burst: burst, launch: launch, show: show };
  })();

  /* ---------- music ---------- */
  var audio = $('#bgm'), musicBtn = $('#musicBtn');
  if (C.music) {
    audio.src = C.music;
    musicBtn.hidden = false;
    audio.addEventListener('error', function () { musicBtn.hidden = true; });
    musicBtn.addEventListener('click', function () { audio.paused ? audio.play() : audio.pause(); });
    audio.addEventListener('play', function () { musicBtn.classList.add('playing'); });
    audio.addEventListener('pause', function () { musicBtn.classList.remove('playing'); });
  }

  /* ---------- open envelope ---------- */
  var opened = false;
  function openInvite() {
    if (opened) return; opened = true;
    $('#envelope').classList.add('open');
    if (C.music) audio.play().catch(function () {});
    var r = $('#openBtn').getBoundingClientRect();
    setTimeout(function () { FW.burst(r.left + r.width / 2, r.top, true); }, 350);
    setTimeout(function () {
      $('#cover').classList.add('gone');
      document.body.classList.remove('locked');
      $('#main').removeAttribute('aria-hidden');
      paragraphs($('#wishText'), C.wish, !reduceMotion);
      FW.show(9, 260);
      startReveal();
    }, 1700);
  }
  $('#openBtn').addEventListener('click', openInvite);
  $('#moreCrackers').addEventListener('click', function () { FW.show(7, 200); });

  /* ---------- reveal on scroll ---------- */
  function startReveal() {
    var items = $$('.reveal');
    if (!('IntersectionObserver' in window)) { items.forEach(function (n) { n.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in'); io.unobserve(e.target);
        if (e.target.classList.contains('closing-wish')) FW.show(6, 300);
      });
    }, { threshold: 0.15 });
    items.forEach(function (n) { io.observe(n); });
  }

  /* ---------- video ---------- */
  (function () {
    var src = (C.video || '').trim(); if (!src) return;
    var frame = $('#videoFrame'), yt = src.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/);
    frame.innerHTML = '';
    if (yt) {
      var isShort = /shorts\//.test(src);
      if (!isShort) frame.classList.add('landscape');
      var f = el('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + yt[1] + '?rel=0&playsinline=1';
      f.title = 'Deepavali video';
      f.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
      f.allowFullscreen = true;
      frame.appendChild(f);
    } else {
      var v = el('video');
      v.src = src; v.controls = true; v.playsInline = true; v.preload = 'metadata';
      if (C.videoPoster) v.poster = C.videoPoster;
      v.addEventListener('loadedmetadata', function () { if (v.videoWidth > v.videoHeight) frame.classList.add('landscape'); });
      v.addEventListener('play', function () { if (!audio.paused) { audio.pause(); v.addEventListener('pause', function () { if (C.music) audio.play().catch(function () {}); }, { once: true }); } });
      frame.appendChild(v);
    }
  })();

  /* ---------- map & navigation ---------- */
  (function () {
    var q = encodeURIComponent(C.address || '');
    $('#mapFrame').src = 'https://maps.google.com/maps?q=' + q + '&z=16&output=embed';
    $('#btnMaps').href = C.mapsUrl || 'https://www.google.com/maps/search/?api=1&query=' + q;
    $('#btnWaze').href = C.wazeUrl || 'https://waze.com/ul?q=' + q + '&navigate=yes';
    function gcal(d) { return new Date(d).toISOString().replace(/[-:]|\.\d{3}/g, ''); }
    $('#btnCal').href = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + encodeURIComponent(C.eventName || 'Deepavali Open House') +
      '&dates=' + gcal(C.start) + '/' + gcal(C.end) +
      '&location=' + q +
      '&details=' + encodeURIComponent((C.title || '') + ' — ' + (C.hosts || ''));
  })();

  /* ---------- countdown ---------- */
  (function () {
    var target = new Date(C.start).getTime(), box = $('#countdown');
    var d = $('#cdD'), h = $('#cdH'), m = $('#cdM'), s = $('#cdS');
    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) { box.classList.add('done'); box.textContent = 'The celebration has begun! 🪔'; return; }
      d.textContent = Math.floor(diff / 864e5);
      h.textContent = pad(Math.floor(diff / 36e5) % 24);
      m.textContent = pad(Math.floor(diff / 6e4) % 60);
      s.textContent = pad(Math.floor(diff / 1e3) % 60);
      setTimeout(tick, 1000);
    }
    tick();
  })();

  /* ---------- RSVP ---------- */
  var form = $('#rsvpForm'), msg = $('#formMsg'), btn = $('#rsvpBtn');
  var paxSel = $('#paxSelect'), paxField = $('#paxField');
  for (var i = 1; i <= (C.maxPax || 10); i++) {
    var o = el('option', null, i + (i === 1 ? ' person' : ' people')); o.value = i; paxSel.appendChild(o);
  }
  var demo = !C.rsvpApiUrl;
  var DEMO_KEY = 'deepavali-rsvp-demo';

  form.addEventListener('change', function (e) {
    if (e.target.name === 'attending') paxField.hidden = e.target.value !== 'Attending';
  });

  function renderWall(data) {
    $('#tally').hidden = false;
    $('#tAttend').textContent = data.attending || 0;
    $('#tWishes').textContent = (data.wishes || []).length;
    var wall = $('#wishesWall'); wall.innerHTML = '';
    (data.wishes || []).slice(0, 50).forEach(function (w) {
      var item = el('div', 'wish-item');
      item.appendChild(el('p', null, '“' + w.wish + '”'));
      item.appendChild(el('b', null, '— ' + w.name));
      wall.appendChild(item);
    });
  }
  function demoData() {
    var rows = load(DEMO_KEY, []), att = 0, wishes = [];
    rows.forEach(function (r) { if (r.attending === 'Attending') att += Number(r.pax) || 1; if (r.wishes) wishes.unshift({ name: r.name, wish: r.wishes }); });
    wishes.push({ name: 'Priya & Family', wish: 'Happy Deepavali and congratulations on your beautiful new home! 🪔' });
    return { attending: att + 4, wishes: wishes };
  }
  function loadWall() {
    if (demo) { renderWall(demoData()); return; }
    fetch(C.rsvpApiUrl + '?t=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (d) { if (d && d.ok) renderWall(d); })
      .catch(function () {});
  }
  loadWall();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fd = new FormData(form);
    var data = {
      name: (fd.get('name') || '').trim(),
      phone: (fd.get('phone') || '').trim(),
      attending: fd.get('attending') || '',
      pax: fd.get('attending') === 'Attending' ? fd.get('pax') : 0,
      wishes: (fd.get('wishes') || '').trim()
    };
    msg.classList.remove('err');
    if (!data.name) { msg.textContent = 'Please enter your name.'; msg.classList.add('err'); form.elements.namedItem('name').focus(); return; }
    if (!data.attending) { msg.textContent = 'Please let us know if you can attend.'; msg.classList.add('err'); return; }

    btn.disabled = true; msg.textContent = 'Sending…';
    var done = function () {
      btn.disabled = false;
      msg.textContent = data.attending === 'Attending'
        ? 'Thank you! We can’t wait to celebrate with you 🪔'
        : 'Thank you for letting us know. Happy Deepavali! ✨';
      form.reset(); paxField.hidden = false;
      FW.show(5, 220);
      loadWall();
    };
    if (demo) {
      var rows = load(DEMO_KEY, []); rows.push(data); save(DEMO_KEY, rows);
      setTimeout(done, 500); return;
    }
    // No Content-Type header = text/plain, so there is no CORS preflight to Apps Script
    fetch(C.rsvpApiUrl, { method: 'POST', body: JSON.stringify(data) })
      .then(function (r) { return r.json(); })
      .then(function (d) { if (d && d.ok) done(); else throw new Error(d && d.error); })
      .catch(function () {
        btn.disabled = false;
        msg.textContent = 'Sorry, something went wrong. Please try again.'; msg.classList.add('err');
      });
  });
})();
