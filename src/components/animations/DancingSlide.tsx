import { useEffect, useRef } from "preact/hooks";
import gsap from "gsap";

interface DancingSlideProps {
  children: preact.ComponentChildren; // imagen u otro contenido
  amplitude?: number; // distancia máxima de movimiento horizontal (px)
  speed?: number; // duración de un ciclo completo (segundos)
  delay?: number; // delay antes de iniciar
}

export default function DancingSlide({
  children,
  amplitude = 20,
  speed = 2,
  delay = 0,
}: DancingSlideProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const tween = gsap.to(containerRef.current, {
      x: `+=${amplitude}`, // mueve a la derecha
      duration: speed / 2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true, // vuelve al punto original
      delay,
    });

    return () => {
      tween.kill();
    };
  }, [amplitude, speed, delay]);

  return (
    <div
      ref={containerRef}
      style={{ display: "inline-block", willChange: "transform" }}
    >
      {children}
    </div>
  );
}
