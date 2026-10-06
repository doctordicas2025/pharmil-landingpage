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

export type NoticeTone = "info" | "warning" | "danger";

export type NoticeProps = {
  tone?: NoticeTone;
  title?: string;
  children: ReactNode;
};

const noticeIcon: Record<NoticeTone, ReactNode> = {
  info: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 9v5M10 6.2v.1" />
    </>
  ),
  warning: (
    <>
      <path d="M10 3 2.5 16.5h15z" />
      <path d="M10 8.5v3.5M10 14.4v.1" />
    </>
  ),
  danger: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 6v5M10 13.8v.1" />
    </>
  ),
};

/**
 * Aviso em linha, dentro do fluxo da pagina. O tom vem sempre acompanhado de
 * icone e texto: a cor reforca, nunca carrega o significado sozinha.
 */
export function Notice({ tone = "info", title, children }: NoticeProps) {
  return (
    <div className={`ds-notice ds-notice--${tone}`}>
      <svg aria-hidden="true" className="ds-notice__icon" focusable="false" viewBox="0 0 20 20">
        {noticeIcon[tone]}
      </svg>
      <div className="ds-notice__body">
        {title ? <p className="ds-notice__title">{title}</p> : null}
        <div className="ds-notice__text">{children}</div>
      </div>
    </div>
  );
}
