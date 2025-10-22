/** @jsxImportSource preact */
import { useEffect, useState } from "preact/hooks";

export interface Slide {
  title: string;
}

export interface HeroSectionProps {
  backgroundType?: "video" | "image";
  backgroundSrc?: string;
  slides?: Slide[];
  interval?: number;
  enableCarousel?: boolean;
}

export default function Hero({
  backgroundType = "video",
  backgroundSrc = "/public/images/index/video.mp4",
  slides = [
    { title: "CALIDAD Y RAPIDEZ" },
    { title: "EXPERIENCIA COMO RESPALDO" },
    { title: "SEGURIDAD EN EL SERVICIO" },
    { title: "CUIDADO EN EL TRASLADO" },
  ],
  interval = 6000,
  enableCarousel = true,
}: HeroSectionProps) {
  const [active, setActive] = useState(0);

  // Carrusel automático si está habilitado
  useEffect(() => {
    if (!enableCarousel) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(timer);
  }, [slides.length, interval, enableCarousel]);

  const activeSlide = slides[active];

  return (
    <section class="relative h-[100vh] lg:h-screen overflow-hidden z-0">
      {/* 🎥 Imagen o Video de fondo */}
      {backgroundType === "video" ? (
        <video
          autoplay
          muted
          loop
          class="absolute top-0 left-0 w-full h-full object-cover z-10"
        >
          <source src={backgroundSrc} type="video/mp4" />
        </video>
      ) : (
        <img
          src={backgroundSrc}
          alt="Background"
          class="absolute top-0 left-0 w-full h-full object-cover z-10"
        />
      )}

      {/* Overlay oscuro */}
      <div class="absolute top-0 left-0 w-full h-full bg-black/40 z-10"></div>

      {/* Contenido */}
      <div class="relative z-20 flex items-start h-full px-6 lg:px-20 pt-[50vh]">
        <div class="max-w-3xl text-left relative">
          {enableCarousel ? (
            // Carrusel de títulos
            <div
              key={activeSlide.title}
              class="animate-fade-in absolute"
              style={{ transition: "opacity 1s ease-in-out" }}
            >
              <h1 class="titulo-principal">
                <span class="block">{activeSlide.title.split(" ")[0]}</span>
                <span class="block whitespace-nowrap">
                  {activeSlide.title.split(" ").slice(1).join(" ")}
                </span>
              </h1>
            </div>
          ) : (
            // Solo muestra el primer título si no hay carrusel
            <h1 class="titulo-principal animate-fade-in">
              <span class="block">{slides[0].title.split(" ")[0]}</span>
              <span class="block whitespace-nowrap">
                {slides[0].title.split(" ").slice(1).join(" ")}
              </span>
            </h1>
          )}
        </div>
      </div>

      <style>
        {`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}
      </style>
    </section>
  );
}
