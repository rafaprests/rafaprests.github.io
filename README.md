# rafaprests.github.io

Meu site pessoal — cartão de visita + o diário do desafio **10 projetos em 10 dias** (dia 0).

Feito com HTML/CSS/JS puro, sem build. Servido pelo GitHub Pages.

## Rodar localmente

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

## Editar

- **Adicionar um projeto do desafio:** preencha o dia correspondente em [`projects.js`](projects.js).
- **CV / LinkedIn / email:** preencha as constantes no topo de [`main.js`](main.js)
  (`CV_URL`, `LINKEDIN_URL`, `EMAIL`).
- **Som ambiente (opcional):** coloque um arquivo em `assets/ambient.mp3`.

## Estrutura

| arquivo         | o quê                                   |
|-----------------|------------------------------------------|
| `index.html`    | conteúdo e seções                        |
| `styles.css`    | tema (terminal × editorial) e layout     |
| `main.js`       | render dos dias, tema, som, cursor, eggs |
| `projects.js`   | os 10 dias (dados)                       |
