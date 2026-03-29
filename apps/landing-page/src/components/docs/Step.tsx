/** @jsxImportSource react */
import React from 'react';

interface StepProps {
  title: string;
  number: string | number;
  children: React.ReactNode;
}

export default function Step({ title, number, children }: StepProps) {
  return (
    <div className="group mb-8 flex gap-4">
      {/* Visual Indicator Column */}
      <div className="flex flex-col items-center">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50 text-sm font-bold text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
          {number}
        </div>
        {/* Connecting Line */}
        <div className="mt-2 h-full min-h-5 w-px bg-slate-100" />
      </div>

      {/* Content Column */}
      <div className="flex-1 pt-1 pb-4">
        <h3 className="mb-2 text-lg font-bold tracking-tight text-slate-900">
          {title}
        </h3>
        <div className="prose-pre:mt-2 leading-relaxed text-slate-600">
          {children}
        </div>
      </div>
    </div>
  );
}
