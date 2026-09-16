import type { Metadata } from "next";
import Link from "next/link";

import { Header } from "@/components/Header";
import Footer from "@/components/sections/Footer";
import { companyInfo, getContactHref } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como a Pharmil coleta, usa, armazena e protege seus dados pessoais, conforme a LGPD.",
};

export default function PrivacidadePage() {
  const contactHref = getContactHref();

  return (
    <>
      <Header contactHref={contactHref} />
      <main className="legal-page">
        <div className="legal-shell">
          <header className="legal-page__header">
            <p className="legal-page__eyebrow">Documento legal</p>
            <h1 className="legal-page__title">Política de Privacidade</h1>
            <p className="legal-page__updated">
              Vigente desde {companyInfo.effectiveDate} &middot; Última
              atualização: {companyInfo.lastUpdated}
            </p>
          </header>

          <div className="legal-page__body">
            <h2>1. Controlador dos dados</h2>
            <p>
              <strong>{companyInfo.legalName}</strong>, inscrita no CNPJ sob o nº{" "}
              {companyInfo.cnpj}, com sede em {companyInfo.address}, é a
              controladora dos dados pessoais tratados por meio deste site e dos
              canais de atendimento da Pharmil.
            </p>
            <p>
              Esta Política descreve como coletamos, utilizamos, armazenamos,
              compartilhamos e protegemos seus dados pessoais, em conformidade
              com a Lei nº 13.709/2018 (Lei Geral de Proteção de Dados
              Pessoais &ndash; LGPD).
            </p>

            <h2>2. Dados que coletamos</h2>
            <h3>2.1. Dados fornecidos por você</h3>
            <ul>
              <li>
                <strong>Identificação e contato:</strong> nome completo, telefone
                e, quando aplicável, e-mail e endereço de entrega;
              </li>
              <li>
                <strong>Informações de atendimento:</strong> o motivo do contato
                e as informações que você compartilha voluntariamente durante a
                conversa;
              </li>
              <li>
                <strong>Origem da indicação:</strong> identificador do parceiro
                ou campanha que originou seu acesso, quando presente no link.
              </li>
            </ul>

            <h3>2.2. Dados coletados automaticamente</h3>
            <ul>
              <li>
                Endereço IP, tipo de navegador, dispositivo e sistema
                operacional;
              </li>
              <li>
                Páginas acessadas, tempo de permanência e origem do tráfego.
              </li>
            </ul>

            <div className="legal-callout">
              <p>
                <strong>Dados sensíveis.</strong> Informações sobre saúde são
                consideradas dados pessoais sensíveis pela LGPD. Solicitamos
                apenas o estritamente necessário ao atendimento e os tratamos com
                proteção reforçada, mediante seu consentimento específico e
                destacado ou para o exercício regular de direitos. Não
                compartilhe informações de saúde além do necessário.
              </p>
            </div>

            <h2>3. Finalidades e bases legais</h2>
            <ul>
              <li>
                <strong>Prestar o atendimento solicitado</strong> &mdash;
                execução de contrato ou de procedimentos preliminares (art. 7º,
                V);
              </li>
              <li>
                <strong>Intermediar o contato com farmácias parceiras</strong>{" "}
                &mdash; execução de contrato (art. 7º, V) e, quanto a dados de
                saúde, consentimento específico (art. 11, I);
              </li>
              <li>
                <strong>Organizar e acompanhar a entrega</strong> &mdash;
                execução de contrato (art. 7º, V);
              </li>
              <li>
                <strong>Cumprir obrigações legais, fiscais e regulatórias</strong>{" "}
                &mdash; cumprimento de obrigação legal (art. 7º, II);
              </li>
              <li>
                <strong>Prevenir fraudes e garantir a segurança</strong> &mdash;
                legítimo interesse (art. 7º, IX);
              </li>
              <li>
                <strong>Comunicações promocionais</strong> &mdash; consentimento
                (art. 7º, I), revogável a qualquer momento.
              </li>
            </ul>

            <h2>4. Compartilhamento de dados</h2>
            <p>
              Não vendemos seus dados pessoais. O compartilhamento ocorre apenas
              nas hipóteses abaixo e sempre limitado ao necessário:
            </p>
            <ul>
              <li>
                <strong>Farmácias parceiras habilitadas</strong>, para viabilizar
                a dispensação solicitada;
              </li>
              <li>
                <strong>Operadores logísticos</strong>, para realizar a entrega;
              </li>
              <li>
                <strong>Prestadores de tecnologia</strong> (hospedagem, banco de
                dados e comunicação), que tratam os dados sob nossa instrução e
                com obrigações contratuais de confidencialidade;
              </li>
              <li>
                <strong>Instituições de pagamento</strong>, para processar
                transações;
              </li>
              <li>
                <strong>Autoridades públicas</strong>, quando exigido por lei,
                ordem judicial ou requisição de autoridade competente.
              </li>
            </ul>
            <p>
              Alguns prestadores podem armazenar dados fora do Brasil. Nesses
              casos, adotamos as garantias exigidas pelos arts. 33 a 36 da LGPD.
            </p>

            <h2>5. Cookies e tecnologias similares</h2>
            <p>
              Utilizamos cookies necessários ao funcionamento do site e, mediante
              seu consentimento, cookies analíticos para entender como as páginas
              são utilizadas. Você pode bloquear ou remover cookies nas
              configurações do seu navegador &mdash; o bloqueio de cookies
              necessários pode afetar o funcionamento de partes do site.
            </p>

            <h2>6. Armazenamento e segurança</h2>
            <p>
              Adotamos medidas técnicas e administrativas para proteger seus
              dados contra acesso não autorizado, perda, alteração ou divulgação
              indevida, incluindo criptografia em trânsito, controle de acesso
              restrito e registro de operações.
            </p>
            <p>
              Nenhum sistema é totalmente imune a incidentes. Caso ocorra
              incidente de segurança com risco relevante aos seus direitos,
              comunicaremos você e a Autoridade Nacional de Proteção de Dados
              (ANPD), conforme o art. 48 da LGPD.
            </p>

            <h2>7. Prazo de retenção</h2>
            <p>
              Mantemos seus dados pelo tempo necessário ao cumprimento das
              finalidades descritas nesta Política ou pelos prazos exigidos em
              lei &mdash; entre eles, o prazo prescricional de 5 (cinco) anos
              previsto no Código de Defesa do Consumidor e os prazos fiscais
              aplicáveis. Encerrado o prazo, os dados são eliminados ou
              anonimizados.
            </p>

            <h2>8. Seus direitos como titular</h2>
            <p>
              Nos termos do art. 18 da LGPD, você pode solicitar a qualquer
              momento:
            </p>
            <ul>
              <li>Confirmação da existência de tratamento;</li>
              <li>Acesso aos seus dados;</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
              <li>
                Anonimização, bloqueio ou eliminação de dados desnecessários,
                excessivos ou tratados em desconformidade com a lei;
              </li>
              <li>Portabilidade a outro fornecedor de serviço ou produto;</li>
              <li>
                Eliminação dos dados tratados com base em consentimento,
                ressalvadas as hipóteses de guarda obrigatória;
              </li>
              <li>
                Informação sobre as entidades com as quais compartilhamos seus
                dados;
              </li>
              <li>
                Informação sobre a possibilidade de não fornecer consentimento e
                sobre as consequências dessa negativa;
              </li>
              <li>Revogação do consentimento a qualquer momento.</li>
            </ul>
            <p>
              As solicitações podem ser feitas pelo e-mail {companyInfo.email} e
              são respondidas nos prazos previstos na legislação. Podemos
              solicitar informações adicionais para confirmar sua identidade
              antes de atender ao pedido.
            </p>

            <h2>9. Encarregado pelo tratamento de dados</h2>
            <p>
              Para exercer seus direitos ou esclarecer dúvidas sobre esta
              Política, entre em contato com nosso encarregado (DPO) pelo e-mail{" "}
              {companyInfo.email}.
            </p>

            <h2>10. Alterações desta Política</h2>
            <p>
              Esta Política pode ser atualizada para refletir mudanças legais,
              regulatórias ou operacionais. A versão vigente é sempre a publicada
              nesta página, com a respectiva data de atualização. Alterações
              relevantes serão comunicadas pelos canais de contato informados.
            </p>

            <h2>11. Contato</h2>
            <ul>
              <li>
                <strong>E-mail:</strong> {companyInfo.email}
              </li>
              <li>
                <strong>Telefone:</strong> {companyInfo.phone}
              </li>
              <li>
                <strong>Endereço:</strong> {companyInfo.address}
              </li>
            </ul>

            <Link className="legal-back" href="/">
              <span aria-hidden="true">←</span> Voltar para a página inicial
            </Link>
          </div>
        </div>
      </main>
      <Footer contactHref={contactHref} />
    </>
  );
}
