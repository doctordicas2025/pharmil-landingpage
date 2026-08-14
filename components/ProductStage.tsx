import Image from "next/image";

export function ProductStage() {
  return (
    <figure className="product-stage">
      <div className="product-stage__image-frame">
        <Image
          className="product-stage__image"
          src="/images/pharmil-products-hero.jpg"
          alt="Embalagens e frascos da linha Pharmil"
          width={1376}
          height={768}
          sizes="(max-width: 992px) 100vw, 55vw"
          preload
        />
      </div>

      <figcaption className="product-stage__caption">
        <span className="product-stage__caption-title">
          <span aria-hidden="true" />
          Linha Pharmil
        </span>
        <small>Apresentações e disponibilidade sob confirmação.</small>
      </figcaption>
    </figure>
  );
}
