(function () {
  const G = {};

  G.fauna = {
    delfin: `
      <path d="M30 66C60 48 100 36 140 40C160 42 172 50 178 56L197 60L178 64C160 74 120 80 90 78C60 76 44 72 30 70Z"/>
      <path d="M34 67C24 58 14 52 3 50C10 58 14 64 18 68C12 74 8 80 6 89C16 84 24 78 34 70Z"/>
      <path d="M100 40C104 27 112 19 125 13C120 24 120 32 124 41Z"/>
      <path d="M122 74C118 84 110 92 99 97C105 88 107 80 109 75Z"/>
      <circle class="hueco" cx="163" cy="56" r="2.6"/>`,
    tiburon: `
      <path d="M24 62C54 50 104 44 152 50C172 52 188 58 198 64C188 70 172 72 152 72C112 77 62 75 30 68Z"/>
      <path d="M32 64C24 52 16 38 7 23C12 40 16 54 20 64C16 70 12 78 7 87C18 80 26 72 34 68Z"/>
      <path d="M98 49C106 37 112 25 118 12C120 28 124 40 131 49Z"/>
      <path d="M124 72C120 82 112 92 99 101C108 88 112 80 114 72Z"/>
      <path d="M57 53L64 43L69 53Z"/><path d="M50 69L56 77L61 69Z"/>
      <circle class="hueco" cx="176" cy="60" r="2.4"/>
      <path class="trazo-hueco" d="M156 56v10M161 55v11M166 56v9"/>`,
    tortuga: `
      <ellipse cx="96" cy="60" rx="44" ry="32"/>
      <path d="M137 52C146 49 157 51 163 56C167 60 167 64 163 66C157 71 146 71 137 68Z"/>
      <path d="M117 38C131 22 152 11 177 9C161 22 144 34 128 46Z"/>
      <path d="M117 82C131 98 152 109 177 111C161 98 144 86 128 74Z"/>
      <path d="M64 37C56 29 46 25 37 27C44 34 52 40 60 44Z"/>
      <path d="M64 83C56 91 46 95 37 93C44 86 52 80 60 76Z"/>
      <path d="M53 60L39 55L39 65Z"/>
      <path class="trazo-hueco" d="M78 46L96 38L114 46L114 74L96 82L78 74ZM96 38V30M114 46L126 42M114 74L126 78M78 46L66 42M78 74L66 78M96 82V90"/>`,
    pez: `
      <path d="M44 60C64 36 112 30 150 46C162 51 170 56 177 60C170 64 162 69 150 74C112 90 64 84 44 60Z"/>
      <path d="M48 60L13 33C22 50 22 70 13 87Z"/>
      <path d="M95 39C103 28 116 23 127 25C120 32 118 38 118 42Z"/>
      <path d="M98 80C104 88 110 92 118 94C114 88 112 84 112 80Z"/>
      <circle class="hueco" cx="153" cy="55" r="4"/>`,
    linterna: `
      <path d="M34 60C54 42 110 38 160 50C172 54 182 58 189 62C182 68 170 72 156 74C110 82 54 78 34 60Z"/>
      <path d="M38 60L9 37L18 60L9 83Z"/>
      <path d="M100 42C106 34 114 31 122 32C118 37 116 41 116 44Z"/>
      <circle class="hueco" cx="166" cy="58" r="8"/>
      <g class="foto-luz"><circle cx="62" cy="69" r="3.4"/><circle cx="77" cy="72" r="3.4"/><circle cx="92" cy="74" r="3.4"/><circle cx="107" cy="75" r="3.4"/><circle cx="122" cy="75" r="3.4"/><circle cx="137" cy="74" r="3.4"/><circle cx="151" cy="71" r="3.4"/><circle cx="178" cy="64" r="3"/></g>`,
    calamar: `
      <g transform="rotate(-38 100 62)">
        <path d="M100 4C115 20 119 46 116 74L84 74C81 46 85 20 100 4Z"/>
        <path d="M100 10C119 14 129 23 133 34L113 30Z"/><path d="M100 10C81 14 71 23 67 34L87 30Z"/>
        <ellipse cx="100" cy="80" rx="15" ry="8"/>
        <path class="trazo" d="M90 86C86 98 82 108 75 117M95 87C94 100 92 110 89 119M100 88V120M105 87C106 100 108 110 111 119M110 86C114 98 118 108 125 117"/>
        <circle class="hueco" cx="94" cy="79" r="2.4"/>
      </g>`,
    pescador: `
      <path d="M40 70C40 44 70 30 106 32C140 34 164 48 170 66C174 80 164 96 140 100C112 104 76 102 56 94C46 90 40 82 40 70Z"/>
      <path d="M168 62L196 44C190 60 190 72 196 90L168 78Z"/>
      <path class="trazo" d="M80 34C84 18 98 8 114 8"/>
      <circle class="cebo" cx="116" cy="8" r="6"/>
      <path class="hueco" d="M42 72L58 66L54 76L66 72L62 82L74 78L72 88L40 86Z"/>
      <circle class="hueco" cx="78" cy="54" r="4"/>`,
    pepino: `
      <path d="M18 78C18 60 50 52 100 54C150 56 182 62 184 76C184 88 150 92 100 92C50 92 18 92 18 78Z"/>
      <circle cx="40" cy="58" r="5"/><circle cx="60" cy="54" r="5.5"/><circle cx="82" cy="52" r="5.5"/><circle cx="104" cy="52" r="5.5"/><circle cx="126" cy="54" r="5.5"/><circle cx="148" cy="57" r="5"/><circle cx="168" cy="61" r="4.5"/>
      <path class="trazo" d="M184 70l11-9M186 76h13M184 82l11 9"/>`,
    cangrejo: `
      <ellipse cx="100" cy="72" rx="40" ry="24"/>
      <path class="trazo grueso" d="M68 62C56 52 48 44 44 36M132 62C144 52 152 44 156 36"/>
      <path d="M44 38C31 36 22 27 24 15C30 22 38 24 44 22C40 16 40 9 45 5C53 14 55 27 47 37Z"/>
      <path d="M156 38C169 36 178 27 176 15C170 22 162 24 156 22C160 16 160 9 155 5C147 14 145 27 153 37Z"/>
      <path class="trazo" d="M68 78L44 90L36 105M72 86L52 100L48 115M132 78L156 90L164 105M128 86L148 100L152 115M76 92L62 106M124 92L138 106"/>
      <path class="trazo" d="M90 50V40M110 50V40"/><circle cx="90" cy="39" r="4"/><circle cx="110" cy="39" r="4"/>`,
    anfipodo: `
      <ellipse cx="160" cy="56" rx="16" ry="13"/><ellipse cx="142" cy="46" rx="15" ry="14"/><ellipse cx="124" cy="40" rx="15" ry="15"/>
      <ellipse cx="106" cy="38" rx="15" ry="15"/><ellipse cx="88" cy="40" rx="15" ry="15"/><ellipse cx="71" cy="46" rx="14" ry="14"/>
      <ellipse cx="57" cy="55" rx="13" ry="13"/><ellipse cx="46" cy="66" rx="11" ry="11"/><ellipse cx="39" cy="77" rx="9" ry="9"/>
      <path class="trazo" d="M34 84l-11 10M38 86l-6 13M42 86l0 13"/>
      <path class="trazo fino" d="M171 49C183 36 191 26 197 13M169 55C185 49 194 47 200 47"/>
      <path class="trazo" d="M150 67l6 17M134 58l2 19M118 54l-2 19M102 52l-4 19M86 54l-6 17M70 60l-8 15M57 68l-9 13"/>
      <circle class="hueco" cx="164" cy="52" r="3"/>`,
  };

  G.icono = {
    sol: `<circle cx="32" cy="32" r="10"/><path d="M32 8v8M32 48v8M8 32h8M48 32h8M15 15l6 6M43 43l6 6M15 49l6-6M43 21l6-6"/>`,
    frio: `<path d="M32 6v52M10 19l44 26M10 45l44-26"/><path d="M26 10l6 6 6-6M26 54l6-6 6 6"/>`,
    presion: `<path d="M12 10v16M32 10v16M52 10v16M6 22l6 6 6-6M26 22l6 6 6-6M46 22l6 6 6-6"/><rect x="8" y="38" width="48" height="16" rx="4"/>`,
    comida: `<circle cx="16" cy="12" r="3"/><circle cx="34" cy="20" r="3"/><circle cx="50" cy="10" r="3"/><circle cx="24" cy="32" r="3"/><circle cx="44" cy="36" r="3"/><path d="M8 52c10-8 38-8 48 0"/>`,
    oxigeno: `<circle cx="22" cy="34" r="14"/><path d="M42 52c0-8 12-8 12 0s-12 8-12 0"/><text x="22" y="40" text-anchor="middle" font-size="16" font-weight="700" stroke="none" fill="currentColor">O</text><text x="48" y="58" text-anchor="middle" font-size="9" stroke="none" fill="currentColor">2</text>`,
    gusano: `<path d="M22 58V20M34 58V14M46 58V24"/><path d="M22 20c-6-6 6-12 0-18M34 14c6-6-6-10 2-14M46 24c-6-6 6-10 0-16"/><path d="M14 58h40"/>`,
    almeja: `<path d="M8 40C8 20 56 20 56 40L32 54Z"/><path d="M32 54L20 28M32 54L32 24M32 54L44 28"/>`,
    camaron: `<path d="M50 18C30 14 14 24 12 40c-1 10 6 16 14 14"/><path d="M50 18l8-8M50 18l10 2M24 30l-6 10M32 24l-4 12M40 20l-2 12"/><path d="M26 54l-8 4 4-8"/>`,
    caracol: `<path d="M10 50h44"/><path d="M14 50c0-18 12-28 24-28s16 10 16 18-6 12-14 12-12-6-10-12 8-6 10-2"/><path d="M54 50l6-14M58 50l4-8"/>`,
    barco: `<path d="M6 40h52l-8 12H14Z"/><path d="M20 40V28h20v12M28 28V18h8v10"/>`,
    ojo: `<path d="M4 32c8-14 20-20 28-20s20 6 28 20c-8 14-20 20-28 20S12 46 4 32Z"/><circle cx="32" cy="32" r="8"/>`,
  };

  G.svgFauna = (nombre) => `<svg class="ani ani-${nombre}" viewBox="0 0 200 120" aria-hidden="true">${G.fauna[nombre] || ''}</svg>`;
  G.svgIcono = (nombre) => `<svg class="ico" viewBox="0 0 64 64" aria-hidden="true">${G.icono[nombre] || ''}</svg>`;

  G.montar = () => {
    document.querySelectorAll('[data-ani]').forEach((el) => {
      if (!el.dataset.listo) {
        el.insertAdjacentHTML('afterbegin', G.svgFauna(el.dataset.ani));
        el.dataset.listo = '1';
      }
    });
    document.querySelectorAll('[data-ico]').forEach((el) => {
      if (!el.dataset.listo) {
        el.insertAdjacentHTML('afterbegin', G.svgIcono(el.dataset.ico));
        el.dataset.listo = '1';
      }
    });
  };

  window.G = G;
})();
