// PENDENCIA: os tres depoimentos abaixo vieram do pacote de design como
// PLACEHOLDER — nao sao de clientes reais. Substitua por depoimentos reais com
// autorizacao de uso, ou remova a secao de `app/page.tsx`.
const testimonials = [
  {
    quote:
      "Perguntei sobre o lote e me mandaram foto da caixa e do laudo em dois minutos. Não estou acostumada com esse nível de resposta.",
    author: "Camila R.",
    place: "Goiânia/GO",
  },
  {
    quote:
      "Chegou gelado, lacre intacto e com o rastreio funcionando desde o primeiro dia. Embalagem melhor que a de farmácia grande.",
    author: "Diego M.",
    place: "Belo Horizonte/MG",
  },
  {
    quote:
      "Explicaram o que eu precisava levar para o meu médico antes de fechar o pedido. Ninguém tentou me empurrar nada.",
    author: "Renata P.",
    place: "Curitiba/PR",
  },
] as const;

export default function Testimonials() {
  return (
    <section
      aria-labelledby="depoimentos-title"
      className="testimonials"
      id="depoimentos"
    >
      <h2 className="section-title" id="depoimentos-title">
        O que dizem sobre o atendimento.
      </h2>

      <ul className="testimonials__grid">
        {testimonials.map((item) => (
          <li className="testimonial" key={item.author}>
            <span aria-hidden="true" className="testimonial__mark">
              &ldquo;
            </span>
            <blockquote className="testimonial__quote">{item.quote}</blockquote>
            <p className="testimonial__author">
              <strong>{item.author}</strong> · {item.place}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
