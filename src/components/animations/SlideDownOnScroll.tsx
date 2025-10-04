import { h } from 'preact';
import { useEffect, useState, useRef } from 'preact/hooks';

interface Props {
  children: preact.ComponentChildren;
}

export default function SlideDownOnScroll({ children }: Props) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setInView(true);
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      class={`transition-transform duration-1000 ease-out ${
        inView ? 'translate-y-0 opacity-90' : '-translate-y-20 opacity-30'
      }`}
    >
      {children}
    </div>
  );
}
