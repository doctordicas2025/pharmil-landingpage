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

- `app/`: layout, metadados e rota inicial.
- `components/`: header, hero, apresentação do produto e seções.
- `public/brand` e `public/images`: logo oficial e packshot local do hero.
- `styles/`: tokens e estilos organizados por domínio visual.
- `PRODUCT.md` e `DESIGN.md`: contexto estratégico e sistema visual.
- `.impeccable/design.json`: extensão legível por ferramentas de design.
