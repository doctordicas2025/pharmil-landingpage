# Pharmil — instruções do repositório

O Claude Code não lê `AGENTS.md` nativamente, então este arquivo existe para
carregar os contratos do projeto. Ele não duplica conteúdo: aponta para as
fontes da verdade.

@DESIGN.md

> `AGENTS.md` está no `.gitignore` (é local, não versionado). Quando presente,
> vale como regra geral de engenharia; a importação não é feita aqui para o
> arquivo não quebrar em quem clonar o repositório sem ele.

## Design system

- A biblioteca de componentes fica em `design-system/`. Importe do barril:
  `import { Button } from "@/design-system"`.
- Interface nova sai da biblioteca. Se o componente não existe lá, ele nasce lá —
  nunca solto na pasta de uma página.
- Nenhum valor de cor, fonte, espaçamento ou raio vai hardcoded. Tudo resolve
  para um token em `design-system/tokens/tokens.css`.
- `design-system/README.md` tem o mapa da biblioteca e o passo a passo para criar
  um componente.
- A rota `/design-system` renderiza a biblioteca inteira com todos os estados.
- `.interface-design/system.md` registra a extração medida do código: frequência
  de cada valor, conflitos resolvidos e dívida conhecida.

## Comandos

```bash
npm run dev        # servidor local
npm run build      # build de producao
npm run typecheck  # tsc --noEmit
npm run lint       # eslint, zero warnings tolerados
```

## Contexto do produto

`PRODUCT.md` tem público, propósito e princípios. `README.md` tem setup, variáveis
de ambiente e deploy.

## Design: 10 ajustes finos (valem pra toda interface que você criar ou editar)

1. Raio concêntrico: elemento arredondado dentro de outro usa o raio de fora menos o espaçamento entre eles (ex.: `calc(var(--radius-card) - var(--space-4))`). Nunca o mesmo raio nos 2.
2. Bordas com transparência: `rgb(0 0 0 / 0.12)` no tema claro e `rgb(255 255 255 / 0.12)` no escuro, no lugar de hex sólido sobre fundos coloridos, para a borda se misturar com qualquer fundo.
3. Paletas em OKLCH, não em HSL: cores irmãs têm o mesmo L e o mesmo C e mudam só o H, mantendo C dentro do sRGB.
4. Degradês com `in oklch`: `linear-gradient(90deg in oklch, ...)` sempre precedido da mesma linha sem `in oklch` como reserva. Se aparecer matiz indesejado no meio, usar `in oklab`.
5. Traço do ícone acompanha o peso do texto ao lado. Ícone de 20px com texto de 16px: peso 400 = `stroke-width` 1.75, 500 = 2, 600 = 2.5, 700 = 2.75. Outro tamanho: `stroke-width = haste do texto em px * 24 / tamanho do ícone em px`.
6. Carrosséis e listas com rolagem horizontal somem nas pontas: `mask-image` e `-webkit-mask-image` com `linear-gradient(90deg, transparent, #000 15% 85%, transparent)`. Setas e botões ficam fora do elemento com máscara.
7. Troca de ícone (copiar/copiado, play/pause, menu/fechar): os 2 ícones no mesmo lugar (`grid-area: 1 / 1`), o escondido com `opacity: 0` e `filter: blur(4px)`, transição de 200ms em `opacity` e `filter`, e `transition: none` em `@media (prefers-reduced-motion: reduce)`.
8. Modo escuro mostra profundidade com superfície mais clara, não com sombra: página, cartão e menu sobem ~7 pontos de L no OKLCH a cada nível, com borda `rgb(255 255 255 / 0.08)` na camada de cima.
9. Altura de tela cheia: `min-height: 100vh` seguido de `min-height: 100dvh`, nunca `100vh` sozinho (ou `100svh` na primeira dobra se a barra do navegador causar pulo na rolagem).
10. Foto de produto com fundo branco em cima de fundo claro colorido: `mix-blend-mode: multiply` na `img` e `isolation: isolate` no cartão. Nunca em fundo escuro.

Ao terminar uma mudança de interface, confira esses 10 itens no que alterou e diga quais aplicou.
