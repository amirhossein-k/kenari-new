export default function Loading() {
  return (
    <div className="container-x grid grid-cols-2 gap-4 py-16 md:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="aspect-[4/3] animate-pulse bg-brand-100" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-2/3 animate-pulse rounded bg-brand-100" />
            <div className="h-3 w-full animate-pulse rounded bg-brand-50" />
          </div>
        </div>
      ))}
    </div>
  );
}
