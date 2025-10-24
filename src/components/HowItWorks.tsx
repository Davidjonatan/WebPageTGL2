import { h } from "preact";
import { useState, useEffect, useRef } from "preact/hooks";
import AnimateEntrance from "./animations/AnimateEntrance";
import HowItWorksGalleryModal from "./HowItWorksGalleryModal";
import AnimateImages from "./animations/AnimateImages";

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

  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = urlParams.get("tab");
    if (initialTab && tabKeys.includes(initialTab)) {
      setActiveTab(initialTab);
    }
  }, []);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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

            {/* Dropdown Mobile - MEJORADO */}
            <div class="lg:hidden mt-6 relative z-[60]" ref={dropdownRef}>
              <button
                type="button"
                class="flex items-center justify-between w-64 px-4 py-3 bg-white text-[#1E2A47] rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span class="font-medium">{tabs[activeTab].text}</span>
                <svg 
                  class={`w-5 h-5 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Menú desplegable con animación */}
              <div class={`
                absolute mt-2 w-64 bg-white rounded-xl shadow-2xl z-[9999] overflow-hidden
                transition-all duration-300 transform origin-top
                ${dropdownOpen 
                  ? 'opacity-100 scale-100 translate-y-0' 
                  : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }
              `}>
                <div class="max-h-60 overflow-y-auto">
                  {tabKeys.map((key) => (
                    <button
                      key={key}
                      type="button"
                      class={`block w-full text-left px-4 py-3 transition-all duration-200 border-b border-gray-100 last:border-b-0
                        ${activeTab === key
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-[#1E2A47] hover:bg-gray-50'
                        }`}
                      onClick={() => {
                        setActiveTab(key);
                        setDropdownOpen(false);
                      }}
                    >
                      <div class="flex items-center justify-between">
                        <span>{tabs[key].text}</span>
                        {activeTab === key && (
                          <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimateEntrance>

        {/* 🎨 Galería Fancy con animación pop */}
        <AnimateEntrance origin="top" useScrollTrigger={true} triggerClass="gallery-col" stagger={0.2}>
          <AnimateImages activeTab={activeTab}>
            <div class="relative mt-10 gallery-col">
              <div class="max-h-[850px] overflow-hidden rounded-3xl shadow-2xl p-4 bg-[#101437]/40 backdrop-blur-sm">
                {/* Desktop grid */}
                <div class="hidden sm:grid grid-cols-6 auto-rows-[200px] gap-4">
                  {tabs[activeTab].images.slice(0, 9).map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setModalIndex(idx);
                        setModalOpen(true);
                      }}
                      class={`relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer animate-pop ${
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
                    </div>
                  ))}
                </div>
{/* Mobile layout - Maso de cartas con profundidad mejorada */}
<div class="sm:hidden flex justify-start items-center gap-3 relative mt-4 h-52 pl-6">
  {/* Primera imagen - fondo, más alejada */}
  {tabs[activeTab].images[0] && (
    <div
      class="absolute left-8 w-32 h-44 overflow-hidden rounded-xl shadow-2xl cursor-pointer z-10 transform -rotate-6 transition-all duration-300 hover:scale-105 hover:z-40"
      onClick={() => {
        setModalIndex(0);
        setModalOpen(true);
      }}
    >
      <img
        src={tabs[activeTab].images[0].src}
        alt={tabs[activeTab].images[0].alt ?? "Galería"}
        class="w-full h-full object-cover"
      />
      {/* Sombra interna para profundidad */}
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>
  )}

  {/* Segunda imagen - medio, con elevación */}
  {tabs[activeTab].images[1] && (
    <div
      class="absolute left-20 w-36 h-48 overflow-hidden rounded-xl shadow-2xl cursor-pointer z-20 transform -rotate-2 transition-all duration-300 hover:scale-110 hover:z-50"
      onClick={() => {
        setModalIndex(1);
        setModalOpen(true);
      }}
    >
      <img
        src={tabs[activeTab].images[1].src}
        alt={tabs[activeTab].images[1].alt ?? "Galería"}
        class="w-full h-full object-cover"
      />
      {/* Sombra interna más pronunciada */}
      <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
    </div>
  )}

  {/* Fajo de imágenes - frente, con máximo relieve */}
  {tabs[activeTab].images.length > 2 && (
    <div
      class="absolute left-32 w-40 h-52 bg-gradient-to-br from-blue-800 via-purple-800 to-indigo-900 rounded-xl shadow-2xl cursor-pointer z-30 transform rotate-4 transition-all duration-300 hover:scale-110 hover:z-50 hover:shadow-3xl"
      onClick={() => {
        setModalIndex(2);
        setModalOpen(true);
      }}
    >
      {/* Efecto de cartas apiladas */}
      <div class="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg z-40">
        <span class="text-xs font-bold text-black">{tabs[activeTab].images.length - 2}</span>
      </div>
      
      {/* Borde sutil para efecto 3D */}
      <div class="absolute inset-0 rounded-xl border-2 border-white/10"></div>
      
      {/* Contenido del fajo */}
      <div class="relative z-10 text-white text-center p-4 h-full flex flex-col items-center justify-center">
        <div class="text-4xl font-bold mb-2 drop-shadow-lg">+</div>
        <div class="text-lg font-semibold mb-1 drop-shadow-md">Ver galería</div>
        <div class="text-xs opacity-90 drop-shadow">({tabs[activeTab].images.length} imágenes)</div>
      </div>

      {/* Efecto de brillo */}
      <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent"></div>
    </div>
  )}

  {/* Mensaje si no hay imágenes */}
  {tabs[activeTab].images.length === 0 && (
    <div class="text-white/70 text-center">
      No hay imágenes disponibles
    </div>
  )}
</div>
              </div>
            </div>
          </AnimateImages>
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