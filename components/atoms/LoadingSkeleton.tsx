'use client';

const HEIGHTS = [220, 280, 320, 250, 200, 300, 240, 260, 340, 210, 270, 310];

export default function LoadingSkeleton({ index = 0 }: { index?: number }) {
  const height = HEIGHTS[index % HEIGHTS.length];
  return (
    <div className="break-inside-avoid mb-5 rounded-3xl overflow-hidden bg-neutral-900 ring-1 ring-white/10">
      <div className="w-full bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800 animate-pulse" style={{ height }} />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-neutral-800 rounded-full animate-pulse w-3/4" />
        <div className="h-3 bg-neutral-800 rounded-full animate-pulse w-1/2" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="columns-2 md:columns-3 xl:columns-4 gap-4 space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <LoadingSkeleton key={i} index={i} />
      ))}
    </div>
  );
}
