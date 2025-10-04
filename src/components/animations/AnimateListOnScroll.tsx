import { useEffect, useRef } from "preact/hooks";

interface Props {
  children: any;
}

export default function AnimateListOnScroll({ children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    import("gsap").then((gsapModule) => {
      import("gsap/ScrollTrigger").then((ScrollTriggerModule) => {
        const gsap = gsapModule.default;
        const ScrollTrigger = ScrollTriggerModule.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);

        // Buscar específicamente la lista UL dentro del contenedor
        const list = container.querySelector("ul");
        if (!list) return;

        const items = list.querySelectorAll("li");
        if (!items || items.length === 0) return;

        gsap.fromTo(
          items,
          { 
            opacity: 0, 
            x: -30, // Cambié a -30 para que vengan desde la izquierda
            scale: 0.8 
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.2, // Reducí el stagger para que sea más rápido
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: list, // Usar la lista como trigger
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    });
  }, []);

  return <div ref={containerRef}>{children}</div>;
}