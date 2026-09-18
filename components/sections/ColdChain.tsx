import Image from "next/image";

const stats = [
  { value: "2–8 °C", detail: "faixa mantida do estoque à entrega, com registro no envio" },
  { value: "48h", detail: "autonomia térmica da embalagem em rotas mais longas" },
  { value: "100%", detail: "dos pedidos com lacre numerado e código de rastreio" },
] as const;

export default function ColdChain() {
  return (
    <section
      aria-labelledby="cold-chain-title"
      className="cold-chain"
      id="cadeia-de-frio"
    >
      <div className="cold-chain__inner">
        <div>
          <p className="cold-chain__label">Cadeia de frio</p>
          <h2 className="section-title cold-chain__title" id="cold-chain-title">
            O que acontece entre o estoque e a sua porta.
          </h2>
          <p className="cold-chain__lede">
            Nada sai sem conferência dupla de lote e temperatura. Você recebe fotos
            do lacre e o código de rastreio antes de a caixa deixar Brasília.
          </p>

          <ul className="cold-chain__stats">
            {stats.map((stat) => (
              <li key={stat.value}>
                <strong>{stat.value}</strong>
                <span>{stat.detail}</span>
              </li>
            ))}
          </ul>
        </div>

        <figure className="cold-chain__figure">
          <Image
            alt="Embalagens Pharmil prontas para envio"
            height={768}
            sizes="(max-width: 900px) 92vw, 520px"
            src="/images/pharmil-products-hero.jpg"
            width={1376}
          />
          <figcaption>
            Conferência de lote antes do fechamento da caixa térmica. As embalagens
            variam conforme o fabricante do lote disponível.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
