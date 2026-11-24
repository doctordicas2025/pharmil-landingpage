// Catalogo da loja da landing: os mesmos produtos, nomes, fotos e precos da
// Loja do app (app.pharmilmed.com), na ordem da vitrine de la.
//
// Fonte: as regras de preco da sessao Pharmil3gp9 (sdr_price_rules) e o
// cadastro de produtos, lidos em 24/11/2026. Entra a oferta ligada de produto
// ativo. O preco mora so neste arquivo: mudou no cadastro, muda aqui.
//
// Texto de produto: o que o cadastro informa (descricao, apresentacao,
// conservacao, pais de origem). Onde ele nao informa, o campo fica de fora.
// Tirzepatida Peking 100mg e as duas Retatrutidas nao tem texto no cadastro e
// mantem o que a landing ja dizia delas.
// Coberto por tests/catalog.test.mjs.

export type Category = "GLP-1" | "Skin" | "Recovery";

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
  /** Nome da oferta na Loja do app. */
  name: string;
  category: Category;
  /** O que se cobra hoje sai de priceToday(). */
  normalPrice: number;
  campaign?: Campaign;
  /** Foto do cadastro, guardada em public/images/catalogo. */
  image: string;
  /** Como a caixa vem, em uma linha. */
  presentation?: string;
  description?: string;
  /** Pais de origem, com o nome que a Loja do app mostra. */
  origin?: string;
  /** Orientacao de conservacao. */
  storage?: string;
  /** Solucao pronta para seringa U-100. So quem tem este campo entra na
   *  calculadora de dose: caneta e frasco sem concentracao ficam de fora. */
  solution?: Solution;
};

export type Solution = {
  substance: string;
  /** Concentracao impressa na caixa: labelMg em labelMl. */
  labelMg: number;
  labelMl: number;
  /** Total em um frasco. Define quantas doses ele rende. */
  vialMg: number;
  /** Como a caixa vem, em uma linha. */
  vialNote: string;
};

// Black Friday do cadastro: de 16 a 30/11/2026. O preco e o de cada produto.
const blackFriday = (price: number): Campaign => ({
  name: "Black Friday",
  price,
  firstDay: "2026-11-16",
  lastDay: "2026-11-30",
});

// A caixa e a ampola avulsa do mesmo produto tem a mesma conservacao no cadastro.
const tgParaguaiStorage =
  "Mantenha os frascos refrigerados entre 2 °C e 8 °C, mesmo lacrados. Proteja da luz e não congele. No transporte, mantenha a cadeia de frio entre 2 °C e 8 °C.";
const lipolessStorage =
  "Mantenha os frascos na geladeira entre 2 °C e 8 °C, mesmo lacrados. Não congele. Cada frasco é de uso único. Descarte-o após o uso, inclusive se restar solução.";

// O que a landing ja dizia dos produtos sem conservacao no cadastro.
const refrigerated = "Refrigerado, entre 2 e 8 °C";

