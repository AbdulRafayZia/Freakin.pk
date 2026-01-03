export default function Loading() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-5 bg-[#fff5f9]">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Spinner */}
        <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>

        {/* Loading Text */}
        <h2 className="text-2xl font-fredoka font-bold text-pink-600">
          Loading Products...
        </h2>

        {/* Animated Dots */}
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </main>
  );
}
