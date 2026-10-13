/**
 * Tek, oturum boyunca yeniden kullanılan AudioContext (bkz. docs/technical-plan.md §4).
 * iPad Safari'de ses yalnızca bir kullanıcı jesti İÇİNDE başlatılabilir; bu nedenle
 * `unlock()` SADECE bir dokunma event handler'ının senkron çağrı zinciri içinde çağrılmalı.
 */
class AudioManager {
  private context: AudioContext | null = null;
  private buffers = new Map<string, AudioBuffer>();

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
      const response = await fetch(`/audio/${path}`);
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

  /** Buffer yüklenmemişse sessizce hiçbir şey yapmaz. */
  play(path: string): void {
    if (!this.context) return;
    const buffer = this.buffers.get(path);
    if (!buffer) {
      console.warn(`[audio] henüz yüklenmemiş, çalınamadı: ${path}`);
      return;
    }
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.context.destination);
    source.start(0);
  }
}

export const audioManager = new AudioManager();
