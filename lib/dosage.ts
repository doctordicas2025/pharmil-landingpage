// Matematica de dose para seringa U-100. Cada unidade marcada na seringa
// equivale a 0,01 mL, entao unidades = volume em mL x 100.
// Coberto por tests/dosage.test.mjs.

// Os produtos e suas concentracoes vem do catalogo (lib/catalog.ts, campo
// `solution`). Aqui fica so a matematica, que nao depende do produto.

// Escalonamento da bula de tirzepatida (ANVISA, nov/2024): comeca em 2,5 mg e
// sobe 2,5 mg a cada 4 semanas no minimo, ate 15 mg. As demais doses da lista
// sao usadas na pratica mas nao constam da bula; a interface diferencia.
export const LABEL_DOSES_MG: readonly number[] = [2.5, 5, 7.5, 10, 12.5, 15];

export const DOSES_MG: readonly number[] = [
  2.5, 3.5, 3.75, 5, 6, 6.5, 7.5, 8.5, 9.5, 10, 11.5, 12.5, 13.5, 15,
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
