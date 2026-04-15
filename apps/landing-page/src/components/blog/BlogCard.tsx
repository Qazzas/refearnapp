import React from 'react';

interface BlogCardProps {
  title: string;
  date: string;
  slug: string;
  image: string;
  cdnUrl: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  title,
  date,
  slug,
  image,
  cdnUrl,
}) => {
  return (
    <article className="group h-full">
      <a
        href={`/blog/${slug}`}
        className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/60 bg-white transition-all duration-300 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/10"
      >
        {/* Top: Image Section - Full Bleed (No Padding) */}
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-slate-100">
          <img
            src={`${cdnUrl}${image}`}
            alt={title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Spotify-style "Play" button overlay - Positioned relative to image edge */}
          <div className="absolute right-4 bottom-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom: Info Section - Padding applied here only */}
        <div className="flex flex-1 flex-col p-6">
          <time className="mb-3 text-[11px] font-bold tracking-[0.15em] text-slate-400 uppercase">
            {date}
          </time>

          <h3 className="line-clamp-2 text-xl leading-tight font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
            {title}
          </h3>

          <div className="mt-auto flex items-center pt-8 text-sm font-bold text-indigo-600">
            <span>Read Article</span>
            <div className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </a>
    </article>
  );
};

export default BlogCard;
