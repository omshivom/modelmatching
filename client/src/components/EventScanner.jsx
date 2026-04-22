import EventCard from './EventCard';

export default function EventScanner({
  urlOptions,
  selectedOption,
  onOptionChange,
  onScan,
  loading,
  scanStep,
  scanSteps,
  scanDone,
  events,
  selectedEvent,
  onSelectEvent,
  usedFallback,
}) {
  return (
    <div className="w-[420px] shrink-0 border-r border-gray-100 bg-white flex flex-col h-full">
      {/* Panel header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-50">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-serif text-base font-semibold text-charcoal-800">Event Scanner</h2>
          <span className="text-[10px] tracking-widest text-gray-400 uppercase">Live</span>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          Scan Eventbrite live for modeling &amp; casting opportunities, then match to your roster.
        </p>
      </div>

      {/* Controls */}
      <div className="px-5 py-4 border-b border-gray-50 space-y-3">
        <div>
          <label className="text-[10px] tracking-widest uppercase text-gray-400 block mb-1.5">
            Location
          </label>
          <div className="relative">
            <select
              value={selectedOption.url}
              onChange={e => onOptionChange(urlOptions.find(o => o.url === e.target.value))}
              disabled={loading}
              className="w-full appearance-none bg-cream-50 border border-gray-200 text-charcoal-800 text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-charcoal-800 transition disabled:opacity-50 cursor-pointer"
            >
              {urlOptions.map(opt => (
                <option key={opt.url} value={opt.url}>{opt.label}</option>
              ))}
            </select>
            <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div>
          <label className="text-[10px] tracking-widest uppercase text-gray-400 block mb-1.5">
            Source URL
          </label>
          <div className="bg-cream-50 border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2">
            <svg className="text-gray-400 shrink-0" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1a5 5 0 100 10A5 5 0 006 1zM1 6h10" stroke="currentColor" strokeWidth="1.2" />
              <path d="M6 1c-1.38 1.38-2 3-2 5s.62 3.62 2 5M6 1c1.38 1.38 2 3 2 5s-.62 3.62-2 5" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <span className="text-[11px] text-gray-500 truncate font-mono">{selectedOption.url}</span>
          </div>
        </div>

        <button
          onClick={onScan}
          disabled={loading}
          className="w-full bg-charcoal-800 hover:bg-charcoal-700 disabled:bg-gray-300 text-white text-sm font-medium py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 tracking-wide"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Scanning...
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Scan for Events
            </>
          )}
        </button>
      </div>

      {/* Progress steps */}
      {loading && (
        <div className="px-5 py-3 border-b border-gray-50 animate-fade-in">
          <div className="space-y-1.5">
            {scanSteps.map((step, i) => (
              <div key={step} className={`flex items-center gap-2 text-xs transition-all duration-300 ${i === scanStep ? 'text-charcoal-800' : i < scanStep ? 'text-gray-300' : 'text-gray-200'}`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                  i < scanStep ? 'bg-emerald-500' : i === scanStep ? 'bg-gold-400 animate-pulse-gold' : 'bg-gray-200'
                }`}>
                  {i < scanStep ? (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4l2 2L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className={`w-1.5 h-1.5 rounded-full ${i === scanStep ? 'bg-white' : 'bg-gray-400'}`} />
                  )}
                </span>
                {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results area */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {!loading && events.length === 0 && !scanDone && (
          <EmptyState />
        )}

        {!loading && scanDone && events.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-400 text-sm">No modeling events found for this location.</p>
            <p className="text-gray-300 text-xs mt-1">Try a different search.</p>
          </div>
        )}

        {events.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-charcoal-800">
                {events.length} event{events.length !== 1 ? 's' : ''} found
              </span>
              {usedFallback && (
                <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full">
                  Showing cached results
                </span>
              )}
            </div>
            <div className="space-y-3 animate-fade-in">
              {events.map((event, i) => (
                <EventCard
                  key={i}
                  event={event}
                  selected={selectedEvent === event}
                  onSelect={onSelectEvent}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* How it works */}
      <div className="px-5 py-3 border-t border-gray-50">
        <details className="group">
          <summary className="text-[10px] tracking-widest uppercase text-gray-400 cursor-pointer flex items-center gap-1 list-none select-none">
            <svg className="transition-transform group-open:rotate-90" width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            How it works
          </summary>
          <p className="mt-2 text-[11px] text-gray-400 leading-relaxed">
            The AI agent scans Eventbrite live, extracts opportunities, and matches them to the talent roster based on style, demographics, availability, and location — powered by Claude.
          </p>
        </details>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-cream-100 flex items-center justify-center mb-4">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M14 3C8.477 3 4 7.477 4 13c0 2.694 1.03 5.146 2.72 6.98L3 24l4.02-3.72A9.956 9.956 0 0014 23c5.523 0 10-4.477 10-10S19.523 3 14 3z" stroke="#D4A843" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="10" cy="13" r="1.2" fill="#D4A843" />
          <circle cx="14" cy="13" r="1.2" fill="#D4A843" />
          <circle cx="18" cy="13" r="1.2" fill="#D4A843" />
        </svg>
      </div>
      <h3 className="font-serif text-sm font-semibold text-charcoal-800 mb-1">Discover Live Events</h3>
      <p className="text-xs text-gray-400 leading-relaxed max-w-[220px]">
        Select a location and scan Eventbrite for modeling and casting opportunities.
      </p>
    </div>
  );
}
