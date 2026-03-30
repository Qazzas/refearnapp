/** @jsxImportSource react */
import React, { useEffect, useState } from 'react';
import {
  Book,
  Globe,
  Settings,
  ShieldCheck,
  Zap,
  Database,
  X,
} from 'lucide-react';

export default function Sidebar() {
  const [activeId, setActiveId] = useState('getting-started');
  const [isOpen, setIsOpen] = useState(false);

  const groups = [
    {
      label: 'Setup',
      items: [
        { title: 'Getting Started', href: '#getting-started', icon: Book },
        { title: 'Cloudflare Setup', href: '#cloudflare', icon: Globe },
      ],
    },
    {
      label: 'Configuration',
      items: [
        { title: 'VPS & Dashboard', href: '#vps-setup', icon: ShieldCheck },
        { title: 'Self-Hosting', href: '#self-hosting', icon: ShieldCheck },
        { title: 'Worker Deployment', href: '#tracker-setup', icon: Zap },
        { title: 'Database & Sync', href: '#database-setup', icon: Database },
        { title: 'Env Variables', href: '#env-variables', icon: Settings },
      ],
    },
  ];

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-docs-menu', handleOpen);

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
          window.history.replaceState(null, '', `#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );
    document
      .querySelectorAll('section[id]')
      .forEach((s) => observer.observe(s));

    return () => {
      window.removeEventListener('open-docs-menu', handleOpen);
      observer.disconnect();
    };
  }, []);

  const NavLinks = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          <h3 className="px-4 py-2 text-[10px] font-black tracking-widest text-slate-400/80 uppercase">
            {group.label}
          </h3>
          <nav className="flex flex-col gap-1">
            {group.items.map((item) => {
              const isActive = activeId === item.href.replace('#', '');
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={onLinkClick}
                  className={`group flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                  }`}
                >
                  <item.icon
                    size={16}
                    className={
                      isActive
                        ? 'text-indigo-600'
                        : 'text-slate-400 group-hover:text-indigo-600'
                    }
                  />
                  {item.title}
                </a>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-full flex-col lg:flex">
        <NavLinks />
      </aside>

      {/* Mobile Drawer Container */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-300 lg:hidden ${
          isOpen ? 'visible' : 'pointer-events-none invisible'
        }`}
      >
        {/* Backdrop - Fades in/out */}
        <div
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Menu Panel - Slides in/out */}
        <div
          className={`absolute top-0 left-0 flex h-full w-[280px] flex-col bg-white p-6 shadow-2xl transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-4">
            <span className="font-bold text-indigo-600">Refearn Docs</span>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>
          <div className="no-scrollbar flex-1 overflow-y-auto">
            <NavLinks onLinkClick={() => setIsOpen(false)} />
          </div>
        </div>
      </div>
    </>
  );
}
