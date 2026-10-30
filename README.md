# rafaprests.github.io

Meu site pessoal — cartão de visita + o TCC (busca de música por linguagem natural).

Feito com HTML/CSS/JS puro, sem build. Servido pelo GitHub Pages.

## Rodar localmente

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

## Editar

- **Link do estudo:** se o endereço do túnel na MotoZ mudar, troque as três ocorrências em
  [`estudo/index.html`](estudo/index.html). O site inteiro aponta para `estudo/`.
- **CV / LinkedIn / email:** preencha as constantes no topo de [`main.js`](main.js)
  (`CV_URL`, `LINKEDIN_URL`, `EMAIL`).
- **Som ambiente (opcional):** coloque um arquivo em `assets/ambient.mp3`.

## Estrutura

| arquivo         | o quê                                   |
|-----------------|------------------------------------------|
| `index.html`    | conteúdo e seções                        |
| `styles.css`    | tema (terminal × editorial) e layout     |
| `main.js`       | links, tema, som, contador de visitas    |
| `estudo/`       | redireciona para o estudo do TCC         |
