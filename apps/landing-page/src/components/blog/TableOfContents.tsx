import React, { useState, useEffect } from 'react';
import { List, X, ChevronRight } from 'lucide-react';
import PricingCTA from './PricingCTA';

interface Heading {
  slug: string;
  text: string;
}

interface ToCProps {
  sections: Heading[];
}

const TableOfContents: React.FC<ToCProps> = ({ sections }) => {
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observerOptions = {
      rootMargin: '0px 0px -70% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, observerOptions);

    document
      .querySelectorAll('h2[id]')
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden w-64 shrink-0 lg:block">
        {/* IMPORTANT: Everything you want to stay on screen as you scroll
          MUST be inside this sticky div.
        */}
        <div className="sticky top-32 flex h-[calc(100vh-10rem)] flex-col">
          {/* 1. TOP CTA: Now inside the sticky flow with a bottom margin */}
          <div className="mb-6 shrink-0">
            <PricingCTA variant="sidebar" />
          </div>

          {/* 2. TABLE OF CONTENTS: Added flex-1 and min-h-0 to force internal scroll */}
          <div className="flex min-h-0 flex-1 flex-col rounded-[0.5rem] border border-slate-200 p-6">
            <p className="mb-6 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              On this page
            </p>

            {/* overflow-y-auto only works if a parent has a defined height or flex-1 */}
            <nav className="custom-scrollbar overflow-y-auto pr-2">
              <ul className="space-y-2">
                {sections.map((s) => {
                  const isActive = activeId === s.slug;
                  return (
                    <li key={s.slug}>
                      <a
                        href={`#${s.slug}`}
                        onClick={(e) => handleClick(e, s.slug)}
                        className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                          isActive
                            ? 'text-indigo-600'
                            : 'text-slate-500 hover:text-indigo-600'
                        }`}
                      >
                        <span className={isActive ? 'font-bold' : ''}>
                          {s.text}
                        </span>
                        {isActive && (
                          <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.6)]" />
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </aside>

      {/* --- MOBILE FLOATING MENU --- */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-2xl transition-transform active:scale-90"
        >
          {isOpen ? <X size={24} /> : <List size={24} />}
        </button>

        {isOpen && (
          <div
            className="fixed inset-0 z-90 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="animate-in fade-in zoom-in absolute right-6 bottom-24 w-[calc(100vw-3rem)] max-w-[320px] rounded-lg bg-white p-6 shadow-2xl ring-1 ring-slate-200 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="mb-4 border-b border-slate-100 pb-3 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Table of Contents
              </p>

              <div className="custom-scrollbar max-h-[60vh] space-y-1 overflow-y-auto pr-2">
                {sections.map((s) => (
                  <a
                    key={s.slug}
                    href={`#${s.slug}`}
                    onClick={(e) => handleClick(e, s.slug)}
                    className={`flex items-center justify-between rounded-md px-4 py-3 text-sm font-bold transition-all ${
                      activeId === s.slug
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-slate-600 active:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{s.text}</span>
                    {activeId === s.slug && (
                      <ChevronRight size={16} className="shrink-0" />
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TableOfContents;
