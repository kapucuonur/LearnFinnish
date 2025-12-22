// Audio Service - Text-to-Speech using Web Speech API

class AudioService {
    constructor() {
        this.synth = window.speechSynthesis;
        this.currentUtterance = null;
        this.isPaused = false;
        this.currentRate = 1.0;
        this.voices = [];

        // Load voices
        this.loadVoices();

        // Reload voices when they change (some browsers load async)
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => this.loadVoices();
        }
    }

    loadVoices() {
        this.voices = this.synth.getVoices();
    }

    // Get Finnish voice (prefer native Finnish voice)
    getFinnishVoice() {
        // Try to find a Finnish voice
        let finnishVoice = this.voices.find(voice => voice.lang.startsWith('fi'));

        // Fallback to any voice if Finnish not available
        if (!finnishVoice && this.voices.length > 0) {
            finnishVoice = this.voices[0];
        }

        return finnishVoice;
    }

    // Speak Finnish text
    speak(text, options = {}) {
        // Stop any ongoing speech
        this.stop();

        const utterance = new SpeechSynthesisUtterance(text);

        // Set language to Finnish
        utterance.lang = 'fi-FI';

        // Set voice
        const voice = this.getFinnishVoice();
        if (voice) {
            utterance.voice = voice;
        }

        // Set rate (speed)
        utterance.rate = options.rate || this.currentRate;

        // Set pitch
        utterance.pitch = options.pitch || 1.0;

        // Set volume
        utterance.volume = options.volume || 1.0;

        // Callbacks
        if (options.onStart) {
            utterance.onstart = options.onStart;
        }

        if (options.onEnd) {
            utterance.onend = options.onEnd;
        }

        if (options.onError) {
            utterance.onerror = options.onError;
        }

        this.currentUtterance = utterance;
        this.synth.speak(utterance);
        this.isPaused = false;
    }

    // Pause speech
    pause() {
        if (this.synth.speaking && !this.isPaused) {
            this.synth.pause();
            this.isPaused = true;
        }
    }

    // Resume speech
    resume() {
        if (this.isPaused) {
            this.synth.resume();
            this.isPaused = false;
        }
    }

    // Stop speech
    stop() {
        this.synth.cancel();
        this.currentUtterance = null;
        this.isPaused = false;
    }

    // Check if speaking
    isSpeaking() {
        return this.synth.speaking;
    }

    // Set speech rate
    setRate(rate) {
        this.currentRate = rate;
    }

    // Get available rates
    getRates() {
        return [
            { value: 0.5, label: '0.5x' },
            { value: 0.75, label: '0.75x' },
            { value: 1.0, label: '1x' },
            { value: 1.25, label: '1.25x' },
            { value: 1.5, label: '1.5x' },
            { value: 2.0, label: '2x' }
        ];
    }
}

// Create singleton instance
const audioService = new AudioService();

// Export functions
export function speakFinnish(text, options = {}) {
    return audioService.speak(text, options);
}

export function pauseSpeech() {
    return audioService.pause();
}

export function resumeSpeech() {
    return audioService.resume();
}

export function stopSpeech() {
    return audioService.stop();
}

export function isSpeaking() {
    return audioService.isSpeaking();
}

export function setRate(rate) {
    return audioService.setRate(rate);
}

export function getRates() {
    return audioService.getRates();
}

export function getFinnishVoice() {
    return audioService.getFinnishVoice();
}
