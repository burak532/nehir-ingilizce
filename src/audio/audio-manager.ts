/**
 * Tek, oturum boyunca yeniden kullanılan AudioContext (bkz. docs/technical-plan.md §4).
 * iPad Safari'de ses yalnızca bir kullanıcı jesti İÇİNDE başlatılabilir; bu nedenle
 * `unlock()` SADECE bir dokunma event handler'ının senkron çağrı zinciri içinde çağrılmalı.
 */
class AudioManager {
  private context: AudioContext | null = null;
  private buffers = new Map<string, AudioBuffer>();
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
    return new Promise((resolve) => {
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
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
