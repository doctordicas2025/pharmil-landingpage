import type { ReactNode } from "react";

/** Indicador de carregamento. Herda a cor do contexto. */
export function Spinner({ label }: { label?: string }) {
  return (
    <span aria-hidden={label ? undefined : true} className="ds-spinner" role={label ? "status" : undefined}>
      {label ? <span className="ds-sr-only">{label}</span> : null}
    </span>
  );
}

export type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

/** Ausencia de dado explicada. Nunca deixar area vazia sem texto. */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="ds-state ds-state--empty">
      <p className="ds-state__title">{title}</p>
      {description ? <p className="ds-state__description">{description}</p> : null}
      {action ? <div className="ds-state__action">{action}</div> : null}
    </div>
  );
}

export type ErrorStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

/** Falha recuperavel. Sempre com saida — nunca so a mensagem. */
export function ErrorState({ title, description, action }: ErrorStateProps) {
  return (
    <div className="ds-state ds-state--error" role="alert">
      <p className="ds-state__title">{title}</p>
      {description ? <p className="ds-state__description">{description}</p> : null}
      {action ? <div className="ds-state__action">{action}</div> : null}
    </div>
  );
}

/** Esqueleto de carregamento. Usa a mesma altura do conteudo que substitui. */
export function Skeleton({ height = 16, width }: { height?: number; width?: number | string }) {
  return (
    <span
      aria-hidden="true"
      className="ds-skeleton"
      style={{ height, width: width ?? "100%" }}
    />
  );
}
