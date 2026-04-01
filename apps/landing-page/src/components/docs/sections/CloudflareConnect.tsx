/** @jsxImportSource react */
import { CheckCircle2, Globe } from 'lucide-react';
import Frame from '../Frame'; // Adjust this path based on your folder structure

export default function CloudflareConnect() {
  return (
    <section id="cloudflare" className="mb-24 scroll-mt-20">
      <div className="mb-4 flex items-center gap-2 font-bold tracking-tighter text-indigo-600 uppercase">
        <Globe size={20} />
        <span>Domain Connectivity</span>
      </div>
      <h2 className="mb-6 text-3xl leading-tight font-bold text-slate-900">
        Cloudflare Configuration
      </h2>

      <div className="prose prose-slate max-w-none space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="mt-0 text-lg font-bold text-slate-900">
            Connecting your Domain
          </h3>
          <p className="mb-6 text-slate-600">
            RefearnApp utilizes Cloudflare Workers. Your domain must be managed
            by Cloudflare to route traffic correctly.
          </p>

          {/* The Screenshot Frame */}
          <Frame
            src="/Sections/cloudflare-domains-connect.png"
            alt="Cloudflare DNS Configuration"
            caption="Ensure your domain status is 'Active' in the Cloudflare dashboard."
          />

          <ul className="list-none space-y-4 pl-0">
            <li className="flex gap-3">
              <CheckCircle2
                className="mt-1 shrink-0 text-emerald-500"
                size={18}
              />
              <span className="text-slate-700">
                <strong>New Domains:</strong> Purchase via Cloudflare Registrar
                for instant setup.
              </span>
            </li>
            <li className="flex gap-3">
              <CheckCircle2
                className="mt-1 shrink-0 text-emerald-500"
                size={18}
              />
              <span className="text-slate-700">
                <strong>External Domains:</strong> If using Namecheap or others,
                update your Name Servers to the records provided in your
                Cloudflare DNS tab.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
