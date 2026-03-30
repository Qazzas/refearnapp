/** @jsxImportSource react */
import { ShieldCheck, ArrowRight, ChevronDown } from 'lucide-react';

export default function VPSConfig() {
  return (
    <section id="vps-setup" className="mb-24 scroll-mt-20 px-4 md:px-0">
      <div className="mb-4 flex items-center gap-2 font-bold tracking-tighter text-indigo-600 uppercase">
        <ShieldCheck size={18} />
        <span className="text-xs md:text-sm">Server Configuration</span>
      </div>
      <h2 className="mb-6 text-2xl leading-tight font-bold text-slate-900 md:text-3xl">
        Linking your VPS to Cloudflare
      </h2>

      <div className="space-y-8">
        {/* Step 1: DNS Record */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900 md:text-lg">
            1. Create your Origin DNS Record
          </h3>
          <p className="mb-6 text-sm leading-relaxed text-slate-600 md:text-base">
            Point a subdomain to your VPS IP. Use{' '}
            <code className="rounded bg-slate-100 px-1 text-indigo-600">
              origin
            </code>{' '}
            or any name (e.g., <em>app</em>).
          </p>

          {/* Simulated DNS Dashboard - Responsive Fix */}
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 font-mono shadow-lg">
            <div className="border-b border-slate-800 bg-slate-800/50 px-4 py-2 text-[9px] font-bold tracking-widest text-slate-500 uppercase md:text-xs">
              Cloudflare DNS Dashboard
            </div>
            <div className="p-4 md:p-5">
              {/* Header row - smaller text on mobile */}
              <div className="mb-2 grid grid-cols-3 gap-2 border-b border-slate-700 pb-2 text-[8px] font-black text-slate-500 uppercase md:text-[10px]">
                <span>Type</span>
                <span>Name</span>
                <span>IPv4 Content</span>
              </div>
              {/* Values row - smaller text and break-all for IP/Names */}
              <div className="grid grid-cols-3 items-center gap-2 py-1 text-[10px] md:text-sm">
                <span className="font-bold text-indigo-400">A</span>
                <span className="leading-tight break-all text-emerald-400">
                  origin{' '}
                  <span className="block text-[8px] font-normal text-slate-500 opacity-70 md:inline">
                    (any name)
                  </span>
                </span>
                <span className="leading-tight break-all text-amber-400">
                  YOUR_VPS_IP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Redirection URL */}
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-5 md:p-6">
          <h3 className="mb-2 text-base font-bold text-indigo-900 md:text-lg">
            2. Match the Redirection URL
          </h3>
          <p className="mb-6 text-sm leading-relaxed text-indigo-900/80 md:text-base">
            Link your Cloudflare subdomain to your <strong>Coolify VPS</strong>{' '}
            via Environment Variables.
          </p>

          <div className="flex flex-col items-stretch gap-4 rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm md:flex-row md:items-center md:p-5">
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
                Env Variable
              </p>
              <code className="block text-[10px] font-bold break-all text-indigo-600 md:inline-block md:text-sm">
                NEXT_PUBLIC_REDIRECTION_URL
              </code>
            </div>

            {/* Mobile-only Arrow Replacement */}
            <div className="flex justify-center text-slate-300">
              <ArrowRight size={20} className="hidden md:block" />
              <ChevronDown size={20} className="block md:hidden" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="mb-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
                Example Value
              </p>
              <code className="block text-[10px] font-bold break-all text-slate-800 underline decoration-indigo-200 md:inline-block md:text-sm">
                https://origin.yourdomain.com
              </code>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
