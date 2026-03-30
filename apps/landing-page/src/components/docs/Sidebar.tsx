/** @jsxImportSource react */
import React, { useEffect, useState } from 'react';
import {
  Book,
  Globe,
  Settings,
  ShieldCheck,
  Zap,
  Database,
} from 'lucide-react';

export default function Sidebar() {
  const [activeId, setActiveId] = useState('getting-started');

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
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Detects when section is in top-middle of screen
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
          // Optional: Update URL without jumping
          window.history.replaceState(null, '', `#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <aside className="flex w-full flex-col gap-6">
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
    </aside>
  );
}
