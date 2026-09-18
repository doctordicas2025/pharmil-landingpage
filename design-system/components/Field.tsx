"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { useId } from "react";

export type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: string;
  /** Mensagem de erro. Presente = campo entra em estado de erro. */
  error?: string;
  /** Texto de apoio abaixo do campo, suprimido quando ha erro. */
  hint?: string;
};

/**
 * Campo de texto. O erro e sempre texto, nunca so a borda vermelha — cor
 * sozinha nao comunica para quem nao a distingue.
 */
export function Field({ label, error, hint, className, ...rest }: FieldProps) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={["ds-field", error && "has-error", className].filter(Boolean).join(" ")}>
      <label className="ds-field__label" htmlFor={id}>
        {label}
      </label>
      <input
        {...rest}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className="ds-field__input"
        id={id}
      />
      {error ? (
        <p className="ds-field__error" id={`${id}-error`}>
          {error}
        </p>
      ) : hint ? (
        <p className="ds-field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export type OptionGroupProps = {
  label: string;
  name: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
};

/**
 * Escolha unica apresentada como cartoes tocaveis. O radio nativo fica
 * acessivel mas invisivel: o estado selecionado e desenhado no rotulo.
 */
export function OptionGroup({
  label,
  name,
  options,
  value,
  onChange,
  error,
  disabled = false,
}: OptionGroupProps) {
  return (
    <fieldset className={["ds-options", error && "has-error"].filter(Boolean).join(" ")}>
      <legend className="ds-field__label">{label}</legend>
      <div className="ds-options__list">
        {options.map((option) => (
          <label
            className={[
              "ds-option",
              value === option && "is-selected",
              disabled && "is-disabled",
            ]
              .filter(Boolean)
              .join(" ")}
            key={option}
          >
            <input
              checked={value === option}
              className="ds-sr-only"
              disabled={disabled}
              name={name}
              onChange={(e) => onChange(e.target.value)}
              type="radio"
              value={option}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      {error ? <p className="ds-field__error">{error}</p> : null}
    </fieldset>
  );
}

/** Agrupa campos com o espacamento vertical do sistema. */
export function FieldSet({ children }: { children: ReactNode }) {
  return <div className="ds-fieldset">{children}</div>;
}
