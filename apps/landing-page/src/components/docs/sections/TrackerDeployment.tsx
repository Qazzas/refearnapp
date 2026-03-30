/** @jsxImportSource react */
import { Terminal, ShieldCheck, Zap, Key, AlertTriangle } from 'lucide-react';

export default function TrackerDeployment() {
  return (
    <section id="tracker-setup" className="mb-24 scroll-mt-20">
      <div className="mb-4 flex items-center gap-2 font-bold tracking-tighter text-indigo-600 uppercase">
        <Zap size={20} />
        <span>Worker Deployment</span>
      </div>
      <h2 className="mb-6 text-3xl leading-tight font-bold text-slate-900">
        Deploying the Tracking Worker
      </h2>

      <div className="space-y-8">
        {/* Step 1: Login Warning */}
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2 font-bold text-amber-800">
            <ShieldCheck size={20} />
            <h3>Cloudflare Authentication (SSH)</h3>
          </div>
          <p className="mb-4 text-sm leading-relaxed text-amber-800/80">
            Since you are on a remote VPS, standard <code>wrangler login</code>{' '}
            will fail because it tries to open a browser on localhost. You must
            use the <strong>no-browser</strong> flag.
          </p>
          <div className="rounded-lg bg-slate-900 p-4 font-mono text-xs text-amber-400">
            npx wrangler login --no-browser
          </div>
          <p className="mt-3 text-xs text-amber-700 italic">
            * Follow the link provided in the terminal, authorize on your PC,
            and paste the code back into the VPS terminal.
          </p>
        </div>

        {/* Step 2: Deployment Command */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
            <Terminal size={18} className="text-indigo-500" />
            Launch the Tracker Setup
          </h3>
          <p className="mb-4 text-sm text-slate-600">
            Run the following command in the root folder of your project on the
            VPS. This script will configure your <code>wrangler.toml</code> and
            deploy the worker.
          </p>
          <div className="rounded-lg bg-slate-900 p-4 font-mono text-sm text-indigo-300">
            pnpm launch:tracker
          </div>
        </div>

        {/* Step 3: Variable Mapping Table */}
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-indigo-900">
            <Key size={18} />
            Configuration Mapping
          </h3>
          <p className="mb-6 text-sm text-indigo-900/70">
            The script will prompt you for several values. Ensure they match
            your previous environment setup exactly:
          </p>

          <div className="overflow-hidden rounded-xl border border-indigo-100 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-indigo-100/50 text-[10px] font-black tracking-widest text-indigo-900/50 uppercase">
                <tr>
                  <th className="px-4 py-3">Prompt</th>
                  <th className="px-4 py-3">Source Variable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-50">
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-700">
                    VPS App URL
                  </td>
                  <td className="px-4 py-3 font-mono text-indigo-600">
                    NEXT_PUBLIC_REDIRECTION_URL
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-700">
                    Public Worker Domain
                  </td>
                  <td className="px-4 py-3 font-mono text-indigo-600">
                    NEXT_PUBLIC_BASE_URL
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-700">
                    INTERNAL_SECRET
                  </td>
                  <td className="px-4 py-3 font-mono text-indigo-600">
                    INTERNAL_SECRET
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-700">
                    UPSTASH_REDIS_URL
                  </td>
                  <td className="px-4 py-3 font-mono text-indigo-600">
                    UPSTASH_REDIS_REST_URL
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-700">
                    UPSTASH_REDIS_TOKEN
                  </td>
                  <td className="px-4 py-3 font-mono text-indigo-600">
                    UPSTASH_REDIS_REST_TOKEN
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Final Warning */}
        <div className="flex gap-3 rounded-xl border border-slate-200 bg-slate-100 p-4">
          <AlertTriangle size={20} className="shrink-0 text-slate-500" />
          <p className="text-xs leading-relaxed text-slate-600">
            <strong>Note:</strong> After deployment, the script will
            automatically set Cloudflare Secrets for your Redis credentials. You
            do not need to add these manually in the Cloudflare dashboard.
          </p>
        </div>
      </div>
    </section>
  );
}
