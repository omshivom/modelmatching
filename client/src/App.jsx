import { useState } from 'react';
import TopBar from './components/TopBar';
import EventScanner from './components/EventScanner';
import ModelPanel from './components/ModelPanel';

const URL_OPTIONS = [
  { label: 'United States', url: 'https://www.eventbrite.com/d/united-states/model-casting/' },
  { label: 'New York', url: 'https://www.eventbrite.com/d/ny--new-york/model-casting/' },
  { label: 'Los Angeles', url: 'https://www.eventbrite.com/d/ca--los-angeles/model-casting/' },
  { label: 'Fashion Shows', url: 'https://www.eventbrite.com/d/united-states/fashion-show/' },
];

const SCAN_STEPS = [
  'Connecting to Eventbrite...',
  'Scanning for modeling events...',
  'Extracting event data with AI...',
  'Almost there...',
];

export default function App() {
  const [selectedOption, setSelectedOption] = useState(URL_OPTIONS[1]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [matches, setMatches] = useState([]);
  const [scanLoading, setScanLoading] = useState(false);
  const [matchLoading, setMatchLoading] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanDone, setScanDone] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);
  const [shortlist, setShortlist] = useState(new Set());
  const [matchError, setMatchError] = useState(null);

  const handleScan = async () => {
    setScanLoading(true);
    setScanDone(false);
    setEvents([]);
    setSelectedEvent(null);
    setMatches([]);
    setScanStep(0);

    const timers = [
      setTimeout(() => setScanStep(1), 2500),
      setTimeout(() => setScanStep(2), 6000),
      setTimeout(() => setScanStep(3), 11000),
    ];

    try {
      const response = await fetch('/api/scrape-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: selectedOption.url }),
      });
      const data = await response.json();
      setEvents(data.events || []);
      setUsedFallback(data.fallback || false);
      setScanDone(true);
    } catch {
      setEvents([]);
      setScanDone(true);
    } finally {
      timers.forEach(clearTimeout);
      setScanLoading(false);
    }
  };

  const handleSelectEvent = async (event) => {
    setSelectedEvent(event);
    setMatchLoading(true);
    setMatches([]);
    setMatchError(null);

    try {
      const response = await fetch('/api/match-models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event }),
      });
      const data = await response.json();
      if (data.error) {
        setMatchError(data.error);
      } else {
        setMatches(data.matches || []);
      }
    } catch {
      setMatchError('AI matching temporarily unavailable. Please try again.');
    } finally {
      setMatchLoading(false);
    }
  };

  const toggleShortlist = (modelId) => {
    setShortlist(prev => {
      const next = new Set(prev);
      if (next.has(modelId)) next.delete(modelId);
      else next.add(modelId);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <TopBar shortlistCount={shortlist.size} />
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
        <EventScanner
          urlOptions={URL_OPTIONS}
          selectedOption={selectedOption}
          onOptionChange={setSelectedOption}
          onScan={handleScan}
          loading={scanLoading}
          scanStep={scanStep}
          scanSteps={SCAN_STEPS}
          scanDone={scanDone}
          events={events}
          selectedEvent={selectedEvent}
          onSelectEvent={handleSelectEvent}
          usedFallback={usedFallback}
        />
        <ModelPanel
          event={selectedEvent}
          loading={matchLoading}
          matches={matches}
          shortlist={shortlist}
          onToggleShortlist={toggleShortlist}
          error={matchError}
        />
      </div>
    </div>
  );
}
