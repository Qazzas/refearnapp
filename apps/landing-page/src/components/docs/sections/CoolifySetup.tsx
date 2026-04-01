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
  ChevronDown,
} from 'lucide-react';
import Frame from '../Frame'; // Ensure path is correct

export default function CoolifySetup() {
  const repoUrl = 'https://github.com/ZAK123DSFDF/refearnapp';

  return (
    <section id="self-hosting" className="mb-24 scroll-mt-20 px-4 md:px-0">
      <div className="mb-4 flex items-center gap-2 font-bold tracking-tighter text-indigo-600 uppercase">
        <Terminal size={20} />
        <span>Deployment Guide</span>
      </div>
      <h2 className="mb-6 text-2xl leading-tight font-bold text-slate-900 md:text-3xl">
        Self-Hosting with Coolify
      </h2>

      <div className="space-y-12">
        {/* Step 1: Installation */}
        <div className="relative border-l-2 border-slate-200 pl-6 md:pl-8">
          <div className="absolute top-0 -left-2.25 h-4 w-4 rounded-full border-4 border-white bg-indigo-600 shadow-sm" />
          <h3 className="mb-3 text-lg font-bold text-slate-900 md:text-xl">
            1. Install Coolify on VPS
          </h3>
          <p className="mb-4 text-sm leading-relaxed text-slate-600 md:text-base">
            SSH into your VPS server and run the official command. Once
            finished, access the UI via your IP on port 8000.
          </p>
          <div className="overflow-x-auto rounded-xl bg-slate-900 p-4 font-mono text-xs break-all whitespace-pre-wrap text-indigo-300 md:text-sm">
            curl -fsSL https://get.coollabs.io/coolify/install.sh | bash
          </div>
        </div>

        {/* Step 2: Repository */}
        <div className="relative border-l-2 border-slate-200 pl-6 md:pl-8">
          <div className="absolute top-0 -left-2.25 h-4 w-4 rounded-full border-4 border-white bg-slate-300" />
          <h3 className="mb-3 text-lg font-bold text-slate-900 md:text-xl">
            2. Connect Forked Repository
          </h3>
          <div className="mb-4 space-y-3">
            <div className="flex flex-col items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800 shadow-sm sm:flex-row">
              <GitFork size={18} className="mt-0.5 shrink-0" />
              <div className="w-full overflow-hidden">
                <p className="mb-1 font-bold">
                  Action Required: Fork the Repository
                </p>
                <p className="mb-3 opacity-90">
                  Fork this repository to maintain your own config:
                </p>
                <a
                  href={repoUrl}
                  target="_blank"
                  className="block text-xs font-bold break-all underline hover:text-amber-900 md:text-sm"
                >
                  {repoUrl} <ExternalLink size={14} className="ml-1 inline" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <Github size={18} className="shrink-0 text-slate-400" />
              <code className="text-[10px] font-bold break-all text-indigo-600 italic md:text-sm">
                https://github.com/YOUR_USERNAME/refearnapp
              </code>
            </div>
          </div>
        </div>

        {/* Step 3: Configuration */}
        <div className="relative border-l-2 border-slate-200 pl-6 md:pl-8">
          <div className="absolute top-0 -left-2.25 h-4 w-4 rounded-full border-4 border-white bg-slate-300" />
          <h3 className="mb-3 text-lg font-bold text-slate-900 md:text-xl">
            3. Configure Environment & Domain
          </h3>

          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 md:p-5">
            <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
              <Info size={16} className="shrink-0 text-indigo-500" />
              Input All Variables
            </h4>
            <p className="text-sm text-slate-600">
              Add all keys from the{' '}
              <a
                href="#env-variables"
                className="font-bold text-indigo-600 underline"
              >
                Reference Section
              </a>{' '}
              below.
            </p>

            {/* Image 1: Environment Variables */}
            <Frame
              src="/Sections/coolify-environment-variables.png"
              alt="Coolify Environment Variables Setup"
              caption="Paste your environment variables into the 'Environment Variables' tab."
            />
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 shadow-sm md:p-6">
              <div className="mb-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 font-bold text-indigo-900">
                  <Link size={18} className="shrink-0" />
                  <h4 className="text-sm md:text-base">Link Redirection URL</h4>
                </div>
                <p className="text-[10px] font-bold tracking-tight text-indigo-600/70 uppercase">
                  Coolify Path: Configuration &gt; General &gt; Domains
                </p>
              </div>

              <div className="flex flex-col gap-4 rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm md:flex-row md:items-center">
                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
                    1. Cloudflare Name
                  </p>
                  <code className="text-[10px] font-bold text-slate-800 md:text-xs">
                    https://[ANY-NAME].yourdomain.com
                  </code>
                </div>

                <div className="flex justify-center text-slate-300">
                  <ArrowRight size={20} className="hidden md:block" />
                  <ChevronDown size={20} className="block md:hidden" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
                    2. Paste into "Domains"
                  </p>
                  <code className="block text-[10px] font-bold break-all text-indigo-600 italic md:truncate md:text-xs">
                    NEXT_PUBLIC_REDIRECTION_URL
                  </code>
                </div>
              </div>

              {/* Image 2: Domain Setup */}
              <Frame
                src="/Sections/coolify-domains.png"
                alt="Coolify Domain Configuration"
                caption="Ensure the domain matches your NEXT_PUBLIC_REDIRECTION_URL exactly."
              />
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-start gap-3 text-xs text-slate-600 md:text-sm">
                <FileCode size={18} className="shrink-0 text-indigo-500" />
                <p>
                  Set <strong>Dockerfile</strong> and{' '}
                  <strong>Root Directory</strong> to <code>/</code>.
                </p>
              </div>

              {/* Image 3: Docker Setup */}
              <Frame
                src="/Sections/coolify-docker-setup.png"
                alt="Coolify Build Settings"
                caption="Select Dockerfile as the build pack in the 'General' settings."
              />
            </div>
          </div>
        </div>

        {/* Step 4: Deploy */}
        <div className="relative border-l-2 border-slate-200 pl-6 md:pl-8">
          <div className="absolute top-0 -left-2.25 h-4 w-4 rounded-full border-4 border-white bg-emerald-500 shadow-sm" />
          <h3 className="mb-3 text-lg font-bold text-slate-900 md:text-xl">
            4. Launch
          </h3>
          <button className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 font-bold text-white shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-700 md:w-auto">
            <Play size={18} fill="currentColor" />
            Deploy Now
          </button>
        </div>
      </div>
    </section>
  );
}
