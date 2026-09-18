"use client";

import Image from "next/image";
import { useState } from "react";

import { Category, formatPrice, products } from "@/lib/catalog";
import { getWhatsappHref } from "@/lib/site-config";

type Filter = "Todos" | Category;

const filters: Filter[] = ["Todos", "GLP-1", "Skin", "Recovery"];

const categoryCards = [
  {
    cat: "GLP-1" as Category,
    index: "01",
    image: "/images/cut-lipoless.png",
    detail: "Tirzepatida e Retatrutida, em frasco e em caneta.",
  },
  {
    cat: "Skin" as Category,
    index: "02",
    image: "/images/cut-ghkcu.png",
    detail: "GHK-Cu e Glow, liofilizados com laudo por lote.",
  },
  {
    cat: "Recovery" as Category,
    index: "03",
    image: "/images/cut-klow.png",
    detail: "Blends de manutenção, como o Klow.",
  },
];

const orderHref = (name: string, presentation: string) =>
  getWhatsappHref(
    `Olá, vim pelo site da Pharmil e quero pedir: ${name} (${presentation}).`,
  );

export default function Shop() {
  const [cat, setCat] = useState<Filter>("Todos");
  const [detailId, setDetailId] = useState<string | null>(null);

  const countFor = (f: Filter) =>
    f === "Todos" ? products.length : products.filter((p) => p.category === f).length;

  const visible = cat === "Todos" ? products : products.filter((p) => p.category === cat);
  const detail = products.find((p) => p.id === detailId) ?? null;

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
            Escolha pela finalidade. Cada produto abre com dosagem, apresentação e
            orientação de conservação.
          </p>
        </div>

        <ul className="categories__grid">
          {categoryCards.map((card) => (
            <li key={card.cat}>
              <button
                className="category-card"
                onClick={() => pick(card.cat)}
                type="button"
              >
                <span className="category-card__thumb">
                  <Image alt="" height={220} src={card.image} width={220} />
                </span>
                <span className="category-card__body">
                  <span className="category-card__index">{card.index}</span>
                  <strong className="category-card__title">{card.cat}</strong>
                  <span className="category-card__detail">{card.detail}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="loja-title" className="shop" id="loja">
        <div className="shop__header">
          <p className="shop__label">Nossos produtos</p>
          <h2 className="section-title" id="loja-title">
            A lojinha Pharmil.
          </h2>
          <p className="section-intro">
            Preço à vista em PIX. Toque em um produto para ver apresentação,
            conservação e o que acompanha.
          </p>
        </div>

        <div aria-label="Filtrar por linha" className="shop__filters" role="tablist">
          {filters.map((f) => (
            <button
              aria-selected={cat === f}
              className={`shop__filter${cat === f ? " is-active" : ""}`}
              key={f}
              onClick={() => setCat(f)}
              role="tab"
              type="button"
            >
              {f} <span>{countFor(f)}</span>
            </button>
          ))}
        </div>

        <ul className="shop__grid">
          {visible.map((p) => (
            <li className="product" key={p.id}>
              <button
                aria-label={`Ver detalhes de ${p.name}`}
                className="product__media"
                onClick={() => setDetailId(p.id)}
                style={{ background: p.tint }}
                type="button"
              >
                <Image
                  alt={p.name}
                  className={`product__image product__image--${p.fit}`}
                  height={432}
                  sizes="(max-width: 640px) 90vw, 300px"
                  src={p.image}
                  width={432}
                />
                {p.badge ? <span className="product__badge">{p.badge}</span> : null}
              </button>

              <div className="product__body">
                <p className="product__category">{p.category}</p>
                <h3 className="product__name">{p.name}</h3>
                <p className="product__presentation">{p.presentation}</p>
              </div>

              <div className="product__footer">
                <p className="product__price">
                  {formatPrice(p.price)} <small>no PIX</small>
                </p>
                <div className="product__actions">
                  <a
                    className="product__buy"
                    href={orderHref(p.name, p.presentation)}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Pedir no WhatsApp
                  </a>
                  <button
                    aria-label={`Ver detalhes de ${p.name}`}
                    className="product__more"
                    onClick={() => setDetailId(p.id)}
                    type="button"
                  >
                    <span aria-hidden="true">+</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <p className="shop__notice">
          Produtos sujeitos a disponibilidade de lote. A dispensação é feita por
          farmácia parceira habilitada, mediante prescrição e acompanhamento de
          profissional de saúde.
        </p>
      </section>

      {detail ? (
        <div className="modal" onClick={() => setDetailId(null)} role="presentation">
          <div
            aria-labelledby="modal-title"
            aria-modal="true"
            className="modal__dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
          >
            <button
              aria-label="Fechar"
              className="modal__close"
              onClick={() => setDetailId(null)}
              type="button"
            >
              <span aria-hidden="true">✕</span>
            </button>

            <div className="modal__media">
              <Image
                alt={detail.name}
                height={520}
                sizes="(max-width: 700px) 90vw, 420px"
                src={detail.image}
                width={520}
              />
            </div>

            <div className="modal__body">
              <p className="product__category">{detail.category}</p>
              <h3 className="modal__title" id="modal-title">
                {detail.name}
              </h3>
              <p className="modal__description">{detail.description}</p>

              <dl className="modal__facts">
                {detail.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>

              <p className="modal__price">{formatPrice(detail.price)}</p>

              <a
                className="modal__cta"
                href={orderHref(detail.name, detail.presentation)}
                rel="noopener noreferrer"
                target="_blank"
              >
                Pedir este produto no WhatsApp
              </a>

              <p className="modal__note">
                Conservação sob refrigeração. Uso mediante prescrição e
                acompanhamento profissional.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
