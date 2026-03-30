/** @jsxImportSource react */
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function VPSConfig() {
  return (
    <section id="vps-setup" className="mb-24 scroll-mt-20">
      <div className="mb-4 flex items-center gap-2 font-bold tracking-tighter text-indigo-600 uppercase">
        <ShieldCheck size={20} />
        <span>Server Configuration</span>
      </div>
      <h2 className="mb-6 text-3xl leading-tight font-bold text-slate-900">
        Linking your VPS to Cloudflare
      </h2>

      <div className="space-y-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
            1. Create your Origin DNS Record
          </h3>
          <p className="mb-6 text-slate-600">
            Point a subdomain to your VPS IP. While we use{' '}
            <code className="bg-slate-100 px-1 text-indigo-600">origin</code> as
            an example, you can use any name (e.g., <em>backend, api, app</em>).
          </p>

          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 font-mono text-sm shadow-lg">
            <div className="border-b border-slate-800 bg-slate-800/50 px-4 py-2 text-xs font-bold tracking-widest text-slate-500 uppercase">
              Cloudflare DNS Dashboard
            </div>
            <div className="p-5">
              <div className="mb-2 grid grid-cols-3 gap-4 border-b border-slate-700 pb-2 text-[10px] text-slate-500 uppercase">
                <span>Type</span>
                <span>Name (Subdomain)</span>
                <span>IPv4 Content</span>
              </div>
              <div className="grid grid-cols-3 gap-4 py-1">
                <span className="font-bold text-indigo-400">A</span>
                <span className="text-emerald-400">
                  origin{' '}
                  <span className="text-[10px] font-normal text-slate-500 underline">
                    (or any name)
                  </span>
                </span>
                <span className="text-amber-400">YOUR_VPS_IP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-6">
          <h3 className="mb-2 text-lg font-bold text-indigo-900">
            2. Match the Redirection URL
          </h3>
          <p className="mb-6 leading-relaxed text-indigo-900/80">
            The subdomain you created in Cloudflare must now be linked to your{' '}
            <strong>Coolify VPS</strong>. Add this as an Environment Variable in
            your Coolify service settings so the application knows its own
            public origin.
          </p>

          <div className="flex flex-col items-stretch gap-4 rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm md:flex-row md:items-center">
            <div className="flex-1">
              <p className="mb-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Env Variable
              </p>
              <code className="text-sm font-bold text-indigo-600">
                NEXT_PUBLIC_REDIRECTION_URL
              </code>
            </div>
            <ArrowRight size={20} className="hidden text-slate-300 md:block" />
            <div className="flex-1">
              <p className="mb-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Example Value
              </p>
              <code className="text-sm font-bold text-slate-800 underline decoration-indigo-200">
                https://origin.yourdomain.com
              </code>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
