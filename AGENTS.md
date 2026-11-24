# Instruções do projeto

## Find Skills primeiro

Em toda tarefa deste projeto, abra e use a skill `find-skills` antes de planejar, escolher ferramentas ou implementar. Confira as skills já disponíveis e o catálogo oficial. Carregue as que se aplicam e cite no chat as que usou. Fonte oficial: [Find Skills](https://github.com/vercel-labs/skills/blob/main/skills/find-skills/SKILL.md). Se houver uma decisão que mude o resultado, use `grill-me` para esclarecê-la antes de executar a parte dependente.


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
