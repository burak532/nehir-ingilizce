/**
 * Tek, oturum boyunca yeniden kullanılan AudioContext (bkz. docs/technical-plan.md §4).
 * iPad Safari'de ses yalnızca bir kullanıcı jesti İÇİNDE başlatılabilir; bu nedenle
 * `unlock()` SADECE bir dokunma event handler'ının senkron çağrı zinciri içinde çağrılmalı.
 */
/** Farklı TTS seslendirmeleri ve oynatma günleri arasında ses seviyesi kaydırağı
 *  fark edilir biçimde değişiyordu (bkz. kullanıcı geri bildirimi). Her klip bu
 *  referans RMS'e normalize edilerek çalınır. */
const TARGET_RMS = 0.1;
const MIN_GAIN = 0.4;
const MAX_GAIN = 3;

function computeNormalizationGain(buffer: AudioBuffer): number {
  let sumSquares = 0;
  let sampleCount = 0;
  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < data.length; i += 1) {
      sumSquares += data[i] * data[i];
      sampleCount += 1;
    }
  }
  if (sampleCount === 0) return 1;
  const rms = Math.sqrt(sumSquares / sampleCount);
  if (rms === 0) return 1;
  const gain = TARGET_RMS / rms;
  return Math.min(MAX_GAIN, Math.max(MIN_GAIN, gain));
}

class AudioManager {
  private context: AudioContext | null = null;
  private buffers = new Map<string, AudioBuffer>();
  private gains = new Map<string, number>();
  private currentSource: AudioBufferSourceNode | null = null;

  get isUnlocked(): boolean {
    return this.context !== null;
  }

  /** Bir kullanıcı dokunuşunun senkron zinciri içinden çağrılmalı. */
  unlock(): void {
    if (this.context) {
      if (this.context.state === "suspended") {
        void this.context.resume();
      }
      return;
    }
    const AudioContextCtor =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    this.context = new AudioContextCtor();
  }

  async resumeIfNeeded(): Promise<void> {
    if (this.context && this.context.state === "suspended") {
      await this.context.resume();
    }
  }

  async preload(paths: string[]): Promise<void> {
    if (!this.context) return;
    await Promise.all(paths.map((path) => this.loadBuffer(path)));
  }

  private async loadBuffer(path: string): Promise<void> {
    if (!this.context || this.buffers.has(path)) return;
    try {
      // BASE_URL: GitHub Pages alt-yol dağıtımında sesler köke değil doğru alt-yola göre çözülsün.
      const response = await fetch(`${import.meta.env.BASE_URL}audio/${path}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      this.buffers.set(path, audioBuffer);
      this.gains.set(path, computeNormalizationGain(audioBuffer));
    } catch (error) {
      // Ses üretim hattı tamamlanana kadar (Aşama 5) dosyalar eksik olabilir —
      // bu durumda sessizce atla, uygulamayı kırma.
      console.warn(`[audio] önbelleğe alınamadı: ${path}`, error);
    }
  }

  /**
   * Buffer yüklenmemişse sessizce hiçbir şey yapmaz. Aynı anda tek ses çalsın diye
   * önceki sesi (varsa) keser — sesler üst üste binmesin (bkz. kullanıcı geri bildirimi).
   *
   * Dönen Promise, ses doğal olarak bitince (veya bir sonraki play() tarafından
   * kesilince) resolve olur — çağıranlar "bu ses bitince diğerini çal" diye
   * SIRALI oynatma yapabilsin diye (sabit setTimeout gecikmesi tahminiyle değil).
   */
  play(path: string): Promise<void> {
    if (!this.context) return Promise.resolve();
    const buffer = this.buffers.get(path);
    if (!buffer) {
      console.warn(`[audio] henüz yüklenmemiş, çalınamadı: ${path}`);
      return Promise.resolve();
    }

    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch {
        // Zaten durmuşsa stop() hata atar — görmezden gel.
      }
      this.currentSource = null;
    }

    const context = this.context;
    const gainValue = this.gains.get(path) ?? 1;
    return new Promise((resolve) => {
      const source = context.createBufferSource();
      source.buffer = buffer;
      const gainNode = context.createGain();
      gainNode.gain.value = gainValue;
      source.connect(gainNode);
      gainNode.connect(context.destination);
      source.onended = () => {
        if (this.currentSource === source) this.currentSource = null;
        resolve();
      };
      source.start(0);
      this.currentSource = source;
    });
  }

  private playTone(freq: number, startTime: number, duration: number, peakGain: number): void {
    if (!this.context) return;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.connect(gain);
    gain.connect(this.context.destination);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  /** Ücretsiz, sentezlenmiş "doğru cevap" zili — kısa, neşeli, yükselen iki ton. */
  playSuccessChime(): void {
    if (!this.context) return;
    const now = this.context.currentTime;
    this.playTone(523.25, now, 0.18, 0.2); // C5
    this.playTone(659.25, now + 0.12, 0.22, 0.22); // E5
  }

  /** Ücretsiz, sentezlenmiş "tekrar bakalım" tonu — yumuşak, cezalandırıcı olmayan, alçalan. */
  playGentleRetryTone(): void {
    if (!this.context) return;
    const now = this.context.currentTime;
    this.playTone(349.23, now, 0.22, 0.12); // F4
    this.playTone(293.66, now + 0.16, 0.26, 0.12); // D4
  }
}

export const audioManager = new AudioManager();
