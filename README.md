# Pharmil Landing Page

Landing page institucional da Pharmil reconstruída em Next.js a partir da referência do Google Stitch. O projeto preserva a arquitetura de conteúdo e a paleta vinho, coral, laranja e azul-marinho, com uma implementação responsiva, acessível e pronta para deploy na Vercel.

## Requisitos

- Node.js 20.9 ou superior
- npm 10 ou superior

## Desenvolvimento local

```bash
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

## Variáveis públicas

Copie `.env.example` para `.env.local` e ajuste os valores. Não versionar `.env.local`.

- `NEXT_PUBLIC_SITE_URL`: domínio HTTPS usado nos metadados.
- `NEXT_PUBLIC_CONTACT_URL`: canal HTTPS oficial exibido nos CTAs de atendimento.

URLs ausentes, inválidas ou sem HTTPS são ignoradas de forma segura.

## Validação

```bash
npm run typecheck
npm run lint
npm run build
```

Os screenshots de revisão ficam em `output/playwright/` e não são necessários para o deploy.

## Deploy na Vercel

1. Crie um repositório Git exclusivo para esta pasta.
2. Envie os arquivos do projeto, incluindo `package-lock.json`.
3. Importe o repositório na Vercel.
4. Cadastre as duas variáveis públicas no ambiente de produção.
5. Use o preset Next.js e o comando padrão `npm run build`.

Não é necessário um `vercel.json`; a Vercel detecta o App Router automaticamente.

## Conteúdo regulatório

A interface mantém as linhas e nomenclaturas da referência, mas não transforma substâncias sem autorização em oferta. Antes da publicação, revise registros, laudos, apresentações, prescrições, canais de contato e permissões de divulgação com responsáveis técnicos e jurídicos.

## Estrutura principal

- `app/`: layout, metadados, rota inicial e a rota `/design-system`.
- `components/`: header, hero e seções da landing, montadas a partir da biblioteca.
- `design-system/`: biblioteca de componentes, tokens e HTMLs de referência.
- `public/brand` e `public/images`: logo oficial e imagens de produto.
- `styles/`: estilos de layout por seção. Valores vêm dos tokens da biblioteca.
- `PRODUCT.md` e `DESIGN.md`: contexto estratégico e contrato visual.
- `AGENTS.md` e `CLAUDE.md`: instruções para agentes.
- `.interface-design/system.md`: extração medida do design system a partir do código.
- `.impeccable/design.json`: snapshot legível por ferramentas de design, anterior ao
  redesign — mantido por compatibilidade, mas `DESIGN.md` prevalece.

## Design system

A biblioteca de componentes fica em `design-system/`, com os tokens em
`design-system/tokens/tokens.css`. Interface nova sai dela, e nenhum valor de cor,
fonte, espaçamento ou raio é escrito direto no código.

```bash
npm run dev   # e abra /design-system
```

A rota renderiza todos os componentes com seus estados. O mapa da biblioteca e o
passo a passo para criar um componente estão em `design-system/README.md`.

Os HTMLs de referência visual estão em `design-system/reference/` e abrem direto
no navegador, sem servidor.
