
# Yu-Gi-Oh! Card Maker

Crie suas próprias cartas personalizadas de Yu-Gi-Oh! com um visual fiel ao estilo oficial da Konami.

![yugioh-card-maker-screenshot](https://github.com/user-attachments/assets/fd46d861-710b-4226-8fa2-57903cd53b6c)

## 🚀 Tecnologias utilizadas

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [HTML Canvas API](https://developer.mozilla.org/pt-BR/docs/Web/API/Canvas_API)
- [Playwright](https://playwright.dev/)

## 📂 Estrutura do projeto

```
yugioh-card-maker/
├── public/
│   ├── fonts/
│   └── images/
│       └── card/        # molduras, atributos, estrelas, tipos de Magia/Armadilha e setas
├── src/
│   ├── components/      # layout da página, formulário, prévia da carta e campos
│   ├── contexts/        # estado da carta
│   ├── hooks/
│   ├── lib/
│   │   └── canvas/      # desenho da carta (sem React)
│   ├── constants/       # textos da interface, opções dos campos e listas do jogo
│   ├── types/
│   └── utils/           # regras de cada moldura e funções auxiliares
└── tests/
    ├── app/             # comportamento do app pelo formulário
    └── visual/          # regressão visual das cartas, pixel a pixel
```

## ⚙️ Como rodar localmente

```bash
# Instale as dependências
npm install

# Rode o projeto
npm run dev
```

Acesse no navegador: `http://localhost:5173/yugioh-card-maker`

## 🧪 Testes

```bash
# Instale o navegador dos testes (só na primeira vez)
npx playwright install chromium

# Todos os testes
npm test

# Só a regressão visual das cartas
npm run test:visual
```

Os testes visuais desenham um conjunto de cartas e comparam cada pixel com as imagens em `tests/visual/__snapshots__`. Se uma mudança no visual for intencional, confira o resultado com `npx playwright show-report` e regrave as referências com `npm run test:visual:update`.

## 👨‍💻 Autor

Desenvolvido por **Richard Tavares**  
[GitHub](https://github.com/richard-tavares) | [LinkedIn](https://linkedin.com/in/richard-tavares)


## Aviso Legal

Este projeto foi criado exclusivamente para fins educacionais e demonstração de habilidades em desenvolvimento web.

**Todos os direitos sobre Yu-Gi-Oh!, incluindo imagens, nomes, logotipos e demais elementos relacionados, pertencem à Konami.**

Este projeto não é oficial, não está afiliado à Konami e não tem relação direta com a empresa.