export const products: Product[] = [
  {
    id: "black-combo",
    name: "Black Combo: TG China + GHK-Cu",
    category: "GLP-1",
    normalPrice: 814,
    image: "/images/catalogo/black-combo-tg-china-ghk-cu.webp",
    description:
      "1 caixa de TG Origem China (4 frascos de tirzepatida 15 mg/0,5 mL) + 1 frasco de GHK-Cu Genixx Labs 100 mg.",
  },
  {
    id: "tg15",
    name: "TG Origem Paraguai",
    category: "GLP-1",
    normalPrice: 769,
    image: "/images/catalogo/tg-15-4-frascos.webp",
    presentation: "TG Paraguai (Indufar) 15 mg/0,5 mL · caixa com 4 frascos",
    origin: "Paraguai",
    storage: tgParaguaiStorage,
    // Caixa: "4 frascos viales con 0,5 mL"; "cada 0,5 mL contiene 15 mg"
    solution: {
      substance: "Tirzepatida",
      labelMg: 15,
      labelMl: 0.5,
      vialMg: 15,
      vialNote: "caixa com 4 frascos de 15 mg",
    },
  },
  {
    id: "tg-china",
    name: "TG Origem China",
    category: "GLP-1",
    normalPrice: 549,
    campaign: blackFriday(539),
    image: "/images/catalogo/tg-15-4-frascos.webp",
    origin: "China",
  },
  {
    id: "tirzec-4",
    name: "Tirzec 4 ampolas",
    category: "GLP-1",
    normalPrice: 769,
    image: "/images/catalogo/tirzec-4-ampolas.webp",
    origin: "Paraguai",
  },
  {
    id: "tirzec-md",
    name: "Tirzec MD",
    category: "GLP-1",
    normalPrice: 649,
    campaign: blackFriday(499),
    image: "/images/catalogo/tirzec-md-15.webp",
    presentation:
      "Tirzec MD (Quimfa) · 1 frasco multidose de 2 mL por caixa · 15 mg por 0,5 mL, 60 mg no frasco inteiro",
    origin: "Paraguai",
    storage:
      "Conserve o frasco na geladeira entre 2 °C e 8 °C, mesmo lacrado. Após abrir, mantenha nessa temperatura por no máximo quatro semanas.",
  },
  {
    id: "ghkcu",
    name: "GHK-Cu 100mg",
    category: "Skin",
    normalPrice: 599,
    campaign: blackFriday(349),
    image: "/images/catalogo/ghk-cu-genixx-100mg.webp",
    description: "GHK-Cu Genixx Labs 100 mg. Frasco de GHK-Cu de 100 mg.",
    origin: "Estados Unidos",
  },
  {
    id: "tirze100",
    name: "Tirzepatida Peking 100mg",
    category: "GLP-1",
    normalPrice: 1100,
    campaign: blackFriday(1000),
    image: "/images/catalogo/tirzepatida-pepking-100.webp",
    presentation: "Frasco liofilizado 100 mg",
    description:
      "Frasco liofilizado de maior quantidade, para quem já tem orientação profissional definida. Reconstituição conforme instrução do profissional responsável.",
    origin: "Inglaterra",
    storage: refrigerated,
  },
  {
    id: "lipoless",
    name: "Lipoless MD 15mg",
    category: "GLP-1",
    normalPrice: 699,
    campaign: blackFriday(589),
    image: "/images/catalogo/lipoless-md-15.webp",
    presentation:
      "Lipoless MD (Éticos) · 1 frasco multidose de 2,4 mL por caixa · 15 mg por 0,6 mL, 60 mg no frasco inteiro",
    origin: "Paraguai",
    storage:
      "Guarde o frasco na geladeira entre 2 °C e 8 °C, mesmo lacrado. Proteja da luz e não congele. Depois do primeiro uso, mantenha refrigerado e descarte em até 30 dias.",
    // Caixa: "Vial Multidosis ... contiene 4 dosis de 15 mg / 0,6 mL"
    solution: {
      substance: "Tirzepatida",
      labelMg: 15,
      labelMl: 0.6,
      vialMg: 60,
      vialNote: "1 frasco multidose com 4 doses de 15 mg",
    },
  },
  {
    id: "reta40",
    name: "Retatrutida Synedica 40mg",
    category: "GLP-1",
    normalPrice: 1370,
    campaign: blackFriday(899),
    image: "/images/catalogo/retatrutida-synedica-40.webp",
    presentation: "Caneta aplicadora · 40 mg",
    description:
      "Apresentação em caneta aplicadora. Disponibilidade confirmada por lote no atendimento.",
    origin: "Alemanha",
    storage: refrigerated,
  },
  {
    id: "glow-skin-booster",
    name: "Glow Skin Booster",
    category: "Skin",
    normalPrice: 950,
    campaign: blackFriday(849),
    image: "/images/catalogo/glow-alluvi.webp",
    description:
      "Glow GHK-Cu Alluvi Healthcare. Caixa com dois dispositivos; marcação da embalagem: 10/10/50 mg.",
    origin: "Inglaterra",
  },
  {
    id: "reta60",
    name: "Retatrutida Peking 60mg",
    category: "GLP-1",
    normalPrice: 1100,
    image: "/images/catalogo/reta-60-pepking.webp",
    presentation: "Frasco liofilizado 60 mg",
    description:
      "Frasco liofilizado. Reconstituição e uso conforme orientação do profissional responsável.",
    origin: "Inglaterra",
    storage: refrigerated,
  },
  {
    id: "t36-md",
    name: "T36 15 MD",
    category: "GLP-1",
    normalPrice: 699,
    campaign: blackFriday(649),
    image: "/images/catalogo/t36-md-15.webp",
    presentation: "T36 15 MD (Laboratorios Catedral) · 1 frasco multidose de 2,4 mL por caixa",
    origin: "Paraguai",
    storage:
      "Mantenha o frasco na geladeira entre 2 °C e 8 °C, mesmo lacrado. Não congele. Depois do primeiro uso, mantenha refrigerado e descarte em até 30 dias.",
  },
  {
    id: "klow",
    name: "Klow",
    category: "Recovery",
    normalPrice: 797,
    campaign: blackFriday(622),
    image: "/images/catalogo/klow-80mg.webp",
    description:
      "Klow BioPeptides 80 mg. Frasco azul com tampa vermelha e conta-gotas acompanhante, conforme imagem do produto.",
    origin: "Estados Unidos",
  },
  {
    id: "lipoless-4",
    name: "Lipoless 4 ampolas",
    category: "GLP-1",
    normalPrice: 749,
    image: "/images/catalogo/lipoless-4-ampolas.webp",
    presentation: "Lipoless 15 mg/0,5 mL (Éticos) · caixa com 4 frascos de dose única",
    origin: "Paraguai",
    storage: lipolessStorage,
  },
  {
    id: "tirzedral",
    name: "Tirzedral",
    category: "GLP-1",
    normalPrice: 749,
    image: "/images/catalogo/tirzedral-15.webp",
    presentation:
      "Tirzedral 15 mg/0,5 mL (Laboratorios Catedral) · caixa com 4 frascos de dose única",
    origin: "Paraguai",
    storage:
      "Guarde os frascos entre 2 °C e 8 °C, sem congelar. A bula desta apresentação permite até 28 dias consecutivos fora da geladeira a menos de 30 °C. Descarte ao fim desse prazo. Cada frasco é de uso único.",
  },
  {
    id: "veltrane90",
    name: "Veltrane 90mg",
    category: "GLP-1",
    normalPrice: 649,
    campaign: blackFriday(579),
    image: "/images/catalogo/veltrane-gold-90.webp",
    description: "Retatrutida.",
    origin: "Bélgica",
  },
  {
    id: "avulsa-tirzec",
    name: "Ampola avulsa Tirzec",
    category: "GLP-1",
    normalPrice: 250,
    image: "/images/catalogo/unidade-ampola.webp",
    description: "1 ampola avulsa da Tirzec.",
    origin: "Paraguai",
  },
  {
    id: "avulsa-lipoless",
    name: "Ampola avulsa Lipoless",
    category: "GLP-1",
    normalPrice: 250,
    image: "/images/catalogo/unidade-ampola.webp",
    presentation: "Lipoless 15 mg/0,5 mL (Éticos) · 1 frasco avulso de dose única",
    description: "1 ampola avulsa da Lipoless.",
    origin: "Paraguai",
    storage: lipolessStorage,
  },
  {
    id: "avulsa-tg-china",
    name: "Ampola avulsa TG Origem China",
    category: "GLP-1",
    normalPrice: 250,
    image: "/images/catalogo/unidade-ampola.webp",
    description: "1 ampola avulsa da TG Origem China.",
    origin: "China",
  },
  {
    id: "avulsa-tg-paraguai",
    name: "Ampola avulsa TG Origem Paraguai",
    category: "GLP-1",
    normalPrice: 250,
    image: "/images/catalogo/unidade-ampola.webp",
    presentation: "TG Paraguai (Indufar) 15 mg/0,5 mL · 1 frasco avulso",
    description: "1 ampola avulsa da TG Origem Paraguai.",
    origin: "Paraguai",
    storage: tgParaguaiStorage,
  },
  {
    id: "glow",
    name: "Glow 70mg",
    category: "Skin",
    normalPrice: 697,
    campaign: blackFriday(580),
    image: "/images/catalogo/glow-alluvi.webp",
    description: "GHK-Cu, BPC-157/TB-500.",
    origin: "Estados Unidos",
  },
  {
    id: "vital-science-20",
    name: "Vital Science 20mg",
    category: "GLP-1",
    normalPrice: 529,
    campaign: blackFriday(499),
    image: "/images/catalogo/vital-science-20mg.webp",
    description: "Vital Science Tirzepatide 20 mg.",
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
