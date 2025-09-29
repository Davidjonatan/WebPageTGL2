import { useEffect, useRef } from "preact/hooks";

interface Props {
  children: any;
}

export default function AnimateOnScroll({ children }: Props) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    import("gsap").then((gsapModule) => {
      import("gsap/ScrollTrigger").then((ScrollTriggerModule) => {
        const gsap = gsapModule.default;
        const ScrollTrigger = ScrollTriggerModule.ScrollTrigger;

        gsap.registerPlugin(ScrollTrigger);

        gsap.fromTo(
          elementRef.current!,
          { opacity: 0, x: 50 },
          {
            opacity: 1,
            x: 0,
            duration: 1.0,        // más lenta
            ease: "power2.out",
            scrollTrigger: {
              trigger: elementRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    });
  }, []);

  return <div ref={elementRef}>{children}</div>;
}
