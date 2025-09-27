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

        const items = container.querySelectorAll("li");
        if (!items || items.length === 0) return;

        gsap.fromTo(
          items,
          { opacity: 0, x: 50 },
          {
            opacity: 1,
            x: 0,
            duration: 1.2,
            stagger: 0.3,
            ease: "power2.out",
            scrollTrigger: {
              trigger: container,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    });
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
