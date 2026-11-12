(function () {
  const params = new URLSearchParams(location.search);
  const RENDER = params.has('render');
  const esc = D.$('#escenario');
  const visor = D.$('#visor');
  const S = window.DIAPOS;
  const T = 1.4;
  const QUIETO = !RENDER && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const Deck = (window.Deck = { escala: 1, i: -1, tl: null, render: RENDER, listo: false, total: S.length });

  Deck.escenarioRect = () => esc.getBoundingClientRect();

  const ajustar = () => {
    const s = RENDER ? 1 : Math.min(visor.clientWidth / 1920, visor.clientHeight / 1080);
    Deck.escala = s;
    esc.style.transform = `translate(-50%, -50%) scale(${s})`;
  };

  const preparar = () => {
    D.$$('[data-split]').forEach((el) => D.dividir(el, el.dataset.split));
    D.$$('[data-eco]').forEach((el) => D.eco(el));
    G.montar();
    S.forEach((s) => {
      s.el = document.getElementById(s.id);
      if (s.prep) s.prep(s.el);
    });
    E.iniciar();
    gsap.set('#bat', { xPercent: -50, yPercent: -50, x: 2300, y: 300, autoAlpha: 0 });
    D.$('#hud-t').textContent = String(S.length).padStart(2, '0');
  };

  const limpiar = (el) => {
    const todos = [el, ...el.querySelectorAll('*')];
    gsap.killTweensOf(todos);
    gsap.set(todos, { clearProps: 'all' });
  };

  const mundoHacia = (tl, s) => {
    if (s.propio) return;
    const m = Object.assign({ rayos: 1, sup: -300, nieve: 1 }, s.mundo);
    const d = m.prof - E.mundo.prof;
    const dc = Math.sign(d || 1) * Math.min(1600, Math.max(320, Math.abs(d) * 0.3));
    tl.to(E.mundo, { prof: m.prof, rayos: m.rayos, sup: m.sup, nieve: m.nieve, duration: T + 0.2, ease: 'power2.inOut' }, 0);
    tl.to(E.mundo, { cam: E.mundo.cam + dc, duration: T + 0.5, ease: 'power2.inOut' }, 0);
  };

  const batHacia = (tl, s) => {
    if (s.propio) return;
    const b = s.bat;
    tl.to('#bat-cable', { opacity: 0, duration: 0.4 }, 0);
    if (!b) {
      tl.to('#bat', { x: '+=760', y: '-=180', rotation: -14, duration: T, ease: 'power2.in' }, 0);
      tl.to('#bat-haz', { opacity: 0, duration: 0.5 }, 0);
      tl.set('#bat', { autoAlpha: 0 }, T);
      return;
    }
    const sc = b.s ?? 1;
    tl.to('#bat', { autoAlpha: 1, duration: 0.3 }, 0);
    tl.to('#bat', { x: b.x, y: b.y, scaleX: b.flip ? -sc : sc, scaleY: sc, rotation: b.r || 0, duration: T + 0.3, ease: 'power3.inOut' }, 0);
    tl.to('#bat-haz', { opacity: b.luz || 0, duration: T }, 0.2);
    if (b.salir) tl.to('#bat', { autoAlpha: 0, duration: 0.5 }, T);
  };

  const medidorHacia = (tl, s) => {
    const m = s.medidor;
    if (!m) {
      tl.to(E.medidor, { a: 0, duration: 0.5 }, 0);
      return;
    }
    tl.to(E.medidor, { a: 1, duration: 0.6 }, 0.2);
    tl.set(E.medidor, { zona: m.zona || '' }, 0);
    tl.set(E.medidor, { texto: '' }, 0);
    if (m.v != null) tl.to(E.medidor, { v: m.v, duration: m.dur || T + 0.4, ease: 'power2.inOut' }, m.retraso || 0);
    if (m.texto) tl.set(E.medidor, { texto: m.texto }, (m.retraso || 0) + (m.dur || T + 0.4));
  };

  const TRANS = {
    bucear(tl, a, b) {
      tl.to(a.el, { y: -340, opacity: 0, duration: 0.9, ease: 'power2.in' }, 0);
      tl.fromTo(b.el, { y: 380, opacity: 0 }, { y: 0, opacity: 1, duration: 1.3, ease: 'power3.out' }, 0.5);
      return 0.55;
    },
    subir(tl, a, b) {
      tl.to(a.el, { y: 340, opacity: 0, duration: 0.9, ease: 'power2.in' }, 0);
      tl.fromTo(b.el, { y: -380, opacity: 0 }, { y: 0, opacity: 1, duration: 1.3, ease: 'power3.out' }, 0.5);
      return 0.55;
    },
    empujar(tl, a, b) {
      tl.to(a.el, { x: -560, rotation: -3, scale: 0.92, opacity: 0, duration: 1, ease: 'power3.inOut' }, 0);
      tl.fromTo(b.el, { x: 680, opacity: 0 }, { x: 0, opacity: 1, duration: 1.15, ease: 'power3.out' }, 0.32);
      return 0.45;
    },
    fundir(tl, a, b) {
      tl.to(a.el, { opacity: 0, duration: 0.7, ease: 'power2.in' }, 0);
      tl.fromTo(b.el, { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.5);
      return 0.6;
    },
    zoomIn(tl, a, b, o) {
      tl.to(a.el, { scale: 2.6, opacity: 0, transformOrigin: o.origen || '50% 50%', duration: 1.1, ease: 'power3.in' }, 0);
      tl.fromTo(b.el, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out' }, 0.75);
      return 0.75;
    },
    zoomOut(tl, a, b) {
      tl.to(a.el, { scale: 0.72, duration: 1, ease: 'power3.in' }, 0);
      tl.to(a.el, { opacity: 0, duration: 0.55, ease: 'power2.in' }, 0);
      tl.fromTo(b.el, { scale: 1.25, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.3, ease: 'power3.out' }, 0.5);
      return 0.55;
    },
    chevron(tl, a, b) {
      tl.to(a.el, { x: 420, opacity: 0, duration: 0.75, ease: 'power3.in' }, 0);
      tl.set(b.el, { opacity: 1 }, 0);
      tl.fromTo(b.el,
        { clipPath: 'polygon(-40% 0%, -30% 0%, -15% 50%, -30% 100%, -40% 100%, -25% 50%)' },
        { clipPath: 'polygon(-40% 0%, 125% 0%, 140% 50%, 125% 100%, -40% 100%, -25% 50%)', duration: 1.3, ease: 'power3.inOut' },
        0.15);
      tl.fromTo('#barrido', { x: -620 }, { x: 2400, duration: 1.3, ease: 'power3.inOut' }, 0.15);
      return 0.55;
    },
  };

  const construir = (desdeI, haciaI) => {
    const a = desdeI >= 0 ? S[desdeI] : null;
    const b = S[haciaI];
    limpiar(b.el);
    gsap.set(b.el, { visibility: 'visible', opacity: 0 });
    const tl = gsap.timeline({ paused: true });
    const ctx = { desde: a, hacia: b };
    if (!a && b.inicio) b.inicio(tl);
    mundoHacia(tl, b);
    batHacia(tl, b);
    medidorHacia(tl, b);

    let t0 = 0;
    const contiguo = a && haciaI === desdeI + 1;
    if (!a) {
      tl.set(b.el, { opacity: 1 }, 0);
    } else if (contiguo && typeof b.trans === 'function') {
      tl.set(b.el, { opacity: 1 }, 0);
      t0 = b.trans.call(b, tl, ctx);
    } else {
      const tipo = contiguo ? b.trans || 'fundir' : haciaI < desdeI ? 'subir' : 'fundir';
      t0 = TRANS[tipo](tl, a, b, b.transOpc || {});
    }
    if (a) tl.set(a.el, { autoAlpha: 0 }, Math.max(t0 + 1.3, 1.7));
    b.entrar(tl, t0, ctx);

    D.$('#hud-n').textContent = String(haciaI + 1).padStart(2, '0');
    tl.to('#hud-barra i', { width: ((haciaI + 1) / S.length) * 100 + '%', duration: 1, ease: 'power2.inOut' }, 0);
    return tl;
  };

  Deck.ir = (n, inmediato) => {
    if (n < 0 || n >= S.length || n === Deck.i) return;
    if (Deck.tl) {
      Deck.tl.progress(1);
      Deck.tl.kill();
    }
    const tl = construir(Deck.i, n);
    Deck.i = n;
    Deck.tl = tl;
    if (inmediato || QUIETO) tl.progress(1);
    else tl.play();
    if (!RENDER) {
      try {
        history.replaceState(null, '', '#' + (n + 1));
      } catch (e) {}
      controles.actualizar(n);
    }
  };
  Deck.siguiente = () => Deck.ir(Deck.i + 1);
  Deck.anterior = () => Deck.ir(Deck.i - 1);

  Deck.clip = (n) => {
    if (Deck.tl) Deck.tl.kill();
    const tl = construir(n - 1, n);
    Deck.i = n;
    Deck.tl = tl;
    return { dur: S[n].dur || 9, id: S[n].id, notas: S[n].notas || '' };
  };
  Deck.cuadro = (t, tGlobal) => {
    Deck.tl.time(t);
    E.mundo.t = tGlobal;
    E.dibujar();
  };
  Deck.notas = () => S.map((s) => ({ id: s.id, notas: s.notas || '', dur: s.dur || 9 }));

  const teclas = (e) => {
    const k = e.key;
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k)) {
      e.preventDefault();
      Deck.siguiente();
    } else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) {
      e.preventDefault();
      Deck.anterior();
    } else if (k === 'Home') Deck.ir(0);
    else if (k === 'End') Deck.ir(S.length - 1);
    else if (k === 'f' || k === 'F') pantallaCompleta();
  };

  const pantallaCompleta = () => {
    try {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      else document.documentElement.requestFullscreen().catch(() => {});
    } catch (e) {}
  };

  const controles = {
    el: D.$('#controles'),
    reloj: null,
    actualizar(n) {
      if (!this.el) return;
      D.$('#ctl-num').textContent = `${String(n + 1).padStart(2, '0')} / ${String(S.length).padStart(2, '0')}`;
      D.$('#btn-ant').disabled = n <= 0;
      D.$('#btn-sig').disabled = n >= S.length - 1;
    },
    despertar() {
      if (!this.el) return;
      this.el.classList.remove('dormido');
      clearTimeout(this.reloj);
      this.reloj = setTimeout(() => this.el.classList.add('dormido'), 3000);
    },
    iniciar() {
      if (!this.el) return;
      const parar = (fn) => (e) => {
        e.stopPropagation();
        fn();
        this.despertar();
      };
      D.$('#btn-ant').addEventListener('click', parar(Deck.anterior));
      D.$('#btn-sig').addEventListener('click', parar(Deck.siguiente));
      D.$('#btn-pant').addEventListener('click', parar(pantallaCompleta));
      ['pointermove', 'pointerdown', 'keydown'].forEach((ev) => addEventListener(ev, () => this.despertar(), { passive: true }));
      this.despertar();
    },
  };

  const deslizar = () => {
    let x0 = null;
    let y0 = 0;
    esc.addEventListener('touchstart', (e) => {
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
    }, { passive: true });
    esc.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        e.preventDefault();
        if (dx < 0) Deck.siguiente();
        else Deck.anterior();
      }
    });
  };

  const arrancar = async () => {
    await document.fonts.ready;
    await Promise.all(D.$$('img').map((i) => (i.decode ? i.decode().catch(() => {}) : null)));
    preparar();
    ajustar();
    if (RENDER) {
      if (controles.el) controles.el.hidden = true;
    } else {
      addEventListener('resize', ajustar);
      addEventListener('keydown', teclas);
      esc.addEventListener('click', (e) => {
        const r = esc.getBoundingClientRect();
        if (e.clientX < r.left + r.width * 0.25) Deck.anterior();
        else Deck.siguiente();
      });
      deslizar();
      controles.iniciar();
      gsap.ticker.add((time) => {
        E.mundo.t = time;
        E.dibujar();
      });
      const desdeHash = () => {
        const n = parseInt(location.hash.slice(1), 10);
        return n >= 1 && n <= S.length ? n - 1 : -1;
      };
      addEventListener('hashchange', () => {
        const n = desdeHash();
        if (n >= 0 && n !== Deck.i) Deck.ir(n);
      });
      const n = desdeHash();
      if (n > 0) {
        Deck.ir(n - 1, true);
        Deck.ir(n);
      } else Deck.ir(0);
    }
    Deck.listo = true;
  };

  arrancar();
})();
