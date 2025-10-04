import { useEffect, useState } from "preact/hooks";
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
  interval = 5000,
}: Props) {
  const [current, setCurrent] = useState(0);

  // autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, interval);
    return () => clearInterval(timer);
  }, [interval, testimonials.length]);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));

  return (
    <section class="bg-gradient-to-b from-[#1E2A47] to-slate-900 py-8 lg:py-12">
      <AnimateOnScrollTop>
        <div class="max-w-3xl mx-auto px-4 xl:px-0 relative">
          <figure
  class="relative flex flex-col gap-y-4 sm:mx-auto sm:w-11/12 xl:gap-y-6 text-center 
         h-52 md:h-60 lg:h-64 xl:h-72 overflow-hidden"
>
  <blockquote class="h-full overflow-y-auto px-2">
    <p class="text-base md:text-lg xl:text-xl font-medium text-slate-100">
      “{testimonials[current].quote}”
    </p>
  </blockquote>

  {/* botones de navegación */}
  <div class="mt-4 flex items-center justify-center gap-x-3 md:mt-6 md:gap-x-6">
    <button
      aria-label="Previous testimonial"
      onClick={prev}
      class="rounded-full cursor-pointer flex items-center justify-center transition-all focus:ring-2 ring-slate-500 shadow-md bg-slate-800 text-white hover:bg-slate-700 w-7 h-7 md:w-9 md:h-9 xl:w-10 xl:h-10"
    >
      ←
    </button>
    <button
      aria-label="Next testimonial"
      onClick={next}
      class="rounded-full cursor-pointer flex items-center justify-center transition-all focus:ring-2 ring-slate-500 shadow-md bg-slate-800 text-white hover:bg-slate-700 w-7 h-7 md:w-9 md:h-9 xl:w-10 xl:h-10"
    >
      →
    </button>
  </div>

  {/* progress dots */}
  <div class="mt-3 flex justify-center gap-x-2">
    {testimonials.map((_, idx) => (
      <button
        key={idx}
        onClick={() => setCurrent(idx)}
        class={`w-2 h-2 rounded-full transition-all duration-200 ${
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
