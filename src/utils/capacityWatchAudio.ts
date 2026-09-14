/**
 * Capacity Watch Audio Notification Engine
 * Uses Web Audio API to produce a gentle alert chime when critical threshold is exceeded.
 */

export function playCapacityAlertChime(severity: "WARNING" | "CRITICAL" = "CRITICAL") {
  if (typeof window === "undefined") return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (severity === "CRITICAL") {
      // Urgent double tone (E5 -> A5)
      osc.type = "sine";
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.setValueAtTime(880.0, now + 0.12); // A5

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);

      // Second soft pulse
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(880.0, now + 0.22);
      osc2.frequency.setValueAtTime(1046.5, now + 0.34); // C6

      gain2.gain.setValueAtTime(0.09, now + 0.22);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.22);
      osc2.stop(now + 0.55);
    } else {
      // Gentle warning chime (A4 -> C#5)
      osc.type = "sine";
      osc.frequency.setValueAtTime(440.0, now);
      osc.frequency.exponentialRampToValueAtTime(554.37, now + 0.2);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  } catch {
    // Browsers may block audio before user gesture; gracefully ignore
  }
}
