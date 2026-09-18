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
import { getContactHref } from "@/lib/site-config";

export default function HomePage() {
  const contactHref = getContactHref();

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header contactHref={contactHref} />
      <main id="conteudo">
        <Hero contactHref={contactHref} />
        <Shop />
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
