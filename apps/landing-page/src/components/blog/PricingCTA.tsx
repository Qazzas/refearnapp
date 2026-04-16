import React from 'react';
import {
  CURRENT_BILLING_MODE,
  PRICING_TEXT,
  CURRENT_CONFIG_MODE,
  PRICING_CONFIG,
} from '../../lib/pricing';

interface PricingCTAProps {
  variant: 'sidebar' | 'footer';
}

const PricingCTA: React.FC<PricingCTAProps> = ({ variant }) => {
  const isSidebar = variant === 'sidebar';
  const pricingContent = PRICING_TEXT[CURRENT_BILLING_MODE];
  const isHybridMode = CURRENT_CONFIG_MODE === PRICING_CONFIG.HYBRID;

  return (
    <div
      className={`relative overflow-hidden transition-all duration-300 ${
        isSidebar
          ? 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md'
          : 'my-16 rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm md:p-16'
      }`}
    >
      <div className="absolute top-0 left-0 h-1.5 w-full bg-indigo-600" />

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

      {!isSidebar && (
        <p className="mx-auto mb-8 max-w-2xl text-lg font-medium text-slate-500">
          Create an affiliate program for your SaaS or digital product in
          minutes.
        </p>
      )}

      <div
        className={`flex flex-col ${isSidebar ? 'w-full' : 'mx-auto w-full max-w-sm items-stretch'}`}
      >
        {/* Badge */}
        {pricingContent.badge && (
          <span
            className={`mb-1.5 font-black tracking-widest text-indigo-600 uppercase ${isSidebar ? 'ml-1 text-[9px]' : 'text-[11px]'}`}
          >
            {pricingContent.badge}
          </span>
        )}

        {/* Primary Action Button */}
        <a
          href="/#pricing"
          className={`inline-block rounded-md bg-slate-900 text-center font-bold text-white transition-all hover:bg-slate-800 active:scale-95 ${
            isSidebar ? 'py-3 text-xs' : 'py-4 text-base'
          }`}
        >
          {pricingContent.button}
        </a>
        {/* Hybrid Logic */}
        {isHybridMode && (
          <>
            <div className="my-3 text-center text-[10px] font-bold text-slate-300 uppercase">
              or
            </div>

            <a
              href="/signup"
              className={`inline-block rounded-md bg-indigo-50 text-center font-bold text-indigo-600 transition-all hover:bg-indigo-100 active:scale-95 ${
                isSidebar ? 'py-3 text-xs' : 'py-4 text-base'
              }`}
            >
              Start for Free
            </a>

            {/* Specific trust text for the free option in hybrid mode */}
            <p className="mt-2 text-center text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              No credit card required
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PricingCTA;
