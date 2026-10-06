"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Button, Field, Notice, OptionGroup } from "@/design-system";
import type { OptionItem } from "@/design-system";
import { products } from "@/lib/catalog";
import type { Product, Solution } from "@/lib/catalog";
import {
  DOSES_MG,
  LABEL_DOSES_MG,
  SYRINGES_ML,
  calculateDose,
  concentration,
  formatMg,
  formatMgPerMl,
  formatMl,
  formatUnits,
  isOnMark,
  syringeStepUnits,
} from "@/lib/dosage";

import { SyringeGauge } from "./SyringeGauge";

// So entra o que o catalogo marca como solucao pronta para seringa.
type CalcProduct = Product & { solution: Solution };
const CALC_PRODUCTS = products.filter((p): p is CalcProduct => Boolean(p.solution));

const OUTRO = "outro";

type State = {
  product: string;
  labelMg: string;
  labelMl: string;
  syringeMl: string;
  dose: string;
  doseCustom: string;
};

// Nada vem marcado alem da seringa: a pessoa precisa dizer qual e o produto
// dela, porque a mesma dose da unidades diferentes em cada um.
const INITIAL: State = {
  product: "",
  labelMg: "",
  labelMl: "",
  syringeMl: "1",
  dose: "",
  doseCustom: "",
};

const toNumber = (s: string) => (s.trim() === "" ? Number.NaN : Number(s.trim().replace(",", ".")));
const pick = (choice: string, custom: string) => toNumber(choice === OUTRO ? custom : choice);
const decimal = (n: number) => String(n).replace(".", ",");
const valido = (n: number) => Number.isFinite(n) && n > 0;
const rotulo = (s: Solution) => `${formatMg(s.labelMg)}/${formatMl(s.labelMl)}`;

const customError = (s: string) =>
  s.trim() !== "" && !valido(toNumber(s)) ? "Digite um número maior que zero, como 4,2." : undefined;

const productOptions: OptionItem[] = [
  ...CALC_PRODUCTS.map((p) => ({
    value: p.id,
    label: (
      <span className="calc-product">
        <span className="calc-product__thumb">
          <Image alt="" height={56} sizes="56px" src={p.image} width={56} />
        </span>
        <span className="calc-product__text">
          <span className="calc-product__name">{p.name}</span>
          <span className="calc-product__detail">
            {p.solution.substance} {rotulo(p.solution)} · {p.solution.vialNote}
          </span>
        </span>
      </span>
    ),
  })),
  { value: OUTRO, label: "Outro produto", detail: "Digite os mg e os mL que estão no rótulo" },
];

const syringeOptions: OptionItem[] = SYRINGES_ML.map((ml) => ({
  value: String(ml),
  label: formatMl(ml),
  detail: `${ml * 100} UI`,
}));

const doseOptions: OptionItem[] = [
  ...DOSES_MG.map((d) => ({
    value: String(d),
    label: `${decimal(d)} mg`,
    marked: LABEL_DOSES_MG.includes(d),
  })),
  { value: OUTRO, label: "Outra" },
];

// labelMg em labelMl e a concentracao (a conta das unidades); vialMg e o total
// no frasco (a conta do rendimento). So diferem no frasco multidose.
type Vial = {
  vialMg: number;
  labelMg: number;
  labelMl: number;
  mgPerMl: number | null;
  description: string;
  substance: string | null;
  multidose: boolean;
};

function resolveVial(s: State): Vial {
  const product = CALC_PRODUCTS.find((p) => p.id === s.product);
  if (product) {
    const sol = product.solution;
    return {
      vialMg: sol.vialMg,
      labelMg: sol.labelMg,
      labelMl: sol.labelMl,
      mgPerMl: concentration(sol.labelMg, sol.labelMl),
      description: `${product.name} (${rotulo(sol)})`,
      substance: sol.substance,
      multidose: sol.vialMg > sol.labelMg,
    };
  }
  const vialMg = s.product === OUTRO ? toNumber(s.labelMg) : Number.NaN;
  const vialMl = s.product === OUTRO ? toNumber(s.labelMl) : Number.NaN;
  return {
    vialMg,
    labelMg: vialMg,
    labelMl: vialMl,
    mgPerMl: concentration(vialMg, vialMl),
    description: `${formatMg(vialMg)}/${formatMl(vialMl)}`,
    substance: null,
    multidose: false,
  };
}

