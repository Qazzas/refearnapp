/** @jsxImportSource react */
import {
  Copy,
  LayoutDashboard,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Link2,
} from 'lucide-react';
import Frame from '../Frame';

export default function PortalSetup() {
  return (
    <section id="portal-setup" className="mb-24 scroll-mt-20 px-4 md:px-0">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2 text-xs font-bold tracking-tight text-indigo-600 uppercase sm:text-sm">
        <LayoutDashboard size={18} className="fill-current" />
        <span>Final Activation Phase</span>
      </div>
      <h2 className="mb-8 text-2xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        Finalizing <span className="text-indigo-600">Portal Routing</span>
      </h2>

      <div className="space-y-6 sm:space-y-10">
        {/* Step 1: Organization Creation */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-200">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Initialize Your Organization
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            With your dashboard live, execute your first login. You’ll be
            prompted to define your <strong>Organization Workspace</strong>.
            This acts as the central hub for all affiliate tracking and payout
            logic.
          </p>
        </div>

        {/* Step 2: The Domain Sync Bridge */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/30 p-6 shadow-sm ring-1 ring-amber-500/10">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-sm font-bold text-white">
              2
            </div>
            <h3 className="text-lg font-bold text-amber-900">
              Synchronize Domain Routing
            </h3>
          </div>
          <p className="mb-8 text-sm leading-relaxed text-amber-900/80 sm:text-base">
            To ensure the affiliate portal is reachable, you must bridge the
            active domain from your Refearn Dashboard back to your Coolify
            configuration.
          </p>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_48px_1fr] lg:items-center">
            {/* Source: Refearn */}
            <div className="rounded-xl border border-amber-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-amber-50 pb-3">
                <span className="text-[10px] font-black tracking-widest text-amber-600 uppercase">
                  Step A: Export
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  Refearn Dashboard
                </span>
              </div>
              <div className="space-y-4">
                <p className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Link2 size={14} className="text-amber-500" /> Manage Domains
                  &rarr; Copy
                </p>
                <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                  <code className="truncate font-mono text-[10px] font-bold text-indigo-600">
                    app.yourdomain.com
                  </code>
                  <Copy
                    size={14}
                    className="shrink-0 cursor-pointer text-slate-400 hover:text-indigo-600"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Frame
                  src="/Sections/coolify-manage-domains.png"
                  alt="RefearnApp Domain Management"
                  caption="Copy the active domain prefix from your settings."
                />
              </div>
            </div>

            {/* Visual Connector */}
            <div className="flex justify-center">
              <ArrowRight
                className="rotate-90 text-amber-300 lg:rotate-0"
                size={32}
              />
            </div>

            {/* Destination: Coolify */}
            <div className="rounded-xl border border-indigo-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-indigo-50 pb-3">
                <span className="text-[10px] font-black tracking-widest text-indigo-600 uppercase">
                  Step B: Import
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  Coolify Control Panel
                </span>
              </div>
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-800">
                  Configuration &rarr; General &rarr; Domains
                </p>
                <div className="rounded-lg border-2 border-dashed border-indigo-100 bg-indigo-50/30 p-2 text-center text-[10px] font-black tracking-tighter text-indigo-600 uppercase">
                  Paste Deployment URL
                </div>
              </div>
              <div className="mt-4">
                <Frame
                  src="/Sections/coolify-domains.png"
                  alt="Coolify Domain Entry"
                  caption="Inform your VPS which URL to listen for."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Cloudflare Connection */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3 font-bold text-slate-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
              3
            </div>
            <h3 className="text-lg">Global DNS Propagation</h3>
          </div>
          <p className="mb-6 text-sm leading-relaxed text-slate-600 sm:text-base">
            Map your domain to your infrastructure by creating an{' '}
            <strong>A Record</strong> within Cloudflare. Ensure the "Name" field
            matches your chosen subdomain exactly.
          </p>

          <Frame
            src="/Sections/cloudflare-dns.png"
            alt="Cloudflare DNS Configuration"
            caption="The Record Name must be the prefix (e.g., 'app') of your full URL."
          />

          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
            <div className="bg-slate-900 px-4 py-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Required DNS Record
            </div>
            <div className="grid grid-cols-1 divide-y divide-slate-100 p-4 font-mono text-[11px] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <div className="py-2 sm:px-4 sm:py-0">
                <span className="mb-1 block text-[9px] text-slate-400">
                  TYPE
                </span>
                <span className="font-bold text-indigo-600">A</span>
              </div>
              <div className="py-2 sm:px-4 sm:py-0">
                <span className="mb-1 block text-[9px] text-slate-400">
                  NAME (SUBDOMAIN)
                </span>
                <span className="font-bold text-emerald-600">app</span>
              </div>
              <div className="py-2 sm:px-4 sm:py-0">
                <span className="mb-1 block text-[9px] text-slate-400">
                  CONTENT (IP)
                </span>
                <span className="font-bold text-amber-600">YOUR_VPS_IP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
          <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-emerald-200/20 blur-2xl" />
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 className="text-lg font-extrabold text-emerald-900">
                Deployment Successful!
              </h4>
              <p className="mt-1 text-sm leading-relaxed text-emerald-800/80">
                Your affiliate infrastructure is now operational. Once DNS
                propagation completes, your portal will be accessible globally.
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm font-bold text-emerald-600">
                <span>Start managing affiliates</span>
                <ExternalLink size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
