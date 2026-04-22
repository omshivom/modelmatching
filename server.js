const express = require('express');
const path = require('path');
const fs = require('fs');
const ScrapingBeeClient = require('scrapingbee');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(express.json({ limit: '10mb' }));

const SCRAPINGBEE_API_KEY = 'ETYV0ZH6N4122NK9F1KIUXHSN3PP7U2Q1R4VX1YIZ06TBJGJFCHF84AQIZ3N9J95XSIGWBL8O00EZBLP';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const models = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/models.json'), 'utf8'));
const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/bookings.json'), 'utf8'));

const FALLBACK_EVENTS = [
  {
    title: "NYC Open Casting Call — SS26 Collections",
    date: "May 28, 2026",
    location: "New York, NY",
    description: "Open casting for runway and editorial models for upcoming Spring/Summer 2026 collections. Seeking diverse looks from size 0–16.",
    event_url: "https://www.eventbrite.com",
    event_type: "Casting Call",
    style_tags: ["runway", "editorial", "SS26", "inclusive", "NYC"]
  },
  {
    title: "NYFW Emerging Designers Showcase",
    date: "June 4, 2026",
    location: "New York, NY",
    description: "Runway showcase featuring 12 emerging New York-based designers. Looking for models with strong runway presence and editorial versatility.",
    event_url: "https://www.eventbrite.com",
    event_type: "Fashion Show",
    style_tags: ["runway", "NYFW", "emerging designers", "editorial", "NYC"]
  },
  {
    title: "Commercial Model Open Call — Beauty Campaign",
    date: "May 30, 2026",
    location: "New York, NY",
    description: "Major beauty brand seeking fresh faces for a national campaign. Focus on commercial appeal, strong social media presence preferred.",
    event_url: "https://www.eventbrite.com",
    event_type: "Open Call",
    style_tags: ["commercial", "beauty", "social media", "campaign", "NYC"]
  },
  {
    title: "Streetwear & Urban Fashion Casting",
    date: "June 8, 2026",
    location: "Brooklyn, NY",
    description: "Casting for an urban streetwear lookbook shoot. Seeking models with Gen-Z appeal and authentic street style.",
    event_url: "https://www.eventbrite.com",
    event_type: "Photo Shoot",
    style_tags: ["streetwear", "urban", "gen-z", "lookbook", "Brooklyn"]
  },
  {
    title: "Luxury Brand Runway Auditions",
    date: "June 12, 2026",
    location: "Manhattan, NY",
    description: "Major European luxury house holding NYC auditions for upcoming couture show. Experience with high-fashion runway required.",
    event_url: "https://www.eventbrite.com",
    event_type: "Runway",
    style_tags: ["luxury", "haute couture", "European", "runway", "Manhattan"]
  },
  {
    title: "Swimwear Collection Photo Shoot",
    date: "June 6, 2026",
    location: "Miami, FL",
    description: "New beachwear brand shooting their debut campaign. Seeking confident, expressive models comfortable in swimwear.",
    event_url: "https://www.eventbrite.com",
    event_type: "Photo Shoot",
    style_tags: ["swimwear", "commercial", "beach", "Miami", "campaign"]
  },
  {
    title: "Inclusive Fashion Runway — Body Positive Brands",
    date: "June 15, 2026",
    location: "New York, NY",
    description: "Runway show celebrating body diversity and inclusive fashion. All sizes and backgrounds welcome. Strong advocacy focus.",
    event_url: "https://www.eventbrite.com",
    event_type: "Fashion Show",
    style_tags: ["inclusive", "body positive", "diversity", "runway", "NYC"]
  }
];

async function scrapeEvents(targetUrl) {
  const client = new ScrapingBeeClient(SCRAPINGBEE_API_KEY);
  const response = await client.get({
    url: targetUrl,
    params: {
      render_js: 'true',
      wait: 3000,
      block_ads: 'true',
    },
  });
  const decoder = new TextDecoder();
  return decoder.decode(response.data);
}

