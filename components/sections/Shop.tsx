"use client";

import Image from "next/image";
import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardMedia,
  Eyebrow,
  FactList,
  FilterPill,
  IconButton,
  Modal,
  ModalBody,
  ModalMedia,
  Price,
} from "@/design-system";
import { formatPrice } from "@/lib/catalog";
import type { Category, ProductToday } from "@/lib/catalog";
import { getWhatsappHref } from "@/lib/site-config";

type Filter = "Todos" | Category;

const filters: Filter[] = ["Todos", "GLP-1", "Skin", "Recovery"];

const categoryCards: { cat: Category; index: string; detail: string }[] = [
  { cat: "GLP-1", index: "01", detail: "Tirzepatida e Retatrutida, em frasco e em caneta." },
  { cat: "Skin", index: "02", detail: "GHK-Cu e Glow, com laudo por lote." },
  { cat: "Recovery", index: "03", detail: "Blends de manutenção, como o Klow." },
];

const orderHref = (name: string) =>
  getWhatsappHref(`Olá, vim pelo site da Pharmil e quero pedir: ${name}.`);

// O preco de hoje e, em campanha, o normal que vai riscado ao lado.
const priceOf = (p: ProductToday) => ({
  amount: formatPrice(p.price),
  normalAmount: p.discount ? formatPrice(p.discount.normalPrice) : undefined,
});

// So entra a linha que o catalogo informa para o produto.
const factsOf = (p: ProductToday) =>
  [
    { label: "Apresentação", value: p.presentation },
    { label: "Origem", value: p.origin },
    { label: "Conservação", value: p.storage },
  ].filter((fact): fact is { label: string; value: string } => fact.value !== undefined);

export type ShopProps = {
  /** A vitrine do dia. O preco chega resolvido pelo servidor, para o relogio
   *  do visitante nao mudar o que a pagina mostra. */
  products: ProductToday[];
};

export default function Shop({ products }: ShopProps) {
  const [cat, setCat] = useState<Filter>("Todos");
  const [detailId, setDetailId] = useState<string | null>(null);

  const countFor = (f: Filter) =>
    f === "Todos" ? products.length : products.filter((p) => p.category === f).length;

  const visible = cat === "Todos" ? products : products.filter((p) => p.category === cat);
  const detail = products.find((p) => p.id === detailId) ?? null;

  // Cada linha leva a foto do primeiro produto dela na vitrine.
  const lines = categoryCards.flatMap((card) => {
    const first = products.find((p) => p.category === card.cat);
    return first ? [{ ...card, image: first.image }] : [];
  });

  const pick = (next: Category) => {
    setCat(next);
    document.getElementById("loja")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <section aria-labelledby="categorias-title" className="categories" id="categorias">
        <div className="categories__header">
          <h2 className="section-title" id="categorias-title">
            Três linhas, um mesmo padrão de controle.
          </h2>
          <p className="section-intro">
            Escolha pela finalidade. Cada produto abre com a foto da embalagem, o
            preço e as informações de apresentação e conservação disponíveis.
          </p>
        </div>

        <ul className="categories__grid">
          {lines.map((line) => (
            <li key={line.cat}>
              <button
                className="category-card"
                onClick={() => pick(line.cat)}
                type="button"
              >
                <span className="category-card__thumb">
                  <Image alt="" height={220} src={line.image} width={220} />
                </span>
                <span className="category-card__body">
                  <span className="category-card__index">{line.index}</span>
                  <strong className="category-card__title">{line.cat}</strong>
                  <span className="category-card__detail">{line.detail}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="loja-title" className="shop" id="loja">
        <div className="shop__header">
          <Eyebrow>Nossos produtos</Eyebrow>
          <h2 className="section-title" id="loja-title">
            A lojinha Pharmil.
          </h2>
          <p className="section-intro">
            Preço à vista em PIX. Toque em um produto para ver os detalhes.
          </p>
        </div>

        <div aria-label="Filtrar por linha" className="shop__filters" role="group">
          {filters.map((f) => (
            <FilterPill
              active={cat === f}
              count={countFor(f)}
              key={f}
              onClick={() => setCat(f)}
            >
              {f}
            </FilterPill>
          ))}
        </div>

        <ul className="shop__grid">
          {visible.map((p) => (
            <Card as="li" interactive key={p.id}>
              <button
                aria-label={`Ver detalhes de ${p.name}`}
                className="shop__media-trigger"
                onClick={() => setDetailId(p.id)}
                type="button"
              >
                <CardMedia>
                  <Image
                    alt={p.name}
                    height={432}
                    sizes="(max-width: 640px) 90vw, 300px"
                    src={p.image}
                    width={432}
                  />
                  {p.discount ? <Badge>{p.discount.campaign}</Badge> : null}
                </CardMedia>
              </button>

              <CardBody>
                <Eyebrow tone="muted">{p.category}</Eyebrow>
                <h3 className="product__name">{p.name}</h3>
                {p.presentation ? (
                  <p className="product__presentation">{p.presentation}</p>
                ) : null}
              </CardBody>

              <CardFooter>
                <Price {...priceOf(p)} note="no PIX" />
                <div className="product__actions">
                  <Button
                    href={orderHref(p.name)}
                    rel="noopener noreferrer"
                    target="_blank"
                    variant="inline"
                  >
                    Pedir no WhatsApp
                  </Button>
                  <IconButton
                    label={`Ver detalhes de ${p.name}`}
                    onClick={() => setDetailId(p.id)}
                  >
                    <span aria-hidden="true">+</span>
                  </IconButton>
                </div>
              </CardFooter>
            </Card>
          ))}
        </ul>

        <p className="shop__notice">
          Produtos sujeitos a disponibilidade de lote. A dispensação é feita por
          farmácia parceira habilitada, mediante prescrição e acompanhamento de
          profissional de saúde.
        </p>
      </section>

      <Modal
        onClose={() => setDetailId(null)}
        open={detail !== null}
        title={detail?.name ?? ""}
      >
        {detail ? (
          <>
            <ModalMedia>
              <Image
                alt={detail.name}
                height={520}
                sizes="(max-width: 700px) 90vw, 420px"
                src={detail.image}
                width={520}
              />
            </ModalMedia>

            <ModalBody>
              <Eyebrow tone="muted">{detail.category}</Eyebrow>
              <h3 className="modal__title">{detail.name}</h3>
              {detail.description ? (
                <p className="modal__description">{detail.description}</p>
              ) : null}

              <FactList facts={factsOf(detail)} />

              <div className="modal__price">
                {detail.discount ? <Badge>{detail.discount.campaign}</Badge> : null}
                <Price {...priceOf(detail)} size="lg" />
              </div>

              <Button
                block
                href={orderHref(detail.name)}
                rel="noopener noreferrer"
                target="_blank"
              >
                Pedir este produto no WhatsApp
              </Button>

              <p className="modal__note">
                Conservação sob refrigeração. Uso mediante prescrição e
                acompanhamento profissional.
              </p>
            </ModalBody>
          </>
        ) : null}
      </Modal>
    </>
  );
}
