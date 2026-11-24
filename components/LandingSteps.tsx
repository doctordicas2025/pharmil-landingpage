import { Card, CardBody } from "@/design-system";

type Step = { title: string; detail: string };

export function LandingSteps({ steps }: { steps: readonly Step[] }) {
  return (
    <ol className="lp-grid lp-grid--3 lp-steps">
      {steps.map((step, index) => (
        <Card as="li" key={step.title}>
          <CardBody>
            <span aria-hidden="true" className="lp-step__number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="lp-card__title">{step.title}</h3>
            <p className="lp-card__text">{step.detail}</p>
          </CardBody>
        </Card>
      ))}
    </ol>
  );
}
