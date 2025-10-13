import { useEffect, useRef } from "preact/hooks";
import gsap from "gsap";

interface SlideDirectionalProps {
  children: preact.ComponentChildren;
  direction?: "left" | "right" | "top" | "bottom"; // desde dónde entra
  distance?: number; // qué tanto se mueve
  duration?: number; // duración de la animación
  delay?: number; // tiempo antes de iniciar
  triggerOnScroll?: boolean; // si quieres que se active al hacer scroll
}

export default function SlideDirectional({
  children,
  direction = "bottom",
  distance = 80,
  duration = 1,
  delay = 0,
  triggerOnScroll = true,
}: SlideDirectionalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    let from: gsap.TweenVars = { x: 0, y: 0 };

    // Define la dirección inicial
    switch (direction) {
      case "left":
        from.x = -distance;
        break;
      case "right":
        from.x = distance;
        break;
      case "top":
        from.y = -distance;
        break;
      case "bottom":
        from.y = distance;
        break;
    }

    const animate = () => {
      gsap.fromTo(
        el,
        from,
        {
          x: 0,
          y: 0,
          duration,
          delay,
          ease: "power2.out",
        }
      );
    };

    if (triggerOnScroll) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate();
              observer.disconnect(); // solo se anima una vez
            }
          });
        },
        { threshold: 0.2 }
      );

      observer.observe(el);
      return () => observer.disconnect();
    } else {
      animate();
    }
  }, [direction, distance, duration, delay, triggerOnScroll]);

  return <div ref={ref}>{children}</div>;
}
