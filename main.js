/* =========================================================================
   main.js — comportamento do site
   ========================================================================= */
(function () {
  "use strict";

  /* -----------------------------------------------------------------------
   * CONFIG — placeholders para o Rafael preencher
   * --------------------------------------------------------------------- */
  const CV_URL       = "https://docs.google.com/document/d/141HRthqUsSmXq3aMjyDHlaMzlDMhus-b/export?format=pdf"; // baixa direto em PDF, sempre a versão mais atual do doc
  const LINKEDIN_URL = "https://www.linkedin.com/in/rafael-brondani-prestes-954b3a207/"; // ex.: https://www.linkedin.com/in/rafael-...
  const EMAIL        = "rbprestes@hotmail.com"; // ex.: rafaelbrondanip@gmail.com

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none)").matches;

  /* -----------------------------------------------------------------------
   * Links de contato (só ativa o que estiver preenchido)
   * --------------------------------------------------------------------- */
  function wireLink(id, href) {
    const el = document.getElementById(id);
    if (!el) return;
    if (href) {
      el.setAttribute("href", href);
    } else {
      el.classList.add("is-soon");
      el.setAttribute("title", "em breve — placeholder");
      el.addEventListener("click", (e) => e.preventDefault());
    }
  }
  wireLink("cv-link", CV_URL);
  wireLink("linkedin-link", LINKEDIN_URL);
  wireLink("email-link", EMAIL ? "mailto:" + EMAIL : "");

  /* -----------------------------------------------------------------------
   * Render dos 10 dias (a partir de PROJECTS em projects.js)
   * --------------------------------------------------------------------- */
  const STATUS = {
    done: { label: "✓ done", cls: "done" },
    wip:  { label: "in progress", cls: "wip" },
    soon: { label: "soon", cls: "" },
  };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }

  function renderProjects() {
    const grid = document.getElementById("projects-grid");
    if (!grid || typeof PROJECTS === "undefined") return;

    grid.innerHTML = PROJECTS.map((p) => {
      const st = STATUS[p.status] || STATUS.soon;
      const isSoon = p.status === "soon";
      const title = p.title || "por vir";

      const tags = (p.tags || [])
        .map((t) => `<span class="tag">${esc(t)}</span>`)
        .join("");

      const links = [
        p.repo ? `<a href="${esc(p.repo)}" target="_blank" rel="noopener">repo ↗</a>` : "",
        p.demo ? `<a href="${esc(p.demo)}" target="_blank" rel="noopener">demo ↗</a>` : "",
      ].filter(Boolean).join("");

      return `
        <li class="card ${isSoon ? "is-soon" : ""}">
          <div class="card-head">
            <span class="card-day">day ${p.day}</span>
            <span class="badge ${st.cls}">${st.label}</span>
          </div>
          <h3 class="card-title ${isSoon ? "muted" : ""}">${esc(title)}</h3>
          ${p.blurb ? `<p class="card-blurb">${esc(p.blurb)}</p>` : `<p class="card-blurb">Aguardando o dia ${p.day}…</p>`}
          ${tags ? `<div class="tags">${tags}</div>` : ""}
          ${links ? `<div class="card-links">${links}</div>` : ""}
        </li>`;
    }).join("");
  }
  renderProjects();

  /* -----------------------------------------------------------------------
   * Toggle de tema (persistido)
   * --------------------------------------------------------------------- */
  const root = document.documentElement;
  const themeBtn = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);
  syncThemeIcon();

  function syncThemeIcon() {
    if (themeBtn) themeBtn.textContent = root.getAttribute("data-theme") === "light" ? "☀" : "☾";
  }
  themeBtn && themeBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    syncThemeIcon();
  });

  /* -----------------------------------------------------------------------
   * Som ambiente opcional (off por padrão, persistido)
   * --------------------------------------------------------------------- */
  const soundBtn = document.getElementById("sound-toggle");
  const audio = document.getElementById("ambient");
  let soundOn = localStorage.getItem("sound") === "on";

  function applySound() {
    if (!audio) return;
    if (soundOn) {
      audio.volume = 0.35;
      const play = audio.play();
      if (play && play.catch) {
        play.catch(() => { soundOn = false; syncSound(); }); // sem áudio disponível → volta a off
      }
    } else {
      audio.pause();
    }
    syncSound();
  }
  function syncSound() {
    if (!soundBtn) return;
    soundBtn.setAttribute("aria-pressed", String(soundOn));
    soundBtn.textContent = soundOn ? "♫" : "♪";
    localStorage.setItem("sound", soundOn ? "on" : "off");
  }
  soundBtn && soundBtn.addEventListener("click", () => { soundOn = !soundOn; applySound(); });
  syncSound(); // não auto-toca no load (política de autoplay); espera 1 clique

  /* -----------------------------------------------------------------------
   * Cachorrinho que corre atrás do cursor (estilo oneko)
   * Corre até perto do mouse; parado, senta e dorme 😴.
   * Só em dispositivos com hover e sem reduced-motion.
   * --------------------------------------------------------------------- */
  if (!isTouch && !prefersReducedMotion) {
    const pet = document.getElementById("cursor-pet");
    const dog = document.getElementById("dog");
    if (pet && dog) {
      const SPEED = 12;        // px por tick
      const NEAR = 42;         // distância em que ele "chega" e para (trailing)
      const SLEEP_AFTER = 16;  // ticks parado antes de dormir (~1.5s)

      let petX = window.innerWidth / 2, petY = window.innerHeight / 2;
      let mx = petX, my = petY, shown = false, idle = 0, asleep = false;

      window.addEventListener("mousemove", (e) => {
        mx = e.clientX; my = e.clientY;
        if (!shown) { shown = true; pet.style.opacity = "1"; }
      }, { passive: true });

      setInterval(() => {
        const dx = mx - petX, dy = my - petY;
        const dist = Math.hypot(dx, dy);

        if (dist < NEAR) {
          // chegou → fica parado; depois de um tempo, dorme
          pet.classList.remove("run");
          idle++;
          if (idle > SLEEP_AFTER && !asleep) {
            asleep = true; dog.textContent = "😴"; pet.classList.add("sleep");
          }
        } else {
          // acorda e corre atrás do mouse
          if (asleep) { asleep = false; dog.textContent = "🐕"; pet.classList.remove("sleep"); }
          idle = 0;
          pet.classList.add("run");
          pet.classList.toggle("right", dx > 0);   // vira pra direção do movimento
          petX += (dx / dist) * SPEED;
          petY += (dy / dist) * SPEED;
        }
        pet.style.transform = `translate(${petX}px, ${petY}px) translate(-50%, -50%)`;
      }, 90);
    }
  }

  /* -----------------------------------------------------------------------
   * Ano no rodapé
   * --------------------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -----------------------------------------------------------------------
   * Easter eggs
   *  1) mensagem no console
   *  2) konami code → "modo festa" (só um leve tremor/hue), respeita reduced-motion
   * --------------------------------------------------------------------- */
  console.log(
    "%c> hey, dev 👋",
    "font-family:monospace;font-size:16px;color:#7ee787;font-weight:700"
  );
  console.log(
    "%crafael@pucrs:~$ você achou o console. digite o konami code na página ;)\n↑ ↑ ↓ ↓ ← → ← → B A",
    "font-family:monospace;color:#8b98a5"
  );

  if (!prefersReducedMotion) {
    const KONAMI = [
      "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
      "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a",
    ];
    let idx = 0;
    window.addEventListener("keydown", (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      idx = key === KONAMI[idx] ? idx + 1 : (key === KONAMI[0] ? 1 : 0);
      if (idx === KONAMI.length) {
        idx = 0;
        document.body.animate(
          [{ filter: "hue-rotate(0deg)" }, { filter: "hue-rotate(360deg)" }],
          { duration: 1400, iterations: 2 }
        );
        console.log("%c🎉 konami! bem-vindo ao clube.", "color:#ffca7a;font-family:monospace");
      }
    });
  }
})();
