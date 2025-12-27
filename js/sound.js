// Sound Manager using Web Audio API for retro sound effects
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.masterVolume = CONFIG.SOUND.MASTER_VOLUME;
        this.enabled = true;
        this.init();
    }

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported', e);
            this.enabled = false;
        }
    }

    playShoot() {
        if (!this.enabled) return;

        const now = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(400, now);
        oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.1);

        gainNode.gain.setValueAtTime(this.masterVolume * 0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        oscillator.start(now);
        oscillator.stop(now + 0.1);
    }

    playJump() {
        if (!this.enabled) return;

        const now = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(300, now);
        oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.15);

        gainNode.gain.setValueAtTime(this.masterVolume * 0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        oscillator.start(now);
        oscillator.stop(now + 0.15);
    }

    playEnemyDeath() {
        if (!this.enabled) return;

        const now = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(400, now);
        oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.3);

        gainNode.gain.setValueAtTime(this.masterVolume * 0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        oscillator.start(now);
        oscillator.stop(now + 0.3);
    }

    playPowerUp() {
        if (!this.enabled) return;

        const now = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, now);
        oscillator.frequency.setValueAtTime(500, now + 0.05);
        oscillator.frequency.setValueAtTime(600, now + 0.1);
        oscillator.frequency.setValueAtTime(800, now + 0.15);

        gainNode.gain.setValueAtTime(this.masterVolume * 0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        oscillator.start(now);
        oscillator.stop(now + 0.2);
    }

    playHit() {
        if (!this.enabled) return;

        const now = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(100, now);

        gainNode.gain.setValueAtTime(this.masterVolume * 0.4, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        oscillator.start(now);
        oscillator.stop(now + 0.1);
    }

    playLevelComplete() {
        if (!this.enabled) return;

        const now = this.audioContext.currentTime;
        const notes = [523, 659, 784, 1047]; // C, E, G, C (one octave higher)

        notes.forEach((frequency, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(frequency, now + index * 0.1);

            gainNode.gain.setValueAtTime(this.masterVolume * 0.2, now + index * 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + index * 0.1 + 0.15);

            oscillator.start(now + index * 0.1);
            oscillator.stop(now + index * 0.1 + 0.15);
        });
    }

    playGameOver() {
        if (!this.enabled) return;

        const now = this.audioContext.currentTime;
        const notes = [523, 494, 440, 392]; // C, B, A, G (descending)

        notes.forEach((frequency, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(frequency, now + index * 0.15);

            gainNode.gain.setValueAtTime(this.masterVolume * 0.2, now + index * 0.15);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + index * 0.15 + 0.2);

            oscillator.start(now + index * 0.15);
            oscillator.stop(now + index * 0.15 + 0.2);
        });
    }

    setVolume(volume) {
        this.masterVolume = clamp(volume, 0, 1);
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}
