// Testes do catalogo da loja. Rodar com: npm test
// Os valores esperados vem da Loja do app (app.pharmilmed.com) lida em 24/11/2026,
// nao da implementacao.

import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

import { catalogToday, priceToday, products } from "../lib/catalog.ts";

const RAIZ = new URL("../", import.meta.url);
const brasilia = (local) => new Date(`${local}-03:00`);
const HOJE = brasilia("2026-11-24T12:00:00");

const blackFriday = {
  name: "Black Friday",
  price: 349,
  firstDay: "2026-11-16",
  lastDay: "2026-11-30",
};
const ghk = { normalPrice: 599, campaign: blackFriday };

test("com a campanha valendo, cobra o preço dela e guarda o normal para riscar", () => {
  assert.deepEqual(priceToday(ghk, HOJE), {
    price: 349,
    discount: { campaign: "Black Friday", normalPrice: 599 },
  });
});

test("no último dia, 30/11 às 23:59 de Brasília, a campanha ainda vale", () => {
  // No relogio UTC ja e 01/12 02:59: o dia que conta e o de Brasilia.
  assert.equal(priceToday(ghk, brasilia("2026-11-30T23:59:00")).price, 349);
});

test("em 01/12 à 00:00 de Brasília o preço volta ao normal, sem selo nem riscado", () => {
  assert.deepEqual(priceToday(ghk, brasilia("2026-12-01T00:00:00")), { price: 599 });
});

test("antes do primeiro dia da campanha vale o preço normal", () => {
  assert.deepEqual(priceToday(ghk, brasilia("2026-11-15T23:59:00")), { price: 599 });
});

test("campanha igual ou maior que o normal não vira desconto", () => {
  for (const price of [599, 650]) {
    const product = { normalPrice: 599, campaign: { ...blackFriday, price } };
    assert.deepEqual(priceToday(product, HOJE), { price: 599 }, `campanha a ${price}`);
  }
});

test("produto sem campanha fica no preço normal", () => {
  assert.deepEqual(priceToday({ normalPrice: 769 }, HOJE), { price: 769 });
});

// [nome, preco de hoje, preco normal riscado]. Os 13 primeiros foram conferidos
// pelo dono na Loja do app; os demais, na mesma pagina, no mesmo dia. A ordem
// e a da vitrine do app. Oferta desligada la ("Unidade Ampola", "Veltrane
// 120mg") nao entra: a lista e exata.
// Tirzec MD: o dono baixou a campanha de 539 para 499 no proprio 24/11; o valor
// daqui e o do cadastro relido depois da mudanca.
const LOJA_DO_APP_EM_24_11 = [
  ["Black Combo: TG China + GHK-Cu 100", 814, null],
  ["TG 15 — Linha MOMO", 769, null],
  ["TG China 15 — Linha MOMO", 539, 549],
  ["Tirzec Kit 4 — Linha MOMO", 769, null],
  ["Tirzec MD 15 — Linha MOMO", 499, 649],
  ["GHK-Cu 100", 349, 599],
  ["Pepking 100 — Linha MOMO", 1000, 1100],
  ["Lipoless MD 15 — Linha MOMO", 589, 699],
  ["Synedica 40 — Linha RETA", 899, 1370],
  ["Glow Skin Booster", 849, 950],
  ["Pepking 60 — Linha RETA", 1100, null],
  ["T36 15 MD — Linha MOMO", 649, 699],
  ["Klow 80", 622, 797],
  ["Lipoless Kit 4 — Linha MOMO", 749, null],
  ["Tirzedral 15 — Linha MOMO", 749, null],
  ["Veltrane 90 — Linha RETA", 579, 649],
  ["Unidade avulsa Tirzec — Linha MOMO", 250, null],
  ["Unidade avulsa Lipoless — Linha MOMO", 250, null],
  ["Unidade avulsa TG China — Linha MOMO", 250, null],
  ["Unidade avulsa TG Paraguai — Linha MOMO", 250, null],
  ["Glow Blend", 580, 697],
  ["Vital Science 20 — Linha MOMO", 499, 529],
];

test("em 24/11/2026 a vitrine tem os produtos, a ordem, os preços e o selo da Loja do app", () => {
  assert.deepEqual(
    catalogToday(HOJE).map((p) => [p.name, p.price, p.discount ?? null]),
    LOJA_DO_APP_EM_24_11.map(([name, today, normal]) => [
      name,
      today,
      normal ? { campaign: "Black Friday", normalPrice: normal } : null,
    ]),
  );
});

test("em 01/12 a vitrine inteira está no preço normal", () => {
  assert.deepEqual(
    catalogToday(brasilia("2026-12-01T00:00:00")).map((p) => [p.name, p.price, p.discount ?? null]),
    LOJA_DO_APP_EM_24_11.map(([name, today, normal]) => [name, normal ?? today, null]),
  );
});

test("os ids dos produtos são únicos", () => {
  const ids = products.map((p) => p.id);
  assert.deepEqual(ids, [...new Set(ids)]);
});

test("toda foto é a do cadastro e existe em public/images/catalogo", () => {
  for (const p of products) {
    assert.match(p.image, /^\/images\/catalogo\/[a-z0-9-]+\.webp$/, p.name);
    assert.ok(existsSync(new URL(`public${p.image}`, RAIZ)), `${p.name}: falta ${p.image}`);
  }
});

test("GHK-Cu nunca aparece como GHK-CU", () => {
  assert.doesNotMatch(JSON.stringify(products), /GHK-?CU/);
});

// Arquivos de codigo e estilo, sem node_modules nem a referencia estatica do
// design system (que tem as proprias copias em reference/assets).
function arquivosDeCodigo(pasta) {
  return readdirSync(new URL(pasta, RAIZ), { withFileTypes: true }).flatMap((item) => {
    const caminho = `${pasta}${item.name}`;
    if (item.isDirectory()) return item.name === "reference" ? [] : arquivosDeCodigo(`${caminho}/`);
    return /\.(tsx?|css)$/.test(item.name) ? [caminho] : [];
  });
}

test("toda imagem citada no código existe em public/", () => {
  const pastas = ["app/", "components/", "design-system/", "lib/", "styles/"];
  for (const arquivo of pastas.flatMap(arquivosDeCodigo)) {
    const texto = readFileSync(new URL(arquivo, RAIZ), "utf8");
    for (const [imagem] of texto.matchAll(/\/(?:images|brand)\/[\w./-]+\.(?:png|jpe?g|webp|svg)/g)) {
      assert.ok(existsSync(new URL(`public${imagem}`, RAIZ)), `${arquivo} cita ${imagem}`);
    }
  }
});
