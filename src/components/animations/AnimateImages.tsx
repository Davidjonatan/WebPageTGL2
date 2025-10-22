import { h } from "preact";
import { useEffect, useRef } from "preact/hooks";
import gsap from "gsap";

interface Props {
  children: any;        // Los elementos a animar
  activeTab: string;    // Se dispara animación al cambiar de tab
}

export default function AnimateImages({ children, activeTab }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const images = containerRef.current.querySelectorAll(".animate-pop");

    gsap.fromTo(
      images,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        stagger: 0.1,
        ease: "back.out(1.7)"
      }
    );
  }, [activeTab]);

  return <div ref={containerRef}>{children}</div>;
}
