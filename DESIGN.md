---
name: Pharmil
description: Procedência visível, atendimento claro e entrega acompanhada.
colors:
  pharmil-red: "#8F1C20"
  signal-red: "#C93424"
  thermal-orange: "#FF6828"
  cold-chain-navy: "#102F49"
  paper-warm: "#FBF8F4"
  surface-warm: "#F4ECE5"
  peach-mist: "#FFE2D2"
  ink-warm: "#24191A"
  text-muted: "#6A5D5A"
  line-soft: "#E7DDD5"
typography:
  display:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "clamp(3.35rem, 6.5vw, 6.6rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "clamp(2.25rem, 4.5vw, 4.75rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  sm: "8px"
  md: "16px"
  lg: "28px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "72px"
components:
  button-primary:
    backgroundColor: "{colors.pharmil-red}"
    textColor: "{colors.paper-warm}"
    rounded: "{rounded.pill}"
    padding: "14px 22px"
  button-primary-hover:
    backgroundColor: "{colors.signal-red}"
  button-secondary:
    backgroundColor: "{colors.paper-warm}"
    textColor: "{colors.pharmil-red}"
    rounded: "{rounded.pill}"
    padding: "14px 22px"
---

# Design System: Pharmil

## 1. Overview

**Creative North Star: "A cadeia fria, em evidência"**

A interface deve lembrar uma embalagem farmacêutica bem resolvida sobre uma bancada iluminada: limpa, objetiva e concreta, mas com calor humano suficiente para não parecer hospitalar. O visitante normalmente consulta a página no celular e quer sentir que há processo, produto e pessoas reais por trás da marca.

O sistema adota uma paleta completa e comprometida. Vermelho e laranja ocupam áreas decisivas; azul profundo organiza trechos de confiança e logística; os neutros são sempre aquecidos. A composição é assimétrica e usa grandes campos de cor, tipografia firme e imagens de produto concretas. Landing pages genéricas de IA, catálogos frios e promessas agressivas são proibidos.

**Key Characteristics:**

- Produto em primeiro plano, com nomes e embalagens legíveis.
- Ritmo alternado entre áreas abertas, blocos densos de cor e linhas técnicas.
- Hierarquia tipográfica forte, com poucas mensagens por dobra.
- Movimento curto, responsivo e sempre opcional.
- Conversão baseada em clareza, nunca em pressão.

## 2. Colors

A paleta combina calor operacional e confiança logística: vermelho Pharmil, laranja térmico, azul de cadeia fria e neutros de papel.

### Primary

- **Vermelho Pharmil:** assinatura, CTA principal e pontos de decisão.
- **Vermelho Sinal:** estados ativos, detalhes de embalagem e feedback visual.

### Secondary

- **Laranja Térmico:** energia, transições de cor e pequenos marcadores de ação.
- **Azul Cadeia Fria:** seções de procedência, logística e contraste institucional.

### Tertiary

- **Névoa Pêssego:** halos discretos e fundos de suporte próximos aos produtos.

### Neutral

- **Papel Quente:** fundo principal e texto sobre áreas escuras.
- **Superfície Quente:** alternância de seção e áreas de apoio.
- **Tinta Quente:** texto principal, nunca preto puro.
- **Texto Suave:** informação secundária.
- **Linha Suave:** divisores e contornos funcionais.

### Named Rules

**The Thermal Map Rule.** Vermelho, laranja e azul devem formar uma narrativa de calor, produto e cadeia de frio. Nunca usar o blend como decoração sem função.

**The Tinted Neutral Rule.** Preto e branco puros são proibidos. Todo neutro mantém uma leve temperatura da marca.

## 3. Typography

**Display Font:** Archivo (com Arial como fallback)
**Body Font:** Archivo (com Arial como fallback)

**Character:** Archivo sustenta todo o sistema com uma presença geométrica, firme e institucional, próxima da anatomia do wordmark oficial. A amplitude de pesos mantém títulos sólidos e textos corridos legíveis sem fragmentar a identidade.

### Hierarchy

- **Display** (800, escala fluida, 0.92): somente para a promessa principal e frases curtas.
- **Headline** (800, escala fluida, 0.98): títulos de seção com quebras editoriais intencionais.
- **Title** (700 a 800, 1.25rem a 1.75rem, 1.1): nomes de produtos e etapas.
- **Body** (400, 1rem, 1.6): conteúdo com largura máxima entre 65 e 72 caracteres.
- **Label** (700, 0.78rem, 0.08em): microcopy curta, navegação e metadados.

### Named Rules

**The Packaging Voice Rule.** Títulos devem soar como informação impressa numa boa embalagem: curtos, específicos e sem adjetivos vazios.

## 4. Elevation

O sistema é plano por padrão e cria profundidade com sobreposição, escala e diferença tonal. Sombras são ambientais, amplas e coloridas, nunca caixas cinzentas pesadas.

### Shadow Vocabulary

- **Ambient Product:** sombra difusa e quente sob embalagens e objetos, usada apenas para separá-los do fundo.
- **Interactive Lift:** deslocamento vertical pequeno acompanhado de sombra suave em botões e itens clicáveis.

### Named Rules

**The Object-Only Shadow Rule.** Sombras pertencem a produtos e controles interativos. Seções inteiras e textos permanecem planos.

## 5. Components

### Buttons

- **Shape:** cápsula firme, sem exagero de altura.
- **Primary:** vermelho Pharmil com texto em papel quente e seta direcional.
- **Hover / Focus:** pequena elevação por transform, cor mais viva e anel de foco de alto contraste.
- **Secondary:** fundo claro, texto vermelho e contorno funcional.

### Chips

- **Style:** contorno suave, ícone linear e texto curto; usados somente para sinais de confiança.
- **State:** hover tonal, sem glassmorphism.

### Cards / Containers

- **Corner Style:** curvas moderadas; produtos podem ultrapassar o limite visual do container.
- **Background:** neutros quentes ou campos sólidos de marca.
- **Shadow Strategy:** apenas produtos recebem sombra ambiental.
- **Border:** linha suave quando necessária para organização.
- **Internal Padding:** fluido, maior no desktop e compacto no mobile.

### Inputs / Fields

- **Style:** fundo de papel, contorno visível e cantos médios.
- **Focus:** anel vermelho com contraste AA.
- **Error / Disabled:** texto explícito e ícone; nunca depender apenas da cor.

### Navigation

Barra superior leve, wordmark à esquerda, âncoras de seção no centro e CTA à direita. No mobile, o menu abre em fluxo natural e mantém alvos de toque de pelo menos 44px.

### Product Stage

O hero usa o packshot fornecido no projeto Stitch, armazenado localmente e acompanhado por legenda explícita. A moldura combina laranja térmico e azul profundo sem interferir na leitura das embalagens.

## 6. Do's and Don'ts

### Do:

- **Do** usar o vermelho Pharmil nos CTAs e o azul profundo para ancorar confiança e cadeia de frio.
- **Do** manter cada dobra focada em uma pergunta real do visitante.
- **Do** usar HTML semântico, foco visível e experiência completa com movimento reduzido.
- **Do** manter nomes, orientações e ressalvas de produto explícitos no texto.

### Don't:

- **Don't** criar landing pages genéricas de IA, com gradientes decorativos, textos inflados e grades repetitivas de cards.
- **Don't** usar catálogos farmacêuticos frios, densos e impessoais.
- **Don't** usar comunicação agressiva que banaliza prescrição, promete resultados ou cria urgência artificial.
- **Don't** usar luxo cenográfico, glassmorphism, texto em gradiente ou listras laterais grossas.
- **Don't** repetir pequenos rótulos em caixa alta sobre todos os títulos de seção.
