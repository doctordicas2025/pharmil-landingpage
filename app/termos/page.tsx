import type { Metadata } from "next";

import { Header } from "@/components/Header";
import Footer from "@/components/sections/Footer";
import { companyInfo, getContactHref } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Condições de uso dos serviços de intermediação de atendimento e logística da Pharmil.",
};

export default function TermosPage() {
  const contactHref = getContactHref();

  return (
    <>
      <Header contactHref={contactHref} />
      <main className="legal-page">
        <div className="legal-shell">
          <header className="legal-page__header">
            <p className="legal-page__eyebrow">Documento legal</p>
            <h1 className="legal-page__title">Termos de Uso</h1>
            <p className="legal-page__updated">
              Vigente desde {companyInfo.effectiveDate} &middot; Última
              atualização: {companyInfo.lastUpdated}
            </p>
          </header>

          <div className="legal-page__body">
            <h2>1. Quem somos</h2>
            <p>
              Este site é operado por <strong>{companyInfo.legalName}</strong>,
              inscrita no CNPJ sob o nº {companyInfo.cnpj}, com sede em{" "}
              {companyInfo.address}, doravante denominada &ldquo;Pharmil&rdquo;.
            </p>
            <p>
              Ao acessar este site ou utilizar nossos canais de atendimento, você
              declara ter lido, compreendido e concordado com estes Termos de
              Uso. Caso não concorde, não utilize os serviços.
            </p>

            <h2>2. Natureza do serviço</h2>
            <div className="legal-callout">
              <p>
                <strong>
                  A Pharmil atua exclusivamente como intermediária de atendimento
                  e logística.
                </strong>{" "}
                Não somos farmácia, drogaria ou distribuidora. Não realizamos
                dispensação, prescrição, manipulação ou comercialização direta de
                medicamentos.
              </p>
            </div>
            <p>Nosso serviço consiste em:</p>
            <ul>
              <li>
                Orientar o usuário sobre requisitos e etapas do atendimento;
              </li>
              <li>
                Intermediar o contato com farmácias parceiras devidamente
                habilitadas e regularizadas junto aos órgãos competentes;
              </li>
              <li>
                Organizar e acompanhar a logística de entrega, quando aplicável.
              </li>
            </ul>
            <p>
              A dispensação de qualquer item é realizada pela farmácia parceira,
              sob sua exclusiva responsabilidade técnica e legal, observadas as
              normas da ANVISA, do Conselho Federal de Farmácia e demais
              regulamentações aplicáveis.
            </p>

            <h2>3. Prescrição e orientação profissional</h2>
            <p>
              Itens sujeitos a prescrição somente podem ser dispensados mediante
              apresentação de receita válida, emitida por profissional de saúde
              habilitado, e observados os prazos e condições legais.
            </p>
            <p>
              Nenhum conteúdo deste site constitui aconselhamento médico,
              farmacêutico ou nutricional, tampouco promete resultado clínico,
              estético ou terapêutico. As informações têm caráter exclusivamente
              informativo e não substituem consulta, diagnóstico, prescrição ou
              acompanhamento de profissional habilitado.
            </p>

            <h2>4. Cadastro e responsabilidade do usuário</h2>
            <p>
              Para utilizar o atendimento, você deve ter no mínimo 18 anos e
              plena capacidade civil. Ao fornecer seus dados, você se compromete
              a:
            </p>
            <ul>
              <li>Prestar informações verdadeiras, exatas e atualizadas;</li>
              <li>
                Apresentar documentação legítima quando solicitada, incluindo
                prescrição válida;
              </li>
              <li>
                Não utilizar os serviços para finalidade ilícita ou em desacordo
                com a legislação vigente.
              </li>
            </ul>
            <p>
              O fornecimento de informações falsas ou de documentação irregular
              resulta no cancelamento imediato do atendimento, sem prejuízo das
              medidas cabíveis.
            </p>

            <h2>5. Valores e pagamento</h2>
            <p>
              Valores, formas de pagamento e custos de frete são informados e
              confirmados durante o atendimento, antes de qualquer cobrança.
              Nenhum pagamento deve ser realizado sem confirmação prévia das
              condições.
            </p>
            <p>
              Utilize apenas os canais oficiais da Pharmil. Não nos
              responsabilizamos por pagamentos efetuados a terceiros ou por meio
              de canais não oficiais. Em caso de dúvida sobre a autenticidade de
              um canal, entre em contato pelo e-mail {companyInfo.email}.
            </p>

            <h2>6. Prazos e entrega</h2>
            <p>
              Prazos de entrega são estimativos e variam conforme destino,
              modalidade de envio, disponibilidade e condições logísticas.
              Informações sobre acondicionamento, transporte e rastreamento são
              comunicadas antes da confirmação.
            </p>
            <p>
              Ao receber, confira a integridade da embalagem. Havendo qualquer
              alteração, avaria ou divergência, não utilize o conteúdo e entre em
              contato imediatamente pelos canais oficiais.
            </p>

            <h2>7. Cancelamento, troca e reembolso</h2>
            <h3>7.1. Direito de arrependimento</h3>
            <p>
              Nos termos do art. 49 do Código de Defesa do Consumidor, você pode
              desistir da contratação no prazo de <strong>7 (sete) dias
              corridos</strong> contados do recebimento, desde que o produto
              esteja em sua embalagem original, lacrado e sem indício de uso.
            </p>
            <h3>7.2. Restrições sanitárias</h3>
            <p>
              Por determinação sanitária, medicamentos e produtos para a saúde
              cuja embalagem tenha sido violada não podem ser devolvidos,
              trocados ou reintegrados ao estoque, salvo em caso de vício,
              avaria de transporte ou divergência de entrega.
            </p>
            <h3>7.3. Produtos com vício ou avaria</h3>
            <p>
              Constatado vício, avaria ou divergência, entre em contato em até 7
              (sete) dias do recebimento. Após análise, será oferecida a
              substituição do item, a restituição do valor pago ou o abatimento
              proporcional do preço, conforme o art. 18 do Código de Defesa do
              Consumidor.
            </p>
            <h3>7.4. Prazo de restituição</h3>
            <p>
              Aprovado o reembolso, a restituição é processada em até 30 (trinta)
              dias, pelo mesmo meio de pagamento utilizado na contratação. O
              prazo de compensação pode variar conforme a instituição financeira
              ou a operadora do cartão.
            </p>

            <h2>8. Limitação de responsabilidade</h2>
            <p>
              A Pharmil responde pelos serviços de intermediação e logística que
              presta diretamente. Não se responsabiliza por:
            </p>
            <ul>
              <li>
                Atos, omissões ou responsabilidade técnica das farmácias
                parceiras, que respondem pela dispensação;
              </li>
              <li>
                Uso indevido, armazenamento inadequado ou administração de
                qualquer item em desacordo com a orientação profissional e as
                instruções do rótulo;
              </li>
              <li>
                Resultados individuais, que variam conforme fatores clínicos e
                pessoais;
              </li>
              <li>
                Atrasos decorrentes de caso fortuito, força maior ou de fatores
                alheios ao nosso controle.
              </li>
            </ul>

            <h2>9. Propriedade intelectual</h2>
            <p>
              Marca, logotipo, textos, imagens, layout e código deste site são de
              titularidade da Pharmil ou de seus licenciantes, protegidos pela
              legislação de propriedade intelectual. É vedada a reprodução total
              ou parcial sem autorização prévia e por escrito.
            </p>

            <h2>10. Alterações destes Termos</h2>
            <p>
              Estes Termos podem ser atualizados a qualquer momento para refletir
              mudanças legais, regulatórias ou operacionais. A versão vigente é
              sempre a publicada nesta página, com a respectiva data de
              atualização. O uso continuado dos serviços após alterações implica
              concordância com a nova versão.
            </p>

            <h2>11. Legislação aplicável e foro</h2>
            <p>
              Estes Termos são regidos pelas leis da República Federativa do
              Brasil. Fica eleito o foro da comarca de{" "}
              {companyInfo.jurisdiction} para dirimir controvérsias, ressalvado o
              direito do consumidor de optar pelo foro de seu domicílio, nos
              termos do Código de Defesa do Consumidor.
            </p>

            <h2>12. Contato</h2>
            <p>
              Dúvidas, solicitações ou reclamações relacionadas a estes Termos
              podem ser encaminhadas para:
            </p>
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

            <a className="legal-back" href="/">
              <span aria-hidden="true">←</span> Voltar para a página inicial
            </a>
          </div>
        </div>
      </main>
      <Footer contactHref={contactHref} />
    </>
  );
}
