/** @jsxImportSource react */
import {
  Terminal,
  ShieldCheck,
  Zap,
  Key,
  AlertTriangle,
  Monitor,
  Laptop,
  Settings,
  Globe,
  RefreshCcw,
} from 'lucide-react';

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
        {/* Step 0: Global Prerequisite */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2 font-bold text-slate-800">
            <Settings size={20} className="text-slate-400" />
            <h3>Prerequisite: Install Wrangler</h3>
          </div>
          <p className="mb-4 text-sm text-slate-600">
            Ensure Cloudflare's CLI tool is available globally on your VPS
            before starting.
          </p>
          <div className="rounded-lg bg-slate-900 p-4 font-mono text-xs text-indigo-300">
            npm install -g wrangler
          </div>
        </div>

        {/* Step 1: The SSH Tunnel */}
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2 font-bold text-indigo-900">
            <Monitor size={20} />
            <h3>1. Prepare SSH Tunnel (Your Local PC)</h3>
          </div>
          <p className="mb-4 text-sm leading-relaxed text-slate-600">
            Run this in your <strong>Local Terminal</strong> to bridge your VPS
            to your browser for authentication:
          </p>
          <div className="mb-4 rounded-lg bg-slate-900 p-4 font-mono text-xs text-indigo-300">
            ssh -L 8976:localhost:8976 your_username@your_vps_ip
          </div>
          <div className="flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-500">
            <Laptop size={14} /> Windows / Mac / Linux
          </div>
        </div>

        {/* Step 2: Specific Auth Flow */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2 font-bold text-slate-800">
            <ShieldCheck size={20} className="text-emerald-500" />
            <h3>2. Authenticate Cloudflare</h3>
          </div>
          <p className="mb-4 text-sm text-slate-600">
            Navigate to the worker directory to authenticate within the pnpm
            isolation:
          </p>
          <div className="space-y-1 rounded-lg bg-slate-900 p-4 font-mono text-xs text-emerald-400">
            <p>cd apps/tracking-worker</p>
            <p>npx wrangler login</p>
            <p>cd ../..</p>
          </div>
        </div>

        {/* Step 3: Deployment Command */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
            <Terminal size={18} className="text-indigo-500" />
            3. Launch Tracker Setup
          </h3>
          <div className="rounded-lg bg-slate-900 p-4 font-mono text-sm text-indigo-300">
            pnpm launch:tracker
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Follow the <strong>on-screen terminal instructions</strong>. Use the
            table below to map your variables correctly.
          </p>
        </div>

        {/* Step 4: Mapping Table */}
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-4 md:p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-indigo-900">
            <Key size={18} />
            Script Prompt Reference
          </h3>
          {/* Scrollable Container */}
          <div className="scrollbar-thin scrollbar-thumb-indigo-100 overflow-x-auto rounded-xl border border-indigo-100 bg-white shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-indigo-100/50 text-[9px] font-black tracking-widest whitespace-nowrap text-indigo-900/50 uppercase">
                <tr>
                  <th className="min-w-[140px] px-4 py-3">Prompt Name</th>
                  <th className="min-w-[200px] px-4 py-3">
                    Variable From Dashboard
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-50">
                {[
                  { prompt: 'VPS App URL', env: 'NEXT_PUBLIC_REDIRECTION_URL' },
                  {
                    prompt: 'Public Worker Domain',
                    env: 'NEXT_PUBLIC_BASE_URL',
                  },
                  { prompt: 'INTERNAL_SECRET', env: 'INTERNAL_SECRET' },
                  {
                    prompt: 'UPSTASH_REDIS_URL',
                    env: 'UPSTASH_REDIS_REST_URL',
                  },
                  {
                    prompt: 'UPSTASH_REDIS_TOKEN',
                    env: 'UPSTASH_REDIS_REST_TOKEN',
                  },
                ].map((row) => (
                  <tr key={row.env}>
                    <td className="px-4 py-3 font-medium whitespace-nowrap text-slate-700">
                      {row.prompt}
                    </td>
                    <td className="px-4 py-3 font-mono whitespace-nowrap text-indigo-600">
                      {row.env}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile Hint */}
          <p className="mt-2 text-center text-[10px] text-slate-400 italic md:hidden">
            ← Swipe table to see full variables →
          </p>
        </div>

        {/* Step 5: Final Custom Domain Step */}
        <div className="rounded-2xl border-2 border-indigo-500 bg-white p-6 shadow-md ring-4 ring-indigo-500/5">
          <div className="mb-3 flex items-center gap-2 font-bold text-slate-900">
            <Globe size={20} className="text-indigo-500" />
            <h3>5. Final Step: Connect Custom Domain</h3>
          </div>
          <p className="mb-4 text-sm text-slate-600">
            Link your domain in the Cloudflare Dashboard to make the worker
            public.
          </p>
          <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm">
            <p>
              1. Go to <strong>Workers & Pages</strong> {'>'} Select your
              tracker worker.
            </p>
            <p>
              2. Go to <strong>Settings</strong> {'>'}{' '}
              <strong>Domains & Routes</strong> {'>'}{' '}
              <strong>Add Custom Domain</strong>.
            </p>
            <div className="ml-2 space-y-2 border-l-2 border-indigo-200 py-1 pl-4">
              <p className="font-medium text-indigo-900 underline underline-offset-4">
                Add these two values:
              </p>
              <ul className="list-disc pl-4 font-mono text-[11px] text-slate-600">
                <li>
                  yourdomain.com{' '}
                  <span className="font-sans text-[10px] text-slate-400">
                    (Bare Domain)
                  </span>
                </li>
                <li>
                  www.yourdomain.com{' '}
                  <span className="font-sans text-[10px] text-slate-400">
                    (WWW Catch-all)
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="space-y-3">
          <div className="flex gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
            <RefreshCcw size={18} className="shrink-0 text-indigo-500" />
            <p className="text-[11px] leading-relaxed text-indigo-900/70">
              <strong>Mistake during setup?</strong> Your configuration is saved
              in <code>/apps/tracking-worker/.env.selfhost</code>. To re-enter
              your details, run: <br />
              <code className="font-bold text-indigo-600">
                pnpm launch:tracker --reset
              </code>
            </p>
          </div>

          <div className="flex gap-3 rounded-xl border border-slate-200 bg-slate-100 p-4">
            <AlertTriangle size={18} className="shrink-0 text-slate-500" />
            <p className="text-[11px] leading-relaxed text-slate-600 italic">
              Note: Cloudflare SSL issuance may take up to 10 minutes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
