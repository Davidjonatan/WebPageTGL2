import { useEffect, useRef } from "preact/hooks";

interface Props {
  children: preact.ComponentChildren;
}

export default function AnimateFooter({ children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    (async () => {
      const gsapModule = await import("gsap");
      const ScrollTriggerModule = await import("gsap/ScrollTrigger");

      const gsap = gsapModule.gsap || gsapModule.default;
      const ScrollTrigger = ScrollTriggerModule.ScrollTrigger;

      gsap.registerPlugin(ScrollTrigger);

      // 👈 usamos '!' para decirle a TS que no es null
      const columns = containerRef.current!.querySelectorAll<HTMLElement>(".footer-col");

      if (columns.length === 0) return;

      gsap.fromTo(
        columns,
        { opacity: 0, x: 50, y: 30, scale: 0.95 }, // inicio más marcado
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.3, // cada columna entra escalonada
          scrollTrigger: {
            trigger: containerRef.current!,
            start: "top 90%", // dispara cuando el footer entra
            toggleActions: "play none none none",
          },
        }
      );
    })();
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
