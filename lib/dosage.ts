// Matematica de dose para seringa U-100. Cada unidade marcada na seringa
// equivale a 0,01 mL, entao unidades = volume em mL x 100.
// Coberto por tests/dosage.test.mjs.

export type SolutionGroup = {
  id: "a" | "b" | "c";
  label: string;
  /** Concentracao como impressa no rotulo: labelMg em labelMl. */
  labelMg: number;
  labelMl: number;
  mgPerMl: number;
  /** Total de tirzepatida no frasco. Define quantas doses ele rende. */
  vialMg: number;
  /** Presente so quando o frasco tem mais que a dose do rotulo. */
  vialNote?: string;
  products: string;
};

// Solucoes prontas de tirzepatida: a concentracao vem do rotulo, nao precisa
// reconstituir. As unidades dependem so da concentracao; o rendimento depende
// do total no frasco, que no multidose (MD) e 4 x 15 mg.
export const SOLUTION_GROUPS: readonly SolutionGroup[] = [
  { id: "a", label: "15 mg / 0,5 mL", labelMg: 15, labelMl: 0.5, mgPerMl: 30, vialMg: 15, products: "T.G., Lipoless, Tirzec, Lipoland, Trizedral" },
  { id: "b", label: "15 mg / 0,6 mL", labelMg: 15, labelMl: 0.6, mgPerMl: 25, vialMg: 60, vialNote: "frasco multidose com 4 doses de 15 mg", products: "Lipoless MD, Tirzedral MD" },
  { id: "c", label: "15 mg / 1 mL", labelMg: 15, labelMl: 1, mgPerMl: 15, vialMg: 15, products: "Gluconex" },
];

// Escalonamento da bula de tirzepatida (ANVISA, nov/2024): comeca em 2,5 mg e
// sobe 2,5 mg a cada 4 semanas no minimo, ate 15 mg. As demais doses da lista
// sao usadas na pratica mas nao constam da bula; a interface diferencia.
export const LABEL_DOSES_MG: readonly number[] = [2.5, 5, 7.5, 10, 12.5, 15];

export const SOLUTION_DOSES_MG: readonly number[] = [
  2.5, 3.5, 3.75, 5, 6, 6.5, 7.5, 8.5, 9.5, 10, 11.5, 12.5, 13.5, 15,
];

// Po liofilizado: mesmas opcoes da calculadora publica que os clientes usam,
// mais 50 e 100 mg, que cobrem a GHK-Cu do catalogo. A conta nao depende da
// substancia, so dos mg do frasco e dos mL de diluente.
export const POWDER_VIAL_MG: readonly number[] = [5, 10, 15, 20, 30, 50, 60, 100];
export const POWDER_DILUENT_ML: readonly number[] = [0.5, 1, 1.5, 2, 2.5, 3];
export const POWDER_DOSES_MG: readonly number[] = [
  0.25, 0.5, 1, 1.7, 2, 2.4, 2.5, 4, 5, 7.5, 10, 12, 12.5, 15, 17.5, 20, 25, 30,
];

export const SYRINGES_ML: readonly number[] = [0.3, 0.5, 1];

// Tolerancia para erro de ponto flutuante: 0.3 / 0.1 da 2.9999999999999996.
const EPS = 1e-9;

const valido = (n: number) => Number.isFinite(n) && n > 0;

export function concentration(vialMg: number, diluentMl: number): number | null {
  if (!valido(vialMg) || !valido(diluentMl)) return null;
  return vialMg / diluentMl;
}

export type DoseInput = {
  mgPerMl: number;
  doseMg: number;
  syringeMl: number;
  vialMg: number;
};

export type DoseResult = {
  volumeMl: number;
  units: number;
  syringeMaxUnits: number;
  fullDoses: number;
  remainderMg: number;
  exceedsSyringe: boolean;
  exceedsVial: boolean;
};

export function calculateDose(input: DoseInput): DoseResult | null {
  const { mgPerMl, doseMg, syringeMl, vialMg } = input;
  if (![mgPerMl, doseMg, syringeMl, vialMg].every(valido)) return null;

  const volumeMl = doseMg / mgPerMl;
  const units = volumeMl * 100;
  const syringeMaxUnits = syringeMl * 100;
  // Dose completa e a unica que conta: a sobra nao fecha uma aplicacao.
  const fullDoses = Math.floor(vialMg / doseMg + EPS);
  const remainderMg = Math.round((vialMg - fullDoses * doseMg) * 100) / 100;

  return {
    volumeMl,
    units,
    syringeMaxUnits,
    fullDoses,
    remainderMg: Math.max(0, remainderMg),
    exceedsSyringe: units > syringeMaxUnits + EPS,
    exceedsVial: doseMg > vialMg + EPS,
  };
}

// Graduacao da seringa U-100 comum: a de 1 mL marca de 2 em 2 unidades; as de
// 0,3 e 0,5 mL marcam de 1 em 1.
export function syringeStepUnits(syringeMl: number): number {
  return syringeMl > 0.5 + EPS ? 2 : 1;
}

// O valor calculado coincide com um risco impresso? Se nao, a pessoa vai ter
// de decidir entre dois riscos, e a interface avisa.
export function isOnMark(units: number, stepUnits: number): boolean {
  const r = Math.round(units * 10) / 10; // o que a tela mostra
  const resto = r % stepUnits;
  return resto < 0.05 || stepUnits - resto < 0.05;
}

// Uma casa decimal, virgula, sem ",0". Arredondar para inteiro escondia meia
// unidade, que numa dose pequena chega a 20% do total.
export function formatUnits(units: number): string {
  const r = Math.round(units * 10) / 10;
  return Number.isInteger(r) ? String(r) : r.toFixed(1).replace(".", ",");
}

export function formatMg(mg: number): string {
  const r = Math.round(mg * 100) / 100;
  return `${String(r).replace(".", ",")} mg`;
}

export function formatMl(ml: number): string {
  const r = Math.round(ml * 1000) / 1000;
  return `${String(r).replace(".", ",")} mL`;
}

export function formatMgPerMl(mgPerMl: number): string {
  const r = Math.round(mgPerMl * 100) / 100;
  return `${String(r).replace(".", ",")} mg/mL`;
}
