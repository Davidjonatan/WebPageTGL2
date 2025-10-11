import { useEffect, useRef } from "preact/hooks";
import type { ComponentChildren } from "preact";

interface AnimateEntranceProps {
  children: ComponentChildren;
  origin?: "topRight" | "bottomLeft" | "topLeft" | "bottomRight" | "top" | "bottom" | "Left" | "Right";
  stagger?: number;
  useScrollTrigger?: boolean;
  triggerClass?: string;
}

export default function AnimateEntrance({
  children,
  origin = "topRight",
  stagger = 0.2,
  useScrollTrigger = true,
  triggerClass = "",
}: AnimateEntranceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    (async () => {
      const gsapModule = await import("gsap");
      const ScrollTriggerModule = await import("gsap/ScrollTrigger");

      const gsap = gsapModule.gsap || gsapModule.default;
      const ScrollTrigger = ScrollTriggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const elements = triggerClass
        ? containerRef.current.querySelectorAll<HTMLElement>(`.${triggerClass}`)
        : containerRef.current.children;

      if (!elements.length) return;

      let from = { opacity: 0, x: 0, y: 0, scale: 0.95 };

      switch (origin) {
        case "topRight":
          from.x = 50;
          from.y = -50;
          break;
        case "bottomLeft":
          from.x = -50;
          from.y = 50;
          break;
        case "topLeft":
          from.x = -50;
          from.y = -50;
          break;
        case "bottomRight":
          from.x = 50;
          from.y = 50;
          break;
        case "top":
          from.y = 50;
          break;
        case "bottom":
          from.y = -50;
          break;
        case "Left":
          from.x = -50;
          break;
        case "Right":
          from.x = 50;
          break;
      }

      gsap.fromTo(
        elements,
        from,
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger,
          scrollTrigger: useScrollTrigger
            ? {
                trigger: containerRef.current!,
                start: "top 90%",
                toggleActions: "play none none none",
              }
            : undefined,
        }
      );
    })();
  }, [origin, stagger, useScrollTrigger, triggerClass]);

  return <div ref={containerRef}>{children}</div>;
}
