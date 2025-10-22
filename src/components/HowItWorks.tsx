import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
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

                {/* Mobile layout */}
                <div class="sm:hidden flex justify-center gap-4 relative mt-4">
                  {tabs[activeTab].images.slice(0, 2).map((img, idx) => (
                    <div
                      key={idx}
                      class="relative w-28 h-28 overflow-hidden rounded-xl shadow-lg animate-pop"
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

                  {tabs[activeTab].images[2] && (
                    <div
                      class="relative w-28 h-28 rounded-xl shadow-xl cursor-pointer group animate-pop"
                      onClick={() => {
                        setModalIndex(2);
                        setModalOpen(true);
                      }}
                    >
                      <img
                        src={tabs[activeTab].images[2].src}
                        alt={tabs[activeTab].images[2].alt}
                        class="w-full h-full object-cover rounded-xl"
                      />
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
