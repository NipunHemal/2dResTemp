// soundController.ts
export function createBeep(customSoundUrl?: string) {
  let intervalId: number | null = null;
  let audioCtx: AudioContext | null = null;
  let oscillator: OscillatorNode | null = null;
  let gainNode: GainNode | null = null;
  let audioElement: HTMLAudioElement | null = null;

  const start = () => {
    if (customSoundUrl) {
      audioElement = new Audio(customSoundUrl);
      audioElement.loop = true; // loop the sound
      audioElement.play().catch(() => {});
      return;
    }

    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    oscillator = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 880; // A5
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    gainNode.gain.setValueAtTime(0.2, now);

    oscillator.start(now);

    // Optional: create a pulsing beep every 400ms
    intervalId = window.setInterval(() => {
      if (!gainNode) return;
      gainNode.gain.setValueAtTime(0.2, audioCtx!.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx!.currentTime + 0.35);
    }, 400);
  };

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (oscillator) {
      oscillator.stop();
      oscillator.disconnect();
      oscillator = null;
    }
    if (gainNode) {
      gainNode.disconnect();
      gainNode = null;
    }
    if (audioCtx) {
      try {
        audioCtx.close();
      } catch (e) {}
      audioCtx = null;
    }
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      audioElement = null;
    }
  };

  return { start, stop };
}
