import type { ButtonHTMLAttributes, ReactNode } from "react";

export type EyebrowTone = "wine" | "orange" | "muted";

/**
 * Rotulo curto em caixa alta acima de um titulo. Tracking positivo — e o
 * oposto do display, que fecha.
 */
export function Eyebrow({
  tone = "wine",
  children,
}: {
  tone?: EyebrowTone;
  children: ReactNode;
}) {
  return <p className={`ds-eyebrow ds-eyebrow--${tone}`}>{children}</p>;
}

/** Selo sobre imagem. Curto: duas ou tres palavras. */
export function Badge({ children }: { children: ReactNode }) {
  return <span className="ds-badge">{children}</span>;
}

/** Pilula com ponto, usada como assinatura de topo de secao. */
export function DotPill({ children }: { children: ReactNode }) {
  return (
    <p className="ds-dot-pill">
      <span aria-hidden="true" />
      {children}
    </p>
  );
}

export type FilterPillProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  /** Contador opcional, renderizado com menos enfase que o rotulo. */
  count?: number;
  children: ReactNode;
};

/** Filtro de lista. O estado ativo inverte para preenchimento wine. */
export function FilterPill({
  active = false,
  count,
  children,
  className,
  ...rest
}: FilterPillProps) {
  return (
    <button
      {...rest}
      aria-pressed={active}
      className={["ds-filter", active && "is-active", className].filter(Boolean).join(" ")}
      type={rest.type ?? "button"}
    >
      {children}
      {count !== undefined ? <span>{count}</span> : null}
    </button>
  );
}

/** Sinal de confianca com icone. Nao e acao — nao recebe hover de clique. */
export function Chip({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="ds-chip">
      <span aria-hidden="true" className="ds-icon-box">
        {icon}
      </span>
      <span>{children}</span>
    </span>
  );
}

/** Container de icone de 38px. Da presenca a icones isolados. */
export function IconBox({ children }: { children: ReactNode }) {
  return (
    <span aria-hidden="true" className="ds-icon-box">
      {children}
    </span>
  );
}
