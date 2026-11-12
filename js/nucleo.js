(function () {
  const D = {};

  D.$ = (s, r = document) => r.querySelector(s);
  D.$$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  D.arr = (x) => (Array.isArray(x) ? x : x instanceof NodeList ? Array.from(x) : [x]);

  D.fmt = (n, dec = 0) => {
    const fijo = Math.abs(n).toFixed(dec).split('.');
    const ent = fijo[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return (n < 0 ? '−' : '') + ent + (dec ? ',' + fijo[1] : '');
  };

  const envolver = (t) => {
    const m = document.createElement('span');
    m.className = 'm';
    const i = document.createElement('span');
    i.className = 'i';
    i.textContent = t;
    m.appendChild(i);
    return m;
  };

  D.dividir = (el, modo) => {
    if (el.dataset.dividido) return;
    el.dataset.dividido = '1';
    const recorrer = (nodo) => {
      Array.from(nodo.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) {
              frag.appendChild(document.createTextNode(' '));
              return;
            }
            if (modo === 'letras') {
              const pal = document.createElement('span');
              pal.className = 'pal';
              Array.from(p).forEach((c) => pal.appendChild(envolver(c)));
              frag.appendChild(pal);
            } else if (modo === 'luz') {
              const w = document.createElement('span');
              w.className = 'w';
              w.textContent = p;
              frag.appendChild(w);
            } else {
              frag.appendChild(envolver(p));
            }
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains('m')) {
          recorrer(n);
        }
      });
    };
    recorrer(el);
  };

  D.eco = (el) => {
    if (el.dataset.ecoListo) return;
    el.dataset.ecoListo = '1';
    const n = +el.dataset.eco || 2;
    const texto = el.textContent.trim();
    for (let k = 1; k <= n; k++) {
      const c = document.createElement('span');
      c.className = 'eco-capa';
      c.dataset.k = k;
      c.setAttribute('aria-hidden', 'true');
      c.textContent = texto;
      el.appendChild(c);
    }
  };

  D.revelar = (tl, el, at = 0, o = {}) => {
    const items = D.arr(el).flatMap((e) => (e.classList && e.classList.contains('i') ? [e] : D.$$('.i', e)));
    tl.from(items, {
      yPercent: o.desde === 'arriba' ? -135 : 135,
      rotation: o.giro || 0,
      duration: o.dur || 1,
      ease: o.ease || 'expo.out',
      stagger: o.stagger ?? 0.045,
    }, at);
  };

  D.encender = (tl, el, at = 0, o = {}) => {
    tl.from(D.arr(el).flatMap((e) => D.$$('.w', e)), {
      opacity: 0.13,
      duration: o.dur || 0.45,
      stagger: o.stagger ?? 0.055,
      ease: 'power1.out',
    }, at);
  };

  D.ecos = (tl, el, at = 0, o = {}) => {
    tl.from(D.$$('.eco-capa', el), {
      y: 0,
      opacity: 0,
      duration: o.dur || 1.1,
      stagger: o.stagger ?? 0.09,
      ease: o.ease || 'power4.out',
    }, at);
  };

  D.contar = (tl, el, a, b, at = 0, dur = 1.6, fmt = (v) => D.fmt(v)) => {
    const o = { v: a };
    el.textContent = fmt(a);
    tl.to(o, {
      v: b,
      duration: dur,
      ease: 'power3.out',
      onUpdate: () => {
        el.textContent = fmt(o.v);
      },
    }, at);
  };

  D.trazar = (tl, els, at = 0, dur = 1.2, o = {}) => {
    D.arr(els).forEach((p, i) => {
      const L = p.getTotalLength();
      tl.fromTo(p, { strokeDasharray: L + ' ' + L, strokeDashoffset: o.reverso ? -L : L }, {
        strokeDashoffset: 0,
        duration: dur,
        ease: o.ease || 'power2.inOut',
      }, at + i * (o.stagger || 0));
    });
  };

  D.cadena = (tl, els, at = 0, paso = 0.26, o = {}) => {
    D.arr(els).forEach((p, i) => {
      tl.from(p, {
        width: 0,
        paddingLeft: 0,
        paddingRight: 0,
        marginRight: 0,
        opacity: 0,
        duration: o.dur || 0.75,
        ease: 'power3.out',
      }, at + i * paso);
    });
  };

  const INSET = {
    arriba: 'inset(100% 0% 0% 0% round 26px)',
    abajo: 'inset(0% 0% 100% 0% round 26px)',
    izq: 'inset(0% 100% 0% 0% round 26px)',
    der: 'inset(0% 0% 0% 100% round 26px)',
    centro: 'inset(50% 50% 50% 50% round 26px)',
  };

  D.clip = (tl, el, at = 0, dir = 'arriba', dur = 1.2, o = {}) => {
    tl.fromTo(el, { clipPath: INSET[dir] }, {
      clipPath: 'inset(0% 0% 0% 0% round 26px)',
      duration: dur,
      ease: o.ease || 'expo.inOut',
      stagger: o.stagger || 0,
    }, at);
  };

  D.iris = (tl, el, at = 0, cx = '50%', cy = '50%', dur = 1.3) => {
    tl.fromTo(el, { clipPath: `circle(0% at ${cx} ${cy})` }, {
      clipPath: `circle(150% at ${cx} ${cy})`,
      duration: dur,
      ease: 'power3.in',
    }, at);
  };

  D.caja = (el) => {
    const r = el.getBoundingClientRect();
    const e = window.Deck.escenarioRect();
    const s = window.Deck.escala;
    return { x: (r.left - e.left) / s, y: (r.top - e.top) / s, w: r.width / s, h: r.height / s };
  };

  D.flipDesde = (destino, origen) => {
    const a = D.caja(origen);
    const b = D.caja(destino);
    return {
      x: a.x + a.w / 2 - (b.x + b.w / 2),
      y: a.y + a.h / 2 - (b.y + b.h / 2),
      scaleX: a.w / b.w,
      scaleY: a.h / b.h,
      transformOrigin: '50% 50%',
    };
  };

  D.flotar = (tl, el, at = 0, o = {}) => {
    tl.to(el, {
      y: o.y ?? -14,
      rotation: o.giro ?? 0,
      duration: o.dur || 3.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: o.repeat ?? 5,
    }, at);
  };

  window.D = D;
})();
