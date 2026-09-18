import type { HTMLAttributes, ReactNode } from "react";

export type CardProps = HTMLAttributes<HTMLElement> & {
  /** Liga a elevacao no hover. So para card que leva a algum lugar. */
  interactive?: boolean;
  /** Superficie alternativa, para card sobre fundo `paper`. */
  tone?: "paper" | "surface";
  selected?: boolean;
  as?: "div" | "li" | "article";
  children: ReactNode;
};

/**
 * Superficie de conteudo. Trata estrutura por borda: sombra so aparece em
 * movimento, nunca em repouso.
 */
export function Card({
  interactive = false,
  tone = "paper",
  selected = false,
  as: Tag = "div",
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <Tag
      {...rest}
      className={[
        "ds-card",
        `ds-card--${tone}`,
        interactive && "is-interactive",
        selected && "is-selected",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Tag>
  );
}

/** Corpo com o padding padrao do card. */
export function CardBody({ children }: { children: ReactNode }) {
  return <div className="ds-card__body">{children}</div>;
}

/** Rodape empurrado para a base — mantem cards de alturas diferentes alinhados. */
export function CardFooter({ children }: { children: ReactNode }) {
  return <div className="ds-card__footer">{children}</div>;
}

export type CardMediaProps = {
  /** Fundo do poco. Use um token `--tint-*`, nunca hex solto. */
  tint: string;
  /** `contain` recorta com folga; `cover` preenche a area. */
  fit?: "contain" | "cover";
  children: ReactNode;
};

/** Poco de imagem de altura fixa no topo do card. */
export function CardMedia({ tint, fit = "contain", children }: CardMediaProps) {
  return (
    <div className={`ds-card__media ds-card__media--${fit}`} style={{ background: tint }}>
      {children}
    </div>
  );
}
