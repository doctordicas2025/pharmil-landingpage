import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import ColdChain from "@/components/sections/ColdChain";
import Faq from "@/components/sections/Faq";
import FinalCta from "@/components/sections/FinalCta";
import Footer from "@/components/sections/Footer";
import OrderProcess from "@/components/sections/OrderProcess";
import Shop from "@/components/sections/Shop";
import Testimonials from "@/components/sections/Testimonials";
import Trust from "@/components/sections/Trust";
import { catalogToday } from "@/lib/catalog";
import { getContactHref } from "@/lib/site-config";

// O preco de campanha vale ate um dia certo de Brasilia. A pagina e refeita de
// hora em hora para voltar sozinha ao preco normal, sem novo deploy.
export const revalidate = 3600;

export default function HomePage() {
  const contactHref = getContactHref();
  const products = catalogToday(new Date());

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header contactHref={contactHref} />
      <main id="conteudo">
        <Hero contactHref={contactHref} />
        <Shop products={products} />
        <ColdChain />
        <OrderProcess />
        <Trust contactHref={contactHref} />
        <Testimonials />
        <Faq contactHref={contactHref} />
        <FinalCta contactHref={contactHref} />
      </main>
      <Footer contactHref={contactHref} />
    </>
  );
}
