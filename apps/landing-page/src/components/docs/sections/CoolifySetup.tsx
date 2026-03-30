/** @jsxImportSource react */
import {
  Terminal,
  Github,
  Link,
  FileCode,
  Play,
  GitFork,
  ArrowRight,
  Info,
  ExternalLink,
} from 'lucide-react';

export default function CoolifySetup() {
  const repoUrl = 'https://github.com/ZAK123DSFDF/refearnapp';

  return (
    <section id="self-hosting" className="mb-24 scroll-mt-20">
      <div className="mb-4 flex items-center gap-2 font-bold tracking-tighter text-indigo-600 uppercase">
        <Terminal size={20} />
        <span>Deployment Guide</span>
      </div>
      <h2 className="mb-6 text-3xl leading-tight font-bold text-slate-900">
        Self-Hosting with Coolify
      </h2>

      <div className="space-y-12">
        {/* Step 1: Installation */}
        <div className="relative border-l-2 border-slate-200 pl-8">
          <div className="absolute top-0 -left-2.25 h-4 w-4 rounded-full border-4 border-white bg-indigo-600 shadow-sm" />
          <h3 className="mb-3 text-xl font-bold text-slate-900">
            1. Install Coolify on VPS
          </h3>
          <p className="mb-4 leading-relaxed text-slate-600">
            SSH into your VPS server and run the official installation command.
            Once finished, access the Coolify UI via the provided IP on port
            8000.
          </p>
          <div className="overflow-x-auto rounded-xl bg-slate-900 p-4 font-mono text-sm text-indigo-300">
            curl -fsSL https://get.coollabs.io/coolify/install.sh | bash
          </div>
        </div>

        {/* Step 2: Repository */}
        <div className="relative border-l-2 border-slate-200 pl-8">
          <div className="absolute top-0 -left-2.25 h-4 w-4 rounded-full border-4 border-white bg-slate-300" />
          <h3 className="mb-3 text-xl font-bold text-slate-900">
            2. Connect Forked Repository
          </h3>
          <div className="mb-4 space-y-3">
            <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800 shadow-sm">
              <GitFork size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="mb-1 font-bold">
                  Action Required: Fork the Repository
                </p>
                <p className="mb-3 opacity-90">
                  To maintain your own configuration and receive future updates,
                  you must fork this repository:
                </p>
                <a
                  href={repoUrl}
                  target="_blank"
                  className="inline-flex items-center gap-2 font-bold underline hover:text-amber-900"
                >
                  {repoUrl} <ExternalLink size={14} />
                </a>
              </div>
            </div>

            <p className="text-sm text-slate-600">
              Once forked, create a <strong>New Resource</strong> in Coolify and
              paste <strong>your fork's URL</strong>:
            </p>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <Github size={18} className="text-slate-400" />
              <code className="text-sm font-bold text-indigo-600 italic">
                https://github.com/YOUR_USERNAME/refearnapp
              </code>
            </div>
          </div>
        </div>

        {/* Step 3: Configuration */}
        <div className="relative border-l-2 border-slate-200 pl-8">
          <div className="absolute top-0 -left-2.25 h-4 w-4 rounded-full border-4 border-white bg-slate-300" />
          <h3 className="mb-3 text-xl font-bold text-slate-900">
            3. Configure Environment & Domain
          </h3>
          {/* Bulk Variables Note */}
          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
              <Info size={16} className="text-indigo-500" />
              Input All Variables
            </h4>
            <p className="mb-0 text-sm text-slate-600">
              Go to the <strong>Environment Variables</strong> tab in Coolify
              and add all keys from the
              <a
                href="#env-variables"
                className="mx-1 font-bold text-indigo-600 underline"
              >
                Reference Section
              </a>
              below.
            </p>
          </div>
          <div className="space-y-6">
            {/* The "Blue Bridge" Instruction */}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2 font-bold text-indigo-900">
                <Link size={20} />
                <h4>Critical: Sync Redirection URL</h4>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-indigo-900/80">
                In the Coolify <strong>General</strong> tab, the{' '}
                <strong>Domain (FQDN)</strong> must exactly match your
                environment variable. You can use <strong>any subdomain</strong>{' '}
                (e.g., origin, app, api, or dashboard).
              </p>

              <div className="flex flex-col items-stretch gap-4 rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm md:flex-row md:items-center">
                <div className="flex-1">
                  <p className="mb-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Env Variable
                  </p>
                  <code className="text-xs font-bold text-indigo-600">
                    NEXT_PUBLIC_REDIRECTION_URL
                  </code>
                </div>
                <ArrowRight
                  size={20}
                  className="hidden text-slate-300 md:block"
                />
                <div className="flex-1">
                  <p className="mb-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Coolify Domain Setup
                  </p>
                  <code className="text-xs font-bold text-slate-800 italic">
                    https://[YOUR-SUBDOMAIN].yourdomain.com
                  </code>
                </div>
              </div>
            </div>

            {/* Build Settings */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
              <FileCode size={18} className="shrink-0 text-indigo-500" />
              <p>
                In <strong>Build Settings</strong>: Select{' '}
                <strong>Dockerfile</strong> and set the{' '}
                <strong>Root Directory</strong> to <code>/</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Step 4: Deploy */}
        <div className="relative border-l-2 border-slate-200 pl-8">
          <div className="absolute top-0 -left-2.25 h-4 w-4 rounded-full border-4 border-white bg-emerald-500 shadow-sm" />
          <h3 className="mb-3 text-xl font-bold text-slate-900">4. Launch</h3>
          <p className="mb-6 leading-relaxed text-slate-600">
            Review your configuration and click <strong>Deploy</strong>. Coolify
            will build the Docker container and provision your SSL certificate
            automatically via the Cloudflare bridge.
          </p>
          <button className="group flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 font-bold text-white shadow-lg shadow-emerald-100 transition-all hover:scale-105 hover:bg-emerald-700 active:scale-95">
            <Play
              size={18}
              fill="currentColor"
              className="transition-transform group-hover:translate-x-1"
            />
            Deploy Now
          </button>
        </div>
      </div>
    </section>
  );
}
