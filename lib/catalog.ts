// Catálogo da vitrine (/catalogo): mesmas fotos em public/images/catalogo,
// preços normais e campanha Black Friday (16 a 30/11/2026) da Loja do app,
// com nomenclatura de protocolos (Linhas MOMO, RETA, GHK e blends).
// Coberto por tests/catalog.test.mjs e tests/dosage.test.mjs.

export type Category =
  | "Linha Metabólica"
  | "Linha Dérmica & Colágeno"
  | "Linha Regenerativa";

/** Preco de campanha do cadastro. Vale do primeiro ao ultimo dia, inclusive,
 *  no calendario de Brasilia (AAAA-MM-DD), e so quando e menor que o normal. */
export type Campaign = {
  name: string;
  price: number;
  firstDay: string;
  lastDay: string;
};

export type Product = {
  id: string;
  /** Nome codificado da oferta na vitrine. */
  name: string;
  category: Category;
  /** O que se cobra hoje sai de priceToday(). */
  normalPrice: number;
  campaign?: Campaign;
  /** Foto do cadastro, guardada em public/images/catalogo. */
  image: string;
  /** Como o kit/unidade vem, em uma linha. */
  presentation?: string;
  description?: string;
  /** Pais de origem, com o nome que a vitrine informa. */
  origin?: string;
  /** Orientacao de conservacao termica. */
  storage?: string;
  /** Solucao pronta para conversao na calculadora U-100. */
  solution?: Solution;
};

export type Solution = {
  substance: string;
  /** Concentracao impressa na embalagem: labelMg em labelMl. */
  labelMg: number;
  labelMl: number;
  /** Total em uma unidade. Define o rendimento. */
  vialMg: number;
  /** Como o kit/unidade vem, em uma linha. */
  vialNote: string;
};

// Black Friday do cadastro: de 16 a 30/11/2026. O preco e o de cada produto.
const blackFriday = (price: number): Campaign => ({
  name: "Black Friday",
  price,
  firstDay: "2026-11-16",
  lastDay: "2026-11-30",
});

const tgParaguaiStorage =
  "Mantenha as unidades refrigeradas entre 2 °C e 8 °C, mesmo lacradas. Proteja da luz e não congele. No transporte, mantenha a cadeia de frio entre 2 °C e 8 °C.";
const lipolessStorage =
  "Mantenha as unidades refrigeradas entre 2 °C e 8 °C, mesmo lacradas. Não congele. Cada unidade é de uso único.";
const refrigerated = "Conservação refrigerada entre 2 °C e 8 °C";

