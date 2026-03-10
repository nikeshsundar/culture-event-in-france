import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, X, Play, Pause, SkipForward, Volume2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const tracks = [
  { id: 1, name: 'Parisian Accordion', region: 'Île-de-France', emoji: '🗼', color: '#C9A84C', type: 'accordion' },
  { id: 2, name: 'Provençal Cicadas', region: 'Provence', emoji: '🌿', color: '#E07A5F', type: 'cicadas' },
  { id: 3, name: 'Breton Sea Waves', region: 'Bretagne', emoji: '🌊', color: '#7EC8E3', type: 'waves' },
  { id: 4, name: 'Loire Valley Flute', region: 'Loire', emoji: '🏰', color: '#D4A8E0', type: 'flute' },
  { id: 5, name: 'Alpine Bells', region: 'Alps', emoji: '🏔️', color: '#90BE6D', type: 'bells' },
];

// Generate ambient sounds using Web Audio API
function createAmbientSound(audioCtx, type) {
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.15;

  if (type === 'accordion') {
    // Warm sustained chord
    const freqs = [261.63, 329.63, 392.0, 523.25];
    freqs.forEach((freq) => {
      const osc = audioCtx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const g = audioCtx.createGain();
      g.gain.value = 0.04;
      // Gentle vibrato
      const lfo = audioCtx.createOscillator();
      lfo.frequency.value = 4 + Math.random() * 2;
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.value = 3;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();
      osc.connect(g);
      g.connect(gainNode);
      osc.start();
    });
  } else if (type === 'cicadas') {
    // High-pitched buzzing
    for (let i = 0; i < 3; i++) {
      const osc = audioCtx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = 3800 + Math.random() * 1200;
      const g = audioCtx.createGain();
      g.gain.value = 0.008;
      const lfo = audioCtx.createOscillator();
      lfo.frequency.value = 8 + Math.random() * 6;
      const lfoG = audioCtx.createGain();
      lfoG.gain.value = 0.01;
      lfo.connect(lfoG);
      lfoG.connect(g.gain);
      lfo.start();
      osc.connect(g);
      g.connect(gainNode);
      osc.start();
    }
  } else if (type === 'waves') {
    // Ocean-like noise with LFO
    const bufferSize = audioCtx.sampleRate * 2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 600;
    const lfo = audioCtx.createOscillator();
    lfo.frequency.value = 0.12;
    const lfoG = audioCtx.createGain();
    lfoG.gain.value = 400;
    lfo.connect(lfoG);
    lfoG.connect(filter.frequency);
    lfo.start();
    noise.connect(filter);
    filter.connect(gainNode);
    noise.start();
  } else if (type === 'flute') {
    // Gentle sine melody
    const freqs = [523.25, 587.33, 659.25, 587.33, 523.25, 493.88, 523.25];
    freqs.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const g = audioCtx.createGain();
      g.gain.value = 0;
      // Fade in/out for each note
      const t = audioCtx.currentTime + i * 1.2;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.05, t + 0.15);
      g.gain.linearRampToValueAtTime(0.03, t + 0.9);
      g.gain.linearRampToValueAtTime(0, t + 1.15);
      osc.connect(g);
      g.connect(gainNode);
      osc.start(t);
      osc.stop(t + 1.2);
    });
    // Schedule repeating by reconnecting (handled by loop logic)
  } else if (type === 'bells') {
    // Bell-like harmonics
    const bellFreqs = [830, 1245, 1660, 2075];
    bellFreqs.forEach((freq) => {
      const osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const g = audioCtx.createGain();
      g.gain.value = 0.02;
      const lfo = audioCtx.createOscillator();
      lfo.frequency.value = 0.3;
      const lfoG = audioCtx.createGain();
      lfoG.gain.value = 0.025;
      lfo.connect(lfoG);
      lfoG.connect(g.gain);
      lfo.start();
      osc.connect(g);
      g.connect(gainNode);
      osc.start();
    });
  }

  return gainNode;
}

