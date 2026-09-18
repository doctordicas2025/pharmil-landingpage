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
