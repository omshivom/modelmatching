import { useState } from 'react';

const AVATAR_COLORS = [
  '#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B',
  '#EF4444', '#6366F1', '#14B8A6', '#F97316', '#84CC16',
  '#A855F7', '#06B6D4', '#F43F5E', '#22C55E', '#3B82F6',
  '#D97706', '#7C3AED', '#059669', '#DC2626', '#2563EB',
];

function MatchScoreRing({ score }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#22c55e' : score >= 65 ? '#f59e0b' : '#9ca3af';

  return (
    <div className="relative inline-flex items-center justify-center w-12 h-12">
      <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90 absolute">
        <circle cx="24" cy="24" r={radius} fill="none" stroke="#F3F4F6" strokeWidth="3" />
        <circle
          cx="24" cy="24" r={radius} fill="none"
          stroke={color} strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <span className="text-xs font-bold relative" style={{ color }}>{score}</span>
    </div>
  );
}

function AvailabilityBadge({ status, conflictClient }) {
  const configs = {
    available: { label: 'Available', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200' },
    tentative: { label: 'Tentative', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400', border: 'border-amber-200' },
    conflict: { label: conflictClient ? `Booked — ${conflictClient}` : 'Conflict', bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500', border: 'border-red-200' },
  };
  const c = configs[status] || configs.available;

  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function formatNumber(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

export default function ModelCard({ match, isShortlisted, onToggleShortlist, index }) {
  const { model, match_score, match_reasoning, availability_status, key_strengths } = match;
  const [justAdded, setJustAdded] = useState(false);

  if (!model) return null;

  const initials = model.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const avatarColor = AVATAR_COLORS[(model.id - 1) % AVATAR_COLORS.length];

  const handleShortlist = () => {
    if (!isShortlisted) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    }
    onToggleShortlist(model.id);
  };

  return (
    <div
      className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all duration-200 animate-slide-up"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
          style={{ backgroundColor: avatarColor }}
        >
          {initials}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="font-serif font-semibold text-charcoal-800 leading-tight text-sm">{model.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{model.instagram_handle}</p>
            </div>
            <MatchScoreRing score={match_score} />
          </div>

          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <AvailabilityBadge status={availability_status} />
            <span className="text-[10px] text-gray-400">{model.base_city} · {model.nationality}</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <Stat label="Followers" value={formatNumber(model.instagram_followers)} />
        <Stat label="Engagement" value={`${model.engagement_rate}%`} />
        <Stat label="Agency" value={model.agency.split(' ')[0]} />
      </div>

      {/* Key strengths */}
      {key_strengths && key_strengths.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {key_strengths.map(s => (
            <span key={s} className="text-[10px] bg-cream-100 text-charcoal-700 px-2 py-0.5 rounded-full border border-cream-200 font-medium">
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Match reasoning */}
      {match_reasoning && (
        <p className="mt-3 text-xs text-gray-500 leading-relaxed border-t border-gray-50 pt-3">
          {match_reasoning}
        </p>
      )}

      {/* Style tags */}
      {model.style_tags && model.style_tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {model.style_tags.slice(0, 4).map(tag => (
            <span key={tag} className="text-[10px] bg-gray-50 text-gray-400 px-1.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Shortlist button */}
      <button
        onClick={handleShortlist}
        className={`mt-3 w-full py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${
          isShortlisted
            ? 'bg-charcoal-800 text-white'
            : justAdded
            ? 'bg-emerald-500 text-white'
            : 'bg-cream-100 text-charcoal-700 hover:bg-cream-200 border border-cream-200'
        }`}
      >
        {justAdded ? (
          <>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Added to Shortlist
          </>
        ) : isShortlisted ? (
          <>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            On Shortlist
          </>
        ) : (
          <>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Add to Shortlist
          </>
        )}
      </button>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-cream-50 rounded-lg px-2 py-1.5 text-center">
      <div className="text-[10px] text-gray-400 mb-0.5">{label}</div>
      <div className="text-xs font-semibold text-charcoal-800 truncate">{value}</div>
    </div>
  );
}
