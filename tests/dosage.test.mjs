// Testes da matematica de dose. Rodar com: npm test
// Todo valor esperado aqui foi calculado a mao, nao copiado da implementacao.

import assert from "node:assert/strict";
import { test } from "node:test";
import {
  calculateDose,
  concentration,
  formatMgPerMl,
  formatUnits,
  isOnMark,
  syringeStepUnits,
} from "../lib/dosage.ts";
import { products } from "../lib/catalog.ts";

const solucao = (id) => products.find((p) => p.id === id).solution;
const mgPorMl = (s) => concentration(s.labelMg, s.labelMl);

test("so produtos de solucao pronta entram na calculadora", () => {
  // Caneta e frasco sem concentracao conhecida ficam de fora.
  assert.deepEqual(
    products.filter((p) => p.solution).map((p) => p.id),
    ["tg15", "lipoless"],
  );
});

test("TG 15 e Lipoless MD tem a concentracao impressa na caixa", () => {
  assert.equal(mgPorMl(solucao("tg15")), 30); // 15 mg / 0,5 mL
  assert.equal(mgPorMl(solucao("lipoless")), 25); // 15 mg / 0,6 mL
});

test("TG 15, 5 mg: 16,7 unidades e 3 doses no frasco de 15 mg", () => {
  const tg = solucao("tg15");
  const r = calculateDose({ mgPerMl: mgPorMl(tg), doseMg: 5, syringeMl: 1, vialMg: tg.vialMg });
  assert.ok(Math.abs(r.units - 16.6667) < 0.001);
  assert.equal(formatUnits(r.units), "16,7");
  assert.equal(r.fullDoses, 3);
  assert.equal(r.remainderMg, 0);
});

test("TG 15, 9,5 mg: 31,7 unidades, e nao 33 como na tabela impressa", () => {
  const r = calculateDose({ mgPerMl: 30, doseMg: 9.5, syringeMl: 1, vialMg: 15 });
  assert.equal(formatUnits(r.units), "31,7");
});

test("Lipoless MD, 10 mg: 40 unidades e 6 doses no frasco multidose de 60 mg", () => {
  // Caixa: "Vial Multidosis ... contiene 4 dosis de 15 mg / 0,6 mL"
  const md = solucao("lipoless");
  assert.equal(md.vialMg, 60);
  const r = calculateDose({ mgPerMl: mgPorMl(md), doseMg: 10, syringeMl: 1, vialMg: md.vialMg });
  assert.equal(formatUnits(r.units), "40");
  assert.equal(r.fullDoses, 6);
});

test("a mesma dose da unidades diferentes no TG e no Lipoless MD", () => {
  const u = (id) => calculateDose({ mgPerMl: mgPorMl(solucao(id)), doseMg: 5, syringeMl: 1, vialMg: 15 }).units;
  assert.equal(formatUnits(u("tg15")), "16,7");
  assert.equal(formatUnits(u("lipoless")), "20");
});

test("de 8,5 a 13,5 mg o frasco de 15 mg do TG tem 1 dose completa", () => {
  for (const d of [8.5, 9.5, 10, 11.5, 12.5, 13.5]) {
    const r = calculateDose({ mgPerMl: 30, doseMg: d, syringeMl: 1, vialMg: 15 });
    assert.equal(r.fullDoses, 1, `dose ${d} mg`);
  }
});

test("dose pequena mostra a meia unidade em vez de arredondar para cima", () => {
  // 10 mg em 1 mL = 10 mg/mL; 0,25 mg = 0,025 mL = 2,5 unidades
  const r = calculateDose({
    mgPerMl: concentration(10, 1),
    doseMg: 0.25,
    syringeMl: 0.3,
    vialMg: 10,
  });
  assert.equal(formatUnits(r.units), "2,5");
});

test("alerta quando a dose e maior que o conteudo do frasco", () => {
  const r = calculateDose({ mgPerMl: 30, doseMg: 20, syringeMl: 1, vialMg: 15 });
  assert.equal(r.exceedsVial, true);
});

test("alerta quando o volume passa da seringa", () => {
  // 15 mg a 15 mg/mL = 1 mL = 100 unidades, numa seringa de 50
  const r = calculateDose({ mgPerMl: 15, doseMg: 15, syringeMl: 0.5, vialMg: 15 });
  assert.equal(r.exceedsSyringe, true);
  assert.equal(r.syringeMaxUnits, 50);
});

test("dose que enche a seringa exatamente nao dispara alerta", () => {
  const r = calculateDose({ mgPerMl: 15, doseMg: 15, syringeMl: 1, vialMg: 15 });
  assert.equal(formatUnits(r.units), "100");
  assert.equal(r.exceedsSyringe, false);
  assert.equal(r.exceedsVial, false);
  assert.equal(r.fullDoses, 1);
});

test("ponto flutuante nao vaza para a tela", () => {
  // 1 / (10/3) * 100 = 30.000000000000004 em ponto flutuante
  const r = calculateDose({
    mgPerMl: concentration(10, 3),
    doseMg: 1,
    syringeMl: 1,
    vialMg: 10,
  });
  assert.equal(formatUnits(r.units), "30");
});

test("ponto flutuante nao perde dose completa no arredondamento para baixo", () => {
  // 0.3 / 0.1 = 2.9999999999999996; sao 3 doses
  const r = calculateDose({ mgPerMl: 1, doseMg: 0.1, syringeMl: 1, vialMg: 0.3 });
  assert.equal(r.fullDoses, 3);
});

test("formatUnits usa virgula, uma casa e corta o zero final", () => {
  assert.equal(formatUnits(16.666), "16,7");
  assert.equal(formatUnits(40), "40");
  assert.equal(formatUnits(2.5), "2,5");
  assert.equal(formatUnits(99.96), "100");
});

test("entrada invalida devolve null em vez de numero sem sentido", () => {
  assert.equal(calculateDose({ mgPerMl: 0, doseMg: 5, syringeMl: 1, vialMg: 15 }), null);
  assert.equal(calculateDose({ mgPerMl: 30, doseMg: -1, syringeMl: 1, vialMg: 15 }), null);
  assert.equal(calculateDose({ mgPerMl: 30, doseMg: Number.NaN, syringeMl: 1, vialMg: 15 }), null);
  assert.equal(concentration(15, 0), null);
});

test("seringa de 1 mL tem risco a cada 2 unidades; as menores, a cada 1", () => {
  assert.equal(syringeStepUnits(0.3), 1);
  assert.equal(syringeStepUnits(0.5), 1);
  assert.equal(syringeStepUnits(1), 2);
});

test("valor que cai entre dois riscos e sinalizado", () => {
  assert.equal(isOnMark(40, 2), true);
  assert.equal(isOnMark(25, 2), false); // 25 UI na seringa de 1 mL
  assert.equal(isOnMark(25, 1), true);
  assert.equal(isOnMark(2.5, 1), false);
  assert.equal(isOnMark(16.6667, 1), false);
  // 1 / (10/3) * 100 = 30.000000000000004 continua em cima do risco
  assert.equal(isOnMark(30.000000000000004, 2), true);
});

test("concentracao aparece com ate duas casas", () => {
  assert.equal(formatMgPerMl(30), "30 mg/mL");
  assert.equal(formatMgPerMl(10 / 3), "3,33 mg/mL");
});
