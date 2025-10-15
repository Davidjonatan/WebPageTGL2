import { h } from "preact";

interface FacebookIconProps {
  color?: string;
  bgColor?: string;
  size?: number;
  hoverScale?: number;
}

export default function FacebookIcon({
  color = "#1C274C",
  bgColor = "#0474AC",
  size = 40,
  hoverScale = 1.2,
}: FacebookIconProps) {
  return (
    <svg
      class="transition-all duration-300 cursor-pointer"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      style={{
        transformOrigin: "center",
        transition: "transform 0.3s ease, fill 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `scale(${hoverScale})`;
        e.currentTarget.style.fill = "#ffffffcc"; // efecto fantasmal
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.fill = color;
      }}
    >
      <path fill={bgColor} d="M6,2h20c2.2,0,4,1.8,4,4v20c0,2.2-1.8,4-4,4H6c-2.2,0-4-1.8-4-4V6C2,3.8,3.8,2,6,2z" />
      <path
        fill="white"
        d="M13.2,16.1v9.7c0,0.1,0.1,0.3,0.3,0.3h3.9c0.2,0,0.3-0.1,0.3-0.3v-9.8h2.8c0.1,0,0.3-0.1,0.3-0.2l0.3-3
        c0-0.2-0.1-0.3-0.3-0.3h-3.1v-2.1c0-0.5,0.4-0.9,1-0.9h2.2c0.2,0,0.3-0.1,0.3-0.3V6.3C21,6.1,20.9,6,20.7,6h-3.6
        c-2.1,0-3.9,1.6-3.9,3.6v2.9h-1.9c-0.2,0-0.3,0.1-0.3,0.3v3c0,0.1,0.1,0.3,0.3,0.3h1.9V16.1z"
      />
    </svg>
  );
}
