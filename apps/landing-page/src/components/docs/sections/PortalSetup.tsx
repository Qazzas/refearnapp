/** @jsxImportSource react */
import {
  Copy,
  LayoutDashboard,
  ArrowRight,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import Frame from '../Frame';

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
            2. The Final Domain Sync (Refearn &lt;&gt; Coolify)
          </h3>
          <p className="mb-6 text-sm leading-relaxed text-amber-900/80 md:text-base">
            To make the affiliate portal reachable, you must sync the active
            domain from the dashboard back to Coolify.
          </p>

          <div className="space-y-4">
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
                  <Copy size={12} /> [subdomain].yourdomain.com
                </div>
              </div>

              <Frame
                src="/Sections/coolify-manage-domains.png"
                alt="RefearnApp Domain Management"
                caption="Copy your active tracking domain (e.g., app, portal, or affiliates) from the dashboard settings."
              />
            </div>

            <div className="flex justify-center py-1">
              <ArrowRight
                className="rotate-90 text-amber-300 md:rotate-0"
                size={24}
              />
            </div>

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
                PASTE COPIED DOMAIN
              </div>

              <Frame
                src="/Sections/coolify-domains.png"
                alt="Coolify Domain Entry"
                caption="Paste the exact domain into Coolify to tell your VPS which URL to listen for."
              />
            </div>
          </div>
        </div>

        {/* Step 3: Cloudflare Connection */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
          <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900 md:text-lg">
            <Globe size={20} className="text-indigo-600" />
            3. Final Cloudflare DNS Mapping
          </h3>
          <p className="mb-6 text-sm leading-relaxed text-slate-600 md:text-base">
            Now, create an <strong>A Record</strong> in Cloudflare. The{' '}
            <strong>Name</strong> must be the subdomain you chose (e.g., if your
            domain is <code>app.domain.com</code>, use <code>app</code>).
          </p>

          <Frame
            src="/Sections/cloudflare-dns.png"
            alt="Cloudflare DNS Configuration"
            caption="The 'Name' must match the subdomain prefix you used in the previous steps."
          />

          <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">
              Required DNS Entry
            </p>
            <div className="grid grid-cols-3 gap-2 font-mono text-[10px] md:text-xs">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400">Type</span>
                <span className="font-bold text-indigo-600">A</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400">Name</span>
                <span className="font-bold text-emerald-600">
                  your-subdomain
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400">Content</span>
                <span className="font-bold text-amber-600">YOUR_VPS_IP</span>
              </div>
            </div>
            <p className="mt-2 text-[10px] text-slate-400 italic">
              * Replace "your-subdomain" with "app", "portal", or whatever
              prefix you used.
            </p>
          </div>
        </div>

        {/* Success Message */}
        <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
          <CheckCircle2 size={20} className="mt-1 shrink-0 text-emerald-600" />
          <div className="text-sm text-emerald-900">
            <p className="font-bold">Setup Complete!</p>
            <p className="leading-relaxed opacity-90">
              Once Cloudflare propagates, your affiliates can access the portal
              directly.
              <strong> You have successfully deployed RefearnApp!</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
