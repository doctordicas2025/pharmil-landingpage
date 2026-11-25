import { Eyebrow, TextLink } from "@/design-system";

const networkItems = [
  {
    title: "Logística refrigerada 2°C–8°C",
    detail: "Caixa térmica lacrada com autonomia de até 48h na rota",
  },
  {
    title: "Conferência de lote",
    detail: "Validade, fotos da embalagem e registro enviados antes da postagem",
  },
  {
    title: "Suporte humano no WhatsApp",
    detail: "Acompanhamento direto da separação até a confirmação da entrega",
  },
] as const;

export type TrustProps = {
  contactHref: string;
};

export default function Trust({ contactHref }: TrustProps) {
  return (
    <section aria-labelledby="rede-title" className="network" id="rede">
      <div className="network__inner">
        <div>
          <Eyebrow>Operação e logística</Eyebrow>
          <h2 className="section-title" id="rede-title">
            Cadeia fria monitorada e suporte humano em cada envio.
          </h2>
          <p className="section-intro">
            A equipe Pharmil acompanha todo o fluxo: conferência de lote, embalagem
            térmica entre 2°C e 8°C e atendimento direto pelo WhatsApp sem robô.
          </p>
          <div className="network__action">
            <TextLink external href={contactHref}>
              Falar com a equipe
            </TextLink>
          </div>
        </div>

        <ul className="network__list">
          {networkItems.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              <small>{item.detail}</small>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
