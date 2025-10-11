// AnimateFromLeft.tsx
import { useEffect, useRef } from "preact/hooks";

interface Props {
  children: preact.ComponentChildren;
  distance?: number;   // cuánto se desplaza desde la izquierda
  duration?: number;   // duración de la animación
  delay?: number;      // retraso antes de iniciar
}

export default function AnimateFromLeft({
  children,
  distance = 50,
  duration = 1.5,
  delay = 0,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    import("gsap").then((gsapModule) => {
      import("gsap/ScrollTrigger").then((ScrollTriggerModule) => {
        const gsap = gsapModule.default;
        const ScrollTrigger = ScrollTriggerModule.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);

        // Animación desde izquierda
        gsap.fromTo(
          ref.current!,
          { autoAlpha: 0, x: -distance },
          {
            autoAlpha: 1,
            x: 0,
            duration,
            delay,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    });
  }, [distance, duration, delay]);

  return (
    <div ref={ref} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
