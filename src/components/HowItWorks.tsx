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
}

export default function HowItWorksGallery({ title, tabs }: Props) {
  const tabKeys = Object.keys(tabs);
  const [activeTab, setActiveTab] = useState(tabKeys[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  // Inicializamos tab desde query string
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = urlParams.get("tab");
    if (initialTab && tabKeys.includes(initialTab)) {
      setActiveTab(initialTab);
    }
  }, []);

  return (
    <section class="bg-[#1E2A47] py-12 lg:py-16 text-white">
      <div class="max-w-7xl mx-auto px-4 xl:px-0 flex flex-col gap-y-6">
   <AnimateEntrance origin={"Left"} useScrollTrigger={false} triggerClass="text-col" stagger={0.2}>
          <div class="flex flex-col items-center text-center text-col">
            <h2 class="text-3xl lg:text-5xl font-semibold">{title}</h2>
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
            <div class="lg:hidden mt-6 relative">
              <button
                type="button"
                class="flex items-center justify-between w-64 px-4 py-2 bg-white text-[#1E2A47] rounded-full shadow-md"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span>{tabs[activeTab].text}</span>
              </button>
              {dropdownOpen && (
                <div class="absolute mt-2 w-64 bg-white rounded-xl shadow-lg z-50">
                  {tabKeys.map((key) => (
                    <button
                      key={key}
                      type="button"
                      class="block w-full text-left px-4 py-2 text-[#1E2A47] hover:bg-[#f0f0f0] rounded-t-xl last:rounded-b-xl"
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

        {/* Galería */}
           <AnimateEntrance origin={"top"} useScrollTrigger={true} triggerClass="gallery-col" stagger={0.2}>

          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8 gallery-col">
            {tabs[activeTab].images.map((img, idx) => (
              <div
                key={idx}
                class="relative w-full h-48 sm:h-56 lg:h-64 rounded-xl overflow-hidden shadow-lg group cursor-pointer"
                onClick={() => {
                  setModalIndex(idx);
                  setModalOpen(true);
                }}
              >
                {/* Imagen */}
                <img
                  src={img.src}
                  alt={img.alt ?? "Galería"}
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay con animación hover */}
                <div class="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex items-center justify-center">
                  {/* Icono lupa */}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
                  </svg>
                </div>
              </div>
            ))}
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
