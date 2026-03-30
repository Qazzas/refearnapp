/** @jsxImportSource react */
import React from 'react';

export const EnvItem = ({
  id,
  name,
  description,
  example,
  codeSnippet,
}: any) => (
  <div
    id={id}
    className="scroll-mt-24 p-5 transition-colors hover:bg-slate-50/50 md:p-6"
  >
    {/* Variable Name Container */}
    <div className="no-scrollbar w-full min-w-0 overflow-x-auto">
      <code className="inline-block text-xs font-bold whitespace-nowrap text-indigo-600 md:text-sm">
        {name}
      </code>
    </div>

    <p className="mt-2 text-xs leading-relaxed font-medium text-slate-700 md:text-sm">
      {description}
    </p>

    {example && (
      <div className="no-scrollbar mt-2 w-full min-w-0 overflow-x-auto">
        <p className="text-[10px] whitespace-nowrap text-slate-400 italic md:text-xs">
          Example: <span className="font-mono text-slate-500">{example}</span>
        </p>
      </div>
    )}

    {codeSnippet && (
      <div className="mt-3 w-full overflow-x-auto rounded-lg border border-slate-100 bg-slate-50 p-3">
        <pre className="font-mono text-[10px] whitespace-pre text-slate-600">
          {codeSnippet}
        </pre>
      </div>
    )}
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
