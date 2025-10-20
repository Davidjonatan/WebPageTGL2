import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import AnimateEntrance from "./animations/AnimateEntrance";
import HowItWorksGalleryModal from "./HowItWorksGalleryModal";

interface Tab {
  text: string;
  subtitle: string;
  images: { src: string; alt?: string }[];
}

interface Tabs {
  [key: string]: Tab;
}

interface Props {
  title: string;
  tabs: Tabs;
  textStyle: string;
}

export default function HowItWorksGallery({ title, tabs, textStyle }: Props) {
  const tabKeys = Object.keys(tabs);
  const [activeTab, setActiveTab] = useState(tabKeys[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = urlParams.get("tab");
    if (initialTab && tabKeys.includes(initialTab)) {
      setActiveTab(initialTab);
    }
  }, []);

  return (
    <section class="bg-gradient-to-b from-[#121843] to-[#121833] py-12 lg:py-16 text-white relative overflow-visible">
      <div class="max-w-7xl mx-auto px-4 xl:px-0 flex flex-col gap-y-6">
        <AnimateEntrance origin="Left" useScrollTrigger={true} triggerClass="text-col" stagger={0.2}>
          <div class="flex flex-col items-center text-center text-col relative z-[20]">
            {title && <h2 class={`${textStyle} text-col`}>{title}</h2>}
            <p class="mt-4 text-base lg:text-lg">{tabs[activeTab].subtitle}</p>

            {/* Botones Desktop */}
            <div class="hidden lg:flex gap-x-3 mt-6">
              {tabKeys.map((key) => (
                <button
                  key={key}
                  type="button"
                  class={`px-4 py-2 rounded-full font-medium transition ${
                    activeTab === key
                      ? "bg-white text-[#1E2A47] shadow-lg"
                      : "bg-transparent border border-white/30 text-white hover:bg-white hover:text-[#1E2A47]"
                  }`}
                  onClick={() => setActiveTab(key)}
                >
                  {tabs[key].text}
                </button>
              ))}
            </div>

            {/* Dropdown Mobile */}
            <div class="lg:hidden mt-6 relative z-[60]">
              <button
                type="button"
                class="flex items-center justify-between w-64 px-4 py-2 bg-white text-[#1E2A47] rounded-full shadow-md"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span>{tabs[activeTab].text}</span>
              </button>
              {dropdownOpen && (
                <div class="absolute mt-2 w-64 bg-white rounded-xl shadow-lg z-[9999] overflow-hidden">
                  {tabKeys.map((key) => (
                    <button
                      key={key}
                      type="button"
                      class="block w-full text-left px-4 py-2 text-[#1E2A47] hover:bg-[#f0f0f0]"
                      onClick={() => {
                        setActiveTab(key);
                        setDropdownOpen(false);
                      }}
                    >
                      {tabs[key].text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </AnimateEntrance>

        {/* 🎨 Galería Fancy */}
        <AnimateEntrance origin="top" useScrollTrigger={true} triggerClass="gallery-col" stagger={0.2}>
          <div class="relative mt-10 gallery-col">
            {/* Contenedor delimitado */}
            <div class="max-h-[850px] overflow-hidden rounded-3xl shadow-2xl p-4 bg-[#101437]/40 backdrop-blur-sm">
              
              {/* Desktop layout (grid irregular) */}
<div class="hidden sm:grid grid-cols-6 auto-rows-[200px] gap-4">
  {tabs[activeTab].images.slice(0, 9).map((img, idx) => (
    <div
      key={idx}
      onClick={() => {
        setModalIndex(idx);
        setModalOpen(true);
      }}
      class={`relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer ${
        idx === 0
          ? "col-span-3 row-span-2"
          : idx === 1
          ? "col-span-3 row-span-1"
          : idx === 2
          ? "col-span-2 row-span-2"
          : idx === 3
          ? "col-span-1 row-span-1"
          : "col-span-2 row-span-1"
      }`}
    >
      <img
        src={img.src}
        alt={img.alt ?? "Galería"}
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-10 w-10 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
          />
        </svg>
      </div>
    </div>
  ))}
</div>


    {/* Mobile layout (3 + stack con imágenes reales) */}
<div class="sm:hidden flex justify-center gap-4 relative mt-4">
  {tabs[activeTab].images.slice(0, 2).map((img, idx) => (
    <div
      key={idx}
      class="relative w-28 h-28 overflow-hidden rounded-xl shadow-lg"
      onClick={() => {
        setModalIndex(idx);
        setModalOpen(true);
      }}
    >
      <img
        src={img.src}
        alt={img.alt ?? "Galería"}
        class="w-full h-full object-cover"
      />
    </div>
  ))}

  {/* Última imagen: fajo real con las imágenes sobrantes */}
  {tabs[activeTab].images[2] && (
    <div
      class="relative w-28 h-28 rounded-xl shadow-xl cursor-pointer group"
      onClick={() => {
        setModalIndex(2);
        setModalOpen(true);
      }}
    >
      {/* Imagen principal */}
      <img
        src={tabs[activeTab].images[2].src}
        alt={tabs[activeTab].images[2].alt}
        class="w-full h-full object-cover rounded-xl"
      />

      {/* Imágenes sobrantes reales, apiladas */}
{tabs[activeTab].images.slice(3, 6).map((extraImg, i) => (
  <img
    key={i}
    src={extraImg.src}
    alt={extraImg.alt}
    class={`absolute inset-0 w-full h-full object-cover rounded-xl border border-white/20 transition-transform duration-300
      ${i === 0 ? 'scale-[0.96] -translate-y-1.5 -translate-x-1.5 group-hover:-translate-y-3 group-hover:-translate-x-3 group-hover:rotate-1' : ''}
      ${i === 1 ? 'scale-[0.94] -translate-y-3 -translate-x-3 group-hover:-translate-y-4 group-hover:-translate-x-4 group-hover:rotate-2' : ''}
      ${i === 2 ? 'scale-[0.92] -translate-y-4 -translate-x-4 group-hover:-translate-y-6 group-hover:-translate-x-6 group-hover:rotate-3' : ''}
    `}
    style={{ zIndex: -i }}
  />
))}
      {/* Texto que indica cuántas más hay */}
      {tabs[activeTab].images.length > 6 && (
        <div class="absolute inset-0 flex items-center justify-center text-white font-semibold text-sm opacity-90 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100">
          +{tabs[activeTab].images.length - 6}
        </div>
      )}
    </div>
  )}
</div>
            </div>
          </div>
        </AnimateEntrance>
      </div>

      {modalOpen && (
        <HowItWorksGalleryModal
          images={tabs[activeTab].images}
          initialIndex={modalIndex}
          onClose={() => setModalOpen(false)}
        />
      )}
    </section>
  );
}
