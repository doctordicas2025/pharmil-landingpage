import type { Metadata } from "next";

import Showcase from "./Showcase";

export const metadata: Metadata = {
  title: "Design System",
  description: "Biblioteca de componentes da Pharmil, com todos os estados.",
  robots: { index: false, follow: false },
};

export default function DesignSystemPage() {
  return (
    <main id="conteudo">
      <Showcase />
    </main>
  );
}
