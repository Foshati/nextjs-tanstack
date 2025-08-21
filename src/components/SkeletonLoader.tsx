export default function SkeletonLoader() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 10 }, () => crypto.randomUUID()).map((id) => (
        <div key={id} className="p-2 border rounded animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );
}