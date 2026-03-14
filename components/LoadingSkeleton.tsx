'use client';

export default function LoadingSkeleton() {
  return (
    <div className="break-inside-avoid mb-6 rounded-3xl overflow-hidden bg-neutral-900 ring-1 ring-white/10">
      {/* Görsel Skeleton */}
      <div className="w-full bg-neutral-800 shimmer" style={{ height: `${200 + Math.random() * 150}px` }} />
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
      {Array.from({ length: count }).map((_, i) => (
        <LoadingSkeleton key={i} />
      ))}
    </div>
  );
}
