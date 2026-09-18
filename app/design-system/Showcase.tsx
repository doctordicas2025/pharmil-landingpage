"use client";

import { useState } from "react";

import {
  Accordion,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  DotPill,
  EmptyState,
  ErrorState,
  Eyebrow,
  FactList,
  Field,
  FieldSet,
  FilterPill,
  IconBox,
  IconButton,
  Modal,
  ModalBody,
  OptionGroup,
  Skeleton,
  Spinner,
  Stat,
  TextLink,
} from "@/design-system";

function Row({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="ds-demo__row">
      <div className="ds-demo__row-head">
        <h3>{title}</h3>
        {note ? <p>{note}</p> : null}
      </div>
      <div className="ds-demo__row-body">{children}</div>
    </section>
  );
}

const clock = (
  <svg fill="none" height="18" stroke="var(--color-orange)" strokeWidth="1.7" viewBox="0 0 24 24" width="18">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export default function Showcase() {
  const [filter, setFilter] = useState("Todos");
  const [choice, setChoice] = useState("Entender como funciona");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="ds-demo">
      <header className="ds-demo__header">
        <Eyebrow>Biblioteca</Eyebrow>
        <h1>Design System Pharmil</h1>
        <p>
          Todos os componentes da biblioteca em <code>design-system/</code>, com seus
          estados. O contrato de valores esta em <code>DESIGN.md</code>; a extracao
          medida do codigo, em <code>.interface-design/system.md</code>.
        </p>
      </header>

      <Row title="Button" note="Variantes primary, secondary e inline. Estados: default, hover, focus, disabled, loading.">
        <Button>Garanta o seu agora</Button>
        <Button variant="secondary">Ver produtos</Button>
        <Button variant="inline">Pedir no WhatsApp</Button>
        <Button disabled>Indisponivel</Button>
        <Button loading>Enviando</Button>
        <Button size="sm" variant="secondary">Compacto</Button>
      </Row>

      <Row title="IconButton" note="44px — o alvo de toque minimo do sistema.">
        <IconButton label="Ver detalhes">+</IconButton>
        <IconButton disabled label="Indisponivel">+</IconButton>
      </Row>

      <Row title="Rotulos" note="Eyebrow em tres tons, badge sobre imagem e pilula de assinatura.">
        <Eyebrow>Nossos produtos</Eyebrow>
        <Eyebrow tone="orange">Cadeia de frio</Eyebrow>
        <Eyebrow tone="muted">Metadado</Eyebrow>
        <Badge>+ GHK-Cu por R$ 249</Badge>
        <DotPill>Tecnologia em peptideos</DotPill>
      </Row>

      <Row title="FilterPill" note="Estado ativo inverte para preenchimento wine.">
        {["Todos", "GLP-1", "Skin", "Recovery"].map((f) => (
          <FilterPill active={filter === f} count={f === "Todos" ? 8 : 2} key={f} onClick={() => setFilter(f)}>
            {f}
          </FilterPill>
        ))}
        <FilterPill disabled>Esgotado</FilterPill>
      </Row>

      <Row title="Chip e IconBox" note="Sinal de confianca. Nao e acao — sem hover de clique.">
        <Chip icon={clock}>Rastreio no mesmo dia</Chip>
        <IconBox>{clock}</IconBox>
      </Row>

      <Row title="Card" note="Repouso, interativo e selecionado. Sombra so em movimento.">
        <Card>
          <CardBody>
            <Eyebrow tone="muted">Etapa</Eyebrow>
            <h4 className="ds-demo__card-title">Conformidade confirmada</h4>
            <p className="ds-demo__card-text">Origem e registro verificados junto a farmacia parceira.</p>
          </CardBody>
          <CardFooter>
            <TextLink href="#">Saber mais</TextLink>
          </CardFooter>
        </Card>
        <Card interactive>
          <CardBody>
            <Eyebrow tone="muted">Interativo</Eyebrow>
            <h4 className="ds-demo__card-title">Passe o mouse</h4>
            <p className="ds-demo__card-text">Eleva 4px com sombra tingida de wine.</p>
          </CardBody>
        </Card>
        <Card selected tone="surface">
          <CardBody>
            <Eyebrow tone="muted">Selecionado</Eyebrow>
            <h4 className="ds-demo__card-title">Estado ativo</h4>
            <p className="ds-demo__card-text">Borda wine com anel de 1px.</p>
          </CardBody>
        </Card>
      </Row>

      <Row title="Field" note="Default, com apoio, erro e desabilitado. Erro sempre em texto, nunca so na borda.">
        <div className="ds-demo__stack">
          <FieldSet>
            <Field label="Nome completo" placeholder="Seu nome" />
            <Field hint="Usamos so para o atendimento." label="Telefone" placeholder="(11) 99999-9999" />
            <Field defaultValue="abc" error="Telefone invalido: faltam digitos." label="Telefone" />
            <Field disabled label="Campo bloqueado" placeholder="Indisponivel" />
          </FieldSet>
        </div>
      </Row>

      <Row title="OptionGroup" note="Escolha unica. O radio nativo fica acessivel mas invisivel.">
        <div className="ds-demo__stack">
          <OptionGroup
            label="Como podemos ajudar?"
            name="demo"
            onChange={setChoice}
            options={["Entender como funciona", "Consultar disponibilidade", "Tirar duvidas sobre entrega"]}
            value={choice}
          />
        </div>
      </Row>

      <Row title="Accordion" note="Uma resposta aberta por vez, controlado por indice.">
        <div className="ds-demo__stack">
          <Accordion
            items={[
              { question: "Preciso de receita medica?", answer: "Sim, sempre que o item exigir." },
              { question: "Como e feita a entrega?", answer: "Caixa termica lacrada, com rastreio no mesmo dia." },
              { question: "Quais formas de pagamento?", answer: "PIX a vista ou cartao." },
            ]}
          />
        </div>
      </Row>

      <Row title="Stat" note="Sobre papel e sobre superficie escura.">
        <div className="ds-demo__stack">
          <Stat detail="faixa mantida do estoque a entrega" value="2–8 °C" />
        </div>
        <div className="ds-demo__stack ds-demo__dark">
          <Stat detail="dos pedidos com lacre numerado" onDark value="100%" />
        </div>
      </Row>

      <Row title="Modal" note="Fecha no clique fora, no botao e no Escape.">
        <Button onClick={() => setModalOpen(true)} variant="secondary">
          Abrir dialogo
        </Button>
        <Modal onClose={() => setModalOpen(false)} open={modalOpen} title="GHK-Cu 100 mg">
          <ModalBody>
            <Eyebrow tone="muted">Skin</Eyebrow>
            <h3 className="ds-demo__modal-title">GHK-Cu 100 mg</h3>
            <p className="ds-demo__card-text">Peptideo de cobre em frasco liofilizado.</p>
            <FactList
              facts={[
                { label: "Apresentacao", value: "Frasco liofilizado" },
                { label: "Quantidade", value: "100 mg" },
                { label: "Conservacao", value: "Entre 2 e 8 °C" },
              ]}
            />
            <div className="ds-demo__modal-action">
              <Button block>Pedir no WhatsApp</Button>
            </div>
          </ModalBody>
        </Modal>
      </Row>

      <Row title="Estados de dado" note="Vazio, erro e carregamento.">
        <div className="ds-demo__stack">
          <EmptyState
            action={<Button size="sm" variant="secondary">Limpar filtro</Button>}
            description="Nenhum produto corresponde a esta linha."
            title="Nada por aqui"
          />
        </div>
        <div className="ds-demo__stack">
          <ErrorState
            action={<Button size="sm" variant="secondary">Tentar de novo</Button>}
            description="Nao foi possivel carregar o catalogo."
            title="Falha ao carregar"
          />
        </div>
        <div className="ds-demo__stack">
          <Skeleton height={20} />
          <div style={{ height: 8 }} />
          <Skeleton height={20} width="70%" />
          <div style={{ height: 16 }} />
          <Spinner label="Carregando" />
        </div>
      </Row>

      <Row title="TextLink">
        <TextLink href="#">Entender o processo</TextLink>
        <TextLink external href="https://wa.me/5561999969091">
          Falar no WhatsApp
        </TextLink>
      </Row>
    </div>
  );
}
