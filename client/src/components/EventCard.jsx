const EVENT_TYPE_STYLES = {
  'Casting Call': 'bg-violet-50 text-violet-700 border-violet-200',
  'Fashion Show': 'bg-rose-50 text-rose-700 border-rose-200',
  'Runway': 'bg-purple-50 text-purple-700 border-purple-200',
  'Photo Shoot': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Open Call': 'bg-amber-50 text-amber-700 border-amber-200',
  'Workshop': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Other': 'bg-gray-50 text-gray-600 border-gray-200',
};

export default function EventCard({ event, selected, onSelect }) {
  const typeStyle = EVENT_TYPE_STYLES[event.event_type] || EVENT_TYPE_STYLES['Other'];

  return (
    <button
      onClick={() => onSelect(event)}
      className={`w-full text-left rounded-xl border p-4 transition-all duration-200 group ${
        selected
          ? 'border-charcoal-800 bg-charcoal-800 text-white shadow-lg'
          : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className={`text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded border ${
            selected ? 'bg-white/10 text-white border-white/20' : typeStyle
          }`}
        >
          {event.event_type}
        </span>
      </div>

      <h3
        className={`font-serif font-semibold text-sm leading-snug mb-1.5 ${
          selected ? 'text-white' : 'text-charcoal-800'
        }`}
      >
        {event.title}
      </h3>

      <div className={`flex items-center gap-3 text-xs mb-2 ${selected ? 'text-white/70' : 'text-gray-500'}`}>
        <span className="flex items-center gap-1">
          <CalIcon size={12} />
          {event.date}
        </span>
        <span className="flex items-center gap-1">
          <PinIcon size={12} />
          {event.location}
        </span>
      </div>

      {event.description && (
        <p className={`text-xs leading-relaxed line-clamp-2 mb-3 ${selected ? 'text-white/60' : 'text-gray-500'}`}>
          {event.description}
        </p>
      )}

      {event.style_tags && event.style_tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {event.style_tags.slice(0, 4).map(tag => (
            <span
              key={tag}
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                selected ? 'bg-white/10 text-white/70' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-end">
        <span
          className={`text-xs font-medium flex items-center gap-1 transition-all ${
            selected
              ? 'text-gold-400'
              : 'text-charcoal-700 group-hover:text-gold-500'
          }`}
        >
          {selected ? 'Matched ✓' : 'View Details'}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </button>
  );
}

function CalIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <rect x="1" y="2.5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1 5.5h12" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.5 1v3M9.5 1v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M7 1C4.79 1 3 2.79 3 5c0 3.25 4 8 4 8s4-4.75 4-8c0-2.21-1.79-4-4-4z" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="7" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
