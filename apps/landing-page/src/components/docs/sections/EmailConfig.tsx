/** @jsxImportSource react */
import { Mail, CheckCircle2, Server, Zap } from 'lucide-react';

export default function EmailConfig() {
  const providers = [
    {
      name: 'Resend',
      icon: Zap,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
      border: 'border-orange-100',
      desc: 'Modern API-based sending. Easiest to setup.',
    },
    {
      name: 'ZeptoMail',
      icon: Mail,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      desc: 'Transactional email by Zoho. Great for high volume.',
    },
    {
      name: 'Custom SMTP',
      icon: Server,
      color: 'text-slate-600',
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      desc: 'Use your own server (Zoho, Google, Amazon SES).',
    },
  ];

  return (
    <section id="email-setup" className="mb-24 scroll-mt-20 px-4 md:px-0">
      <div className="mb-4 flex items-center gap-2 font-bold tracking-tighter text-indigo-600 uppercase">
        <Mail size={18} />
        <span className="text-xs md:text-sm">Communication Setup</span>
      </div>
      <h2 className="mb-6 text-2xl leading-tight font-bold text-slate-900 md:text-3xl">
        Configure Email Delivery
      </h2>

      <p className="mb-8 text-sm leading-relaxed text-slate-600 md:text-base">
        RefearnApp requires an email provider to send alerts and system
        notifications. Choose <strong>one</strong> of the supported methods
        below and configure it in your environment variables.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {providers.map((p) => (
          <div
            key={p.name}
            className={`rounded-2xl border ${p.border} ${p.bg} p-5 shadow-sm`}
          >
            <p.icon className={`mb-3 ${p.color}`} size={24} />
            <h4 className="mb-1 font-bold text-slate-900">{p.name}</h4>
            <p className="text-xs leading-relaxed text-slate-500">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 md:p-8">
        <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-900">
          <CheckCircle2 className="text-emerald-500" size={20} />
          Implementation Steps
        </h3>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
              1
            </div>
            <div>
              <p className="font-bold text-slate-900">Choose your Provider</p>
              <p className="text-sm text-slate-500">
                Sign up for an account on your preferred platform and get your
                API Key or SMTP credentials.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
              2
            </div>
            <div className="w-full">
              <p className="font-bold text-slate-900">Set the Provider Key</p>
              <p className="mb-3 text-sm text-slate-500">
                In Coolify, set the{' '}
                <code className="font-bold text-indigo-600">
                  EMAIL_PROVIDER
                </code>{' '}
                variable to match your choice:
              </p>
              <div className="flex flex-wrap gap-2">
                {['resend', 'smtp', 'zeptomail'].map((val) => (
                  <code
                    key={val}
                    className="rounded bg-slate-100 px-2 py-1 font-mono text-[10px] font-bold text-slate-700"
                  >
                    "{val}"
                  </code>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
              3
            </div>
            <div>
              <p className="font-bold text-slate-900">
                Fill Corresponding Credentials
              </p>
              <p className="text-sm text-slate-500">
                Scroll down to the{' '}
                <a
                  href="#env-variables"
                  className="font-bold text-indigo-600 underline"
                >
                  Env Variables
                </a>{' '}
                section and fill only the keys related to your chosen provider
                (e.g., SMTP host vs Resend Key).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
