export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-red-500 text-center">
        <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
        <p>We couldn't load the passport data you're looking for.</p>
        <p className="mt-4">
          <a href="/" className="text-blue-500 hover:underline">
            Return to Home
          </a>
        </p>
      </div>
    </div>
  );
} 