/** @jsxImportSource react */
import { Copy, ExternalLink, LayoutDashboard, ArrowRight } from 'lucide-react';
import Frame from '../Frame'; // Ensure this path is correct

export default function PortalSetup() {
  return (
    <section id="portal-setup" className="mb-24 scroll-mt-20 px-4 md:px-0">
      <div className="mb-4 flex items-center gap-2 font-bold tracking-tighter text-indigo-600 uppercase">
        <LayoutDashboard size={18} />
        <span className="text-xs md:text-sm">Final Activation</span>
      </div>
      <h2 className="mb-6 text-2xl leading-tight font-bold text-slate-900 md:text-3xl">
        Organization & Portal Routing
      </h2>

      <div className="space-y-8">
        {/* Step 1: Organization Creation */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900 md:text-lg">
            1. Create your Organization
          </h3>
          <p className="mb-6 text-sm leading-relaxed text-slate-600 md:text-base">
            Once your dashboard is live, sign up and log in. You will be
            prompted to create a new <strong>Organization</strong>. This is the
            workspace for your affiliate program.
          </p>
        </div>

        {/* Step 2: The Domain Sync Bridge */}
        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5 md:p-6">
          <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-amber-900 md:text-lg">
            2. The Final Domain Sync
          </h3>
          <p className="mb-6 text-sm leading-relaxed text-amber-900/80 md:text-base">
            To make the affiliate portal reachable, you must sync the active
            domain from the dashboard back to Coolify.
          </p>

          <div className="space-y-4">
            {/* Step A: Inside Refearn */}
            <div className="rounded-xl border border-amber-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between border-b border-amber-50 pb-2">
                <span className="text-[10px] font-black text-amber-600 uppercase">
                  Inside RefearnApp
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-xs font-bold text-slate-700">
                  Manage Domains &gt; Copy Active Domain
                </p>
                <div className="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 font-mono text-[10px] font-bold text-slate-500">
                  <Copy size={12} /> app.yourdomain.com
                </div>
              </div>

              {/* Image A: Manage Domains UI */}
              <Frame
                src="/Sections/coolify-manage-domains.png"
                alt="RefearnApp Domain Management"
                caption="Copy your active tracking domain from the dashboard settings."
              />
            </div>

            <div className="flex justify-center py-1">
              <ArrowRight
                className="rotate-90 text-amber-300 md:rotate-0"
                size={24}
              />
            </div>

            {/* Step B: Inside Coolify */}
            <div className="rounded-xl border border-indigo-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between border-b border-indigo-50 pb-2">
                <span className="text-[10px] font-black text-indigo-600 uppercase">
                  Inside Coolify
                </span>
              </div>
              <p className="mt-4 text-xs font-bold text-slate-700">
                Configuration &gt; General &gt; Domains
              </p>
              <div className="mt-2 rounded border-2 border-dashed border-indigo-100 p-2 text-center font-mono text-[10px] font-bold text-indigo-600">
                PASTE DOMAIN HERE
              </div>

              {/* Image B: Coolify Domain Configuration */}
              <Frame
                src="/Sections/coolify-domains.png"
                alt="Coolify Domain Entry"
                caption="Paste the copied domain into Coolify's general settings to finalize the routing."
              />
            </div>
          </div>
        </div>

        {/* Result Callout */}
        <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
          <ExternalLink size={20} className="mt-1 shrink-0 text-emerald-600" />
          <div className="text-sm text-emerald-900">
            <p className="font-bold">Portal Live!</p>
            <p className="opacity-90">
              After clicking save in Coolify, your affiliate portal is now
              correctly routed to your VPS. Your affiliates can now sign up via
              your custom subdomain.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
