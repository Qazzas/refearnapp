/** @jsxImportSource react */
import React from 'react';

interface EnvItemProps {
  id: string;
  name: string;
  description: string;
  example?: string;
  codeSnippet?: string;
}

export const EnvItem = ({
  id,
  name,
  description,
  example,
  codeSnippet,
}: EnvItemProps) => (
  <div
    id={id}
    className="scroll-mt-24 p-6 transition-colors hover:bg-slate-50/50"
  >
    <code className="text-sm font-bold text-indigo-600">{name}</code>
    <p className="mt-2 text-sm font-medium text-slate-700">{description}</p>
    {example && (
      <p className="mt-1 text-xs text-slate-400 italic">Example: {example}</p>
    )}
    {codeSnippet && (
      <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50 p-3 font-mono text-[10px] break-all text-slate-600">
        {codeSnippet}
      </div>
    )}
  </div>
);

export const EnvGroup = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) => (
  <section>
    <h2 className="mb-6 flex items-center gap-2 text-sm font-bold tracking-widest text-slate-400 uppercase">
      <span>{icon}</span> {title}
    </h2>
    <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {children}
    </div>
  </section>
);
