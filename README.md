# A2 Salão e Barbearia

Site de uma página (HTML, CSS e JavaScript puros, sem dependências) para o A2 Salão e Barbearia, em San Martin, Recife-PE.

## Ver no computador

```bash
python3 -m http.server 3000
```

Abra `http://localhost:3000`. Também funciona abrindo o `index.html` direto no navegador.

## Publicar

- **GitHub Pages:** Settings > Pages > Deploy from a branch > `main` / `(root)`.
- **Cloudflare Pages:** conecte o repositório, sem comando de build, diretório de saída `/`.

## O que editar

| O quê | Onde |
| --- | --- |
| WhatsApp de agendamento | `WHATSAPP_NUMBER` no topo de `script.js` (e o `href` de fallback dos links com `data-whatsapp` no `index.html`) |
| Telefone para ligar | links `tel:` no `index.html` e `telephone` no JSON-LD |
| Horário | parágrafo `editable-hours` no `index.html` e `openingHoursSpecification` no JSON-LD |
| Instagram | `https://www.instagram.com/a2salaobarbearia/` no `index.html` |
| Fotos | tags `<img>` das seções início, sobre e `#galeria` (hoje são fotos de banco de imagens, só para demonstração) |
| Domínio | depois de publicar, adicione `canonical` e `og:url` (veja o comentário no `<head>`) |

## Pendências antes de entregar ao salão

- Trocar as fotos de demonstração por fotos reais do salão (com autorização).
- Confirmar qual WhatsApp usar para agendamento e o horário de domingo.
- Colocar depoimentos reais (com permissão das clientes) na seção `#avaliacoes`.
