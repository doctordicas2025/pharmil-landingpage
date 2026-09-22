export type Category = "GLP-1" | "Skin" | "Recovery";

export type Product = {
  id: string;
  name: string;
  category: Category;
  presentation: string;
  price: number;
  image: string;
  tint: string;
  fit: "contain" | "cover";
  badge?: string;
  description: string;
  facts: { label: string; value: string }[];
};

export const products: Product[] = [
  {
    id: "tg15",
    name: "TG 15",
    category: "GLP-1",
    presentation: "Tirzepatida 15 mg/0,5 mL · 4 frascos",
    price: 599,
    image: "/images/cut-tg.png",
    tint: "var(--tint-photo)",
    fit: "contain",
    badge: "+ GHK-Cu por R$ 249",
    description:
      "Apresentação em frasco com quatro unidades, acompanhada do laudo do lote. Envio em caixa térmica com registro de temperatura e código de rastreio.",
    facts: [
      { label: "Apresentação", value: "4 frascos de 0,5 mL" },
      { label: "Concentração", value: "15 mg/0,5 mL" },
      { label: "Conservação", value: "Refrigerado, entre 2 e 8 °C" },
      { label: "Laudo", value: "Disponível por lote" },
    ],
  },
  {
    id: "lipoless",
    name: "Lipoless MD 15",
    category: "GLP-1",
    presentation: "Tirzepatida 15 mg/0,5 mL · 4 frascos",
    price: 549,
    image: "/images/cut-lipoless.png",
    tint: "var(--tint-photo)",
    fit: "contain",
    description:
      "Mesma concentração do TG 15 em apresentação de outro fabricante. Lote e validade confirmados no atendimento antes do envio.",
    facts: [
      { label: "Apresentação", value: "4 frascos de 0,5 mL" },
      { label: "Concentração", value: "15 mg/0,5 mL" },
      { label: "Conservação", value: "Refrigerado, entre 2 e 8 °C" },
      { label: "Laudo", value: "Disponível por lote" },
    ],
  },
  {
    id: "tirze100",
    name: "Tirzepatida Pepking 100 mg",
    category: "GLP-1",
    presentation: "Frasco liofilizado 100 mg",
    price: 1000,
    image: "/images/cut-tirze-pepking.webp",
    tint: "var(--tint-photo)",
    fit: "contain",
    description:
      "Frasco liofilizado de maior quantidade, para quem já tem orientação profissional definida. Reconstituição conforme instrução do profissional responsável.",
    facts: [
      { label: "Apresentação", value: "Frasco liofilizado" },
      { label: "Quantidade", value: "100 mg" },
      { label: "Conservação", value: "Refrigerado, entre 2 e 8 °C" },
      { label: "Laudo", value: "Disponível por lote" },
    ],
  },
  {
    id: "reta40",
    name: "Retatrutida Synedica 40 mg",
    category: "GLP-1",
    presentation: "Caneta aplicadora · 40 mg",
    price: 1370,
    image: "/images/cut-reta-synedica.webp",
    tint: "var(--tint-photo)",
    fit: "contain",
    description:
      "Apresentação em caneta aplicadora. Disponibilidade confirmada por lote no atendimento.",
    facts: [
      { label: "Apresentação", value: "Caneta aplicadora" },
      { label: "Quantidade", value: "40 mg" },
      { label: "Conservação", value: "Refrigerado, entre 2 e 8 °C" },
      { label: "Laudo", value: "Disponível por lote" },
    ],
  },
  {
    id: "reta60",
    name: "Retatrutida Pepking 60 mg",
    category: "GLP-1",
    presentation: "Frasco liofilizado 60 mg",
    price: 1100,
    // Mesma arte da apresentacao de 40 mg: a caixa e a mesma, muda a dosagem.
    image: "/images/cut-reta-synedica.webp",
    tint: "var(--tint-photo)",
    fit: "contain",
    description:
      "Frasco liofilizado. Reconstituição e uso conforme orientação do profissional responsável.",
    facts: [
      { label: "Apresentação", value: "Frasco liofilizado" },
      { label: "Quantidade", value: "60 mg" },
      { label: "Conservação", value: "Refrigerado, entre 2 e 8 °C" },
      { label: "Laudo", value: "Disponível por lote" },
    ],
  },
  {
    id: "ghkcu",
    name: "GHK-Cu 100 mg",
    category: "Skin",
    presentation: "Frasco liofilizado · 99% de pureza",
    price: 350,
    image: "/images/cut-ghkcu.png",
    tint: "var(--tint-ghkcu)",
    fit: "contain",
    description:
      "Peptídeo de cobre em frasco liofilizado, com laudo de pureza do lote correspondente.",
    facts: [
      { label: "Apresentação", value: "Frasco liofilizado" },
      { label: "Quantidade", value: "100 mg" },
      { label: "Conservação", value: "Refrigerado, entre 2 e 8 °C" },
      { label: "Laudo", value: "Pureza de 99% por lote" },
    ],
  },
  {
    id: "glow",
    name: "Glow",
    category: "Skin",
    presentation: "Blend liofilizado para pele",
    price: 697,
    image: "/images/cut-glow.png",
    tint: "var(--tint-glow)",
    fit: "contain",
    description:
      "Blend liofilizado. A composição do lote disponível é informada durante o atendimento.",
    facts: [
      { label: "Apresentação", value: "Frasco liofilizado" },
      { label: "Quantidade", value: "Conforme lote" },
      { label: "Conservação", value: "Refrigerado, entre 2 e 8 °C" },
      { label: "Laudo", value: "Disponível por lote" },
    ],
  },
  {
    id: "klow",
    name: "Klow",
    category: "Recovery",
    presentation: "Blend liofilizado 80 mg",
    price: 797,
    image: "/images/cut-klow.png",
    tint: "var(--tint-klow)",
    fit: "contain",
    description:
      "Blend liofilizado de manutenção. Composição e orientação de uso informadas no atendimento.",
    facts: [
      { label: "Apresentação", value: "Frasco liofilizado" },
      { label: "Quantidade", value: "80 mg" },
      { label: "Conservação", value: "Refrigerado, entre 2 e 8 °C" },
      { label: "Laudo", value: "Disponível por lote" },
    ],
  },
];

export const formatPrice = (value: number) => `R$ ${value.toLocaleString("pt-BR")}`;