// O que falta para haver resultado, na ordem em que a pessoa preenche.
function missingStep(s: State, vial: Vial, doseMg: number): string {
  if (s.product === "") return "Escolha o seu produto.";
  if (vial.mgPerMl === null) return "Preencha os mg e os mL que estão no rótulo.";
  if (!valido(doseMg)) return "Escolha a dose prescrita.";
  return "Confira os valores digitados.";
}

export type CalculatorProps = {
  /** Endereco absoluto da pagina, para o texto compartilhado. */
  shareUrl: string;
};

export function Calculator({ shareUrl }: CalculatorProps) {
  const [state, setState] = useState<State>(INITIAL);
  const [copied, setCopied] = useState(false);
  const [resultInView, setResultInView] = useState(true);
  const [formInView, setFormInView] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof State>(key: K) => (value: State[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const vial = resolveVial(state);
  const doseMg = pick(state.dose, state.doseCustom);
  const syringeMl = Number(state.syringeMl);
  const result =
    vial.mgPerMl === null
      ? null
      : calculateDose({ mgPerMl: vial.mgPerMl, doseMg, syringeMl, vialMg: vial.vialMg });

  const step = syringeStepUnits(syringeMl);
  const onMark = result ? isOnMark(result.units, step) : true;
  const lowerMark = result ? Math.floor(Math.round(result.units * 10) / 10 / step) * step : 0;
  const biggerSyringe = result
    ? SYRINGES_ML.find((ml) => ml * 100 >= Math.round(result.units * 10) / 10)
    : undefined;

  const shareText =
    result && vial.mgPerMl !== null
      ? [
          "Conversão de dose para seringa U-100",
          `Produto: ${vial.description}`,
          `Dose: ${formatMg(doseMg)}`,
          `Seringa: ${formatMl(syringeMl)}`,
          `Puxar até: ${formatUnits(result.units)} unidades (${formatMl(result.volumeMl)})`,
          "",
          "Confira sempre com quem prescreveu.",
          shareUrl,
        ].join("\n")
      : "";

  // A barra fixa do celular so aparece enquanto a pessoa esta no formulario
  // e o resultado saiu da tela.
  useEffect(() => {
    const form = formRef.current;
    const res = resultRef.current;
    if (!form || !res || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === form) setFormInView(e.isIntersecting);
        if (e.target === res) setResultInView(e.isIntersecting);
      }
    });
    io.observe(form);
    io.observe(res);
    return () => io.disconnect();
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Sem permissao de area de transferencia: o botao do WhatsApp continua.
    }
  }

  function reset() {
    setState(INITIAL);
    formRef.current?.scrollIntoView({ block: "start" });
  }

  function goToResult() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    resultRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  return (
    <>
      <div className="calc" id="calculadora">
        <div className="calc__form" ref={formRef}>
          <div className="calc__group">
            <OptionGroup
              hint="A mesma dose dá unidades diferentes em cada produto. Confira o nome na caixa."
              label="Qual é o seu produto"
              name="produto"
              onChange={set("product")}
              options={productOptions}
              value={state.product}
            />
            {state.product === OUTRO ? (
              <div className="calc__pair">
                <Field
                  error={customError(state.labelMg)}
                  inputMode="decimal"
                  label="mg no rótulo"
                  onChange={(e) => set("labelMg")(e.target.value)}
                  placeholder="Ex.: 15"
                  value={state.labelMg}
                />
                <Field
                  error={customError(state.labelMl)}
                  inputMode="decimal"
                  label="mL no rótulo"
                  onChange={(e) => set("labelMl")(e.target.value)}
                  placeholder="Ex.: 0,5"
                  value={state.labelMl}
                />
              </div>
            ) : null}
          </div>

          <OptionGroup
            hint="Seringa de insulina U-100: 100 unidades = 1 mL."
            label="Seringa"
            layout="chips"
            name="seringa"
            onChange={set("syringeMl")}
            options={syringeOptions}
            value={state.syringeMl}
          />

          <div className="calc__group">
            <OptionGroup
              hint="Com ponto: doses da bula da tirzepatida. Use sempre a dose prescrita."
              label={vial.substance ? `Dose prescrita de ${vial.substance.toLowerCase()}` : "Dose prescrita"}
              layout="chips"
              name="dose"
              onChange={set("dose")}
              options={doseOptions}
              value={state.dose}
            />
            {state.dose === OUTRO ? (
              <Field
                error={customError(state.doseCustom)}
                inputMode="decimal"
                label="Dose em mg"
                onChange={(e) => set("doseCustom")(e.target.value)}
                placeholder="Ex.: 4,2"
                value={state.doseCustom}
              />
            ) : null}
          </div>
        </div>

        <div className="calc__result" id="resultado" ref={resultRef}>
          <p aria-live="polite" className="ds-sr-only">
            {result
              ? `Resultado: ${formatUnits(result.units)} unidades, ${formatMl(result.volumeMl)}.`
              : ""}
          </p>

          <div className={result ? "calc-card" : "calc-card is-empty"}>
            {result && vial.mgPerMl !== null ? (
              <>
                <p className="calc-card__label">Puxe até a marca de</p>
                <p className="calc-card__value">
                  <span className="calc-card__number">{formatUnits(result.units)}</span>
                  <span className="calc-card__unit">unidades</span>
                </p>

                <SyringeGauge maxUnits={result.syringeMaxUnits} stepUnits={step} units={result.units} />

                {!onMark && !result.exceedsSyringe ? (
                  <p className="calc-card__between">
                    Fica entre os riscos {lowerMark} e {lowerMark + step}: esta seringa marca de {step}{" "}
                    em {step}.
                  </p>
                ) : null}

                <dl className="calc-card__facts">
                  <div>
                    <dt>Volume</dt>
                    <dd>{formatMl(result.volumeMl)}</dd>
                  </div>
                  <div>
                    <dt>Concentração</dt>
                    <dd>{formatMgPerMl(vial.mgPerMl)}</dd>
                  </div>
                  <div>
                    <dt>O frasco rende</dt>
                    <dd>
                      {result.fullDoses === 0
                        ? "nenhuma dose"
                        : `${result.fullDoses} ${result.fullDoses === 1 ? "dose" : "doses"}`}
                      <small>
                        {result.fullDoses === 0
                          ? "dose maior que o frasco"
                          : result.remainderMg > 0
                            ? `sobram ${formatMg(result.remainderMg)}`
                            : "sem sobra"}
                      </small>
                    </dd>
                  </div>
                </dl>

                <details className="calc-card__math">
                  <summary>Ver a conta</summary>
                  <ol>
                    <li>
                      {decimal(vial.labelMg)} mg ÷ {formatMl(vial.labelMl)} ={" "}
                      <strong>{formatMgPerMl(vial.mgPerMl)}</strong>
                    </li>
                    <li>
                      {formatMg(doseMg)} ÷ {formatMgPerMl(vial.mgPerMl)} ={" "}
                      <strong>{formatMl(result.volumeMl)}</strong>
                    </li>
                    <li>
                      {formatMl(result.volumeMl)} × 100 = <strong>{formatUnits(result.units)} unidades</strong>
                    </li>
                  </ol>
                </details>
              </>
            ) : (
              <>
                <p className="calc-card__label">Resultado</p>
                <p className="calc-card__empty">{missingStep(state, vial, doseMg)}</p>
              </>
            )}
          </div>

          {result ? (
            <div className="calc__notices">
              {result.exceedsVial ? (
                <Notice title="A dose passa do que tem no frasco" tone="danger">
                  O frasco tem {formatMg(vial.vialMg)} e a dose é {formatMg(doseMg)}. Confira a dose
                  prescrita e o rótulo.
                </Notice>
              ) : null}
              {result.exceedsSyringe ? (
                <Notice title="Não cabe nesta seringa" tone="danger">
                  São {formatUnits(result.units)} unidades e a seringa de {formatMl(syringeMl)} vai até{" "}
                  {result.syringeMaxUnits}.{" "}
                  {biggerSyringe
                    ? `Escolha a de ${formatMl(biggerSyringe)}.`
                    : "Confirme a dose e a concentração com quem prescreveu."}
                </Notice>
              ) : null}
              {!vial.multidose && result.fullDoses > 1 ? (
                <Notice title="Confira se o frasco é multidose">
                  Algumas apresentações são de dose única e não têm conservante. Furar a tampa de novo
                  abre caminho para contaminação. Só divida o frasco se o rótulo disser multidose.
                </Notice>
              ) : null}
            </div>
          ) : null}

          {result ? (
            <div className="calc__actions">
              <Button
                href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                Mandar no WhatsApp
              </Button>
              <Button onClick={copy} size="sm" variant="secondary">
                {copied ? "Copiado" : "Copiar"}
              </Button>
              <Button onClick={reset} size="sm" variant="secondary">
                Recomeçar
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      {result && formInView && !resultInView ? (
        <button className="calc-peek" onClick={goToResult} type="button">
          <span className="calc-peek__value">
            {formatUnits(result.units)} <small>unidades</small>
          </span>
          <span className="calc-peek__action">Ver resultado</span>
        </button>
      ) : null}

      <ReferenceTable doseMg={doseMg} state={state} vial={vial} />
    </>
  );
}

type ReferenceTableProps = { state: State; vial: Vial; doseMg: number };

/** Todas as doses na mesma conta, para conferir de relance. */
function ReferenceTable({ state, vial, doseMg }: ReferenceTableProps) {
  const isCurrent = (d: number) => valido(doseMg) && Math.abs(d - doseMg) < 1e-9;

  if (state.product !== OUTRO) {
    return (
      <section aria-labelledby="tabela-titulo" className="calc-table">
        <h2 className="calc-table__title" id="tabela-titulo">
          A mesma dose em cada produto
        </h2>
        <p className="calc-table__intro">
          Unidades na seringa U-100. A tirzepatida é a mesma: muda o volume em que ela vem, e com
          ele o número de unidades. A coluna destacada é a do produto que você escolheu; quantas
          doses o frasco rende aparece no resultado.
        </p>
        <div aria-labelledby="tabela-titulo" className="calc-table__scroll" role="region" tabIndex={0}>
          <table>
            <thead>
              <tr>
                <th scope="col">Dose</th>
                {CALC_PRODUCTS.map((p) => (
                  <th className={p.id === state.product ? "is-current" : undefined} key={p.id} scope="col">
                    {p.name}
                    <span>{rotulo(p.solution)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DOSES_MG.map((d) => (
                <tr className={isCurrent(d) ? "is-current" : undefined} key={d}>
                  <th scope="row">{formatMg(d)}</th>
                  {CALC_PRODUCTS.map((p) => {
                    const mgPerMl = concentration(p.solution.labelMg, p.solution.labelMl);
                    const r =
                      mgPerMl === null
                        ? null
                        : calculateDose({ mgPerMl, doseMg: d, syringeMl: 1, vialMg: p.solution.vialMg });
                    return (
                      <td className={p.id === state.product ? "is-current" : undefined} key={p.id}>
                        {r ? formatUnits(r.units) : "–"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  if (vial.mgPerMl === null || !valido(vial.vialMg)) return null;

  const mgPerMl = vial.mgPerMl;
  const list = DOSES_MG.filter((d) => d <= vial.vialMg + 1e-9);
  if (list.length === 0) return null;

  return (
    <section aria-labelledby="tabela-titulo" className="calc-table">
      <h2 className="calc-table__title" id="tabela-titulo">
        Outras doses no seu frasco
      </h2>
      <p className="calc-table__intro">
        {vial.description}, ou {formatMgPerMl(mgPerMl)}. Unidades na seringa U-100.
      </p>
      <div aria-labelledby="tabela-titulo" className="calc-table__scroll" role="region" tabIndex={0}>
        <table>
          <thead>
            <tr>
              <th scope="col">Dose</th>
              <th className="is-current" scope="col">
                Unidades
              </th>
              <th scope="col">Volume</th>
              <th scope="col">
                Doses
                <span>no frasco</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((d) => {
              const r = calculateDose({ mgPerMl, doseMg: d, syringeMl: 1, vialMg: vial.vialMg });
              if (!r) return null;
              return (
                <tr className={isCurrent(d) ? "is-current" : undefined} key={d}>
                  <th scope="row">{formatMg(d)}</th>
                  <td className="is-current">{formatUnits(r.units)}</td>
                  <td>{formatMl(r.volumeMl)}</td>
                  <td>{r.fullDoses}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
