"use client";

import type { ReactNode } from "react";
import { useState } from "react";

export type AccordionItem = {
  question: string;
  answer: ReactNode;
};

export type AccordionProps = {
  items: readonly AccordionItem[];
  /** Indice aberto no primeiro render. -1 abre nenhum. */
  defaultOpen?: number;
};

/**
 * Lista de perguntas com uma resposta aberta por vez. Controlado por indice
 * em vez de `<details>` para que o estado seja legivel de fora.
 */
export function Accordion({ items, defaultOpen = 0 }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState(defaultOpen);

  return (
    <ul className="ds-accordion">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <li className="ds-accordion__item" key={item.question}>
            <button
              aria-expanded={open}
              className="ds-accordion__trigger"
              onClick={() => setOpenIndex(open ? -1 : index)}
              type="button"
            >
              {item.question}
              <span aria-hidden="true" className="ds-accordion__marker">
                {open ? "−" : "+"}
              </span>
            </button>
            {open ? <div className="ds-accordion__panel">{item.answer}</div> : null}
          </li>
        );
      })}
    </ul>
  );
}

export type StatProps = {
  value: string;
  detail: string;
  /** Sobre superficie escura, inverte os neutros. */
  onDark?: boolean;
};

/** Numero com significado ao lado. Sozinho, um numero nao e design. */
export function Stat({ value, detail, onDark = false }: StatProps) {
  return (
    <div className={["ds-stat", onDark && "is-on-dark"].filter(Boolean).join(" ")}>
      <strong>{value}</strong>
      <span>{detail}</span>
    </div>
  );
}

export type TextLinkProps = {
  href: string;
  external?: boolean;
  children: ReactNode;
};

/** Link de texto com sublinhado proprio, que fecha no hover. */
export function TextLink({ href, external = false, children }: TextLinkProps) {
  const target = external ? { rel: "noopener noreferrer", target: "_blank" } : {};
  return (
    <a className="ds-text-link" href={href} {...target}>
      {children}
    </a>
  );
}
