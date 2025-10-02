/** HowItWorks.tsx */
import { h } from 'preact';
import { useState } from 'preact/hooks';
import AnimateFromLeft from './animations/AnimateFromLeft';
import AnimateOnScroll from './animations/AnimateOnScroll';

interface Tab {
  text: string;
  image: string;
}

interface Tabs {
  [key: string]: Tab;
}

interface Props {
  title: string;
  subtitle: string;
  tabs: Tabs;
}

export default function HowItWorks({ title, subtitle, tabs }: Props) {
  const tabKeys = Object.keys(tabs);
  const [activeTab, setActiveTab] = useState(tabKeys[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <section class="bg-[#1E2A47] pt-12 lg:pt-16 pb-12 lg:pb-16 text-white">
      <div class="max-w-7xl mx-auto px-4 xl:px-0 flex flex-col gap-y-6">
        <AnimateFromLeft>
        
        <div class="flex flex-col items-center text-center">
          <h2 class="text-3xl lg:text-5xl font-semibold">{title}</h2>
          <p class="mt-4 text-base lg:text-lg">{subtitle}</p>

          {/* Botones desktop */}
          <div class="hidden lg:flex gap-x-3 mt-6">
            {tabKeys.map((key) => (
              <button
                key={key}
                type="button"
                class={`px-4 py-2 rounded-full font-medium transition ${
                  activeTab === key
                    ? 'bg-white text-[#1E2A47] shadow-lg'
                    : 'bg-transparent border border-white/30 text-white hover:bg-white hover:text-[#1E2A47]'
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

        <AnimateOnScroll>
        {/* Imagen */}
        <figure class="relative mt-8 h-56 sm:h-72 md:h-80 lg:h-[24rem] xl:h-[32rem] rounded-2xl overflow-hidden shadow-lg">
          <img
            class="w-full h-full object-cover rounded-2xl transition-all duration-300"
            src={tabs[activeTab].image}
            alt={tabs[activeTab].text}
          />
        </figure>
      </AnimateOnScroll>
      </div>
    </section>
  );
}