export const products: Product[] = [
  {
    id: "black-combo",
    name: "Black Combo: TG China + GHK-Cu 100",
    category: "Linha Metabólica",
    normalPrice: 814,
    image: "/images/catalogo/black-combo-tg-china-ghk-cu.webp",
    description:
      "1 kit TG Origem China (4 unidades 15 mg/0,5 mL — Linha MOMO) + 1 unidade GHK-Cu Genixx Labs 100 mg.",
  },
  {
    id: "tg15",
    name: "TG 15 — Linha MOMO",
    category: "Linha Metabólica",
    normalPrice: 769,
    image: "/images/catalogo/tg-15-4-frascos.webp",
    presentation: "TG Paraguai (Indufar) 15 mg/0,5 mL · Kit com 4 unidades",
    origin: "Paraguai",
    storage: tgParaguaiStorage,
    solution: {
      substance: "Linha MOMO",
      labelMg: 15,
      labelMl: 0.5,
      vialMg: 15,
      vialNote: "kit com 4 unidades de 15 mg",
    },
  },
  {
    id: "tg-china",
    name: "TG China 15 — Linha MOMO",
    category: "Linha Metabólica",
    normalPrice: 549,
    campaign: blackFriday(539),
    image: "/images/catalogo/tg-15-4-frascos.webp",
    presentation: "Kit com 4 unidades · 15 mg/0,5 mL",
    origin: "China",
  },
  {
    id: "tirzec-4",
    name: "Tirzec Kit 4 — Linha MOMO",
    category: "Linha Metabólica",
    normalPrice: 769,
    image: "/images/catalogo/tirzec-4-ampolas.webp",
    presentation: "Kit com 4 unidades · 15 mg",
    origin: "Paraguai",
  },
  {
    id: "tirzec-md",
    name: "Tirzec MD 15 — Linha MOMO",
    category: "Linha Metabólica",
    normalPrice: 649,
    campaign: blackFriday(499),
    image: "/images/catalogo/tirzec-md-15.webp",
    presentation:
      "Tirzec MD (Quimfa) · 1 unidade multidose de 2 mL · 15 mg por 0,5 mL (60 mg total)",
    origin: "Paraguai",
    storage:
      "Conserve a unidade refrigerada entre 2 °C e 8 °C, mesmo lacrada. Após abertura, mantenha nessa faixa por no máximo quatro semanas.",
  },
  {
    id: "ghkcu",
    name: "GHK-Cu 100",
    category: "Linha Dérmica & Colágeno",
    normalPrice: 599,
    campaign: blackFriday(349),
    image: "/images/catalogo/ghk-cu-genixx-100mg.webp",
    description: "GHK-Cu Genixx Labs 100 mg · Unidade concentrada com conferência de lote.",
    origin: "Estados Unidos",
  },
  {
    id: "tirze100",
    name: "Pepking 100 — Linha MOMO",
    category: "Linha Metabólica",
    normalPrice: 1100,
    campaign: blackFriday(1000),
    image: "/images/catalogo/tirzepatida-pepking-100.webp",
    presentation: "Unidade concentrada · 100 mg",
    description:
      "Unidade concentrada de 100 mg da Linha MOMO com conferência de lote e envio térmico monitorado.",
    origin: "Inglaterra",
    storage: refrigerated,
  },
  {
    id: "lipoless",
    name: "Lipoless MD 15 — Linha MOMO",
    category: "Linha Metabólica",
    normalPrice: 699,
    campaign: blackFriday(589),
    image: "/images/catalogo/lipoless-md-15.webp",
    presentation:
      "Lipoless MD (Éticos) · 1 unidade multidose de 2,4 mL · 15 mg por 0,6 mL (60 mg total)",
    origin: "Paraguai",
    storage:
      "Guarde a unidade refrigerada entre 2 °C e 8 °C, mesmo lacrada. Proteja da luz e não congele. Após abertura, mantenha refrigerada por até 30 dias.",
    solution: {
      substance: "Linha MOMO",
      labelMg: 15,
      labelMl: 0.6,
      vialMg: 60,
      vialNote: "1 unidade multidose com 4 doses de 15 mg",
    },
  },
  {
    id: "reta40",
    name: "Synedica 40 — Linha RETA",
    category: "Linha Metabólica",
    normalPrice: 1370,
    campaign: blackFriday(899),
    image: "/images/catalogo/retatrutida-synedica-40.webp",
    presentation: "Kit aplicador · 40 mg",
    description:
      "Apresentação em kit da Linha RETA 40 mg. Disponibilidade e lote confirmados no atendimento.",
    origin: "Alemanha",
    storage: refrigerated,
  },
  {
    id: "glow-skin-booster",
    name: "Glow Skin Booster",
    category: "Linha Dérmica & Colágeno",
    normalPrice: 950,
    campaign: blackFriday(849),
    image: "/images/catalogo/glow-alluvi.webp",
    description:
      "Glow GHK-Cu Alluvi Healthcare · Kit com duas unidades; marcação da embalagem: 10/10/50 mg.",
    origin: "Inglaterra",
  },
  {
    id: "reta60",
    name: "Pepking 60 — Linha RETA",
    category: "Linha Metabólica",
    normalPrice: 1100,
    image: "/images/catalogo/reta-60-pepking.webp",
    presentation: "Unidade concentrada · 60 mg",
    description:
      "Unidade concentrada de 60 mg da Linha RETA com envio térmico 2°C a 8°C e conferência de lote.",
    origin: "Inglaterra",
    storage: refrigerated,
  },
  {
    id: "t36-md",
    name: "T36 15 MD — Linha MOMO",
    category: "Linha Metabólica",
    normalPrice: 699,
    campaign: blackFriday(649),
    image: "/images/catalogo/t36-md-15.webp",
    presentation: "T36 15 MD (Laboratorios Catedral) · 1 unidade multidose de 2,4 mL",
    origin: "Paraguai",
    storage:
      "Mantenha a unidade refrigerada entre 2 °C e 8 °C, mesmo lacrada. Não congele. Após abertura, mantenha refrigerada por até 30 dias.",
  },
  {
    id: "klow",
    name: "Klow 80",
    category: "Linha Regenerativa",
    normalPrice: 797,
    campaign: blackFriday(622),
    image: "/images/catalogo/klow-80mg.webp",
    description:
      "Klow BioPeptides 80 mg · Unidade concentrada da Linha Regenerativa com conferência de lote.",
    origin: "Estados Unidos",
  },
  {
    id: "lipoless-4",
    name: "Lipoless Kit 4 — Linha MOMO",
    category: "Linha Metabólica",
    normalPrice: 749,
    image: "/images/catalogo/lipoless-4-ampolas.webp",
    presentation: "Lipoless 15 mg/0,5 mL (Éticos) · Kit com 4 unidades",
    origin: "Paraguai",
    storage: lipolessStorage,
  },
  {
    id: "tirzedral",
    name: "Tirzedral 15 — Linha MOMO",
    category: "Linha Metabólica",
    normalPrice: 749,
    image: "/images/catalogo/tirzedral-15.webp",
    presentation: "Tirzedral 15 mg/0,5 mL (Laboratorios Catedral) · Kit com 4 unidades",
    origin: "Paraguai",
    storage:
      "Guarde as unidades entre 2 °C e 8 °C, sem congelar. Suporta até 28 dias consecutivos abaixo de 30 °C conforme rótulo do fabricante.",
  },
  {
    id: "veltrane90",
    name: "Veltrane 90 — Linha RETA",
    category: "Linha Metabólica",
    normalPrice: 649,
    campaign: blackFriday(579),
    image: "/images/catalogo/veltrane-gold-90.webp",
    description: "Unidade concentrada 90 mg da Linha RETA com envio térmico monitorado.",
    origin: "Bélgica",
  },
  {
    id: "avulsa-tirzec",
    name: "Unidade avulsa Tirzec — Linha MOMO",
    category: "Linha Metabólica",
    normalPrice: 250,
    image: "/images/catalogo/unidade-ampola.webp",
    description: "1 unidade avulsa Tirzec da Linha MOMO.",
    origin: "Paraguai",
  },
  {
    id: "avulsa-lipoless",
    name: "Unidade avulsa Lipoless — Linha MOMO",
    category: "Linha Metabólica",
    normalPrice: 250,
    image: "/images/catalogo/unidade-ampola.webp",
    presentation: "Lipoless 15 mg/0,5 mL (Éticos) · 1 unidade avulsa",
    description: "1 unidade avulsa Lipoless da Linha MOMO.",
    origin: "Paraguai",
    storage: lipolessStorage,
  },
  {
    id: "avulsa-tg-china",
    name: "Unidade avulsa TG China — Linha MOMO",
    category: "Linha Metabólica",
    normalPrice: 250,
    image: "/images/catalogo/unidade-ampola.webp",
    description: "1 unidade avulsa TG Origem China da Linha MOMO.",
    origin: "China",
  },
  {
    id: "avulsa-tg-paraguai",
    name: "Unidade avulsa TG Paraguai — Linha MOMO",
    category: "Linha Metabólica",
    normalPrice: 250,
    image: "/images/catalogo/unidade-ampola.webp",
    presentation: "TG Paraguai (Indufar) 15 mg/0,5 mL · 1 unidade avulsa",
    description: "1 unidade avulsa TG Origem Paraguai da Linha MOMO.",
    origin: "Paraguai",
    storage: tgParaguaiStorage,
  },
  {
    id: "glow",
    name: "Glow Blend",
    category: "Linha Dérmica & Colágeno",
    normalPrice: 697,
    campaign: blackFriday(580),
    image: "/images/catalogo/glow-alluvi.webp",
    description: "Blend concentrado 70 mg (GHK-Cu / BPC-157 / TB-500) da Linha Dérmica & Colágeno.",
    origin: "Estados Unidos",
  },
  {
    id: "vital-science-20",
    name: "Vital Science 20 — Linha MOMO",
    category: "Linha Metabólica",
    normalPrice: 529,
    campaign: blackFriday(499),
    image: "/images/catalogo/vital-science-20mg.webp",
    description: "Vital Science 20 mg · Unidade concentrada da Linha MOMO.",
    origin: "Inglaterra",
  },
];

