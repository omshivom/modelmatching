import ModelCard from './ModelCard';

const EVENT_TYPE_ICONS = {
  'Casting Call': '🎬',
  'Fashion Show': '✨',
  'Runway': '👠',
  'Photo Shoot': '📸',
  'Open Call': '📢',
  'Workshop': '🎓',
  'Other': '📋',
};

function SkeletonCard({ index }) {
  return (
    <div
      className="bg-white border border-gray-100 rounded-xl p-4 animate-pulse"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-full bg-gray-200 shrink-0" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-20" />
        </div>
        <div className="w-12 h-12 rounded-full bg-gray-100" />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="h-10 bg-gray-100 rounded-lg" />
        <div className="h-10 bg-gray-100 rounded-lg" />
        <div className="h-10 bg-gray-100 rounded-lg" />
      </div>
      <div className="mt-3 flex gap-1.5">
        <div className="h-5 w-16 bg-gray-100 rounded-full" />
        <div className="h-5 w-20 bg-gray-100 rounded-full" />
        <div className="h-5 w-14 bg-gray-100 rounded-full" />
      </div>
      <div className="mt-3 space-y-1.5 pt-3 border-t border-gray-50">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-4/5" />
      </div>
      <div className="mt-3 h-8 bg-gray-100 rounded-lg" />
    </div>
  );
}

export default function ModelPanel({ event, loading, matches, shortlist, onToggleShortlist, error }) {
  if (!event) {
    return (
      <div className="flex-1 flex items-center justify-center bg-cream-50">
        <div className="text-center max-w-xs px-6">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-3xl">
            ✦
          </div>
          <h2 className="font-serif text-lg font-semibold text-charcoal-800 mb-2">
            AI Model Matching
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Select an event from the scanner to see AI-powered model recommendations for your roster.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 text-left">
            {[
              { icon: '📍', label: 'Location match', desc: 'Proximity scoring' },
              { icon: '🎨', label: 'Style fit', desc: 'Event theme alignment' },
              { icon: '📊', label: 'Demographics', desc: 'Audience matching' },
              { icon: '📅', label: 'Availability', desc: 'Calendar conflict check' },
            ].map(f => (
              <div key={f.label} className="bg-white border border-gray-100 rounded-xl p-3">
                <div className="text-lg mb-1">{f.icon}</div>
                <div className="text-xs font-semibold text-charcoal-800">{f.label}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-cream-50">
      {/* Event details header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{EVENT_TYPE_ICONS[event.event_type] || '📋'}</span>
              <span className="text-[10px] tracking-widest uppercase text-gray-400 font-medium">{event.event_type}</span>
            </div>
            <h2 className="font-serif text-lg font-semibold text-charcoal-800 leading-snug">
              {event.title}
            </h2>
            <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-400">
              <span>{event.date}</span>
              <span>·</span>
              <span>{event.location}</span>
              {event.event_url && (
                <>
                  <span>·</span>
                  <a
                    href={event.event_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-500 hover:text-gold-600 underline underline-offset-2"
                  >
                    View on Eventbrite ↗
                  </a>
                </>
              )}
            </div>
          </div>
          {loading && (
            <div className="flex items-center gap-2 bg-gold-400/10 text-gold-600 text-xs px-3 py-1.5 rounded-full border border-gold-400/20 shrink-0">
              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Matching...
            </div>
          )}
        </div>

        {event.style_tags && event.style_tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {event.style_tags.map(tag => (
              <span key={tag} className="text-[10px] bg-cream-100 text-gray-500 px-2 py-0.5 rounded-full border border-cream-200">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* AI matching label */}
      <div className="px-6 pt-4 pb-2 shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-500">
            {loading ? 'Finding matches...' : matches.length > 0 ? `Top ${matches.length} Matches` : ''}
          </h3>
          {!loading && matches.length > 0 && (
            <span className="text-[10px] text-gray-400">Ranked by AI match score</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {loading && (
          <div className="space-y-3">
            {[0, 1, 2, 3, 4].map(i => (
              <SkeletonCard key={i} index={i} />
            ))}
          </div>
        )}

        {!loading && !error && matches.length === 0 && event && (
          <div className="text-center py-10">
            <p className="text-gray-400 text-sm">No matches returned. Please try again.</p>
          </div>
        )}

        {!loading && matches.length > 0 && (
          <div className="space-y-3">
            {matches.map((match, i) => (
              <ModelCard
                key={match.model_id || i}
                match={match}
                index={i}
                isShortlisted={shortlist.has(match.model?.id)}
                onToggleShortlist={onToggleShortlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
