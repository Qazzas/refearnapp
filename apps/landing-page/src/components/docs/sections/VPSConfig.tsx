/** @jsxImportSource react */
import { ShieldCheck, Info, Edit3 } from 'lucide-react';
import Frame from '../Frame'; // Adjust path if necessary

export default function VPSConfig() {
  return (
    <section id="vps-setup" className="mb-24 scroll-mt-20 px-4 md:px-0">
      <div className="mb-4 flex items-center gap-2 font-bold tracking-tighter text-indigo-600 uppercase">
        <ShieldCheck size={18} />
        <span className="text-xs md:text-sm">Network Preparation</span>
      </div>
      <h2 className="mb-6 text-2xl leading-tight font-bold text-slate-900 md:text-3xl">
        Preparing your VPS Bridge
      </h2>

      <div className="space-y-8">
        {/* Step 1: DNS Record */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 md:text-lg">
              1. Create your Origin DNS Record
            </h3>
            <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[9px] font-bold text-slate-500 uppercase md:text-[10px]">
              Cloudflare Side
            </span>
          </div>
          <p className="mb-6 text-sm leading-relaxed text-slate-600 md:text-base">
            Before deploying, you need a "Direct Path" to your VPS. Point a
            subdomain to your VPS IP in Cloudflare. You can use any name you
            like.
          </p>

          {/* New Image Frame Added Here */}
          <Frame
            src="/Sections/cloudflare-dns.png"
            alt="Cloudflare DNS A Record Setup"
            caption="Add an 'A' record pointing your subdomain to your VPS IPv4 address."
          />

          {/* Simulated DNS Dashboard - Styling preserved */}
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 font-mono shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-800/50 px-4 py-2 text-[9px] font-bold tracking-widest text-slate-400 uppercase md:text-xs">
              <span>Cloudflare DNS Dashboard</span>
              <span className="flex items-center gap-1 text-emerald-500">
                <Edit3 size={10} /> Editable Name
              </span>
            </div>

            <div className="p-4 md:p-5">
              <div className="hidden grid-cols-3 gap-2 border-b border-slate-700 pb-2 text-[10px] font-black text-slate-500 uppercase md:grid">
                <span>Type</span>
                <span>Name (Subdomain)</span>
                <span>IPv4 Content</span>
              </div>

              <div className="flex flex-col gap-4 py-1 text-xs md:grid md:grid-cols-3 md:items-center md:gap-2 md:text-sm">
                <div className="flex items-center justify-between md:block">
                  <span className="text-[8px] font-black text-slate-500 uppercase md:hidden">
                    Type
                  </span>
                  <span className="font-bold text-indigo-400">A</span>
                </div>

                <div className="flex flex-col gap-1 md:block">
                  <span className="text-[8px] font-black text-slate-500 uppercase md:hidden">
                    Name (Subdomain)
                  </span>
                  <span className="font-bold break-all text-emerald-400">
                    your-choice
                  </span>
                  <span className="block text-[9px] font-normal text-slate-500 md:mt-1">
                    e.g. origin, app, or vps
                  </span>
                </div>

                <div className="flex flex-col gap-1 md:block">
                  <span className="text-[8px] font-black text-slate-500 uppercase md:hidden">
                    IPv4 Content
                  </span>
                  <span className="leading-relaxed font-bold break-all text-amber-400">
                    YOUR_VPS_IP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: The "Later" Context - Styling preserved */}
        <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-5 md:p-6">
          <div className="mb-3 flex items-center gap-2 text-blue-800">
            <Info size={20} className="shrink-0" />
            <h3 className="text-base font-bold md:text-lg">
              How will this be used?
            </h3>
          </div>

          <div className="mb-6 space-y-4 text-sm leading-relaxed text-blue-900/80 md:text-base">
            <p>
              The name you chose above creates your <strong>Origin URL</strong>.
              This URL will be your:
              <code className="mt-2 block rounded bg-blue-100 px-2 py-1 font-mono text-xs font-bold break-all text-blue-900 md:mx-1 md:inline">
                NEXT_PUBLIC_REDIRECTION_URL
              </code>
            </p>
            <div className="rounded-lg border border-blue-100 bg-white/40 p-3 text-xs italic shadow-sm">
              <span className="mb-1 block font-bold text-blue-800 not-italic">
                Pro-Tip:
              </span>
              If you used{' '}
              <span className="font-mono font-bold text-blue-900">
                dashboard
              </span>
              , your URL is{' '}
              <span className="font-mono font-bold text-blue-900 underline">
                https://dashboard.yourdomain.com
              </span>
              .
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-xl bg-white/60 p-4 md:flex-row md:items-center">
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
                Future Env Var
              </p>
              <code className="text-[11px] font-bold break-all text-indigo-600 md:text-sm">
                NEXT_PUBLIC_REDIRECTION_URL
              </code>
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
                Example Format
              </p>
              <code className="text-[11px] font-bold break-all text-slate-800 underline decoration-blue-200 md:text-sm">
                https://[your-name].domain.com
              </code>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