export const formatPrice = (value: number) => `R$ ${value.toLocaleString("pt-BR")}`;

// O dia de Brasilia e o relogio do preco no app. en-CA escreve AAAA-MM-DD, que
// compara como texto com os dias da campanha.
const brasiliaDay = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" });

export type PriceToday = {
  price: number;
  /** So com campanha valendo hoje: o selo e o preco normal, que vai riscado. */
  discount?: { campaign: string; normalPrice: number };
};

/** O preco de um dia, pela mesma regra da Loja do app. */
export function priceToday(
  { normalPrice, campaign }: Pick<Product, "normalPrice" | "campaign">,
  now: Date,
): PriceToday {
  if (!campaign || campaign.price >= normalPrice) return { price: normalPrice };

  const day = brasiliaDay.format(now);
  if (day < campaign.firstDay || day > campaign.lastDay) return { price: normalPrice };

  return { price: campaign.price, discount: { campaign: campaign.name, normalPrice } };
}

/** Um produto como a vitrine mostra num dia: o preco ja resolvido. */
export type ProductToday = Omit<Product, "normalPrice" | "campaign"> & PriceToday;

export function catalogToday(now: Date): ProductToday[] {
  return products.map(({ normalPrice, campaign, ...shown }) => ({
    ...shown,
    ...priceToday({ normalPrice, campaign }, now),
  }));
}
