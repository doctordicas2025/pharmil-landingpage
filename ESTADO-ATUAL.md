# Estado atual da landing page Pharmil

## Últimas mudanças

- 25/11/2026 00:30 (Brasília), Claude, `fix(cadastro): grava o lead do /cadastro no CRM pelo servidor`: o `/cadastro` passa a gravar em `leads` nas colunas do CRM (`name`, `phone` só dígitos com 55, `source` e etiqueta `landing-cadastro`, `status` `novo`, `metadata` com `objetivo` e `influenciadora`), pelo servidor com a `SUPABASE_SERVICE_ROLE_KEY` (`lib/cadastro-lead.ts`). Telefone já cadastrado (DDD + 8 últimos dígitos, com ou sem 9 e 55) atualiza o `metadata` do lead existente em vez de criar outro. O log fica só com etapa e código do erro, o visitante recebe uma frase neutra, e saiu o cliente com a chave anônima (`lib/supabase.ts`), que só o cadastro usava. Testes em `tests/cadastro-lead.test.mjs`.

## Em andamento

Nada.

## Pendências

- A `SUPABASE_SERVICE_ROLE_KEY` não está nas variáveis do projeto da landing na Vercel (conferido em 25/11 pelo `vercel env ls`: só `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`). Até o dono cadastrá-la em Production e publicar de novo, o `/cadastro` responde a frase neutra, o log diz `supabase_nao_configurado` com a variável que falta e o visitante segue para o WhatsApp sem virar lead. O `/avaliacao` cai na chave anônima no mesmo caso.
- Os logs antigos da Vercel com nome e telefone de quem se cadastrou antes desta correção continuam lá até expirarem; apagar antes é decisão do dono.
- O `/cadastro` não tem limite de envios por IP (o `/avaliacao` tem um em memória).

## Varredura de 23/11/2026

A base revisada foi `90284a8`. As páginas de termos e privacidade passaram a compartilhar o cabeçalho do documento, os dados de contato e o retorno à página inicial. Cada rota continua responsável pelo próprio texto e pelos metadados. As páginas de campanhas `/grupo` e `/original` usam a mesma lista numerada de etapas e mantêm seu conteúdo individual.

O formulário de cadastro agora usa o mesmo gerador de link de WhatsApp da loja e da página de campanha. O teste de regressão cobre acentos e caracteres reservados na mensagem. Os 18 testes da calculadora foram mantidos porque exercitam casos distintos de concentração, graduação, tolerância e limites.

A pendência que esta varredura apontou na ação `app/cadastro/actions.ts` (dados pessoais no log e erro do banco devolvido ao navegador) foi resolvida em 25/11; ver "Últimas mudanças".
