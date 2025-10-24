import { useEffect, useState, useRef } from "preact/hooks";
import AnimateOnScrollTop from "./animations/AnimateOnScrollTop";

interface Testimonial {
  quote: string;
}

interface Props {
  testimonials?: Testimonial[];
  interval?: number; // tiempo en ms para autoplay
}

export default function TestimonialsCarousel({
  testimonials = [
    { quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { quote: "Proin ac lorem id libero sollicitudin cursus." },
    { quote: "Suspendisse potenti. Curabitur non metus sed metus tincidunt." },
  ],
  interval = 10000,
}: Props) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<number | null>(null);

  // 🔁 Función para reiniciar el autoplay
  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, interval);
  };

  // 🧭 Navegación manual
  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
    resetTimer();
  };

  const prev = () => {
    setCurrent((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
    resetTimer();
  };

  // ⏱️ Inicializar autoplay al montar
  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [interval, testimonials.length]);

  return (
    <section class="bg-gradient-to-b from-[#121843] to-[#121833] py-12 lg:py-16">
      <AnimateOnScrollTop>
        <div class="max-w-4xl mx-auto px-6 xl:px-0 relative">
          <figure class="relative flex flex-col gap-y-6 sm:mx-auto sm:w-full xl:gap-y-8 text-center">
            {/* Texto del testimonio */}
            <blockquote class="min-h-[120px] md:min-h-[140px] lg:min-h-[160px] px-4">
              <p class="testimonials">“{testimonials[current].quote}”</p>
            </blockquote>

            {/* Botones de navegación */}
            <div class="mt-6 flex items-center justify-center gap-x-4 md:mt-8 md:gap-x-8">
              <button
                aria-label="Previous testimonial"
                onClick={prev}
                class="rounded-full cursor-pointer flex items-center justify-center transition-all focus:ring-2 ring-slate-500 shadow-md bg-slate-800 text-white hover:bg-slate-700 w-8 h-8 md:w-10 md:h-10 xl:w-12 xl:h-12"
              >
                ←
              </button>
              <button
                aria-label="Next testimonial"
                onClick={next}
                class="rounded-full cursor-pointer flex items-center justify-center transition-all focus:ring-2 ring-slate-500 shadow-md bg-slate-800 text-white hover:bg-slate-700 w-8 h-8 md:w-10 md:h-10 xl:w-12 xl:h-12"
              >
                →
              </button>
            </div>

            {/* Dots */}
            <div class="mt-4 flex justify-center gap-x-3">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrent(idx);
                    resetTimer();
                  }}
                  class={`w-3 h-3 rounded-full transition-all duration-200 ${
                    current === idx
                      ? "bg-slate-100"
                      : "bg-slate-600 hover:bg-slate-500"
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                ></button>
              ))}
            </div>
          </figure>
        </div>
      </AnimateOnScrollTop>
    </section>
  );
}
