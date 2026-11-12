(function () {
  const E = {};
  const mundo = (E.mundo = { prof: 0, cam: 0, sup: -300, rayos: 0, nieve: 1, oscuro: 0, t: 0 });
  const medidor = (E.medidor = { v: 0, a: 0, texto: '', zona: 'Superficie' });

  const RAMPA = [
    [0, [42, 167, 223], [10, 106, 168]],
    [200, [13, 95, 151], [6, 60, 107]],
    [1000, [6, 48, 90], [3, 26, 52]],
    [4000, [3, 22, 44], [1, 10, 22]],
    [6000, [2, 13, 28], [0, 5, 11]],
    [11000, [1, 6, 16], [0, 0, 0]],
  ];

  const mezclar = (a, b, k) => a.map((v, i) => Math.round(v + (b[i] - v) * k));
  const colorProf = (p) => {
    for (let i = 0; i < RAMPA.length - 1; i++) {
      const [p0, a0, b0] = RAMPA[i];
      const [p1, a1, b1] = RAMPA[i + 1];
      if (p <= p1) {
        const k = Math.max(0, Math.min(1, (p - p0) / (p1 - p0)));
        return [mezclar(a0, a1, k), mezclar(b0, b1, k)];
      }
    }
    return [RAMPA[RAMPA.length - 1][1], RAMPA[RAMPA.length - 1][2]];
  };
  const rgb = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;

  let ctx, lienzo, fondoColor, rayos, superficie, ola, olaBrillo, brillo, oscuro, batFlota, regla, lecturaNum, lecturaZona, lecturaUni, medidorEl;
  let semilla = 11;
  const rnd = () => (semilla = (semilla * 16807) % 2147483647) / 2147483647;
  const P = [];
  let sprite;
  let camPrevia = 0;

  E.iniciar = () => {
    lienzo = document.getElementById('particulas');
    ctx = lienzo.getContext('2d');
    fondoColor = document.getElementById('fondo-color');
    rayos = Array.from(document.querySelectorAll('#rayos i'));
    superficie = document.getElementById('superficie');
    ola = document.getElementById('ola');
    olaBrillo = document.getElementById('ola-brillo');
    brillo = document.getElementById('brillo');
    oscuro = document.getElementById('oscuro');
    batFlota = document.getElementById('bat-flota');
    regla = document.getElementById('regla');
    medidorEl = document.getElementById('medidor');
    lecturaNum = document.querySelector('#medidor .num');
    lecturaUni = document.querySelector('#medidor .uni');
    lecturaZona = document.querySelector('#medidor .zona');

    for (let i = 0; i < 190; i++) {
      P.push({
        x: rnd() * 1920,
        y: rnd() * 1100,
        r: 0.6 + rnd() * 2.1,
        v: 4 + rnd() * 14,
        f: 0.25 + rnd() * 0.85,
        fase: rnd() * 6.283,
        bio: rnd() < 0.2,
      });
    }

    sprite = document.createElement('canvas');
    sprite.width = sprite.height = 64;
    const s = sprite.getContext('2d');
    const g = s.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(190,255,250,1)');
    g.addColorStop(0.25, 'rgba(60,242,228,.75)');
    g.addColorStop(1, 'rgba(60,242,228,0)');
    s.fillStyle = g;
    s.fillRect(0, 0, 64, 64);

    let marcas = '';
    for (let y = 0; y <= 1480; y += 20) {
      const mayor = y % 100 === 0;
      marcas += `<line x1="${mayor ? 6 : 22}" x2="40" y1="${y}" y2="${y}" />`;
    }
    regla.innerHTML = marcas;
  };

  const olaRuta = (t, amp, base) => {
    let d = `M0 0 H1920 V${base}`;
    for (let x = 1920; x >= 0; x -= 40) {
      const y = base + Math.sin(x * 0.011 + t * 1.3) * amp + Math.sin(x * 0.024 - t * 0.9) * amp * 0.55;
      d += ` L${x} ${y.toFixed(1)}`;
    }
    return d + ' Z';
  };
  const lineaOla = (t, amp, base) => {
    let d = '';
    for (let x = 0; x <= 1920; x += 40) {
      const y = base + Math.sin(x * 0.011 + t * 1.3) * amp + Math.sin(x * 0.024 - t * 0.9) * amp * 0.55;
      d += (x ? ' L' : 'M') + x + ' ' + y.toFixed(1);
    }
    return d;
  };

  E.dibujar = () => {
    const t = mundo.t;
    const [arriba, abajo] = colorProf(mundo.prof);
    fondoColor.style.background = `linear-gradient(180deg, ${rgb(arriba)} 0%, ${rgb(abajo)} 100%)`;

    const luzRayos = mundo.rayos * Math.max(0, 1 - mundo.prof / 1100);
    rayos.forEach((r, i) => {
      r.style.opacity = (luzRayos * (0.55 + 0.45 * Math.sin(t * 0.7 + i * 1.7))).toFixed(3);
      r.style.transform = `rotate(${(-14 + i * 6 + Math.sin(t * 0.35 + i) * 3).toFixed(2)}deg)`;
    });

    superficie.style.transform = `translateY(${(mundo.sup - 1080).toFixed(1)}px)`;
    superficie.style.display = mundo.sup > -120 ? 'block' : 'none';
    if (mundo.sup > -120) {
      ola.setAttribute('d', olaRuta(t, 9, 1080));
      olaBrillo.setAttribute('d', lineaOla(t, 9, 1080));
    }
    brillo.style.transform = `translateY(${mundo.sup.toFixed(1)}px)`;
    brillo.style.opacity = Math.max(0, Math.min(1, (mundo.sup + 300) / 400)).toFixed(3);
    oscuro.style.opacity = mundo.oscuro.toFixed(3);

    ctx.clearRect(0, 0, 1920, 1080);
    const vel = mundo.cam - camPrevia;
    camPrevia = mundo.cam;
    const bioA = Math.max(0, Math.min(1, (mundo.prof - 500) / 1500));
    const nieveA = mundo.nieve * (mundo.sup > 0 ? Math.max(0, 1 - mundo.sup / 700) : 1);
    ctx.lineCap = 'round';
    for (const p of P) {
      let y = (p.y + t * p.v * 0.6 - mundo.cam * p.f) % 1100;
      if (y < 0) y += 1100;
      y -= 10;
      if (y < mundo.sup) continue;
      const x = p.x + Math.sin(t * 0.4 + p.fase) * 14;
      if (p.bio) {
        const a = bioA * (0.45 + 0.55 * Math.sin(t * 1.6 + p.fase));
        if (a > 0.02) {
          ctx.globalAlpha = a;
          const s = 16 + p.r * 8;
          ctx.drawImage(sprite, x - s / 2, y - s / 2, s, s);
        }
      } else {
        ctx.globalAlpha = 0.55 * nieveA * (0.35 + p.f * 0.65);
        const estela = p.r > 1.2 ? Math.min(60, Math.abs(vel) * p.f * 0.8) : 0;
        if (estela > 3) {
          ctx.globalAlpha *= 0.6;
          ctx.strokeStyle = '#d8f2ff';
          ctx.lineWidth = p.r * 1.4;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + Math.sign(vel) * estela);
          ctx.stroke();
        } else {
          ctx.fillStyle = '#d8f2ff';
          ctx.beginPath();
          ctx.arc(x, y, p.r, 0, 6.283);
          ctx.fill();
        }
      }
    }
    ctx.globalAlpha = 1;

    batFlota.style.transform = `translateY(${(Math.sin(t * 1.1) * 7).toFixed(2)}px) rotate(${(Math.sin(t * 0.8) * 1.6).toFixed(2)}deg)`;

    regla.style.transform = `translateY(${(-((mundo.cam * 0.6) % 100) - 100).toFixed(1)}px)`;
    medidorEl.style.opacity = medidor.a.toFixed(3);
    if (medidor.texto) {
      lecturaNum.textContent = medidor.texto;
    } else {
      lecturaNum.textContent = D.fmt(Math.round(medidor.v));
    }
    lecturaZona.textContent = medidor.zona;
  };

  window.E = E;
})();
