export function EnterpriseCard({ features }: { features: string[] }) {
  return (
    <div className="flex w-full flex-col rounded-[2rem] border border-border bg-slate-900 p-8 text-left shadow-sm transition-all hover:shadow-md md:flex-row md:items-center md:justify-between md:gap-12">
      <div className="flex-1">
        <h3 className="mb-2 text-2xl font-bold text-white">Custom Solutions</h3>
        <p className="mb-6 text-slate-400">
          Need something tailored? We partner with organizations for{" "}
          <strong>custom integrations</strong>, high-volume requirements, and
          specialized infrastructure needs.
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
          {features.map((feat) => (
            <li
              key={feat}
              className="flex items-center gap-2 text-sm text-slate-300"
            >
              <span className="text-primary font-bold">✓</span> {feat}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 shrink-0 md:mt-0">
        <a
          href="/contact"
          className="block rounded-2xl bg-white px-12 py-4 text-center font-bold text-slate-900 transition-all hover:scale-[1.02] hover:bg-slate-100 active:scale-95"
        >
          Request a Custom Solution
        </a>
      </div>
    </div>
  )
}
