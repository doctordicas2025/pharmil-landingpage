# Estado atual da landing page Pharmil

## Varredura de 23/11/2026

A base revisada foi `90284a8`. As páginas de termos e privacidade passaram a compartilhar o cabeçalho do documento, os dados de contato e o retorno à página inicial. Cada rota continua responsável pelo próprio texto e pelos metadados. As páginas de campanhas `/grupo` e `/original` usam a mesma lista numerada de etapas e mantêm seu conteúdo individual.

O formulário de cadastro agora usa o mesmo gerador de link de WhatsApp da loja e da página de campanha. O teste de regressão cobre acentos e caracteres reservados na mensagem. Os 18 testes da calculadora foram mantidos porque exercitam casos distintos de concentração, graduação, tolerância e limites.

### Pendência identificada

A ação `app/cadastro/actions.ts` registra nome, telefone e origem do lead no servidor e devolve detalhes de erro do banco ao navegador. A decisão sobre retenção, acesso aos registros existentes e substituição por diagnóstico sem dados pessoais fica com o responsável pela operação. O teste da aplicação usa apenas dados sintéticos.
