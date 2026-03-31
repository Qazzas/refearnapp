/** @jsxImportSource react */
import React from 'react';

export const EnvItem = ({
  id,
  name,
  description,
  example,
  link,
  children,
}: any) => (
  <div
    id={id}
    className="scroll-mt-24 p-5 transition-colors hover:bg-slate-50/50 md:p-6"
  >
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <code className="text-xs font-bold text-indigo-600 md:text-sm">
          {name}
        </code>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold text-indigo-500 underline hover:text-indigo-700 md:text-xs"
          >
            Get Key Here ↗
          </a>
        )}
      </div>

      <p className="text-xs leading-relaxed font-medium text-slate-700 md:text-sm">
        {description}
      </p>

      {/* This is where the Frame/Image will render if passed */}
      {children}

      {example && (
        <p className="mt-2 text-[10px] text-slate-400 italic md:text-xs">
          Example: <span className="font-mono text-slate-500">{example}</span>
        </p>
      )}
    </div>
  </div>
);

export const EnvGroup = ({ title, icon, children }: any) => (
  <section className="w-full min-w-0">
    <h2 className="mb-4 flex items-center gap-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase md:text-xs">
      <span>{icon}</span> {title}
    </h2>
    {/* The container for all items */}
    <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {children}
    </div>
  </section>
);
