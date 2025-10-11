import { useEffect, useRef } from "preact/hooks";
import gsap from "gsap";

interface AnimatedGlowBorderProps {
  color?: string; // color principal del borde
  thickness?: number; // grosor del borde
}

export default function AnimatedGlowBorder({
  color = "rgba(79,70,229,1)",
  thickness = 4,
}: AnimatedGlowBorderProps) {
  const borderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!borderRef.current) return;

    const tl = gsap.timeline({ repeat: -1, defaults: { ease: "sine.inOut" } });

    tl.to(borderRef.current, {
      opacity: 0, // se apaga completamente
      duration: 1.5,
    })
      .to(borderRef.current, {
        opacity: 1, // vuelve a aparecer
        boxShadow: `0 0 20px ${color}, 0 0 40px ${color}`,
        duration: 1.5,
      });

    return () => tl.kill();
  }, [color]);

  return (
    <div
      ref={borderRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        border: `${thickness}px solid ${color}`,
        borderRadius: "1rem",
        pointerEvents: "none",
        boxSizing: "border-box",
        zIndex: 10,
        opacity: 1,
      }}
    />
  );
}
