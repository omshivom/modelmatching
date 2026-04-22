const EVENT_TYPE_STYLES = {
  'Casting Call': { badge: 'bg-violet-50 text-violet-700 border-violet-200', icon: '🎬' },
  'Fashion Show': { badge: 'bg-rose-50 text-rose-700 border-rose-200', icon: '✨' },
  'Runway': { badge: 'bg-purple-50 text-purple-700 border-purple-200', icon: '👠' },
  'Photo Shoot': { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '📸' },
  'Open Call': { badge: 'bg-amber-50 text-amber-700 border-amber-200', icon: '📢' },
  'Workshop': { badge: 'bg-cyan-50 text-cyan-700 border-cyan-200', icon: '🎓' },
  'Other': { badge: 'bg-gray-50 text-gray-600 border-gray-200', icon: '📋' },
};

export default function EventDetailModal({ event, onClose, onFindModels }) {
  if (!event) return null;

  const typeConfig = EVENT_TYPE_STYLES[event.event_type] || EVENT_TYPE_STYLES['Other'];

  const handleFindModels = () => {
    onClose();
    onFindModels(event);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400" />

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-50">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{typeConfig.icon}</span>
              <span className={`text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded border ${typeConfig.badge}`}>
                {event.event_type}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-gray-500 transition-colors p-1 rounded-lg hover:bg-gray-50"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <h2 className="font-serif text-xl font-semibold text-charcoal-800 leading-snug mt-3">
            {event.title}
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">

          {/* Date & Location */}
          <div className="grid grid-cols-2 gap-3">
            <InfoBlock icon={<CalIcon />} label="Date" value={event.date || 'TBA'} />
            <InfoBlock icon={<PinIcon />} label="Location" value={event.location || 'TBA'} />
          </div>

          {/* Description */}
          {event.description && (
            <div>
              <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">About this event</p>
              <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
            </div>
          )}

          {/* Style Tags */}
          {event.style_tags && event.style_tags.length > 0 && (
            <div>
              <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-2">Style Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {event.style_tags.map(tag => (
                  <span key={tag} className="text-xs bg-cream-100 text-charcoal-700 px-2.5 py-1 rounded-full border border-cream-200 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Event URL */}
          {event.event_url && (
            <div className="bg-cream-50 border border-cream-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <svg className="text-gray-400 shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1a6 6 0 100 12A6 6 0 007 1zM1 7h12" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M7 1c-1.66 1.66-2.4 3.6-2.4 6s.74 4.34 2.4 6M7 1c1.66 1.66 2.4 3.6 2.4 6s-.74 4.34-2.4 6" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                <span className="text-xs text-gray-500 font-mono truncate">{event.event_url}</span>
              </div>
              <a
                href={event.event_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gold-600 hover:text-gold-500 font-medium shrink-0 underline underline-offset-2"
              >
                View ↗
              </a>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="px-6 pb-6">
          <button
            onClick={handleFindModels}
            className="w-full bg-charcoal-800 hover:bg-charcoal-700 text-white font-medium py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm tracking-wide"
          >
            Find Matching Models
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <p className="text-center text-[10px] text-gray-400 mt-2">
            AI will rank your roster based on style, location, availability & reach
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ icon, label, value }) {
  return (
    <div className="bg-cream-50 border border-cream-200 rounded-xl px-3 py-3">
      <div className="flex items-center gap-1.5 text-gray-400 mb-1">
        {icon}
        <span className="text-[10px] tracking-widest uppercase">{label}</span>
      </div>
      <p className="text-sm font-medium text-charcoal-800">{value}</p>
    </div>
  );
}

function CalIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="2.5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1 5.5h12" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.5 1v3M9.5 1v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
      <path d="M7 1C4.79 1 3 2.79 3 5c0 3.25 4 8 4 8s4-4.75 4-8c0-2.21-1.79-4-4-4z" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="7" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
