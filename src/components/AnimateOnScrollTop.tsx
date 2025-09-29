import { useEffect, useRef } from "preact/hooks";

interface Props {
  children: any;
}

export default function AnimateOnScrollTop({ children }: Props) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    // Importar dinámicamente GSAP y ScrollTrigger
    import("gsap").then((gsapModule) => {
      import("gsap/ScrollTrigger").then((ScrollTriggerModule) => {
        const gsap = gsapModule.default;
        const ScrollTrigger = ScrollTriggerModule.ScrollTrigger;

        // Registrar plugin
        gsap.registerPlugin(ScrollTrigger);

        // Animación desde ARRIBA (y: -50)
        gsap.fromTo(
          elementRef.current!,
          { opacity: 0, y: -50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0, // puedes ajustar la duración
            ease: "power2.out",
            scrollTrigger: {
              trigger: elementRef.current,
              start: "top 85%", // empieza cuando el elemento esté al 85% del viewport
              toggleActions: "play none none none",
            },
          }
        );
      });
    });
  }, []);

  return <div ref={elementRef}>{children}</div>;
}
