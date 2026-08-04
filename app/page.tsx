import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import Catalog from "@/components/sections/Catalog";
import ColdChain from "@/components/sections/ColdChain";
import Faq from "@/components/sections/Faq";
import Footer from "@/components/sections/Footer";
import OrderProcess from "@/components/sections/OrderProcess";
import Pepking from "@/components/sections/Pepking";
import Trust from "@/components/sections/Trust";
import { getContactHref } from "@/lib/site-config";

export default function HomePage() {
  const contactHref = getContactHref();

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Catalog />
        <Pepking />
        <ColdChain />
        <OrderProcess contactHref={contactHref} />
        <Trust />
        <Faq />
      </main>
      <Footer contactHref={contactHref} />
    </>
  );
}
