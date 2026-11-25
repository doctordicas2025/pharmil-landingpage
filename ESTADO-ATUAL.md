# Estado atual da landing page Pharmil

## Últimas mudanças

- 25/11/2026 16:26 (Brasília), Antigravity, `fix(funnel): padroniza numero oficial do WhatsApp para 5561999969091`: substitui o número legado `(48) 99115-3151` em `lib/funnel/quiz-config.ts`, `app/vip/page.tsx`, `components/funnel/QuizContactStep.tsx`, `.env.example` e `tests/funnel-quiz-config.test.mjs` pelo número principal oficial do Agente 1 (`5561999969091` / `(61) 99996-9091`), unificando a formatação de exibição via `formatBrazilianWhatsAppDisplay`.
- 25/11/2026 00:43 (Brasília), Claude, `fix(cadastro): lead existente nao recebe campo de verdade, so o historico`: preencher o que faltava ainda deixava um estranho pôr a `influenciadora` (atribuição de comissão) num lead que não tinha. Agora, no lead que já existe, nenhum campo do `metadata` é preenchido nem trocado: o envio vai só para `metadata.cadastros_nao_verificados` (data, objetivo e influenciadora, os 10 mais recentes), que substitui o `historico_cadastro` da linha de baixo (nada chegou a ser gravado com ele: a chave de serviço ainda não está na Vercel). `objetivo` e `influenciadora` de verdade só valem no lead novo.
- 25/11/2026 00:36 (Brasília), Claude, `fix(cadastro): lead existente so ganha dados e o envio tem limite por IP`: o formulário é público e ninguém prova que o telefone é seu, então no lead que já existe o cadastro não sobrescreve chave do `metadata` que tem valor (a `influenciadora` de quem já está no CRM nunca muda), só preenche o que falta e guarda o envio em `metadata.historico_cadastro` (data, objetivo e influenciadora, os 10 mais recentes); `name`, `phone`, `status`, `labels` e `source` não são tocados. `objetivo` só aceita as três opções do formulário (a lista mora em `lib/cadastro-lead.ts` e a página a passa ao formulário), `influenciadora` tem até 40 caracteres, e nome e influenciadora recusam caractere de controle e `<>`. Limite de 10 envios por IP a cada 10 minutos, em memória por instância (o do `/avaliacao` fica dentro do arquivo do funil e não dava para reaproveitar sem editá-lo); o IP não vai para o log.
- 25/11/2026 00:30 (Brasília), Claude, `fix(cadastro): grava o lead do /cadastro no CRM pelo servidor`: o `/cadastro` passa a gravar em `leads` nas colunas do CRM (`name`, `phone` só dígitos com 55, `source` e etiqueta `landing-cadastro`, `status` `novo`, `metadata` com `objetivo` e `influenciadora`), pelo servidor com a `SUPABASE_SERVICE_ROLE_KEY` (`lib/cadastro-lead.ts`). Telefone já cadastrado (DDD + 8 últimos dígitos, com ou sem 9 e 55) atualiza o `metadata` do lead existente em vez de criar outro. O log fica só com etapa e código do erro, o visitante recebe uma frase neutra, e saiu o cliente com a chave anônima (`lib/supabase.ts`), que só o cadastro usava. Testes em `tests/cadastro-lead.test.mjs`.

## Em andamento

Nada.

## Pendências

- A `SUPABASE_SERVICE_ROLE_KEY` não está nas variáveis do projeto da landing na Vercel (conferido em 25/11 pelo `vercel env ls`: só `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`). Até o dono cadastrá-la em Production e publicar de novo, o `/cadastro` responde a frase neutra, o log diz `supabase_nao_configurado` com a variável que falta e o visitante segue para o WhatsApp sem virar lead. O `/avaliacao` cai na chave anônima no mesmo caso.
- Os logs antigos da Vercel com nome e telefone de quem se cadastrou antes desta correção continuam lá até expirarem; apagar antes é decisão do dono.
- O limite por IP do `/cadastro` e o do `/avaliacao` são em memória e valem por instância da Vercel: seguram rajada de um IP, não ataque distribuído. Limite compartilhado pede um armazenamento (banco ou KV).

## Varredura de 23/11/2026

A base revisada foi `90284a8`. As páginas de termos e privacidade passaram a compartilhar o cabeçalho do documento, os dados de contato e o retorno à página inicial. Cada rota continua responsável pelo próprio texto e pelos metadados. As páginas de campanhas `/grupo` e `/original` usam a mesma lista numerada de etapas e mantêm seu conteúdo individual.

O formulário de cadastro agora usa o mesmo gerador de link de WhatsApp da loja e da página de campanha. O teste de regressão cobre acentos e caracteres reservados na mensagem. Os 18 testes da calculadora foram mantidos porque exercitam casos distintos de concentração, graduação, tolerância e limites.

A pendência que esta varredura apontou na ação `app/cadastro/actions.ts` (dados pessoais no log e erro do banco devolvido ao navegador) foi resolvida em 25/11; ver "Últimas mudanças".
