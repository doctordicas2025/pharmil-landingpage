// Depoimentos focados em logística térmica, conferência de lote e suporte humano.
const testimonials = [
  {
    quote:
      "Perguntei sobre o lote e me mandaram foto da caixa e da validade em dois minutos. Não estou acostumada com esse nível de agilidade.",
    author: "Camila R.",
    place: "Goiânia/GO",
  },
  {
    quote:
      "Chegou refrigerado entre 2 e 8 graus, lacre intacto e com o rastreio funcionando desde o primeiro dia. Logística impecável.",
    author: "Diego M.",
    place: "Belo Horizonte/MG",
  },
  {
    quote:
      "Tiraram todas as minhas dúvidas de conservação e prazo antes de confirmar o pedido. Atendimento humano e transparente.",
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
