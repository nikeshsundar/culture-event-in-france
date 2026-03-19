import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

function projectToMap(latitude, longitude) {
  const x = (longitude + 5.3) * 29.14 + 30;
  const y = (51.2 - latitude) * 44.44 + 30;
  return {
    x: Math.max(30, Math.min(470, x)),
    y: Math.max(30, Math.min(470, y)),
  };
}

export default function SeasonalMap() {
  const [activeSeason, setActiveSeason] = useState('summer');
  const navigate = useNavigate();

  const seasonEvents = events.filter((e) => e.season === activeSeason);

  const seasonDots = useMemo(() => {
    const cityMap = new Map();

    seasonEvents.forEach((event) => {
      if (!cityMap.has(event.city)) {
        const position = projectToMap(event.latitude, event.longitude);
        cityMap.set(event.city, {
          city: event.city,
          latitude: event.latitude,
          longitude: event.longitude,
          x: position.x,
          y: position.y,
          count: 0,
        });
      }

      const current = cityMap.get(event.city);
      current.count += 1;
      cityMap.set(event.city, current);
    });

    return Array.from(cityMap.values()).map((dot) => ({
      ...dot,
      r: Math.min(8, 4 + dot.count),
    }));
  }, [seasonEvents]);

  const seasonDotLabels = useMemo(() => {
    const minY = 24;
    const maxY = 476;
    const minGap = 26; // Increased from 18 to account for text height (10.5px font + padding)

    const spreadY = (list) => {
      if (list.length === 0) return [];

      const sorted = [...list].sort((a, b) => a.y - b.y);
      const forward = [];

      for (let index = 0; index < sorted.length; index += 1) {
        const current = sorted[index];
        const previousY = index === 0 ? minY : forward[index - 1].labelY + minGap;
        const labelY = Math.max(current.y, previousY);
        forward.push({ ...current, labelY });
      }

      if (forward[forward.length - 1].labelY > maxY) {
        forward[forward.length - 1].labelY = maxY;
        for (let index = forward.length - 2; index >= 0; index -= 1) {
          forward[index].labelY = Math.min(forward[index].labelY, forward[index + 1].labelY - minGap);
        }
      }

      return forward;
    };

    const left = seasonDots.filter((dot) => dot.x < 250).map((dot) => ({ ...dot, side: 'left' }));
    const right = seasonDots.filter((dot) => dot.x >= 250).map((dot) => ({ ...dot, side: 'right' }));

    return [...spreadY(left), ...spreadY(right)];
  }, [seasonDots]);

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
        <div className="max-w-4xl mx-auto glass rounded-3xl p-6 md:p-10 flex items-stretch">
          {/* Map visual - Full Width */}
          <div className="w-full min-h-[450px] bg-white/[0.03] rounded-2xl border border-white/8 relative overflow-hidden flex items-center justify-center p-4">
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

                {/* Season-specific city dots */}
                {seasonDotLabels.map((dot, i) => {
                  const dotColor = seasonColors[activeSeason];
                  const isRight = dot.side === 'right';
                  const elbowX = isRight ? dot.x + 14 : dot.x - 14;
                  const textX = isRight ? 398 : 102;
                  const lineEndX = isRight ? textX - 6 : textX + 6;
                  return (
                    <g
                      key={dot.city}
                      onClick={() => {
                        const params = new URLSearchParams();
                        params.set('lat', String(dot.latitude));
                        params.set('lng', String(dot.longitude));
                        params.set('city', dot.city);
                        params.set('season', activeSeason);
                        navigate(`/results?${params.toString()}`);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <path
                        d={`M ${dot.x} ${dot.y} L ${elbowX} ${dot.labelY} L ${lineEndX} ${dot.labelY}`}
                        stroke={`${dotColor}80`}
                        strokeWidth="1.4"
                        fill="none"
                        strokeLinecap="round"
                      />

                      <motion.circle
                        cx={dot.x}
                        cy={dot.y}
                        r={dot.r * 2.5}
                        fill="none"
                        stroke={`${dotColor}55`}
                        strokeWidth="1"
                        initial={{ r: dot.r, opacity: 0.7 }}
                        animate={{ r: dot.r * 3, opacity: 0 }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.12 }}
                      />

                      <motion.circle
                        cx={dot.x}
                        cy={dot.y}
                        r={dot.r}
                        fill={dotColor}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: 'spring', delay: i * 0.08 }}
                        style={{
                          filter: `drop-shadow(0 0 6px ${dotColor}88)`,
                        }}
                      />

                      <circle
                        cx={dot.x}
                        cy={dot.y}
                        r={12}
                        fill="transparent"
                      />

                      <text
                        x={textX}
                        y={dot.labelY}
                        dy="0.35em"
                        textAnchor={isRight ? 'start' : 'end'}
                        fill={dotColor}
                        stroke="rgba(10,22,40,0.85)"
                        strokeWidth="0.8"
                        paintOrder="stroke"
                        fontSize="10.5"
                        fontWeight="600"
                        fontFamily="Inter, sans-serif"
                        pointerEvents="none"
                      >
                        {dot.city}
                      </text>
                    </g>
                  );
                })}
              </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
