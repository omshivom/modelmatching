export default function TopBar({ shortlistCount }) {
  return (
    <header className="bg-white border-b border-gray-100 h-16 flex items-center px-6 shrink-0 z-10">
      <div className="flex items-center gap-3 flex-1">
        <span className="text-gold-500 text-xl">✦</span>
        <div>
          <h1 className="font-serif text-lg font-semibold text-charcoal-800 leading-none tracking-wide">
            Elite World Group
          </h1>
          <p className="text-xs text-gray-400 tracking-widest uppercase mt-0.5">
            AI Booking Agent
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 bg-gold-400/10 text-gold-600 text-xs font-medium px-3 py-1.5 rounded-full border border-gold-400/20">
          <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-pulse" />
          Powered by AI
        </div>

        {shortlistCount > 0 && (
          <div className="flex items-center gap-1.5 bg-charcoal-800 text-white text-xs font-medium px-3 py-1.5 rounded-full">
            <span>Shortlist</span>
            <span className="bg-gold-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
              {shortlistCount}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-charcoal-800 flex items-center justify-center text-white text-xs font-semibold">
            CN
          </div>
          <span className="text-sm text-gray-600 hidden sm:block">Chris N.</span>
        </div>
      </div>
    </header>
  );
}
