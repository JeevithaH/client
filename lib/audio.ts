/**
 * Synthesize an elegant, warm luxury confirmation chime using the Web Audio API.
 * Emits a resonant multi-tone chord reminiscent of a premium boutique cash register/chime.
 */
export function playPaymentSuccessSound() {
  if (typeof window === 'undefined') return;

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    // Notes of a luxurious ascending major 9th chord: F5, A5, C6, E6, G6
    const notes = [
      { freq: 698.46, delay: 0, duration: 1.2, gain: 0.15 },
      { freq: 880.00, delay: 0.08, duration: 1.4, gain: 0.2 },
      { freq: 1046.50, delay: 0.16, duration: 1.6, gain: 0.22 },
      { freq: 1318.51, delay: 0.24, duration: 1.8, gain: 0.18 },
      { freq: 1567.98, delay: 0.32, duration: 2.0, gain: 0.12 },
    ];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.8, ctx.currentTime);
    masterGain.connect(ctx.destination);

    notes.forEach(({ freq, delay, duration, gain }) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      // Sine wave with slight triangle warmth
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

      const startTime = ctx.currentTime + delay;
      oscGain.gain.setValueAtTime(0.0001, startTime);
      oscGain.gain.exponentialRampToValueAtTime(gain, startTime + 0.04);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(oscGain);
      oscGain.connect(masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });

    // Clean up audio context after completion
    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 2500);
  } catch (err) {
    console.warn('Web Audio API chime could not play:', err);
  }
}
