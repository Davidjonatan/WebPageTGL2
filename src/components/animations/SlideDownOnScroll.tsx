/** SlideDownOnScroll.tsx */
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

interface Props {
  children: preact.ComponentChildren;
}

export default function SlideDownOnScroll({ children }: Props) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setInView(true);
        });
      },
      { threshold: 0.1 }
    );

    const el = document.getElementById('slide-down-container');
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      id="slide-down-container"
      class={`transition-transform duration-1000 ease-out ${
        inView ? 'translate-y-0 opacity-90' : '-translate-y-20 opacity-30'
      }`}
    >
      {children}
    </div>
  );
}