export default function SoundtrackPlayer() {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const masterGainRef = useRef(null);

  const track = tracks[current];

  const stopSound = useCallback(() => {
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
      gainNodeRef.current = null;
    }
  }, []);

  const startSound = useCallback((trackIndex) => {
    stopSound();
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = ctx;
    const master = ctx.createGain();
    master.gain.value = volume;
    master.connect(ctx.destination);
    masterGainRef.current = master;
    const node = createAmbientSound(ctx, tracks[trackIndex].type);
    node.connect(master);
    gainNodeRef.current = node;
  }, [volume, stopSound]);

  const togglePlay = useCallback(() => {
    if (playing) {
      stopSound();
      setPlaying(false);
    } else {
      startSound(current);
      setPlaying(true);
    }
  }, [playing, current, startSound, stopSound]);

  const nextTrack = useCallback(() => {
    const next = (current + 1) % tracks.length;
    setCurrent(next);
    if (playing) {
      startSound(next);
    }
  }, [current, playing, startSound]);

  const selectTrack = useCallback((i) => {
    setCurrent(i);
    startSound(i);
    setPlaying(true);
  }, [startSound]);

  // Update volume live
  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = volume;
    }
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => () => stopSound(), [stopSound]);

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-gold/30 ${
          playing ? 'gold-gradient' : isDark ? 'bg-navy border border-gold/30' : 'bg-white border border-gold/30'
        }`}
      >
        {playing ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <Music size={22} className="text-navy" />
          </motion.div>
        ) : (
          <Music size={22} className={isDark ? 'text-gold' : 'text-gold'} />
        )}
      </motion.button>

      {/* Player panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-24 left-6 z-50 w-72 rounded-2xl p-5 shadow-2xl border ${
              isDark
                ? 'bg-navy/95 backdrop-blur-xl border-gold/20'
                : 'bg-white/95 backdrop-blur-xl border-gold/20'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs font-bold tracking-[0.1em] uppercase ${isDark ? 'text-gold' : 'text-gold-dark'}`}>
                🎵 Ambient Soundtrack
              </span>
              <button onClick={() => setOpen(false)}>
                <X size={16} className={isDark ? 'text-white/40' : 'text-gray-400'} />
              </button>
            </div>

            {/* Current track */}
            <div className={`rounded-xl p-4 mb-4 ${isDark ? 'bg-white/5' : 'bg-cream'}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{track.emoji}</span>
                <div>
                  <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-navy'}`}>{track.name}</p>
                  <p className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{track.region}</p>
                </div>
              </div>

              {/* Fake waveform */}
              <div className="flex items-end gap-[3px] h-8 mb-3">
                {Array.from({ length: 24 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={playing ? { height: [4, Math.random() * 28 + 4, 4] } : { height: 4 }}
                    transition={playing ? { duration: 0.5 + Math.random() * 0.5, repeat: Infinity, delay: i * 0.04 } : {}}
                    className="flex-1 rounded-full"
                    style={{ background: track.color, minHeight: 4 }}
                  />
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center hover:scale-110 transition-transform"
                >
                  {playing ? <Pause size={18} className="text-navy" /> : <Play size={18} className="text-navy ml-0.5" />}
                </button>
                <button
                  onClick={nextTrack}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-white/10 text-white/60' : 'bg-cream-dark text-gray-500'
                  } hover:text-gold transition-colors`}
                >
                  <SkipForward size={16} />
                </button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-2 mt-3">
                <Volume2 size={14} className={isDark ? 'text-white/30' : 'text-gray-300'} />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1 h-1 accent-gold rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #C9A84C ${volume * 100}%, ${isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'} ${volume * 100}%)` }}
                />
              </div>
            </div>

            {/* Track list */}
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {tracks.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => selectTrack(i)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                    i === current
                      ? isDark ? 'bg-gold/10 text-gold' : 'bg-gold/10 text-gold-dark'
                      : isDark ? 'text-white/50 hover:bg-white/5' : 'text-gray-500 hover:bg-cream'
                  }`}
                >
                  <span className="text-sm">{t.emoji}</span>
                  <span className="text-xs font-medium">{t.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
