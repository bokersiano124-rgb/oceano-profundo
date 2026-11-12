(function () {
  const { $, $$ } = D;
  const S = [];
  const def = (id, o) => S.push(Object.assign({ id, el: null }, o));

  const aparecer = (tl, el, at, o = {}) => {
    if (!el || (Array.isArray(el) && !el.length)) return;
    tl.from(el, { opacity: 0, y: o.y ?? 24, x: o.x ?? 0, duration: o.dur || 0.7, stagger: o.stagger || 0, ease: o.ease || 'power3.out' }, at);
  };

  const entrarZona = (tl, t, el, o = {}) => {
    aparecer(tl, $('.z-cab .etiqueta', el), t, { y: 14, dur: 0.5 });
    tl.from($('.z-rango', el), { opacity: 0, scale: 0.8, duration: 0.6, ease: 'back.out(2)' }, t + 0.1);
    if (!o.sinTitulo) D.revelar(tl, $('.z-nom', el), t + 0.15, { dur: 1.1 });
    D.ecos(tl, $('.z-nom', el), t + (o.sinTitulo ? 0.75 : 0.7));
    const luz = $('.z-luz', el);
    if (luz) {
      aparecer(tl, luz, t + 0.9, { y: 0, x: -30 });
      tl.from($('.medida i', luz), { width: o.luzDesde || '0%', duration: 1.5, ease: 'power2.inOut' }, t + 1.0);
    }
    const cond = $$('.z-cond .pild', el);
    if (cond.length) D.cadena(tl, cond, t + 0.9, 0.3);
    $$('.animal', el).forEach((a, k) => {
      tl.from(a, { opacity: 0, y: 70, duration: 0.9, ease: 'power3.out' }, t + 1.3 + k * 0.18);
      tl.to($('svg, img', a), { y: -10, duration: 2.4 + k * 0.35, yoyo: true, repeat: 3, ease: 'sine.inOut' }, t + 2.3 + k * 0.18);
    });
  };

  const entrarEspecie = (tl, t, el) => {
    aparecer(tl, $('.cientifico', el), t + 0.2, { y: 20 });
    D.revelar(tl, $('.nom', el), t + 0.35, { dur: 1.1, stagger: 0.08 });
    aparecer(tl, $('.alias', el), t + 0.8, { y: 16 });
  };

  def('d01', {
    propio: true,
    medidor: { v: 0, zona: 'Superficie' },
    dur: 8,
    notas: 'Portada: El océano profundo.',
    inicio(tl) {
      tl.set(E.mundo, { sup: 840, rayos: 0, nieve: 0, prof: 0 }, 0);
      tl.set('#bat', { x: 960, y: 400, scaleX: 1, scaleY: 1, rotation: 0, autoAlpha: 1 }, 0);
      tl.set('#bat-cable', { opacity: 1 }, 0);
      tl.set('#bat-haz', { opacity: 0 }, 0);
    },
    entrar(tl, t) {
      const el = this.el;
      tl.to(E.mundo, { sup: 30, duration: 2.2, ease: 'power3.inOut' }, t + 0.3);
      tl.to(E.mundo, { cam: E.mundo.cam + 900, duration: 2.6, ease: 'power2.inOut' }, t + 0.3);
      tl.to(E.mundo, { rayos: 1, nieve: 1, duration: 1.6 }, t + 1.0);
      tl.to('#bat', { x: 1480, y: 470, scaleX: 0.85, scaleY: 0.85, duration: 2.3, ease: 'power3.inOut' }, t + 0.3);
      tl.to('#bat', { rotation: -10, duration: 0.9, ease: 'power2.in' }, t + 0.5);
      tl.to('#bat', { rotation: 0, duration: 1.3, ease: 'power2.out' }, t + 1.4);
      tl.to('#bat-cable', { opacity: 0, duration: 0.5 }, t + 0.95);
      const burbujas = $$('.burbujas i', el);
      tl.fromTo(burbujas, { opacity: 0, y: 30, scale: 0.4 }, {
        opacity: 0.9, y: (i) => -110 - (i % 4) * 45, scale: 1, duration: 1.5, stagger: 0.05, ease: 'power2.out',
      }, t + 1.05);
      tl.to(burbujas, { opacity: 0, duration: 0.6, stagger: 0.05 }, t + 2.1);
      D.revelar(tl, $('.p-oceano', el), t + 1.3, { stagger: 0.06, dur: 1.1 });
      tl.from($('.p-profundo .i', el), { yPercent: 135, duration: 1.2, ease: 'expo.out' }, t + 1.6);
      tl.fromTo($('.p-profundo .i', el), { backgroundPosition: '0% 0%, 50% 85%' }, { backgroundPosition: '0% 0%, 50% 20%', duration: 12, ease: 'none' }, t + 1.6);
      D.ecos(tl, $('.p-profundo', el), t + 2.3);
      tl.from($('.p-el', el), { opacity: 0, x: -30, rotation: -14, duration: 0.9, ease: 'power3.out' }, t + 2.0);
      D.encender(tl, $('.p-sub', el), t + 2.6);
    },
  });

  def('d02', {
    mundo: { prof: 60, rayos: 1 },
    bat: { x: 1650, y: 150, s: 0.45, r: -4, luz: 0 },
    medidor: { v: 0, zona: 'Superficie' },
    dur: 9,
    notas: 'Los océanos cubren aproximadamente el 71 % de la superficie de nuestro planeta. Sin embargo, todavía hay muchas partes que no han sido exploradas directamente, principalmente porque a grandes profundidades encontramos condiciones que dificultan la investigación, como la falta de luz solar, las bajas temperaturas y la presión del agua. El mar lo podemos dividir en cinco zonas según su profundidad.',
    trans(tl, ctx) {
      const d1 = ctx.desde.el;
      const O = $('.p-oceano .i', d1);
      const portada = $('.portada', d1);
      const cO = D.caja(O);
      const cp = D.caja(portada);
      const origen = `${cO.x + cO.w / 2 - cp.x}px ${cO.y + cO.h / 2 - cp.y}px`;
      tl.to(portada, { scale: 7, transformOrigin: origen, opacity: 0, duration: 1.1, ease: 'power3.in' }, 0);
      tl.to($('.p-sub', d1), { opacity: 0, y: -30, duration: 0.5 }, 0);
      const anillo = $('.anillo71', this.el);
      tl.from(anillo, Object.assign(D.flipDesde(anillo, O), { duration: 1.4, ease: 'power3.inOut' }), 0.35);
      return 0.5;
    },
    entrar(tl, t) {
      const el = this.el;
      tl.fromTo($('.valor', el), { strokeDashoffset: 1696.46 }, { strokeDashoffset: 491.97, duration: 1.9, ease: 'power3.inOut' }, t + 0.3);
      D.contar(tl, $('.n71', el), 0, 71, t + 0.3, 1.9);
      tl.from($('.pct', el), { opacity: 0, x: -20, duration: 0.6 }, t + 1.0);
      aparecer(tl, $('.pie', el), t + 1.3, { y: 20 });
      D.encender(tl, $('.frase', el), t + 0.4, { stagger: 0.045 });
      aparecer(tl, $('.d02-der .etiqueta', el), t + 1.4, { y: 14, dur: 0.5 });
      D.cadena(tl, $$('.obst .pild', el), t + 1.6, 0.3);
      tl.from($$('.barras i', el), { scaleX: 0, transformOrigin: '0% 50%', duration: 0.7, stagger: 0.08, ease: 'power3.out' }, t + 2.5);
      D.revelar(tl, $('.cinco .mega', el), t + 2.7);
      aparecer(tl, $('.cinco .acento', el), t + 3.0, { y: 16 });
    },
  });

  def('d03', {
    mundo: { prof: 120, rayos: 1 },
    bat: { x: 1560, y: 200, s: 0.45, r: 0, luz: 0 },
    medidor: { v: 0, zona: 'Superficie' },
    dur: 8,
    notas: 'El mar se divide en cinco zonas según su profundidad: epipelágica (0–200 m), mesopelágica (200–1.000 m), batipelágica (1.000–4.000 m), abisopelágica (4.000–6.000 m) y hadal (por debajo de los 6.000 m).',
    trans(tl, ctx) {
      const d2 = ctx.desde.el;
      const barras = $$('.barras i', d2);
      $$('.fila', this.el).forEach((f, i) => {
        tl.from(f, Object.assign(D.flipDesde(f, barras[i]), { opacity: 1, duration: 1.15, ease: 'power3.inOut' }), 0.15 + i * 0.05);
      });
      tl.set(barras, { opacity: 0 }, 0.15);
      tl.to([$('.anillo71', d2), $('.frase', d2), $('.d02-der .etiqueta', d2), $('.obst', d2), $('.cinco .txt', d2)], {
        opacity: 0, y: -40, duration: 0.6, stagger: 0.04, ease: 'power2.in',
      }, 0);
      return 0.7;
    },
    entrar(tl, t) {
      const el = this.el;
      aparecer(tl, $('.cab .etiqueta', el), t, { y: 14, dur: 0.5 });
      D.revelar(tl, $('.tit .mega', el), t + 0.1);
      D.revelar(tl, $('.tit .acento', el), t + 0.35, { stagger: 0.06 });
      $$('li', el).forEach((li, i) => {
        const a = t + 0.35 + i * 0.12;
        tl.from(li, { borderTopColor: 'rgba(234,246,255,0)', duration: 0.6 }, a - 0.1);
        aparecer(tl, $('.n', li), a, { y: 0, x: -20, dur: 0.5 });
        D.revelar(tl, $('.nom', li), a, { dur: 0.9 });
        aparecer(tl, $('.rango', li), a + 0.1, { y: 0, x: 30, dur: 0.6 });
        aparecer(tl, $('.flecha', li), a + 0.2, { y: 0, x: -30, dur: 0.6 });
      });
      $$('.nom .i', el).slice(1).forEach((n, k) => {
        const a = t + 1.7 + k * 0.22;
        tl.to(n, { color: 'rgba(234,246,255,1)', duration: 0.2 }, a);
        tl.to(n, { color: 'rgba(234,246,255,0)', duration: 0.4 }, a + 0.25);
      });
      tl.to($$('.flecha', el), { x: 14, duration: 0.22, yoyo: true, repeat: 1, stagger: 0.22, ease: 'power2.out' }, t + 1.6);
    },
  });

  def('d04', {
    mundo: { prof: 150, rayos: 1 },
    bat: { x: 1580, y: 560, s: 0.62, flip: true, luz: 0.25 },
    medidor: { v: 200, zona: 'Epipelágica' },
    dur: 8,
    notas: 'Zona epipelágica: va desde la superficie hasta los 200 metros. Es la zona donde llega suficiente luz solar y encontramos animales como los delfines, tiburones, tortugas marinas y diferentes especies de peces.',
    trans(tl, ctx) {
      const d3 = ctx.desde.el;
      const nom1 = $('li:first-child .nom', d3);
      const tit = $('.z-nom', this.el);
      tl.from(tit, Object.assign(D.flipDesde(tit, nom1), { duration: 1.25, ease: 'power3.inOut' }), 0.1);
      tl.from($('.z-nom > .m > .i', this.el), { color: '#ffc531', duration: 1.2 }, 0.3);
      tl.set(nom1, { opacity: 0 }, 0.1);
      tl.to($$('li:not(:first-child)', d3), { y: 420, opacity: 0, duration: 0.9, stagger: 0.05, ease: 'power3.in' }, 0);
      tl.to([$('.cab', d3), $('li:first-child .n', d3), $('li:first-child .rango', d3), $('li:first-child .flecha', d3), $('li:first-child .fila', d3)], { opacity: 0, duration: 0.5 }, 0);
      return 0.8;
    },
    entrar(tl, t) {
      entrarZona(tl, t, this.el, { sinTitulo: true, luzDesde: '0%' });
    },
  });

  def('d05', {
    mundo: { prof: 700, rayos: 1 },
    bat: { x: 1590, y: 590, s: 0.62, flip: true, luz: 0.55 },
    medidor: { v: 1000, zona: 'Mesopelágica' },
    trans: 'bucear',
    dur: 8,
    notas: 'Zona mesopelágica: va desde los 200 hasta los 1.000 metros. Aquí la luz solar empieza a disminuir considerablemente y encontramos animales como los peces linterna y algunos calamares.',
    entrar(tl, t) {
      entrarZona(tl, t, this.el, { luzDesde: '100%' });
      tl.to($$('.foto-luz circle', this.el), { opacity: 0.25, duration: 0.5, yoyo: true, repeat: 7, stagger: 0.08, ease: 'sine.inOut' }, t + 2.2);
    },
  });

  def('d06', {
    mundo: { prof: 2500, rayos: 1 },
    bat: { x: 1600, y: 600, s: 0.62, flip: true, luz: 1 },
    medidor: { v: 4000, zona: 'Batipelágica' },
    trans: 'bucear',
    dur: 8,
    notas: 'Zona batipelágica: va desde los 1.000 hasta los 4.000 metros. A esta profundidad ya no llega la luz del Sol y encontramos animales como el pez pescador.',
    entrar(tl, t) {
      entrarZona(tl, t, this.el, { luzDesde: '30%' });
    },
  });

  def('d07', {
    mundo: { prof: 5000, rayos: 1 },
    bat: { x: 1600, y: 620, s: 0.62, flip: true, luz: 1 },
    medidor: { v: 6000, zona: 'Abisopelágica' },
    trans: 'bucear',
    dur: 8,
    notas: 'Zona abisopelágica: comprende desde los 4.000 hasta los 6.000 metros. En esta zona encontramos temperaturas muy bajas, una presión elevada y animales como los pepinos de mar y algunos crustáceos.',
    entrar(tl, t) {
      entrarZona(tl, t, this.el);
    },
  });

  def('d08', {
    mundo: { prof: 8000, rayos: 1 },
    bat: { x: 1600, y: 640, s: 0.62, flip: true, luz: 1 },
    medidor: { v: 6000, texto: '> 6.000', zona: 'Hadal' },
    trans: 'bucear',
    dur: 8,
    notas: 'Zona hadal: se encuentra por debajo de los 6.000 metros, principalmente en las fosas oceánicas. En esta zona pueden vivir organismos como pequeños crustáceos llamados anfípodos, que están adaptados a soportar presiones extremas.',
    entrar(tl, t) {
      entrarZona(tl, t, this.el);
    },
  });

  def('d09', {
    mundo: { prof: 2500, rayos: 1 },
    bat: { x: 1620, y: 270, s: 0.42, flip: true, luz: 0.8 },
    medidor: null,
    trans: 'subir',
    dur: 10,
    notas: 'A medida que descendemos en el océano, las condiciones ambientales cambian: ausencia de luz solar (por debajo de los 1.000 metros no llega la luz del Sol); aumento de la presión (aproximadamente por cada 10 metros que descendemos, la presión aumenta una atmósfera); temperaturas bajas (en muchas regiones alrededor de los 4 °C); y escasez de alimento (al no haber luz solar, muchos organismos dependen de los restos de materia orgánica que caen desde las capas superiores del océano).',
    prep(el) {
      $('.bicho', el).innerHTML = G.fauna.pescador;
    },
    entrar(tl, t) {
      const el = this.el;
      D.revelar(tl, $('.tit .acento', el), t, { stagger: 0.05 });
      D.revelar(tl, $('.tit .mega', el), t + 0.2, { stagger: 0.035 });
      const bals = $$('.bal', el);
      bals.forEach((b, k) => {
        const a = t + 0.6 + k * 0.32;
        tl.fromTo(b, { clipPath: 'inset(100% 0% 0% 0% round 28px)', y: 40 }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', y: 0, duration: 1, ease: 'expo.out' }, a);
        aparecer(tl, $('.dato', b), a + 0.5, { y: 20, dur: 0.6 });
        aparecer(tl, $('p', b), a + 0.7, { y: 10, dur: 0.6 });
      });
      const [b1, b2, b3, b4] = bals;
      tl.from($('.haz', b1), { scaleY: 0, transformOrigin: '50% 0%', duration: 1.1, ease: 'power2.out' }, t + 1.0);
      tl.from($('.corte', b1), { attr: { x2: 40 }, duration: 0.8 }, t + 1.4);
      aparecer(tl, $('.cota', b1), t + 1.8, { y: 0, dur: 0.5 });
      tl.to(E.mundo, { prof: 4200, duration: 1.8, ease: 'power2.inOut' }, t + 1.3);
      tl.from($$('.capas rect', b2), { scaleX: 0, transformOrigin: '50% 50%', duration: 0.45, stagger: 0.16, ease: 'back.out(1.6)' }, t + 1.3);
      tl.from($$('.etq text', b2), { opacity: 0, duration: 0.3, stagger: 0.16 }, t + 1.45);
      tl.from($$('.regla10 text', b2), { opacity: 0, duration: 0.3, stagger: 0.16 }, t + 1.45);
      tl.from($('.mercurio', b3), { attr: { y: 30, height: 140 }, duration: 1.7, ease: 'power2.inOut' }, t + 1.6);
      aparecer(tl, $('.cota', b3), t + 3.0, { y: 0, x: -10, dur: 0.5 });
      $$('.nieve circle', b4).forEach((c, i) => {
        tl.fromTo(c, { attr: { cy: -10 - i * 22 } }, { attr: { cy: 172 }, duration: 3.2, ease: 'none', repeat: 3 }, t + 1.9 + i * 0.1);
      });
      aparecer(tl, $('.bicho', b4), t + 2.0, { y: 0, dur: 0.6 });
    },
  });

  def('d10', {
    mundo: { prof: 3000, rayos: 1 },
    bat: null,
    medidor: null,
    dur: 10,
    notas: 'Melanocetus johnsonii: conocido también como rape abisal o pez diablo negro, es famoso por su aspecto aterrador y bioluminiscencia. Las hembras son más grandes que los machos, llegando a medir hasta 18 cm, mientras el macho hasta 3 cm. Vive en la zona abisal y batipelágica de los océanos, habitualmente entre los 200 y los 4.000 metros de profundidad. Características: cuerpo color negro o marrón oscuro; boca con dientes afilados; ilicium, prolongación en forma de caña de pescar en su cabeza que tiene un órgano bioluminiscente.',
    trans(tl, ctx) {
      const d = ctx.desde.el;
      tl.to(d, { opacity: 0, scale: 0.96, duration: 0.8, ease: 'power2.in' }, 0);
      tl.from($('.cebo', this.el), { scale: 0, opacity: 0, duration: 0.7, ease: 'back.out(3)' }, 0.45);
      tl.fromTo($('.f10', this.el), { clipPath: 'circle(0% at 44.6% 9.4%)' }, { clipPath: 'circle(142% at 44.6% 9.4%)', duration: 1.7, ease: 'power3.inOut' }, 0.8);
      return 1.0;
    },
    entrar(tl, t) {
      const el = this.el;
      tl.fromTo($('.f10 img', el), { scale: 1.3 }, { scale: 1, duration: 2.6, ease: 'power3.out' }, t);
      entrarEspecie(tl, t, el);
      $$('.talla', el).forEach((f, k) => {
        const a = t + 1.2 + k * 0.25;
        aparecer(tl, f, a, { y: 0, x: -10, dur: 0.5 });
        tl.from($('.barra i', f), { width: 0, duration: 1.2, ease: 'power3.out' }, a + 0.1);
        D.contar(tl, $('.cm', f), 0, k ? 3 : 18, a + 0.1, 1.2);
      });
      aparecer(tl, $('.rango-prof', el), t + 1.9, { y: 20 });
      D.cadena(tl, $$('.pildoras .pild', el), t + 2.3, 0.3);
      tl.to($('.cebo', el), { scale: 1.45, opacity: 0.7, duration: 0.9, yoyo: true, repeat: 7, ease: 'sine.inOut' }, t + 0.8);
    },
  });

  def('d11', {
    mundo: { prof: 1200, rayos: 1 },
    bat: null,
    medidor: null,
    trans: 'empujar',
    dur: 10,
    notas: 'Macropinna microstoma: conocido como pez duende o pez de cabeza transparente, es una especie inusual que habita a unos 600 metros de profundidad o más, allí donde la luz es escasa y el alimento. 2008 y su estudio a la anatomía: ojos tubulares, cúpula transparente, falsos ojos y tamaño.',
    entrar(tl, t) {
      const el = this.el;
      entrarEspecie(tl, t, el);
      D.clip(tl, $('.f11', el), t, 'der', 1.1);
      tl.fromTo($('.f11 .zoom', el), { scale: 1.7 }, { scale: 1, duration: 2.8, ease: 'power3.inOut' }, t + 0.1);
      $$('.dato-c', el).forEach((d, k) => aparecer(tl, d, t + 1.1 + k * 0.25, { y: 24 }));
      D.contar(tl, $('.dato-c b', el), 0, 600, t + 1.1, 1.4, (v) => '≈ ' + D.fmt(v) + ' m');
      D.encender(tl, $('.nota', el), t + 1.8);
      D.trazar(tl, $$('.llamadas path', el), t + 2.9, 0.6, { stagger: 0.25 });
      tl.from($$('.llamadas circle', el), { scale: 0, transformOrigin: '50% 50%', duration: 0.4, stagger: 0.25, ease: 'back.out(3)' }, t + 2.8);
      aparecer(tl, $$('.rot', el), t + 3.2, { y: 0, x: -24, stagger: 0.25, dur: 0.6 });
    },
  });

  def('d12', {
    mundo: { prof: 2000, rayos: 1 },
    bat: null,
    medidor: null,
    trans: 'empujar',
    dur: 10,
    notas: 'Vampyroteuthis infernalis: conocido como calamar vampiro, combina rasgos únicos de los pulpos y los calamares, junto con adaptaciones extremas para sobrevivir en las profundidades marinas. Alcanza una longitud máxima de 28 a 30 centímetros. Características anatómicas externas: ojos gigantes, aletas en la cabeza, brazos y membrana, filamentos sensoriales. Internas: sin bolsa de tinta, metabolismo lento.',
    entrar(tl, t) {
      const el = this.el;
      D.clip(tl, $('.f12', el), t, 'arriba', 1.2);
      tl.fromTo($('.f12 img', el), { scale: 1.25 }, { scale: 1, duration: 3, ease: 'power3.out' }, t);
      entrarEspecie(tl, t, el);
      tl.from($('.c1', el), { x: -80, opacity: 0, duration: 0.9, ease: 'power3.out' }, t + 1.0);
      tl.from($('.c2', el), { x: 80, opacity: 0, duration: 0.9, ease: 'power3.out' }, t + 1.0);
      aparecer(tl, $('.mezcla .txt', el), t + 1.4, { y: 0, x: -20 });
      tl.from($('.regla30 .pista', el), { scaleX: 0, transformOrigin: '0% 50%', duration: 0.9, ease: 'power3.inOut' }, t + 1.6);
      tl.from($('.regla30 .rango', el), { scaleY: 0, duration: 0.5, ease: 'back.out(3)' }, t + 2.4);
      aparecer(tl, $('.regla30 .marcas', el), t + 1.9, { y: 10, dur: 0.5 });
      aparecer(tl, $('.regla30 b', el), t + 2.5, { y: 0, x: -20 });
      aparecer(tl, $$('.dos-col .etiqueta', el), t + 2.6, { y: 10, stagger: 0.2, dur: 0.5 });
      aparecer(tl, $$('.dos-col li', el), t + 2.8, { y: 0, x: -20, stagger: 0.1, dur: 0.5 });
    },
  });

  def('d13', {
    mundo: { prof: 2500, rayos: 1 },
    bat: null,
    medidor: null,
    trans: 'empujar',
    dur: 10,
    notas: 'Bathynomus giganteus: es conocido como isópodo gigante antártico; este puede alcanzar hasta los 9 cm de longitud, aunque condiciones como el poco oxígeno, bajos niveles de luz y agua helada pueden afectar a que no crezcan mucho. Características anatómicas: cuerpo en tres partes (cabeza – cefalón, tórax – pereon, abdomen – pleon), exoesqueleto, 14 patas marchadoras, apéndices nadadores y branquias, ojos y antenas.',
    entrar(tl, t) {
      const el = this.el;
      D.clip(tl, $('.f13', el), t, 'abajo', 1.2);
      tl.fromTo($('.f13 img', el), { scale: 1.2 }, { scale: 1, duration: 3, ease: 'power3.out' }, t);
      $$('.parte', el).forEach((p, k) => {
        tl.from($('i', p), { scaleY: 0, transformOrigin: '50% 0%', duration: 0.6, ease: 'power3.out' }, t + 1.0 + k * 0.3);
        aparecer(tl, $('span', p), t + 1.2 + k * 0.3, { y: 0, x: -16, dur: 0.5 });
      });
      entrarEspecie(tl, t, el);
      aparecer(tl, $('.talla9', el), t + 1.2, { y: 20 });
      D.contar(tl, $('.talla9 .cm', el), 0, 9, t + 1.2, 1.2);
      aparecer(tl, $$('.frenos .fr', el), t + 1.8, { y: 16, stagger: 0.18, dur: 0.5 });
      aparecer(tl, $('.frenos .flecha', el), t + 2.4, { y: 0, x: -16, dur: 0.4 });
      aparecer(tl, $('.frenos .res', el), t + 2.5, { y: 10, dur: 0.6 });
      D.cadena(tl, $$('.pildoras .pild', el), t + 2.8, 0.22);
    },
  });

  def('d14', {
    mundo: { prof: 5000, rayos: 1 },
    bat: null,
    medidor: null,
    trans: 'fundir',
    dur: 11,
    notas: 'Bioluminiscencia: es la capacidad que tienen los seres vivos para emitir y producir su luz propia a través de reacciones químicas naturales. Es un fenómeno común en las profundidades del océano. ¿Cómo se produce? Se genera mediante una reacción bioquímica interna que requiere de dos componentes principales: luciferina (molécula o sustrato que cuando se oxida emite energía en forma de luz) y luciferasa (enzima que acelera y cataliza esa reacción química al entrar en contacto con el oxígeno). ¿Para qué la utilizan los organismos? Es una herramienta de supervivencia adaptativa: atraer presas, defensa y distracción, camuflaje (contrailuminación).',
    entrar(tl, t) {
      const el = this.el;
      tl.fromTo($('.medusa', el), { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 2.2, ease: 'power2.out' }, t);
      tl.to($('.medusa img', el), { y: -26, duration: 3, yoyo: true, repeat: 3, ease: 'sine.inOut' }, t + 1);
      D.revelar(tl, $('.tit', el), t + 0.3, { stagger: 0.03 });
      tl.fromTo($('.tit', el), { textShadow: '0 0 0px rgba(60,242,228,0)' }, { textShadow: '0 0 40px rgba(60,242,228,0.35)', duration: 1.5 }, t + 1.0);
      D.encender(tl, $('.def', el), t + 0.9, { stagger: 0.04 });
      aparecer(tl, $('.n-a', el), t + 1.7, { y: 30, dur: 0.6 });
      tl.from($('.op', el), { opacity: 0, scale: 0.5, duration: 0.4 }, t + 1.95);
      aparecer(tl, $('.n-b', el), t + 2.1, { y: 30, dur: 0.6 });
      aparecer(tl, $('.flecha-cat span', el), t + 2.4, { y: -10, dur: 0.5 });
      D.trazar(tl, $$('.flecha-cat path', el), t + 2.5, 0.6, { stagger: 0.3 });
      tl.from($('.n-luz', el), { scale: 0, opacity: 0, duration: 0.9, ease: 'back.out(2.2)' }, t + 3.1);
      tl.to($('.n-luz', el), { boxShadow: '0 0 150px 54px rgba(60,242,228,0.6)', duration: 1.2, yoyo: true, repeat: 3, ease: 'sine.inOut' }, t + 3.8);
      aparecer(tl, $('.usos .etiqueta', el), t + 3.4, { y: 10, dur: 0.5 });
      $$('.uso', el).forEach((u, k) => {
        const a = t + 3.6 + k * 0.22;
        tl.from(u, { borderTopColor: 'rgba(234,246,255,0)', duration: 0.5 }, a);
        aparecer(tl, $('b', u), a, { y: 40, dur: 0.8 });
        aparecer(tl, $$('.n, small', u), a + 0.2, { y: 10, dur: 0.6 });
      });
    },
  });

  def('d15', {
    mundo: { prof: 4000, rayos: 0 },
    bat: null,
    medidor: null,
    dur: 10,
    notas: 'Lo que todavía no conocemos. Especies aún no documentadas. Magnitud del desconocimiento: los científicos afirman que hay cerca de 2 millones de especies marinas en el planeta, pero que apenas se han descrito alrededor del 10 % de ellas. Microorganismos y fauna abisal: la mayor parte a descubrir son invertebrados, virus marinos, bacterias y organismos de aguas profundas que tienen un desarrollo extremo como la bioluminiscencia y resistencia a presiones aplastantes.',
    prep(el) {
      const on = [3, 17, 22, 38, 45, 51, 64, 79, 86, 93];
      const r = $('.rejilla', el);
      for (let i = 0; i < 100; i++) {
        const p = document.createElement('i');
        if (on.includes(i)) p.className = 'on';
        r.appendChild(p);
      }
    },
    trans(tl, ctx) {
      const d = ctx.desde.el;
      const luz = $('.n-luz', d);
      tl.fromTo($('.fondo-foto', this.el), { opacity: 0 }, { opacity: 1, duration: 1.3 }, 0.5);
      tl.fromTo($('.velo15', this.el), { opacity: 0 }, { opacity: 1, duration: 1.3 }, 0.5);
      tl.to(Array.from(d.children).filter((c) => !c.classList.contains('ecuacion')), { opacity: 0, duration: 0.6 }, 0);
      tl.to($$('.ecuacion > :not(.n-luz)', d), { opacity: 0, duration: 0.5 }, 0);
      tl.to(luz, { scale: 0.3, opacity: 0, duration: 0.5, ease: 'power2.in' }, 0.55);
      $$('.rejilla i.on', this.el).forEach((p, i) => {
        tl.from(p, Object.assign(D.flipDesde(p, luz), { duration: 1.1, ease: 'power3.inOut' }), 0.6 + i * 0.05);
      });
      return 0.8;
    },
    entrar(tl, t) {
      const el = this.el;
      tl.fromTo($('.fondo-foto img', el), { scale: 1.18 }, { scale: 1, duration: 12, ease: 'none' }, t - 0.3);
      aparecer(tl, $('.col .etiqueta', el), t, { y: 14, dur: 0.5 });
      aparecer(tl, $('.cifra', el), t + 0.2, { y: 30 });
      D.contar(tl, $('.cifra .num', el), 0, 2000000, t + 0.3, 2.2);
      aparecer(tl, $('.col .txt', el), t + 1.0, { y: 20 });
      tl.from($$('.rejilla i:not(.on)', el), { opacity: 0, scale: 0.2, duration: 0.5, stagger: { each: 0.012, from: 'random' }, ease: 'back.out(2)' }, t + 0.4);
      aparecer(tl, $('.pct10', el), t + 1.7, { y: 24 });
      D.contar(tl, $('.pct10 .num', el), 0, 10, t + 1.7, 1.2);
      aparecer(tl, $('.falta .etiqueta', el), t + 2.3, { y: 10, dur: 0.5 });
      D.cadena(tl, $$('.falta .pild', el), t + 2.4, 0.28);
      tl.to($$('.rejilla i.on', el), { scale: 1.3, duration: 0.8, yoyo: true, repeat: 5, stagger: 0.07, ease: 'sine.inOut' }, t + 2.6);
    },
  });

  def('d16', {
    mundo: { prof: 3500, rayos: 0 },
    bat: null,
    medidor: null,
    trans: 'chevron',
    dur: 11,
    notas: '¿Qué son las fuentes hidrotermales? Son aberturas que se encuentran en el fondo del océano, generalmente cerca de zonas volcánicas submarinas, por donde sale agua caliente rica en minerales y sustancias químicas. ¿Cómo funcionan? 1. El agua del océano entra por grietas de la corteza terrestre. 2. Se calienta al entrar en contacto con rocas calientes y magma. 3. El agua absorbe minerales y sustancias químicas. 4. Finalmente, sale nuevamente por el fondo marino formando columnas de agua caliente.',
    prep(el) {
      $$('.flujo', el).forEach((f) => {
        const c = f.cloneNode();
        c.setAttribute('class', 'flujo-mov');
        f.after(c);
      });
    },
    entrar(tl, t) {
      const el = this.el;
      D.revelar(tl, $$('.tit [data-split]', el), t, { stagger: 0.03 });
      D.encender(tl, $('.def', el), t + 0.6, { stagger: 0.04 });
      tl.from($('.corteza', el), { opacity: 0, y: 40, duration: 1 }, t + 0.2);
      tl.from($('.magma', el), { opacity: 0, scale: 0.6, transformOrigin: '50% 50%', duration: 1.2 }, t + 0.5);
      D.trazar(tl, $$('.grieta', el), t + 0.7, 0.8, { stagger: 0.15 });
      tl.from($('.chimenea', el), { scaleY: 0, transformOrigin: '50% 100%', duration: 0.8, ease: 'power3.out' }, t + 0.9);
      const pop = (sel, at) => tl.from($(sel, el), { scale: 0, transformOrigin: '50% 50%', duration: 0.5, ease: 'back.out(2.5)' }, at);
      const li = (sel, at) => aparecer(tl, $(sel, el), at, { y: 0, x: -24, dur: 0.6 });
      pop('.paso.p1', t + 1.3); D.trazar(tl, $('.f1', el), t + 1.4, 1.0, { ease: 'power1.inOut' }); li('.ps1', t + 1.4);
      pop('.paso.p2', t + 2.4); D.trazar(tl, $('.f2', el), t + 2.4, 0.9, { ease: 'power1.inOut' }); li('.ps2', t + 2.4);
      tl.to($('.magma', el), { opacity: 0.65, duration: 0.5, yoyo: true, repeat: 5, ease: 'sine.inOut' }, t + 2.6);
      pop('.paso.p3', t + 3.3); D.trazar(tl, $('.f3', el), t + 3.3, 0.7, { ease: 'power1.inOut' }); li('.ps3', t + 3.3);
      tl.from($$('.pluma circle', el), { scale: 0, opacity: 0, y: 40, transformOrigin: '50% 50%', duration: 0.8, stagger: 0.12, ease: 'power2.out' }, t + 3.9);
      pop('.paso.p4', t + 4.0); li('.ps4', t + 4.0);
      tl.to($$('.pluma circle', el), { y: -16, duration: 1.6, yoyo: true, repeat: 3, stagger: 0.15, ease: 'sine.inOut' }, t + 4.8);
      tl.fromTo($$('.flujo-mov', el), { opacity: 0 }, { opacity: 1, duration: 0.5 }, t + 4.4);
      tl.fromTo($$('.flujo-mov', el), { strokeDashoffset: 0 }, { strokeDashoffset: -520, duration: 6, ease: 'none' }, t + 4.4);
      D.clip(tl, $('.f16', el), t + 4.3, 'izq', 1.0);
    },
  });

  def('d17', {
    mundo: { prof: 3500, rayos: 0 },
    bat: null,
    medidor: null,
    trans: 'empujar',
    dur: 9,
    notas: 'Organismos que viven alrededor de las fuentes hidrotermales: gusanos tubícolas gigantes; almejas y mejillones; camarones y cangrejos; caracoles y microorganismos.',
    entrar(tl, t) {
      const el = this.el;
      D.revelar(tl, $('.tit', el), t, { stagger: 0.035 });
      D.revelar(tl, $('.sub', el), t + 0.3, { stagger: 0.05 });
      tl.fromTo($('.f17', el), { x: 320, rotation: 12, opacity: 0 }, { x: 0, rotation: 3, opacity: 1, duration: 1.2, ease: 'power3.out' }, t + 0.1);
      tl.fromTo($('.f17 img', el), { scale: 1.25 }, { scale: 1, duration: 3.2, ease: 'power2.out' }, t + 0.1);
      const giros = [-2, 1.5, 1, -1.5];
      $$('.tarj', el).forEach((c, k) => {
        tl.fromTo(c, { y: 140, rotation: k % 2 ? 12 : -12, opacity: 0 }, { y: 0, rotation: giros[k], opacity: 1, duration: 0.9, ease: 'back.out(1.4)' }, t + 0.7 + k * 0.18);
        D.trazar(tl, $$('.ico path, .ico circle', c), t + 1.1 + k * 0.18, 0.8);
      });
    },
  });

  def('d18', {
    mundo: { prof: 7000, rayos: 0 },
    bat: null,
    medidor: null,
    trans: 'zoomOut',
    dur: 10,
    notas: '¿Qué es la fosa de las Marianas? La fosa de las Marianas es una enorme depresión alargada y profunda del fondo del océano Pacífico. Se formó por el movimiento de las placas tectónicas, cuando la placa del Pacífico se hunde debajo de la placa de las Marianas, en un proceso llamado subducción. Está formada por: rocas de la corteza oceánica, sedimentos acumulados en el fondo marino y materiales minerales provenientes de la actividad geológica.',
    entrar(tl, t) {
      const el = this.el;
      tl.fromTo($('.fondo-foto img', el), { scale: 1.3 }, { scale: 1.05, duration: 10, ease: 'power1.out' }, t - 0.4);
      D.revelar(tl, $$('.tit [data-split]', el), t + 0.1, { stagger: 0.03 });
      D.encender(tl, $('.def', el), t + 0.7);
      aparecer(tl, $('.col .etiqueta', el), t + 1.4, { y: 10, dur: 0.5 });
      D.cadena(tl, $$('.col .pild', el), t + 1.5, 0.3);
      aparecer(tl, $('.subduccion', el), t + 0.6, { y: 40, dur: 0.9 });
      tl.from($('.placa-mar', el), { x: 140, opacity: 0, duration: 1, ease: 'power3.out' }, t + 0.9);
      tl.from($('.placa-pac', el), { x: -220, opacity: 0, duration: 1.2, ease: 'power3.out' }, t + 0.9);
      tl.to($('.placa-pac', el), { x: 26, y: 12, duration: 2.2, yoyo: true, repeat: 3, ease: 'sine.inOut' }, t + 2.1);
      tl.from($('.fosa', el), { scale: 0, transformOrigin: '50% 0%', duration: 0.6 }, t + 1.9);
      D.trazar(tl, $$('.mov', el), t + 1.8, 0.6, { stagger: 0.15 });
      aparecer(tl, $$('.subduccion text', el), t + 2.0, { y: 10, stagger: 0.15, dur: 0.5 });
      D.trazar(tl, $('.guia', el), t + 2.4, 0.4);
      aparecer(tl, $('.subduccion .pie', el), t + 2.7, { y: 10, dur: 0.6 });
    },
  });

  def('d19', {
    mundo: { prof: 11000, rayos: 0 },
    bat: { x: 1660, y: 560, s: 0.5, flip: true, luz: 1 },
    medidor: { v: 10935, zona: 'Abismo Challenger', dur: 3.2, retraso: 0.6 },
    trans: 'zoomIn',
    transOpc: { origen: '1330px 586px' },
    dur: 10,
    notas: '¿Qué es el abismo Challenger? Es el punto más profundo conocido de los océanos y se encuentra en el extremo sur de la fosa de las Marianas, en el océano Pacífico. Su profundidad estimada es de aproximadamente 10.935 metros (10,9 kilómetros). ¿Por qué se llama Challenger? Recibe este nombre por el barco británico HMS Challenger, cuya expedición realizó mediciones de profundidad en esa zona en 1875.',
    entrar(tl, t) {
      const el = this.el;
      tl.fromTo($('.ojo', el), { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 0.5, duration: 2.2, ease: 'power3.out' }, t - 0.3);
      tl.to($('.ojo img', el), { rotation: 25, duration: 14, ease: 'none' }, t);
      aparecer(tl, $('.centro .etiqueta', el), t + 0.2, { y: 14, dur: 0.5 });
      tl.from($('.cifra', el), { opacity: 0, scale: 0.9, duration: 0.8 }, t + 0.2);
      D.contar(tl, $('.cifra .num', el), 6000, 10935, t + 0.3, 2.8);
      aparecer(tl, $('.cifra small', el), t + 1.2, { y: 0, x: -20 });
      aparecer(tl, $('.sub', el), t + 2.2, { y: 20 });
      D.trazar(tl, $('.perfil', el), t + 2.4, 1.2);
      tl.from($('.pin', el), { scale: 0, transformOrigin: '50% 50%', duration: 0.5, ease: 'back.out(3)' }, t + 3.4);
      tl.fromTo($('.onda', el), { scale: 1, opacity: 0.9, transformOrigin: '50% 50%' }, { scale: 4, opacity: 0, duration: 1.4, repeat: 4, ease: 'power1.out' }, t + 3.5);
      aparecer(tl, $('.ubica p', el), t + 2.8, { y: 10 });
      aparecer(tl, $('.nombre', el), t + 3.0, { y: 30 });
      D.trazar(tl, $$('.barco path', el), t + 3.1, 0.8);
      D.contar(tl, $('.anio', el), 1800, 1875, t + 3.2, 1.3, (v) => String(Math.round(v)));
    },
  });

  def('d20', {
    mundo: { prof: 3000, rayos: 0 },
    bat: { x: 460, y: 600, s: 0.35, luz: 0, salir: true },
    medidor: null,
    trans: 'fundir',
    dur: 9,
    notas: '¿Cómo exploramos las profundidades? Submarinos: son vehículos especiales que pueden sumergirse a grandes profundidades y transportar científicos. Robots submarinos: se controlan desde barcos y tienen cámaras, luces y brazos mecánicos para investigar el fondo marino.',
    entrar(tl, t) {
      const el = this.el;
      D.revelar(tl, $$('.tit [data-split]', el), t, { stagger: 0.06 });
      $$('.chev', el).forEach((c, k) => {
        const a = t + 0.5 + k * 0.35;
        tl.fromTo(c, { clipPath: 'polygon(0% 0%, 0% 0%, 16% 50%, 0% 100%, 0% 100%, 16% 50%)' }, {
          clipPath: 'polygon(0% 0%, 84% 0%, 100% 50%, 84% 100%, 0% 100%, 16% 50%)', duration: 1.2, ease: 'expo.inOut',
        }, a);
        tl.fromTo($('img', c), { xPercent: -12, scale: 1.2 }, { xPercent: 0, scale: 1, duration: 2.2, ease: 'power3.out' }, a);
      });
      aparecer(tl, $$('.flechitas i', el), t + 0.3, { y: 0, x: -30, stagger: 0.12, dur: 0.5 });
      tl.to($$('.flechitas i', el), { opacity: 0.3, duration: 0.4, stagger: 0.15, yoyo: true, repeat: 7 }, t + 1.3);
      $$('.txt20', el).forEach((x, k) => {
        aparecer(tl, $('b', x), t + 1.4 + k * 0.35, { y: 30 });
        aparecer(tl, $('p', x), t + 1.6 + k * 0.35, { y: 16 });
      });
    },
  });

  def('d21', {
    mundo: { prof: 800, rayos: 1 },
    bat: null,
    medidor: null,
    trans: 'chevron',
    dur: 10,
    notas: 'Tipos de robots submarinos. ROV (vehículo operado remotamente): es un robot submarino controlado desde un barco mediante cables, que permite explorar las profundidades del mar. AUV (vehículo submarino autónomo): es un robot submarino que realiza misiones programadas sin necesidad de estar conectado a un barco.',
    entrar(tl, t) {
      const el = this.el;
      aparecer(tl, $('.et21', el), t, { y: 10, dur: 0.5 });
      tl.from($('.linea-mar', el), { scaleX: 0, duration: 1.2, ease: 'expo.inOut' }, t + 0.1);
      tl.from($('.barco21', el), { y: -40, opacity: 0, duration: 0.8, ease: 'back.out(2)' }, t + 0.6);
      tl.to($('.barco21', el), { y: 4, rotation: 1.5, duration: 1.6, yoyo: true, repeat: 5, ease: 'sine.inOut' }, t + 1.4);
      D.clip(tl, $('.f-rov', el), t + 0.8, 'abajo', 1.0);
      D.trazar(tl, $('.cable', el), t + 1.2, 0.9);
      aparecer(tl, $('.t-rov', el), t + 1.5, { y: 24 });
      tl.from($('.vs', el), { opacity: 0, scale: 0.6, duration: 0.6 }, t + 1.6);
      D.clip(tl, $('.f-auv', el), t + 1.8, 'centro', 1.0);
      aparecer(tl, $('.t-auv', el), t + 2.2, { y: 24 });
      const ruta = $('.ruta', el);
      tl.fromTo(ruta, { opacity: 0 }, { opacity: 1, duration: 0.8 }, t + 2.2);
      tl.to(ruta, { strokeDashoffset: -420, duration: 7, ease: 'none' }, t + 2.2);
      tl.from($$('.wp', el), { scale: 0, transformOrigin: '50% 50%', duration: 0.4, stagger: 0.12, ease: 'back.out(3)' }, t + 2.4);
      const punto = $('.punto-ruta', el);
      const L = ruta.getTotalLength();
      const o = { p: 0 };
      const mover = () => {
        const pt = ruta.getPointAtLength((o.p % 1) * L);
        punto.style.transform = `translate(${pt.x}px, ${pt.y}px)`;
      };
      mover();
      tl.fromTo(punto, { opacity: 0 }, { opacity: 1, duration: 0.4 }, t + 2.5);
      tl.to(o, { p: 2, duration: 9, ease: 'none', onUpdate: mover }, t + 2.5);
    },
  });

  def('d22', {
    mundo: { prof: 0, rayos: 1, sup: 30 },
    bat: { x: 1600, y: 500, s: 0.6, r: -6, luz: 0 },
    medidor: { v: 0, zona: 'Superficie', dur: 2.4 },
    trans: 'subir',
    dur: 9,
    notas: 'Cierre: 71 % del planeta es océano · 5 zonas de profundidad · 10.935 m en el abismo Challenger · cerca del 10 % de las especies marinas descritas. ¡Gracias!',
    entrar(tl, t) {
      const el = this.el;
      D.revelar(tl, $('.tit', el), t + 0.4, { dur: 1.2 });
      D.ecos(tl, $('.tit', el), t + 1.0);
      $$('.res', el).forEach((r, k) => {
        const a = t + 1.3 + k * 0.2;
        tl.from(r, { borderTopColor: 'rgba(234,246,255,0)', duration: 0.5 }, a);
        aparecer(tl, $('b', r), a, { y: 40, dur: 0.8 });
        aparecer(tl, $('span', r), a + 0.3, { y: 10, dur: 0.6 });
      });
      tl.to('#bat', { rotation: 4, duration: 2, yoyo: true, repeat: 3, ease: 'sine.inOut' }, t + 1.6);
    },
  });

  window.DIAPOS = S;
})();
