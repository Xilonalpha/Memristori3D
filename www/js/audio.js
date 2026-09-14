// ===================== AUDIO SINTETIZAT (WebAudio) =====================
const AudioSys = (function () {
  let ctx = null;
  let enabled = true;

  function ensureCtx() {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) { ctx = null; }
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, dur, type, vol, sweepTo) {
    if (!enabled) return;
    const ac = ensureCtx();
    if (!ac) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, ac.currentTime);
    if (sweepTo) osc.frequency.exponentialRampToValueAtTime(sweepTo, ac.currentTime + dur);
    gain.gain.setValueAtTime(vol || 0.15, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
    osc.connect(gain).connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + dur);
  }

  function noise(dur, vol) {
    if (!enabled) return;
    const ac = ensureCtx();
    if (!ac) return;
    const bufferSize = ac.sampleRate * dur;
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    const src = ac.createBufferSource();
    src.buffer = buffer;
    const gain = ac.createGain();
    gain.gain.setValueAtTime(vol || 0.2, ac.currentTime);
    src.connect(gain).connect(ac.destination);
    src.start();
  }

  return {
    setEnabled(v) { enabled = v; },
    unlock() { ensureCtx(); },
    place() { tone(520, 0.12, 'square', 0.1, 780); },
    shoot() { tone(880, 0.05, 'sine', 0.06, 600); },
    hit() { tone(220, 0.08, 'triangle', 0.09, 120); },
    kill() { tone(340, 0.14, 'sawtooth', 0.1, 90); noise(0.06, 0.05); },
    emp() { tone(160, 0.25, 'sine', 0.12, 60); noise(0.15, 0.08); },
    waveStart() { tone(440, 0.15, 'sine', 0.1, 660); setTimeout(() => tone(660, 0.15, 'sine', 0.1, 880), 120); },
    waveClear() { tone(523, 0.1, 'sine', 0.12); setTimeout(() => tone(659, 0.1, 'sine', 0.12), 100); setTimeout(() => tone(784, 0.2, 'sine', 0.12), 200); },
    coreHit() { tone(90, 0.3, 'sawtooth', 0.15, 40); },
    gameOver() { tone(300, 0.4, 'sawtooth', 0.15, 60); },
    victory() {
      [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, 0.25, 'sine', 0.13), i * 140));
    },
    buttonClick() { tone(700, 0.04, 'square', 0.05, 900); },
    upgrade() { tone(500, 0.1, 'sine', 0.1, 900); setTimeout(() => tone(700, 0.1, 'sine', 0.1, 1100), 80); },
    error() { tone(180, 0.15, 'square', 0.08, 120); }
  };
})();
