/** HowItWorksGallery.tsx */
import { h } from "preact";
import { useState } from "preact/hooks";
import AnimateFromLeft from "./animations/AnimateFromLeft";
import AnimateOnScroll from "./animations/AnimateOnScroll";

interface Tab {
  text: string; // nombre del botón
  subtitle: string; // subtítulo dinámico
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
  const [modalImage, setModalImage] = useState("");

  return (
    <section class="bg-[#1E2A47] py-12 lg:py-16 text-white">
      <div class="max-w-7xl mx-auto px-4 xl:px-0 flex flex-col gap-y-6">
        <AnimateFromLeft>
          {/* Header */}
          <div class="flex flex-col items-center text-center">
            <h2 class="text-3xl lg:text-5xl font-semibold">{title}</h2>
            <p class="mt-4 text-base lg:text-lg">{tabs[activeTab].subtitle}</p>

            {/* Botones desktop */}
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

            {/* Dropdown mobile */}
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
        </AnimateFromLeft>

        {/* Galería */}
        <AnimateOnScroll>
          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
            {tabs[activeTab].images.map((img, idx) => (
              <div
                key={idx}
                class="relative w-full h-48 sm:h-56 lg:h-64 rounded-xl overflow-hidden shadow-lg group cursor-pointer"
                onClick={() => {
                  setModalImage(img.src);
                  setModalOpen(true);
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt ?? "Galería"}
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay */}
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-12 w-12 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div class="relative max-w-4xl w-full mx-4">
            <button
              onClick={() => setModalOpen(false)}
              class="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-200 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={modalImage}
              alt="Vista completa"
              class="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </section>
  );
}
