import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { Spinner } from "./Feedback";

export type ButtonVariant = "primary" | "secondary" | "inline";
export type ButtonSize = "md" | "sm";

type Common = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Ocupa toda a largura disponivel. */
  block?: boolean;
  /** Troca o rotulo por um spinner e bloqueia a interacao. */
  loading?: boolean;
  children: ReactNode;
};

type AsButton = Common &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & { href?: never };

type AsLink = Common &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & { href: string };

export type ButtonProps = AsButton | AsLink;

const classFor = (
  variant: ButtonVariant,
  size: ButtonSize,
  block: boolean,
  loading: boolean,
) =>
  [
    "ds-button",
    `ds-button--${variant}`,
    size === "sm" && "ds-button--sm",
    block && "ds-button--block",
    loading && "is-loading",
  ]
    .filter(Boolean)
    .join(" ");

/**
 * Acao primaria do sistema. Sempre pilula — a forma e o que diz "isto age".
 * Como link, exige href; como botao, aceita onClick e disabled.
 */
export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    block = false,
    loading = false,
    children,
    ...rest
  } = props;

  const className = [classFor(variant, size, block, loading), rest.className]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {loading ? <Spinner /> : null}
      <span className={loading ? "ds-button__label is-hidden" : "ds-button__label"}>
        {children}
      </span>
    </>
  );

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a {...anchorRest} className={className} href={href}>
        {content}
      </a>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      {...buttonRest}
      aria-busy={loading || undefined}
      className={className}
      disabled={buttonRest.disabled || loading}
      type={buttonRest.type ?? "button"}
    >
      {content}
    </button>
  );
}

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Obrigatorio: o botao nao tem rotulo visivel. */
  label: string;
  children: ReactNode;
};

/** Alvo de toque de 44px — o minimo do sistema, nunca menor. */
export function IconButton({ label, children, className, ...rest }: IconButtonProps) {
  return (
    <button
      {...rest}
      aria-label={label}
      className={["ds-icon-button", className].filter(Boolean).join(" ")}
      type={rest.type ?? "button"}
    >
      {children}
    </button>
  );
}
