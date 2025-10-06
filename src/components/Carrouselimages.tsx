import { useEffect, useState } from "preact/hooks";

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
    <section class="bg-gradient-to-b from-[#1E2A47] to-slate-900 py-10 lg:py-16">
      <div class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Texto (izquierda) */}
        <div class="text-center md:text-left space-y-6">
          <h2 class="text-3xl md:text-4xl font-bold text-white">{title}</h2>
          <p class="text-base md:text-lg text-slate-300">{description}</p>
        </div>

        {/* Carrusel de imágenes (derecha) */}
        <div class="relative flex flex-col items-center">
          <figure class="relative w-full max-w-lg h-64 md:h-80 lg:h-96 overflow-hidden rounded-xl shadow-lg">
            <img
              src={slides[current].src}
              alt={slides[current].alt ?? "Slide"}
              class="w-full h-full object-cover transition-all duration-700"
            />
          </figure>

          {/* botones de navegación */}
          <div class="mt-4 flex items-center justify-center gap-x-3">
            <button
              aria-label="Previous slide"
              onClick={prev}
              class="rounded-full cursor-pointer flex items-center justify-center transition-all focus:ring-2 ring-slate-500 shadow-md bg-slate-800 text-white hover:bg-slate-700 w-9 h-9"
            >
              ←
            </button>
            <button
              aria-label="Next slide"
              onClick={next}
              class="rounded-full cursor-pointer flex items-center justify-center transition-all focus:ring-2 ring-slate-500 shadow-md bg-slate-800 text-white hover:bg-slate-700 w-9 h-9"
            >
              →
            </button>
          </div>

          {/* dots de progreso */}
          <div class="mt-3 flex justify-center gap-x-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                class={`w-3 h-3 rounded-full transition-all duration-200 ${
                  current === idx
                    ? "bg-slate-100 scale-110"
                    : "bg-slate-600 hover:bg-slate-500"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
