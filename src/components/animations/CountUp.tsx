// src/components/CountUp.tsx
import { useEffect, useRef, useState } from "preact/hooks";

interface Props {
  value: number;          // Número al que quieres llegar
  duration?: number;      // Duración en ms (por compatibilidad con tu versión anterior). Default 2000
  className?: string;     // Clases Tailwind opcionales
  suffix?: string;        // sufijo opcional (ej. "+")
}

export default function CountUp({
  value,
  duration = 2000,
  className = "",
  suffix = "",
}: Props) {
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let mounted = true;
    let tween: any = null;
    let ScrollTrigger: any = null;

    if (!spanRef.current) return;

    // duration en segundos para GSAP
    const durSec = Math.max(0.1, duration / 1000);

    // importar gsap dinámicamente (igual que tu AnimateOnScroll)
    import("gsap")
      .then((gsapModule) => {
        const gsap = gsapModule.default;
        return import("gsap/ScrollTrigger").then((st) => {
          ScrollTrigger = st.ScrollTrigger;
          gsap.registerPlugin(ScrollTrigger);

          const obj = { val: 0 };

          // crear tween que actualiza 'obj.val' y en onUpdate actualiza el estado
          tween = gsap.to(obj, {
            val: value,
            duration: durSec,
            ease: "power1.out",
            onUpdate() {
              if (!mounted) return;
              // mostrar entero (puedes usar Math.round si prefieres)
              setCurrent(Math.floor(obj.val));
            },
            // ScrollTrigger para que el tween corra cuando el elemento entre en vista
            scrollTrigger: {
              trigger: spanRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        });
      })
      .catch((err) => {
        // si falla la importación, fallback simple (sin animación GSAP)
        console.error("GSAP load failed:", err);
        if (mounted) setCurrent(value);
      });

    return () => {
      mounted = false;
      try {
        if (tween) {
          // matar tween y su scrollTrigger en cleanup
          if (tween.scrollTrigger) tween.scrollTrigger.kill();
          tween.kill();
        }
        // no solemos llamar a ScrollTrigger.kill() globalmente aquí
      } catch (e) {
        // noop
      }
    };
  }, [value, duration]);

  return (
    <span ref={spanRef} className={className}>
      {current}
      {suffix}
    </span>
  );
}
