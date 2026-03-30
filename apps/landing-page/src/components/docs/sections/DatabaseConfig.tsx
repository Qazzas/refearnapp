/** @jsxImportSource react */
import {
  Database,
  Terminal,
  Key,
  AlertCircle,
  ExternalLink,
  Play,
} from 'lucide-react';

export default function DatabaseConfig() {
  return (
    <section id="database-setup" className="mb-24 scroll-mt-20">
      <div className="mb-4 flex items-center gap-2 font-bold tracking-tighter text-indigo-600 uppercase">
        <Database size={20} />
        <span>Data Layer</span>
      </div>
      <h2 className="mb-6 text-3xl leading-tight font-bold text-slate-900">
        Database & Currency Setup
      </h2>

      <div className="space-y-8">
        {/* Step 1: Run the Script */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2 font-bold text-slate-800">
            <Terminal size={20} className="text-indigo-500" />
            <h3>1. Initialize Database & Rates</h3>
          </div>
          <p className="mb-4 text-sm text-slate-600">
            Run the automated setup script from the{' '}
            <strong>project root</strong>. This will configure your{' '}
            <code>.env</code>, migrate your database, and fetch live exchange
            rates.
          </p>
          <div className="rounded-lg bg-slate-900 p-4 font-mono text-sm text-indigo-300">
            pnpm db:setup
          </div>
        </div>

        {/* Step 2: Mapping Table */}
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-6">
          <div className="mb-4 flex items-center gap-2 font-bold text-indigo-900">
            <Key size={18} />
            <h3 className="text-sm">Script Prompt Reference</h3>
          </div>
          <div className="overflow-hidden rounded-xl border border-indigo-100 bg-white shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-indigo-100/50 text-[9px] font-black tracking-widest text-indigo-900/50 uppercase">
                <tr>
                  <th className="px-4 py-3">Prompt Name</th>
                  <th className="px-4 py-3">Value to Paste</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-50">
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-700">
                    Database Connection String
                  </td>
                  <td className="px-4 py-3 font-mono text-indigo-600">
                    DATABASE_URL
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-700">
                    CURRENCY_API_KEY
                  </td>
                  <td className="px-4 py-3 font-mono text-indigo-600">
                    CURRENCY_API_KEY
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-700">
                    UPSTASH_REDIS_REST_URL
                  </td>
                  <td className="px-4 py-3 font-mono text-indigo-600">
                    UPSTASH_REDIS_REST_URL
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-700">
                    UPSTASH_REDIS_REST_TOKEN
                  </td>
                  <td className="px-4 py-3 font-mono text-indigo-600">
                    UPSTASH_REDIS_REST_TOKEN
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Step 3: Action Button: Redeploy Coolify */}
        <div className="rounded-2xl border-2 border-emerald-500 bg-white p-6 shadow-lg ring-4 shadow-emerald-500/10 ring-emerald-500/5">
          <div className="mb-4 flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
              <Play size={20} fill="currentColor" className="ml-1" />
            </div>
            <div>
              <h3 className="text-lg leading-tight font-bold text-slate-900">
                Apply Changes to Dashboard
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                The script has updated your <code>.env</code> file. To apply
                these database settings to your live site, you must re-deploy.
              </p>
            </div>
          </div>

          <a
            href="#"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-emerald-700 hover:shadow-lg active:scale-[0.98]"
          >
            Deploy Coolify Instance Again
            <ExternalLink size={16} />
          </a>
        </div>

        {/* Footer Warning */}
        <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertCircle size={20} className="shrink-0 text-amber-600" />
          <p className="text-[11px] leading-relaxed text-amber-800 italic">
            Note: If the seeding fails, check that your{' '}
            <strong>CURRENCY_API_KEY</strong> is valid and has not reached its
            monthly limit.
          </p>
        </div>
      </div>
    </section>
  );
}
