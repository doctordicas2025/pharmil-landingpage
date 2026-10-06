"use client";

import { useEffect, useRef, useState } from "react";

import { Button, Field, Notice, OptionGroup } from "@/design-system";
import type { OptionItem } from "@/design-system";
import {
  LABEL_DOSES_MG,
  POWDER_DILUENT_ML,
  POWDER_DOSES_MG,
  POWDER_VIAL_MG,
  SOLUTION_DOSES_MG,
  SOLUTION_GROUPS,
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

type Mode = "solucao" | "po";

const OUTRO = "outro";

type State = {
  mode: Mode;
  group: string;
  labelMg: string;
  labelMl: string;
  powderMg: string;
  powderMgCustom: string;
  diluentMl: string;
  diluentMlCustom: string;
  syringeMl: string;
  dose: string;
  doseCustom: string;
};

// Nenhuma dose vem marcada: a calculadora converte, nao sugere.
const INITIAL: State = {
  mode: "solucao",
  group: "a",
  labelMg: "",
  labelMl: "",
  powderMg: "",
  powderMgCustom: "",
  diluentMl: "",
  diluentMlCustom: "",
  syringeMl: "1",
  dose: "",
  doseCustom: "",
};

const toNumber = (s: string) => (s.trim() === "" ? Number.NaN : Number(s.trim().replace(",", ".")));
const pick = (choice: string, custom: string) => toNumber(choice === OUTRO ? custom : choice);
const decimal = (n: number) => String(n).replace(".", ",");
const valido = (n: number) => Number.isFinite(n) && n > 0;

const customError = (s: string) =>
  s.trim() !== "" && !valido(toNumber(s)) ? "Digite um número maior que zero, como 4,2." : undefined;

const modeOptions: OptionItem[] = [
  { value: "solucao", label: "Solução pronta", detail: "Tirzepatida líquida" },
  { value: "po", label: "Pó para reconstituir", detail: "GHK-Cu e outros peptídeos" },
];

const groupOptions: OptionItem[] = [
  ...SOLUTION_GROUPS.map((g) => ({
    value: g.id,
    label: g.label,
    detail: `${formatMgPerMl(g.mgPerMl)}${g.vialNote ? ` · ${g.vialNote}` : ""} · ex.: ${g.products}`,
  })),
  { value: OUTRO, label: "Outra concentração", detail: "Digite o que está no rótulo" },
];

const syringeOptions: OptionItem[] = SYRINGES_ML.map((ml) => ({
  value: String(ml),
  label: formatMl(ml),
  detail: `${ml * 100} UI`,
}));

const chips = (values: readonly number[], unit: string): OptionItem[] => [
  ...values.map((v) => ({ value: String(v), label: `${decimal(v)} ${unit}` })),
  { value: OUTRO, label: "Outro" },
];

// labelMg em labelMl e a concentracao (a conta das unidades); vialMg e o total
// no frasco (a conta do rendimento). So diferem no frasco multidose.
type Vial = {
  vialMg: number;
  labelMg: number;
  labelMl: number;
  mgPerMl: number | null;
  description: string;
  multidose: boolean;
};

function resolveVial(s: State): Vial {
  if (s.mode === "po") {
    const vialMg = pick(s.powderMg, s.powderMgCustom);
    const vialMl = pick(s.diluentMl, s.diluentMlCustom);
    return {
      vialMg,
      labelMg: vialMg,
      labelMl: vialMl,
      mgPerMl: concentration(vialMg, vialMl),
      description: `${formatMg(vialMg)} de pó com ${formatMl(vialMl)} de diluente`,
      multidose: false,
    };
  }
  const group = SOLUTION_GROUPS.find((g) => g.id === s.group);
  if (group) {
    return {
      vialMg: group.vialMg,
      labelMg: group.labelMg,
      labelMl: group.labelMl,
      mgPerMl: group.mgPerMl,
      description: group.vialNote ? `${group.label}, ${group.vialNote}` : group.label,
      multidose: group.vialMg > group.labelMg,
    };
  }
  const vialMg = toNumber(s.labelMg);
  const vialMl = toNumber(s.labelMl);
  return {
    vialMg,
    labelMg: vialMg,
    labelMl: vialMl,
    mgPerMl: concentration(vialMg, vialMl),
    description: `${formatMg(vialMg)} / ${formatMl(vialMl)}`,
    multidose: false,
  };
}

// O que falta para haver resultado, na ordem em que a pessoa preenche.
function missingStep(s: State, vial: Vial, doseMg: number): string {
  if (s.mode === "solucao" && s.group === OUTRO && vial.mgPerMl === null) {
    return "Preencha os mg e os mL que estão no rótulo.";
  }
  if (s.mode === "po" && !valido(vial.vialMg)) return "Escolha quanto pó tem no frasco.";
  if (s.mode === "po" && !valido(vial.labelMl)) return "Escolha quanto diluente você colocou.";
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

  // Trocar o tipo de frasco nao pode esconder a dose escolhida: se ela nao
  // existe na outra lista, vira "Outro" com o mesmo valor.
  const setMode = (value: string) =>
    setState((s) => {
      const mode = value as Mode;
      if (s.mode === mode) return s;
      const list = mode === "solucao" ? SOLUTION_DOSES_MG : POWDER_DOSES_MG;
      const keep = s.dose === "" || s.dose === OUTRO || list.includes(Number(s.dose));
      return keep ? { ...s, mode } : { ...s, mode, dose: OUTRO, doseCustom: decimal(Number(s.dose)) };
    });

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
          `Frasco: ${vial.description} (${formatMgPerMl(vial.mgPerMl)})`,
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

  const doseOptions =
    state.mode === "solucao"
      ? chips(SOLUTION_DOSES_MG, "mg").map((o) => ({
          ...o,
          marked: LABEL_DOSES_MG.includes(Number(o.value)),
        }))
      : chips(POWDER_DOSES_MG, "mg");

  return (
    <>
      <div className="calc" id="calculadora">
        <div className="calc__form" ref={formRef}>
          <OptionGroup
            label="Como vem o seu frasco"
            layout="chips"
            name="modo"
            onChange={setMode}
            options={modeOptions}
            value={state.mode}
          />

          {state.mode === "solucao" ? (
            <div className="calc__group">
              <OptionGroup
                hint="Todos de tirzepatida. Confira no rótulo: a concentração impressa vale mais que esta lista."
                label="Concentração no rótulo"
                name="concentracao"
                onChange={set("group")}
                options={groupOptions}
                value={state.group}
              />
              {state.group === OUTRO ? (
                <div className="calc__pair">
                  <Field
                    error={customError(state.labelMg)}
                    inputMode="decimal"
                    label="mg no frasco"
                    onChange={(e) => set("labelMg")(e.target.value)}
                    placeholder="Ex.: 15"
                    value={state.labelMg}
                  />
                  <Field
                    error={customError(state.labelMl)}
                    inputMode="decimal"
                    label="mL no frasco"
                    onChange={(e) => set("labelMl")(e.target.value)}
                    placeholder="Ex.: 0,5"
                    value={state.labelMl}
                  />
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <div className="calc__group">
                <OptionGroup
                  label="Quanto pó tem no frasco"
                  layout="chips"
                  name="po"
                  onChange={set("powderMg")}
                  options={chips(POWDER_VIAL_MG, "mg")}
                  value={state.powderMg}
                />
                {state.powderMg === OUTRO ? (
                  <Field
                    error={customError(state.powderMgCustom)}
                    inputMode="decimal"
                    label="mg de pó no frasco"
                    onChange={(e) => set("powderMgCustom")(e.target.value)}
                    placeholder="Ex.: 40"
                    value={state.powderMgCustom}
                  />
                ) : null}
              </div>
              <div className="calc__group">
                <OptionGroup
                  hint="Use o volume da bula ou da prescrição. A calculadora não escolhe por você."
                  label="Quanto diluente você colocou"
                  layout="chips"
                  name="diluente"
                  onChange={set("diluentMl")}
                  options={chips(POWDER_DILUENT_ML, "mL")}
                  value={state.diluentMl}
                />
                {state.diluentMl === OUTRO ? (
                  <Field
                    error={customError(state.diluentMlCustom)}
                    inputMode="decimal"
                    label="mL de diluente"
                    onChange={(e) => set("diluentMlCustom")(e.target.value)}
                    placeholder="Ex.: 1,2"
                    value={state.diluentMlCustom}
                  />
                ) : null}
              </div>
            </>
          )}

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
              hint={
                state.mode === "solucao"
                  ? "Com ponto: doses da bula da tirzepatida. Use sempre a dose prescrita."
                  : "Vale para qualquer peptídeo em pó: a conta só depende dos mg e do diluente. Use sempre a dose prescrita."
              }
              label={state.mode === "solucao" ? "Dose prescrita de tirzepatida" : "Dose prescrita"}
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
              {state.mode === "solucao" && !vial.multidose && result.fullDoses > 1 ? (
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

/** Todas as doses na mesma conta, para conferir de relance ou imprimir. */
function ReferenceTable({ state, vial, doseMg }: ReferenceTableProps) {
  const isCurrent = (d: number) => valido(doseMg) && Math.abs(d - doseMg) < 1e-9;
  const groupSelected = state.mode === "solucao" && state.group !== OUTRO;

  if (groupSelected) {
    return (
      <section aria-labelledby="tabela-titulo" className="calc-table">
        <h2 className="calc-table__title" id="tabela-titulo">
          A mesma dose de tirzepatida em cada frasco
        </h2>
        <p className="calc-table__intro">
          Unidades na seringa U-100. A dose de tirzepatida é a mesma: muda só o volume de cada
          frasco, e com ele o número de unidades. A coluna destacada é a do frasco que você
          escolheu. A última coluna conta doses a cada 15 mg; o frasco multidose de 0,6 mL tem 4 ×
          15 mg e rende quatro vezes isso.
        </p>
        <div aria-labelledby="tabela-titulo" className="calc-table__scroll" role="region" tabIndex={0}>
          <table>
            <thead>
              <tr>
                <th scope="col">Dose</th>
                {SOLUTION_GROUPS.map((g) => (
                  <th className={g.id === state.group ? "is-current" : undefined} key={g.id} scope="col">
                    {g.label}
                    <span>{formatMgPerMl(g.mgPerMl)}</span>
                  </th>
                ))}
                <th scope="col">
                  Doses
                  <span>a cada 15 mg</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {SOLUTION_DOSES_MG.map((d) => {
                const doses = calculateDose({ mgPerMl: 30, doseMg: d, syringeMl: 1, vialMg: 15 });
                return (
                  <tr className={isCurrent(d) ? "is-current" : undefined} key={d}>
                    <th scope="row">{formatMg(d)}</th>
                    {SOLUTION_GROUPS.map((g) => {
                      const r = calculateDose({ mgPerMl: g.mgPerMl, doseMg: d, syringeMl: 1, vialMg: g.vialMg });
                      return (
                        <td className={g.id === state.group ? "is-current" : undefined} key={g.id}>
                          {r ? formatUnits(r.units) : "–"}
                        </td>
                      );
                    })}
                    <td>{doses?.fullDoses ?? "–"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  if (vial.mgPerMl === null || !valido(vial.vialMg)) return null;

  const mgPerMl = vial.mgPerMl;
  const list = (state.mode === "solucao" ? SOLUTION_DOSES_MG : POWDER_DOSES_MG).filter(
    (d) => d <= vial.vialMg + 1e-9,
  );
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
