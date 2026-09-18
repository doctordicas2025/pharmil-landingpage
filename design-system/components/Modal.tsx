"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  /** Rotulo acessivel do dialogo. */
  title: string;
  children: ReactNode;
};

/**
 * Dialogo sobreposto. Fecha no clique fora, no botao e no Escape — as tres
 * saidas, porque quem abriu por engano procura a que conhece.
 */
export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="ds-modal" onClick={onClose} role="presentation">
      <div
        aria-label={title}
        aria-modal="true"
        className="ds-modal__dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <button
          aria-label="Fechar"
          className="ds-modal__close"
          onClick={onClose}
          type="button"
        >
          <span aria-hidden="true">✕</span>
        </button>
        {children}
      </div>
    </div>
  );
}

/** Coluna de imagem do dialogo, sobre superficie neutra. */
export function ModalMedia({ children }: { children: ReactNode }) {
  return <div className="ds-modal__media">{children}</div>;
}

/** Coluna de conteudo do dialogo. */
export function ModalBody({ children }: { children: ReactNode }) {
  return <div className="ds-modal__body">{children}</div>;
}

export type FactListProps = {
  facts: readonly { label: string; value: string }[];
};

/** Tabela de fatos: rotulo discreto a esquerda, valor com peso a direita. */
export function FactList({ facts }: FactListProps) {
  return (
    <dl className="ds-facts">
      {facts.map((fact) => (
        <div key={fact.label}>
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
