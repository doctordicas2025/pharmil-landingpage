import { formatUnits } from "@/lib/dosage";

type SyringeGaugeProps = {
  units: number;
  maxUnits: number;
  stepUnits: number;
};

// Medidas no espaco do viewBox. O cilindro vai de BARREL_X ate BARREL_X + BARREL_W.
const BARREL_X = 30;
const BARREL_W = 270;
const BARREL_Y = 14;
const BARREL_H = 26;

/**
 * Seringa U-100 desenhada na escala real da graduacao: risco curto a cada
 * passo da seringa, risco longo com numero a cada 10 (a cada 5 na de 30).
 */
export function SyringeGauge({ units, maxUnits, stepUnits }: SyringeGaugeProps) {
  const ratio = Math.min(units / maxUnits, 1);
  const labelEvery = maxUnits <= 30 ? 5 : 10;
  const ticks: number[] = [];
  for (let u = 0; u <= maxUnits + 1e-9; u += stepUnits) ticks.push(u);

  const x = (u: number) => BARREL_X + (u / maxUnits) * BARREL_W;

  return (
    <svg
      aria-label={`Seringa de ${formatUnits(maxUnits)} unidades preenchida até ${formatUnits(units)}`}
      className="calc-syringe"
      role="img"
      viewBox="0 0 320 62"
    >
      {/* agulha */}
      <line className="calc-syringe__needle" x1="2" x2={BARREL_X - 6} y1="27" y2="27" />
      <rect className="calc-syringe__hub" height="12" rx="2" width="8" x={BARREL_X - 8} y="21" />

      {/* liquido: escala em X a partir da ponta, para a transicao ser so transform */}
      <rect
        className="calc-syringe__fill"
        height={BARREL_H}
        style={{ transform: `scaleX(${ratio})` }}
        width={BARREL_W}
        x={BARREL_X}
        y={BARREL_Y}
      />

      {/* embolo acompanha o nivel */}
      <g className="calc-syringe__plunger" style={{ transform: `translateX(${ratio * BARREL_W}px)` }}>
        <rect height="4" width={BARREL_W + 24} x={BARREL_X} y={BARREL_Y + BARREL_H / 2 - 2} />
        <rect height={BARREL_H - 4} rx="1.5" width="5" x={BARREL_X - 2.5} y={BARREL_Y + 2} />
      </g>

      <rect
        className="calc-syringe__barrel"
        height={BARREL_H}
        rx="4"
        width={BARREL_W}
        x={BARREL_X}
        y={BARREL_Y}
      />

      {ticks.map((u) => {
        const major = Math.abs(u % labelEvery) < 1e-9;
        return (
          <line
            className={major ? "calc-syringe__tick is-major" : "calc-syringe__tick"}
            key={u}
            x1={x(u)}
            x2={x(u)}
            y1={BARREL_Y}
            y2={BARREL_Y + (major ? 11 : 6)}
          />
        );
      })}

      {ticks
        .filter((u) => Math.abs(u % labelEvery) < 1e-9)
        .map((u) => (
          <text className="calc-syringe__label" key={u} textAnchor="middle" x={x(u)} y="56">
            {u}
          </text>
        ))}
    </svg>
  );
}
