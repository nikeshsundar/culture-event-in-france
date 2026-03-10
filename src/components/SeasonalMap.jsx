import { motion } from 'framer-motion';
import { useState } from 'react';
import { seasons } from '../data/constants';
import events from '../data/events.json';

/*
 * Equirectangular projection from real lat/lng:
 * x = (lng + 5.3) × 29.14 + 30      lng ∈ [-5.3, 9.8] → x ∈ [30, 470]
 * y = (51.2 − lat) × 44.44 + 30      lat ∈ [51.2, 41.3] → y ∈ [30, 470]
 */

// Metropolitan France — ~75 points, clockwise from Dunkirk
const FRANCE_PATH = `
  M 254,37
  L 239,41 231,45 231,51
  L 224,72 215,78 194,85
  L 187,97 186,103 176,107
  L 158,104 147,89 127,87
  L 131,102 137,126 140,136
  L 125,135 116,134 95,129
  L 83,127 67,131 53,146
  L 46,162 65,165 70,169
  L 86,175 104,179 115,196
  L 120,196 123,203 120,209
  L 133,230 143,243 151,245
  L 157,255 155,269 152,274
  L 149,298 150,312 148,324
  L 142,357 139,365 133,370
  L 158,382 180,389 202,396
  L 217,402 235,409 246,412
  L 263,412 277,412 273,400
  L 272,378 287,374 293,369
  L 305,363 314,366 328,369
  L 341,373 346,377 357,381
  L 365,383 378,374 381,367
  L 389,362 396,355 401,354 403,351
  L 408,336 393,328 385,318
  L 391,309 378,301 385,285 385,260
  L 376,235 363,244
  L 373,213 390,190 406,184
  L 398,175 399,161 410,139
  L 416,118 423,117 390,110
  L 370,99 366,95 354,97 343,95
  L 329,88 325,69 307,76
  L 301,63 288,59 274,47
  Z
`;

// Corsica — projected from real coordinates
const CORSICA_PATH = `
  M 457,394
  L 460,400 462,410 460,420
  L 458,432 455,445 452,455 451,466
  L 447,460 443,452 439,442
  L 435,433 436,422 440,413
  L 445,405 450,398
  Z
`;

// City positions in SVG coordinate space (same projection, coastal cities nudged just inside border)
const regionDots = [
  { name: 'Paris',      x: 253, y: 134, r: 7 },
  { name: 'Lyon',       x: 325, y: 272, r: 6 },
  { name: 'Marseille',  x: 330, y: 370, r: 6 },
  { name: 'Bordeaux',   x: 168, y: 313, r: 6 },
  { name: 'Strasbourg', x: 406, y: 145, r: 5 },
  { name: 'Nantes',     x: 139, y: 207, r: 5 },
  { name: 'Nice',       x: 398, y: 348, r: 5 },
  { name: 'Lille',      x: 274, y: 57,  r: 5 },
  { name: 'Toulouse',   x: 220, y: 365, r: 5 },
  { name: 'Cannes',     x: 382, y: 360, r: 5 },
];

export default function SeasonalMap() {
  const [activeSeason, setActiveSeason] = useState('summer');

  const seasonEvents = events.filter((e) => e.season === activeSeason);

  const seasonColors = {
    spring: '#D4A8E0',
    summer: '#C9A84C',
    autumn: '#E07A5F',
    winter: '#7EC8E3',
  };

  return (
    <section className="py-24 px-6 md:px-12 bg-navy">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block gold-gradient text-navy text-[0.65rem] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4">
            Interactive
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Seasonal Cultural Map
          </h2>
          <p className="text-white/50 max-w-md mx-auto">
            Watch France come alive — select a season to see where cultural activity peaks
          </p>
        </div>

        {/* Season tabs */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {seasons.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSeason(s.id)}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
                activeSeason === s.id
                  ? 'gold-gradient text-navy'
                  : 'border border-white/20 text-white/55 hover:border-gold/40'
              }`}
            >
              {s.emoji} {s.label}
            </button>
          ))}
        </div>

        {/* Map container */}
        <div className="max-w-4xl mx-auto glass rounded-3xl p-6 md:p-10 flex flex-col md:flex-row gap-8 items-stretch">
          {/* Map visual */}
          <div className="flex-1 min-h-[380px] bg-white/[0.03] rounded-2xl border border-white/8 relative overflow-hidden flex items-center justify-center p-4">
              <svg
                viewBox="0 0 500 500"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Metropolitan France */}
                <path
                  d={FRANCE_PATH}
                  fill={`${seasonColors[activeSeason]}10`}
                  stroke={`${seasonColors[activeSeason]}50`}
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                {/* Corsica */}
                <path
                  d={CORSICA_PATH}
                  fill={`${seasonColors[activeSeason]}10`}
                  stroke={`${seasonColors[activeSeason]}50`}
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />

                {/* City dots — rendered inside SVG for exact alignment */}
                {regionDots.map((dot, i) => {
                  const hasEvents = seasonEvents.some((e) => e.city === dot.name);
                  return (
                    <g key={dot.name}>
                      {/* Pulse ring */}
                      {hasEvents && (
                        <motion.circle
                          cx={dot.x}
                          cy={dot.y}
                          r={dot.r * 2.5}
                          fill="none"
                          stroke={`${seasonColors[activeSeason]}55`}
                          strokeWidth="1"
                          initial={{ r: dot.r, opacity: 0.7 }}
                          animate={{ r: dot.r * 3, opacity: 0 }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.12 }}
                        />
                      )}
                      {/* Dot */}
                      <motion.circle
                        cx={dot.x}
                        cy={dot.y}
                        r={dot.r}
                        fill={hasEvents ? seasonColors[activeSeason] : 'rgba(255,255,255,0.15)'}
                        initial={{ scale: 0 }}
                        animate={{ scale: hasEvents ? 1 : 0.5 }}
                        transition={{ type: 'spring', delay: i * 0.08 }}
                        style={{
                          filter: hasEvents
                            ? `drop-shadow(0 0 6px ${seasonColors[activeSeason]}88)`
                            : 'none',
                        }}
                      />
                      {/* Label */}
                      <text
                        x={dot.x}
                        y={dot.y - dot.r - 6}
                        textAnchor="middle"
                        fill={hasEvents ? seasonColors[activeSeason] : 'rgba(255,255,255,0.25)'}
                        fontSize="11"
                        fontWeight="600"
                        fontFamily="Inter, sans-serif"
                      >
                        {dot.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
          </div>

          {/* Events list */}
          <div className="flex-1 min-w-[220px]">
            <h3 className="font-playfair text-xl text-white mb-5">
              {seasons.find((s) => s.id === activeSeason)?.emoji}{' '}
              {activeSeason.charAt(0).toUpperCase() + activeSeason.slice(1)} Events
            </h3>
            {seasonEvents.length === 0 ? (
              <p className="text-white/40 text-sm">No events this season yet.</p>
            ) : (
              <div className="space-y-0">
                {seasonEvents.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-4 py-3.5 border-b border-white/8"
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: seasonColors[activeSeason] }}
                    />
                    <div>
                      <span className="text-sm text-white/75 block">{event.name}</span>
                      <small className="text-white/35 text-[0.75rem]">
                        {event.city} · {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </small>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