function extractJSON(text) {
  // Try direct parse first
  try {
    return JSON.parse(text.trim());
  } catch {
    // Extract JSON array from markdown code blocks
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      try {
        return JSON.parse(codeBlockMatch[1].trim());
      } catch {}
    }
    // Extract raw JSON array
    const arrayMatch = text.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      try {
        return JSON.parse(arrayMatch[0]);
      } catch {}
    }
    throw new Error('Could not extract valid JSON from response');
  }
}

app.post('/api/scrape-events', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });

  let html = null;
  let scrapeFailed = false;

  try {
    html = await scrapeEvents(url);
  } catch {
    // Retry once after 2s
    try {
      await new Promise(r => setTimeout(r, 2000));
      html = await scrapeEvents(url);
    } catch {
      scrapeFailed = true;
    }
  }

  if (scrapeFailed || !html) {
    return res.json({ events: FALLBACK_EVENTS, fallback: true, fallbackReason: 'scrape' });
  }

  const parsePrompt = `You are an event data extraction agent. Parse the following HTML from Eventbrite and extract all modeling/fashion events into a JSON array.

For each event extract:
- title (string)
- date (string — the date/time as shown)
- location (string — city, state or "Online")
- description (string — brief 1-2 sentence summary)
- event_url (string — the Eventbrite event link if available)
- event_type (string — one of: "Casting Call", "Fashion Show", "Runway", "Photo Shoot", "Open Call", "Workshop", "Other")
- style_tags (array of strings — inferred tags like "NYFW", "streetwear", "luxury", "commercial", "editorial", "bridal", etc.)

Return ONLY valid JSON array, no markdown, no explanation.

HTML:
${html.slice(0, 80000)}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: 'You are a structured data extraction agent specializing in fashion industry events.',
      messages: [{ role: 'user', content: parsePrompt }],
    });

    const events = extractJSON(message.content[0].text);
    if (!Array.isArray(events) || events.length === 0) {
      return res.json({ events: FALLBACK_EVENTS, fallback: true, fallbackReason: 'no_events' });
    }
    return res.json({ events, fallback: false });
  } catch {
    return res.json({ events: FALLBACK_EVENTS, fallback: true, fallbackReason: 'parse_error' });
  }
});

app.post('/api/match-models', async (req, res) => {
  const { event } = req.body;
  if (!event) return res.status(400).json({ error: 'Event required' });

  const systemPrompt = `You are an AI talent matching agent for Elite World Group, a top global modeling agency. Your job is to analyze an event/opportunity and recommend the best-fit models from the agency's roster.

Consider these factors when ranking:
1. Location proximity — models based near the event location are preferred
2. Style fit — match model's style tags and past work to the event theme/type
3. Audience demographics — match model's Instagram audience to the event's target demographic
4. Availability — check if model has conflicting bookings during the event dates
5. Instagram reach — higher engagement rate (not just follower count) is a signal of influence
6. Diversity of recommendation — suggest a diverse mix of models, not all the same profile

For each recommended model, provide:
- model_id (from the roster)
- match_score (0-100)
- match_reasoning (2-3 sentences explaining why this model fits)
- availability_status ("available", "conflict", "tentative")
- key_strengths (array of 2-3 strings, e.g. "NYC-based", "high editorial profile", "strong luxury audience")

Return the top 5 matches as a JSON array sorted by match_score descending. Return ONLY valid JSON, no markdown.`;

  const userPrompt = `Event details:
${JSON.stringify(event, null, 2)}

Model roster:
${JSON.stringify(models, null, 2)}

Current bookings calendar:
${JSON.stringify(bookings, null, 2)}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const rawMatches = extractJSON(message.content[0].text);

    const enrichedMatches = rawMatches.map(match => {
      const model = models.find(m => m.id === match.model_id);
      return { ...match, model };
    }).filter(m => m.model);

    return res.json({ matches: enrichedMatches });
  } catch (err) {
    console.error('Match error:', err.message);
    return res.status(500).json({ error: 'AI matching temporarily unavailable. Please try again.' });
  }
});

// Serve built React app in production
const clientDist = path.join(__dirname, 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`EWG Booking Agent server running on http://localhost:${PORT}`);
  console.log(`Anthropic API key: ${process.env.ANTHROPIC_API_KEY ? 'configured ✓' : 'MISSING — set ANTHROPIC_API_KEY env var'}`);
});
