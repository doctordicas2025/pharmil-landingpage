# Design System Pharmil

Biblioteca de componentes do projeto. Tudo que aparece na interface sai daqui.

Veja rodando: **`/design-system`** — renderiza a biblioteca inteira com todos os
estados. A rota é `noindex` e não entra no menu.

## Onde fica o quê

| Caminho | Conteúdo |
|---|---|
| `tokens/tokens.css` | Fonte da verdade dos valores: cor, tipografia, espaçamento, raio, borda, sombra e movimento. |
| `components/` | Componentes React tipados. Um arquivo por família. |
| `styles/components.css` | Estilos da biblioteca, prefixo `ds-`. |
| `styles/showcase.css` | Estilos exclusivos da rota de showcase. Não usados em produção. |
| `reference/` | HTMLs de referência visual. Abrem direto no navegador, sem servidor. |
| `index.ts` | Barril de exportação. Importe sempre daqui. |

Os documentos que acompanham a biblioteca:

- **`DESIGN.md`** (raiz) — o contrato visual e a fonte da verdade dos tokens.
- **`.interface-design/system.md`** — a extração medida do código: contagem de
  frequência de cada valor, conflitos encontrados e dívida conhecida.

## Componentes

| Componente | Arquivo | Estados |
|---|---|---|
| `Button` | `Button.tsx` | default, hover, active, focus, disabled, loading · variantes `primary` / `secondary` / `inline`, tamanhos `md` / `sm`, `block` |
| `IconButton` | `Button.tsx` | default, hover, focus, disabled · 44px fixo |
| `Card` | `Card.tsx` | repouso, `interactive` (elevação no hover), `selected`, foco interno · tons `paper` / `surface` · polimórfico via `as` |
| `CardBody` `CardFooter` `CardMedia` | `Card.tsx` | `CardMedia` aceita `tint` (token `--tint-*`) e `fit` contain/cover |
| `Field` | `Field.tsx` | default, hover, focus, erro, desabilitado · com `hint` ou `error` |
| `OptionGroup` | `Field.tsx` | default, hover, focus, selecionado, desabilitado, erro |
| `FieldSet` | `Field.tsx` | agrupamento com o espaçamento do sistema |
| `Modal` | `Modal.tsx` | aberto/fechado · fecha no clique fora, no botão e no Escape |
| `ModalMedia` `ModalBody` `FactList` | `Modal.tsx` | composição do diálogo |
| `Accordion` | `Disclosure.tsx` | um painel aberto por vez, controlado por índice |
| `Stat` | `Disclosure.tsx` | sobre papel e sobre superfície escura (`onDark`) |
| `TextLink` | `Disclosure.tsx` | default, hover, focus · `external` adiciona `rel`/`target` |
| `Eyebrow` | `Pill.tsx` | tons `wine` / `orange` / `muted` |
| `Badge` | `Pill.tsx` | selo sobre imagem |
| `DotPill` | `Pill.tsx` | pilula de assinatura com ponto |
| `FilterPill` | `Pill.tsx` | default, hover, focus, ativo, desabilitado · com contador |
| `Chip` `IconBox` | `Pill.tsx` | sinal de confiança com ícone |
| `EmptyState` | `Feedback.tsx` | ausência de dado, com ação de saída |
| `ErrorState` | `Feedback.tsx` | falha recuperável, com ação de saída |
| `Spinner` `Skeleton` | `Feedback.tsx` | carregamento |

## Como usar

```tsx
import { Button, Card, CardBody, Eyebrow } from "@/design-system";

<Card interactive>
  <CardBody>
    <Eyebrow tone="muted">Etapa</Eyebrow>
    <h3>Conformidade confirmada</h3>
  </CardBody>
</Card>
```

Importe sempre do barril (`@/design-system`), nunca do caminho interno do arquivo.

## Como criar um componente novo

1. **Confirme que não existe.** Boa parte do que parece novo é variante de algo
   que já está na tabela acima. Variante entra como prop, não como componente.
2. **Crie em `components/`.** Um arquivo por família — `Button.tsx` guarda
   `Button` e `IconButton` porque dividem a mesma ideia.
3. **Tipe as props e exporte o tipo.** `export type FooProps = ...`.
4. **Estilize em `styles/components.css`** com o prefixo `ds-`. Todo valor
   resolve para um token: se falta um, adicione em `tokens/tokens.css` com um
   nome que descreva a função, não a aparência.
5. **Cubra os estados que o componente tiver:** default, hover, active, focus,
   disabled, loading, erro, vazio, selecionado. Foco sempre visível
   (`:focus-visible` com `--color-focus`). Erro sempre em texto, nunca só na cor.
6. **Exporte no `index.ts`.**
7. **Adicione uma linha na rota de showcase** (`app/design-system/Showcase.tsx`)
   mostrando todos os estados, e uma linha na tabela acima.

## Regras que a biblioteca assume

1. Nenhum hex no CSS — tudo resolve para token.
2. Uma família de acento: wine age, red aquece, orange marca.
3. Bordas estruturam, sombras levantam. Sombra nunca em repouso.
4. Ações são pílula; cards são 22px. Sem raio novo.
5. Peso antes de tamanho na hierarquia; tracking negativo em display, positivo em label.
6. Alvo de toque mínimo de 44px.
7. Fluido antes de breakpoint: `clamp` e `auto-fit` primeiro.

## HTMLs de referência

`reference/landing-prototipo.html` é o protótipo visual que originou o layout
atual. Abre direto no navegador, sem servidor — os caminhos de asset apontam para
`reference/assets/`, que é autocontido. É referência de intenção, não código de
produção: não copie dele, consulte.
