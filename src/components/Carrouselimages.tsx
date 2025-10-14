import { useEffect, useState } from "preact/hooks";
import AnimateEntrance from "./animations/AnimateEntrance";

interface Slide {
  src: string;
  alt?: string;
}

interface Props {
  title?: string;
  description?: string;
  slides?: Slide[];
  interval?: number; // tiempo en ms para autoplay
}

export default function ImageCarousel({
  title = "Nuestro trabajo",
  description = "Explora algunos de nuestros proyectos más recientes y destacados. Cada imagen refleja nuestro compromiso con la calidad y la innovación.",
  slides = [
    { src: "/images/demo1.jpg", alt: "Imagen 1" },
    { src: "/images/demo2.jpg", alt: "Imagen 2" },
    { src: "/images/demo3.jpg", alt: "Imagen 3" },
  ],
  interval = 5000,
}: Props) {
  const [current, setCurrent] = useState(0);

  // autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(timer);
  }, [interval, slides.length]);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () =>
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <section class="bg-gradient-to-b from-[#121833] to-[#121843] py-12 lg:py-20">
      <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-10 items-start">
        {/* Texto (izquierda, arriba) */}
        <div class="flex flex-col justify-start self-start text-center md:text-left space-y-4 mt-4">
         <AnimateEntrance origin="topRight" useScrollTrigger={true} triggerClass="title-col" stagger={0.2}>
          <h2 class="history-title title-col">
            {title}
          </h2>
          </AnimateEntrance>
          <AnimateEntrance origin="bottom" useScrollTrigger={true} triggerClass="description-col" stagger={0.2}>
          <p class="history-description description-col">
            {description}
          </p>
          </AnimateEntrance>
        </div>

        {/* Carrusel de imágenes (derecha, grande) */}
        <AnimateEntrance origin="Right" useScrollTrigger={true} triggerClass="carrousel-col" stagger={0.2}>
        <div class="relative flex flex-col items-center carrousel-col">
          <figure class="relative w-full max-w-2xl h-80 md:h-[28rem] lg:h-[32rem] overflow-hidden rounded-2xl shadow-2xl">
            <img
              src={slides[current].src}
              alt={slides[current].alt ?? "Slide"}
              class="w-full h-full object-cover transition-all duration-700"
            />
          </figure>

          {/* Botones de navegación */}
          <div class="mt-6 flex items-center justify-center gap-x-4">
            <button
              aria-label="Previous slide"
              onClick={prev}
              class="rounded-full cursor-pointer flex items-center justify-center transition-all focus:ring-2 ring-slate-500 shadow-lg bg-slate-800 text-white hover:bg-slate-700 w-10 h-10"
            >
              ←
            </button>
            <button
              aria-label="Next slide"
              onClick={next}
              class="rounded-full cursor-pointer flex items-center justify-center transition-all focus:ring-2 ring-slate-500 shadow-lg bg-slate-800 text-white hover:bg-slate-700 w-10 h-10"
            >
              →
            </button>
          </div>

          {/* Dots de progreso */}
          <div class="mt-4 flex justify-center gap-x-3">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                class={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  current === idx
                    ? "bg-slate-100 scale-125"
                    : "bg-slate-600 hover:bg-slate-500"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </AnimateEntrance>
      </div>
    </section>
  );
}
