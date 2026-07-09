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

  /* O gatinho que persegue o cursor é o oneko — carregado via oneko.js. */

  /* -----------------------------------------------------------------------
   * Ano no rodapé
   * --------------------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -----------------------------------------------------------------------
   * Contador de visitas (Abacus — abacus.jasoncameron.dev, grátis e com CORS)
   * Conta 1 por sessão do navegador: refreshes na mesma aba só leem o total,
   * sem inflar. Se a API falhar, mostra "—" e não quebra nada.
   * --------------------------------------------------------------------- */
  (function visitorCounter() {
    const el = document.getElementById("hitcount");
    if (!el) return;

    const BASE = "https://abacus.jasoncameron.dev";
    const NS = "rafaprests-github-io", KEY = "home";
    const firstThisSession = !sessionStorage.getItem("visited");
    const url = `${BASE}/${firstThisSession ? "hit" : "get"}/${NS}/${KEY}`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.value !== "number") throw new Error("resposta inesperada");
        if (firstThisSession) sessionStorage.setItem("visited", "1");
        el.textContent = String(data.value).padStart(6, "0"); // odômetro retrô
      })
      .catch(() => { el.textContent = "—"; });
  })();

  /* -----------------------------------------------------------------------
   * Um oi discreto no console pra quem for dev
   * --------------------------------------------------------------------- */
  console.log(
    "%c> hey, dev 👋",
    "font-family:monospace;font-size:16px;color:#7ee787;font-weight:700"
  );
  console.log(
    "%crafael@pucrs:~$ obrigado por dar uma espiada. github.com/rafaprests",
    "font-family:monospace;color:#8b98a5"
  );
})();
