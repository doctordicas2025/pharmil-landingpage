export type PriceProps = {
  /** O que se cobra hoje, ja formatado. */
  amount: string;
  /** Preco normal, ja formatado. So quando o de hoje e de campanha: vai riscado. */
  normalAmount?: string;
  /** Condicao curta ao lado do valor, como "no PIX". */
  note?: string;
  /** `lg` para o valor em destaque num dialogo. */
  size?: "md" | "lg";
};

/**
 * Valor de um produto. O preco de hoje carrega o peso e fica sempre na ultima
 * linha, para os valores de cards vizinhos se alinharem. O preco normal entra
 * acima, riscado e dito por extenso, para o desconto nao depender so do risco.
 */
export function Price({ amount, normalAmount, note, size = "md" }: PriceProps) {
  return (
    <div className={`ds-price ds-price--${size}`}>
      {normalAmount ? (
        <p className="ds-price__normal">
          Preço normal: <s>{normalAmount}</s>
        </p>
      ) : null}
      <p className="ds-price__amount">
        {amount}
        {note ? <small> {note}</small> : null}
      </p>
    </div>
  );
}
