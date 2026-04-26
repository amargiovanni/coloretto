// Italian TTS + simple sound effects for kids' games.
// Uses Web Speech API for voice and Web Audio API for sound effects.
// All functions are no-ops when the APIs are unavailable (older browsers, SSR).

let italianVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

function pickItalianVoice(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return;
    voicesLoaded = true;
    // Prefer female Italian voices when available — kids respond better.
    const italianVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('it'));
    italianVoice =
        italianVoices.find((v) => /female|donna|alice|elsa|paola|federica/i.test(v.name)) ||
        italianVoices.find((v) => v.lang === 'it-IT') ||
        italianVoices[0] ||
        null;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    pickItalianVoice();
    window.speechSynthesis.addEventListener('voiceschanged', pickItalianVoice);
}

export interface SpeakOptions {
    rate?: number;
    pitch?: number;
    interrupt?: boolean;
}

export function speak(text: string, opts: SpeakOptions = {}): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (!voicesLoaded) pickItalianVoice();
    if (opts.interrupt !== false) window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'it-IT';
    if (italianVoice) u.voice = italianVoice;
    u.rate = opts.rate ?? 0.95;
    u.pitch = opts.pitch ?? 1.2;
    u.volume = 1;
    window.speechSynthesis.speak(u);
}

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!audioCtx) {
        const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return null;
        audioCtx = new Ctor();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
}

export function playPop(freq: number = 700): void {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(80, freq * 0.4), t + 0.15);
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.22);
}

export function playSuccess(): void {
    const ctx = getCtx();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    notes.forEach((freq, i) => {
        const t = ctx.currentTime + i * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.32);
    });
}

export function playWrong(): void {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.18);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.22);
}
