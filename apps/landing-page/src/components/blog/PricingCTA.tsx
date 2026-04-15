import React from 'react';

interface PricingCTAProps {
  variant: 'sidebar' | 'footer';
}

const PricingCTA: React.FC<PricingCTAProps> = ({ variant }) => {
  const isSidebar = variant === 'sidebar';

  return (
    <div
      className={`relative overflow-hidden transition-all duration-300 ${
        isSidebar
          ? 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md'
          : 'my-16 rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm md:p-16'
      }`}
    >
      {/* Visual Accent - Consistent across both now */}
      <div className="absolute top-0 left-0 h-1.5 w-full bg-indigo-600" />

      {/* Title */}
      <h3
        className={`font-black tracking-tight text-slate-900 ${
          isSidebar
            ? 'mb-4 text-base leading-tight'
            : 'mb-4 text-3xl md:text-5xl'
        }`}
      >
        {isSidebar
          ? 'Create your affiliate program'
          : 'Launch your affiliate program today'}
      </h3>

      {/* Description - Now shown in footer with slate text */}
      {!isSidebar && (
        <p className="mx-auto mb-8 max-w-2xl text-lg font-medium text-slate-500">
          Create an affiliate program for your SaaS or digital product in
          minutes.
        </p>
      )}

      {/* Button Stack */}
      <div
        className={`flex flex-col ${isSidebar ? 'w-full' : 'mx-auto w-full max-w-sm items-stretch'}`}
      >
        {/* Label for the Lifetime Deal */}
        <span
          className={`mb-1.5 font-black tracking-widest text-indigo-600 uppercase ${isSidebar ? 'ml-1 text-[9px]' : 'text-[11px]'}`}
        >
          Limited Time Offer
        </span>

        <a
          href="/pricing"
          className={`inline-block rounded-md bg-slate-900 text-center font-bold text-white transition-all hover:bg-slate-800 active:scale-95 ${
            isSidebar ? 'py-3 text-xs' : 'py-4 text-base'
          }`}
        >
          Buy Lifetime Deal
        </a>

        {/* Divider */}
        <div className="my-2 text-center text-[10px] font-bold text-slate-300 uppercase">
          or
        </div>

        <a
          href="/pricing"
          className={`inline-block rounded-md bg-indigo-50 text-center font-bold text-indigo-600 transition-all hover:bg-indigo-100 active:scale-95 ${
            isSidebar ? 'py-3 text-xs' : 'py-4 text-base'
          }`}
        >
          Start for Free
        </a>

        {/* Trust text for Footer only */}
        {!isSidebar && (
          <p className="mt-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            14-day free trial. No credit card required.
          </p>
        )}
      </div>
    </div>
  );
};

export default PricingCTA;
