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

  /* ---------- Deepavali decorations ---------- */
  var SVGNS = 'http://www.w3.org/2000/svg';
  function useSvg(id, cls) {
    var s = document.createElementNS(SVGNS, 'svg'), u = document.createElementNS(SVGNS, 'use');
    if (cls) s.setAttribute('class', cls);
    s.setAttribute('aria-hidden', 'true');
    u.setAttribute('href', '#' + id);
    s.appendChild(u);
    return s;
  }
  // Marigold, rose and jasmine garland (toran) with hanging strands and mango leaves
  var FLOWERS = ['y', 'o', 'y', 'o', 'w', 'y', 'o', 'r'];
  function makeToran(swags, cls) {
    var box = el('div', 'toran' + (cls ? ' ' + cls : '')), sag = 26, n = 0;
    box.setAttribute('aria-hidden', 'true');
    function flower(xPct, yPx, type) {
      var f = el('i', 'mg ' + (type || FLOWERS[n++ % FLOWERS.length]));
      f.style.left = xPct + '%'; f.style.top = yPx + 'px';
      box.appendChild(f);
    }
    for (var s = 0; s < swags; s++) {
      for (var i = 0; i < 12; i++) {
        var t = i / 12;
        flower(100 * (s + t) / swags, 8 + 4 * t * (1 - t) * sag);
      }
    }
    for (var k = 0; k <= swags; k++) {
      var x = Math.min(Math.max(100 * k / swags, 2), 98);
      for (var j = 1; j <= 4; j++) flower(x, 8 + j * 15, j % 2 ? 'o' : 'y');
      var leaf = el('i', 'leaf');
      leaf.style.left = x + '%'; leaf.style.top = (8 + 5 * 15 - 4) + 'px';
      box.appendChild(leaf);
    }
    return box;
  }

  // Lanterns hang from the middle of the first and last garland swags
  function makeKandils(target, swags) {
    ['left', 'right'].forEach(function (side) {
      var k = el('div', 'kandil ' + side);
      k.style[side] = (50 / swags) + '%';
      k.appendChild(useSvg('kandil'));
      target.appendChild(k);
    });
  }

  // Place a pair of kuthu vilakku (brass standing lamps) on either side of an element
  function flankWithLamps(node) {
    if (!node) return;
    var row = el('div', 'lamp-row' + (node.classList.contains('reveal') ? ' reveal' : ''));
    node.classList.remove('reveal');
    node.parentNode.insertBefore(row, node);
    row.appendChild(useSvg('vilakku', 'vilakku'));
    row.appendChild(node);
    row.appendChild(useSvg('vilakku', 'vilakku'));
  }

  // Petals drifting down every screen
  (function () {
    if (reduceMotion) return;
    var box = el('div', 'bg-petals'), kinds = ['o', 'y', 'r', 'w', 'o', 'y'];
    box.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < 18; i++) {
      var pe = el('i', 'petal ' + kinds[i % kinds.length]);
      pe.style.left = Math.random() * 100 + '%';
      pe.style.animationDuration = 11 + Math.random() * 10 + 's';
      pe.style.animationDelay = -Math.random() * 20 + 's';
      pe.style.setProperty('--sway', (Math.random() * 120 - 60) + 'px');
      pe.style.setProperty('--spin', (Math.random() < .5 ? -1 : 1) * (240 + Math.random() * 360) + 'deg');
      var sz = 8 + Math.random() * 8;
      pe.style.width = sz + 'px'; pe.style.height = sz * 0.7 + 'px';
      box.appendChild(pe);
    }
    document.body.insertBefore(box, $('#cover'));
  })();

  (function decorate() {
    var narrow = innerWidth < 560;
    var cover = $('#cover');
    cover.insertBefore(makeToran(narrow ? 3 : 5), cover.firstChild);
    makeKandils(cover, narrow ? 3 : 5);
    cover.appendChild(makeToran(narrow ? 3 : 5, 'bottom'));

    ['#wish', '#closing'].forEach(function (id) {
      var sec = $(id);
      sec.insertBefore(makeToran(narrow ? 3 : 4), sec.firstChild);
      makeKandils(sec, narrow ? 3 : 4);
    });
    ['#video', '#invite', '#details', '#rsvp', '#story'].forEach(function (id) {
      var sec = $(id);
      sec.classList.add('has-toran');
      sec.insertBefore(makeToran(narrow ? 3 : 4), sec.firstChild);
    });

    // Kuthu vilakku beside the main headings and in the cards
    ['#video > .kicker', '#details .sec-title', '#rsvp .sec-title', '.closing-wish', '.medallion', '.story-diyas', '.cover-title']
      .forEach(function (s) { flankWithLamps($(s)); });

    ['#video', '#details'].forEach(function (id) {
      var row = el('div', 'diya-row');
      row.setAttribute('aria-hidden', 'true');
      for (var i = 0; i < 5; i++) row.appendChild(useSvg('diya'));
      $(id).appendChild(row);
    });
    $$('.card, .detail-wide').forEach(function (c) {
      ['tl', 'tr', 'bl', 'br'].forEach(function (pos) { c.appendChild(useSvg('corner', 'corner ' + pos)); });
    });
  })();

  /* ---------- fireworks / crackers ---------- */
  var FW = (function () {
    var cv = $('#fireworks'), ctx = cv.getContext('2d');
    var parts = [], rockets = [], raf = null, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var palettes = [
      ['#fff1bf', '#ffd25e', '#ffb703'],
      ['#ff9f1c', '#ffd166', '#fff1bf'],
      ['#ff4d6d', '#ffb3c6', '#ffd25e'],
      ['#c77dff', '#e0aaff', '#fff1bf'],
      ['#4cc9f0', '#bde0fe', '#ffd25e'],
      ['#80ed99', '#ffd25e', '#fff1bf']
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
          color: '#fffbe0', r: 1, crackle: true, trail: [] });
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

  /* ---------- music: starts when the envelope opens, loops, no controls ---------- */
  var audio = $('#bgm');
  var musicOn = false;
  function playMusic() { if (!C.music) return; var p = audio.play(); if (p && p.catch) p.catch(function () {}); }
  if (C.music) {
    audio.src = C.music;
    audio.loop = true;
    audio.preload = 'auto';
    // Keep the music going: if something pauses it while the page is showing, start it again
    audio.addEventListener('pause', function () {
      if (musicOn && !document.hidden) setTimeout(playMusic, 300);
    });
    document.addEventListener('visibilitychange', function () {
      if (musicOn && !document.hidden) playMusic();
    });
    // Phone lock-screen / notification controls cannot pause or skip it
    if ('mediaSession' in navigator) {
      ['pause', 'stop', 'seekbackward', 'seekforward', 'previoustrack', 'nexttrack', 'seekto'].forEach(function (a) {
        try { navigator.mediaSession.setActionHandler(a, function () { playMusic(); }); } catch (e) {}
      });
    }
  }

  /* ---------- open envelope ---------- */
  var opened = false;
  function openInvite() {
    if (opened) return; opened = true;
    $('#envelope').classList.add('open');
    musicOn = true;
    playMusic();   // inside the tap, so phones allow sound
    var r = $('#openBtn').getBoundingClientRect();
    setTimeout(function () { FW.burst(r.left + r.width / 2, r.top, true); }, 350);
    setTimeout(function () {
      $('#cover').classList.add('gone');
      document.body.classList.remove('locked');
      $('#main').removeAttribute('aria-hidden');
      paragraphs($('#wishText'), C.wish, !reduceMotion);
      FW.show(9, 260);
      startReveal();
      document.dispatchEvent(new Event('invite-opened'));
      showScrollHint();
    }, 1700);
  }
  /* ---------- floating "scroll down" hint ---------- */
  var hint = $('#scrollHint');
  function hideHint() {
    if (hint.hidden || hint.classList.contains('out')) return;
    hint.classList.add('out');
    setTimeout(function () { hint.hidden = true; }, 500);
  }
  function showScrollHint() {
    hint.hidden = false;
    var start = window.scrollY;
    window.addEventListener('scroll', function onScroll() {
      if (window.scrollY - start > 120) { hideHint(); window.removeEventListener('scroll', onScroll); }
    }, { passive: true });
  }
  hint.addEventListener('click', function () {
    hideHint();
    $('#video').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });

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

  /* ---------- video: autoplays muted inside the royal frame ---------- */
  (function () {
    var src = (C.video || '').trim(); if (!src) return;
    var frame = $('#videoFrame');
    var yt = src.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/);
    frame.innerHTML = '';
    if (yt) {
      if (!/shorts\//.test(src)) frame.classList.add('landscape');
      var f = el('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + yt[1] + '?rel=0&playsinline=1&autoplay=1&mute=1&loop=1&playlist=' + yt[1];
      f.title = 'Deepavali video';
      f.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
      f.allowFullscreen = true;
      frame.appendChild(f);
      return;
    }
    var v = el('video');
    v.muted = true; v.defaultMuted = true; v.setAttribute('muted', '');
    v.autoplay = true; v.loop = true; v.playsInline = true; v.disablePictureInPicture = true;
    v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', '');
    v.preload = 'auto';
    // MP4 for phones; optional WebM fallback for browsers without H.264
    [[src, 'video/mp4'], [C.videoWebm, 'video/webm']].forEach(function (s) {
      if (!s[0]) return;
      var so = el('source'); so.src = s[0]; so.type = s[1]; v.appendChild(so);
    });
    if (C.videoPoster) v.poster = C.videoPoster;
    v.setAttribute('aria-label', 'Deepavali video');
    v.addEventListener('loadedmetadata', function () { if (v.videoWidth > v.videoHeight) frame.classList.add('landscape'); });
    frame.appendChild(v);

    function tryPlay() { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    // Play while the video is on screen, pause when scrolled away
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (ents) {
        ents.forEach(function (e) { if (e.isIntersecting) tryPlay(); else v.pause(); });
      }, { threshold: 0.3 }).observe(v);
    }
    document.addEventListener('invite-opened', tryPlay);

    // Always silent: re-mute if the browser or a gesture unmutes it
    v.addEventListener('volumechange', function () { if (!v.muted) v.muted = true; });
  })();

  /* ---------- map & navigation ---------- */
  (function () {
    var q = encodeURIComponent(C.address || '');
    var map = $('#mapFrame');
    if (map) map.src = 'https://maps.google.com/maps?q=' + q + '&z=16&output=embed';
    $('#btnMaps').href = C.mapsUrl || 'https://www.google.com/maps/search/?api=1&query=' + q;
    $('#btnWaze').href = C.wazeUrl || 'https://waze.com/ul?q=' + q + '&navigate=yes';
    function gcal(d) { return new Date(d).toISOString().replace(/[-:]|\.\d{3}/g, ''); }
    $('#btnCal').href = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + encodeURIComponent(C.eventName || 'Deepavali Open House') +
      '&dates=' + gcal(C.start) + '/' + gcal(C.end) +
      '&location=' + q +
      '&details=' + encodeURIComponent((C.title || '') + ' — ' + (C.hosts || ''));
  })();

  /* ---------- contacts ---------- */
  (function () {
    var list = $('#contactList'), people = C.contacts || [];
    if (!people.length) { $('#contacts').hidden = true; return; }
    // 0123117635 -> "012-311 7635" for display, "60123117635" for WhatsApp / calls
    function pretty(n) { n = n.replace(/\D/g, ''); return n.length === 10 ? n.slice(0, 3) + '-' + n.slice(3, 6) + ' ' + n.slice(6) : n.length === 11 ? n.slice(0, 3) + '-' + n.slice(3, 7) + ' ' + n.slice(7) : n; }
    function intl(n) { n = n.replace(/\D/g, ''); return n.charAt(0) === '0' ? '6' + n : n; }
    people.forEach(function (p) {
      var row = el('div', 'contact');
      var who = el('div', 'contact-who');
      who.appendChild(el('b', 'contact-name', p.name));
      who.appendChild(el('span', 'contact-num', pretty(p.phone)));
      row.appendChild(who);
      var acts = el('div', 'contact-acts');
      var call = el('a', 'btn contact-btn');
      call.href = 'tel:+' + intl(p.phone);
      call.setAttribute('aria-label', 'Call ' + p.name);
      call.appendChild(useSvg('i-phone')); call.appendChild(document.createTextNode('Call'));
      var wa = el('a', 'btn btn-wa contact-btn');
      wa.href = 'https://wa.me/' + intl(p.phone) + '?text=' + encodeURIComponent('Hi ' + p.name + ', about the Deepavali Open House on 14 November…');
      wa.target = '_blank'; wa.rel = 'noopener';
      wa.setAttribute('aria-label', 'WhatsApp ' + p.name);
      wa.appendChild(useSvg('i-wa')); wa.appendChild(document.createTextNode('WhatsApp'));
      acts.appendChild(call); acts.appendChild(wa);
      row.appendChild(acts);
      list.appendChild(row);
    });
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
  var form = $('#rsvpForm'), msg = $('#formMsg'), btn = $('#rsvpBtn'), paxField = $('#paxField');
  var MAX = C.maxPax || 10;
  var demo = !C.rsvpApiUrl;
  var DEMO_KEY = 'deepavali-rsvp-demo';

  // Guest and meal counters: vegetarian + non-vegetarian always add up to the guest count
  var count = { pax: 1, veg: 1, nonveg: 0 };
  function renderCounts() {
    ['pax', 'veg', 'nonveg'].forEach(function (k) {
      $('#out-' + k).textContent = count[k];
      var box = $('.stepper[data-key="' + k + '"]');
      var lo = k === 'pax' ? 1 : 0, hi = k === 'pax' ? MAX : count.pax;
      box.querySelector('[data-d="-1"]').disabled = count[k] <= lo;
      box.querySelector('[data-d="1"]').disabled = count[k] >= hi;
    });
    $('#mealNote').textContent = count.pax + (count.pax === 1 ? ' guest' : ' guests') +
      ' · ' + count.veg + ' vegetarian · ' + count.nonveg + ' non-vegetarian';
  }
  function step(key, delta) {
    if (key === 'pax') {
      count.pax = Math.min(MAX, Math.max(1, count.pax + delta));
      if (count.veg > count.pax) count.veg = count.pax;
      count.nonveg = count.pax - count.veg;
    } else {
      var other = key === 'veg' ? 'nonveg' : 'veg';
      count[key] = Math.min(count.pax, Math.max(0, count[key] + delta));
      count[other] = count.pax - count[key];
    }
    renderCounts();
  }
  $$('.stepper').forEach(function (box) {
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || b.disabled) return;
      step(box.getAttribute('data-key'), Number(b.getAttribute('data-d')));
    });
  });
  renderCounts();

  $('#carPlate').addEventListener('input', function () { this.classList.remove('invalid'); });

  form.addEventListener('change', function (e) {
    if (e.target.name === 'attending') paxField.hidden = e.target.value !== 'Attending';
  });

  // RSVPs in demo mode stay in this browser only
  var memRows = load(DEMO_KEY, []);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fd = new FormData(form);
    var coming = fd.get('attending') === 'Attending';
    var data = {
      name: (fd.get('name') || '').trim(),
      phone: (fd.get('phone') || '').trim(),
      attending: fd.get('attending') || '',
      pax: coming ? count.pax : 0,
      veg: coming ? count.veg : 0,
      nonveg: coming ? count.nonveg : 0,
      // e.g. " wxy  1234, bcd 5 " -> "WXY 1234, BCD 5"
      carPlate: coming ? (fd.get('carPlate') || '').toUpperCase().replace(/[^A-Z0-9 ,-]/g, '').replace(/\s+/g, ' ').replace(/\s*,\s*/g, ', ').replace(/^[ ,]+|[ ,]+$/g, '') : ''
    };
    msg.classList.remove('err');
    if (!data.name) { msg.textContent = 'Please enter your name.'; msg.classList.add('err'); form.elements.namedItem('name').focus(); return; }
    if (!data.attending) { msg.textContent = 'Please let us know if you can attend.'; msg.classList.add('err'); return; }
    if (coming && data.carPlate.replace(/[^A-Z0-9]/g, '').length < 2) {
      msg.textContent = 'Please enter your car number plate.'; msg.classList.add('err');
      var car = $('#carPlate'); car.classList.add('invalid'); car.focus(); return;
    }

    btn.disabled = true; msg.textContent = 'Sending…';
    var done = function () {
      btn.disabled = false;
      msg.textContent = coming
        ? 'Thank you! We can’t wait to celebrate with you 🪔'
        : 'Thank you for letting us know. Happy Deepavali! ✨';
      form.reset(); paxField.hidden = false;
      count = { pax: 1, veg: 1, nonveg: 0 }; renderCounts();
      FW.show(5, 220);
    };
    if (demo) {
      memRows.push(data); save(DEMO_KEY, memRows);
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
