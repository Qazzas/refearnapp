/** @jsxImportSource react */

interface EnvLinkProps {
  name: string;
}

export default function EnvLink({ name }: EnvLinkProps) {
  // Converts DATABASE_URL to database-url for the anchor link
  const anchorId = name.toLowerCase().replace(/_/g, '-');

  return (
    <a
      href={`/docs/env-variables#${anchorId}`}
      className="cursor-help rounded bg-indigo-50 px-1.5 py-0.5 font-mono text-sm font-bold text-indigo-600 transition-all hover:bg-indigo-600 hover:text-white"
      title="Click for details"
    >
      {name}
    </a>
  );
}
