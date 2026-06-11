import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
      <span
        className="text-7xl font-bold"
        style={{
          background: 'linear-gradient(to right, #FF8C00, #FFD700)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        404
      </span>
      <h1 className="text-2xl font-semibold text-white">Page not found</h1>
      <p className="text-gray-400 text-center max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-lg font-medium text-white"
        style={{
          background: 'linear-gradient(to right, #FF8C00, #FFD700)',
        }}
      >
        Back to AudioNest
      </Link>
    </div>
  );
}
