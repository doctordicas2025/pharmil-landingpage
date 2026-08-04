const trustSignals = [
  {
    title: "Procedência explicada",
    description:
      "Origem, identificação e informações disponíveis sobre o item podem ser consultadas antes da decisão.",
  },
  {
    title: "Condições antecipadas",
    description:
      "Disponibilidade, valor, prazo e forma de acondicionamento são alinhados antes da confirmação.",
  },
  {
    title: "Entrega acompanhada",
    description:
      "A modalidade e os recursos de rastreamento disponíveis para o destino são informados no atendimento.",
  },
  {
    title: "Atendimento humano",
    description:
      "Dúvidas sobre o processo são tratadas por uma equipe, com respostas objetivas e contexto.",
  },
] as const;

function CheckIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
      <circle cx="12" cy="12" fill="none" r="9" stroke="currentColor" />
      <path d="m7.5 12 3 3 6-7" fill="none" stroke="currentColor" />
    </svg>
  );
}

export default function Trust() {
  return (
    <section
      aria-labelledby="trust-title"
      className="trust-section"
      id="confianca"
    >
      <div className="section-shell trust-section__layout">
        <header className="trust-section__header">
          <h2 className="section-title" id="trust-title">
            Confiança se constrói com informação verificável.
          </h2>
          <p className="section-intro">
            Em vez de promessas amplas, a Pharmil coloca produto, processo e
            entrega no centro da conversa.
          </p>
        </header>

        <ul className="trust-section__signals">
          {trustSignals.map((signal) => (
            <li className="trust-signal" key={signal.title}>
              <span className="trust-signal__icon">
                <CheckIcon />
              </span>
              <div>
                <h3 className="trust-signal__title">{signal.title}</h3>
                <p className="trust-signal__description">
                  {signal.description}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <aside className="trust-section__commitment">
          <p className="trust-section__commitment-label">Nosso compromisso</p>
          <p>
            Clareza sobre o que é oferecido e como o pedido funciona. O conteúdo
            desta página não promete resultado clínico nem substitui orientação
            profissional.
          </p>
        </aside>
      </div>
    </section>
  );
}
