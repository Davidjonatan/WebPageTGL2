import { useEffect, useRef } from "preact/hooks";
import gsap from "gsap";
import PhoneIcon from "./PhoneIcon";
import FacebookIcon from "./FacebookIcon";

interface SocialIconProps {
  type: "phone" | "facebook";
  animation?: "float" | "pulse" | "none";
  delay?: number;
}

export default function SocialIcon({ type, animation = "float", delay = 0 }: SocialIconProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;

    if (animation === "float") {
      gsap.to(el, {
        y: -6,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "easeInOut",
        delay,
      });
    }

    if (animation === "pulse") {
      gsap.to(el, {
        scale: 1.15,
        duration: 1.5,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut",
        delay,
      });
    }
  }, [animation, delay]);

  return (
    <div ref={ref}>
      {type === "phone" && <PhoneIcon size={32} />}
      {type === "facebook" && <FacebookIcon size={40} />}
    </div>
  );
}
