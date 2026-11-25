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

const filters: Filter[] = [
  "Todos",
  "Linha Metabólica",
  "Linha Dérmica & Colágeno",
  "Linha Regenerativa",
];

const categoryCards: { cat: Category; index: string; label: string; detail: string }[] = [
  {
    cat: "Linha Metabólica",
    index: "01",
    label: "Linha Metabólica (MOMO / RETA)",
    detail: "Linhas MOMO (TG / Lipoless / Pepking) e RETA em kits e unidades selecionadas.",
  },
  {
    cat: "Linha Dérmica & Colágeno",
    index: "02",
    label: "Linha Dérmica & Colágeno (GHK / Glow)",
    detail: "GHK-Cu 100 e Glow Blend concentrados com conferência de lote.",
  },
  {
    cat: "Linha Regenerativa",
    index: "03",
    label: "Linha Regenerativa (Klow)",
    detail: "Blends concentrados de manutenção e recuperação, como o Klow 80.",
  },
];

const orderHref = (name: string) =>
  getWhatsappHref(`Olá, vim pelo catálogo da Pharmil e quero consultar: ${name}.`);

const priceOf = (p: ProductToday) => ({
  amount: formatPrice(p.price),
  normalAmount: p.discount ? formatPrice(p.discount.normalPrice) : undefined,
});

const factsOf = (p: ProductToday) =>
  [
    { label: "Apresentação", value: p.presentation },
    { label: "Origem", value: p.origin },
    { label: "Conservação", value: p.storage },
  ].filter((fact): fact is { label: string; value: string } => fact.value !== undefined);

export type ShopProps = {
  products: ProductToday[];
};

export default function Shop({ products }: ShopProps) {
  const [cat, setCat] = useState<Filter>("Todos");
  const [detailId, setDetailId] = useState<string | null>(null);

  const countFor = (f: Filter) =>
    f === "Todos" ? products.length : products.filter((p) => p.category === f).length;

  const visible = cat === "Todos" ? products : products.filter((p) => p.category === cat);
  const detail = products.find((p) => p.id === detailId) ?? null;

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
            Três linhas, um mesmo padrão de controle térmico.
          </h2>
          <p className="section-intro">
            Escolha pela finalidade do protocolo. Cada item abre com apresentação,
            valor no PIX e orientações de conservação 2°C a 8°C.
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
                  <strong className="category-card__title">{line.label}</strong>
                  <span className="category-card__detail">{line.detail}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="loja-title" className="shop" id="loja">
        <div className="shop__header">
          <Eyebrow>Catálogo de protocolos</Eyebrow>
          <h2 className="section-title" id="loja-title">
            Linhas disponíveis.
          </h2>
          <p className="section-intro">
            Preço à vista em PIX. Toque em um item para ver apresentação, conservação
            e conferência de lote.
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
          Disponibilidade sujeita à conferência de lote no atendimento. Envio em caixa
          térmica 2°C a 8°C com lacre numerado e código de rastreio.
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
                Consultar este item no WhatsApp
              </Button>

              <p className="modal__note">
                Conservação térmica 2°C a 8°C. Conferência de lote e suporte humano
                diretamente pelo WhatsApp.
              </p>
            </ModalBody>
          </>
        ) : null}
      </Modal>
    </>
  );
}
