/**
 * Biblioteca Pharmil. Importe sempre daqui, nunca do caminho interno:
 *
 *   import { Button, Card } from "@/design-system";
 *
 * O contrato visual esta em DESIGN.md. A extracao medida do codigo, com a
 * justificativa de cada valor, esta em .interface-design/system.md.
 */

export { Button, IconButton } from "./components/Button";
export type { ButtonProps, ButtonSize, ButtonVariant, IconButtonProps } from "./components/Button";

export { Card, CardBody, CardFooter, CardMedia } from "./components/Card";
export type { CardMediaProps, CardProps } from "./components/Card";

export { Accordion, Stat, TextLink } from "./components/Disclosure";
export type { AccordionItem, AccordionProps, StatProps, TextLinkProps } from "./components/Disclosure";

export { EmptyState, ErrorState, Skeleton, Spinner } from "./components/Feedback";
export type { EmptyStateProps, ErrorStateProps } from "./components/Feedback";

export { Field, FieldSet, OptionGroup } from "./components/Field";
export type { FieldProps, OptionGroupProps } from "./components/Field";

export { FactList, Modal, ModalBody, ModalMedia } from "./components/Modal";
export type { FactListProps, ModalProps } from "./components/Modal";

export { Badge, Chip, DotPill, Eyebrow, FilterPill, IconBox } from "./components/Pill";
export type { EyebrowTone, FilterPillProps } from "./components/Pill";
