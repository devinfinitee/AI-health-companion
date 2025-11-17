/**
 * SPEECH UTILITIES
 * Text-to-Speech (TTS) and Speech-to-Text (STT) functionality
 * Uses Web Speech API (built into modern browsers)
 */

import { Language } from "@/contexts/LanguageContext";

/**
 * Language code mapping for speech recognition
 * Maps our language codes to browser speech recognition codes
 */
const SPEECH_LANG_CODES: Record<Language, string> = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  ar: "ar-SA",
  zh: "zh-CN",
  hi: "hi-IN",
  pt: "pt-BR",
  yo: "yo-NG", // Yoruba (Nigeria)
  ig: "ig-NG", // Igbo (Nigeria)
  ha: "ha-NG", // Hausa (Nigeria)
};

/**
 * TEXT-TO-SPEECH (TTS) CLASS
 * Converts text to speech using Web Speech API
 */
export class TextToSpeech {
  private synth: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    // Check if browser supports speech synthesis
    if (!("speechSynthesis" in window)) {
      console.warn("Text-to-Speech not supported in this browser");
    }
    this.synth = window.speechSynthesis;
  }

  /**
   * Speak the given text in the specified language
   * @param text - Text to speak
   * @param language - Language code
   * @param options - Optional settings (rate, pitch, volume)
   */
  speak(
    text: string,
    language: Language = "en",
    options: {
      rate?: number; // Speed: 0.1 to 10 (default: 1)
      pitch?: number; // Pitch: 0 to 2 (default: 1)
      volume?: number; // Volume: 0 to 1 (default: 1)
      onEnd?: () => void;
      onError?: (error: any) => void;
    } = {}
  ) {
    // Cancel any ongoing speech
    this.stop();

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language
    utterance.lang = SPEECH_LANG_CODES[language];
    
    // Set options with defaults
    utterance.rate = options.rate ?? 0.9; // Slightly slower for clarity
    utterance.pitch = options.pitch ?? 1;
    utterance.volume = options.volume ?? 1;

    // Set callbacks
    if (options.onEnd) {
      utterance.onend = options.onEnd;
    }
    if (options.onError) {
      utterance.onerror = options.onError;
    }

    // Try to get a voice that matches the language
    const voices = this.synth.getVoices();
    const matchingVoice = voices.find(
      (voice) => voice.lang.startsWith(SPEECH_LANG_CODES[language].split("-")[0])
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    // Store current utterance
    this.currentUtterance = utterance;

    // Speak
    this.synth.speak(utterance);
  }

  /**
   * Stop current speech
   */
  stop() {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }

  /**
   * Pause current speech
   */
  pause() {
    if (this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  /**
   * Resume paused speech
   */
  resume() {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }

  /**
   * Check if currently speaking
   */
  isSpeaking(): boolean {
    return this.synth.speaking;
  }

  /**
   * Get available voices for a language
   */
  getVoices(language?: Language): SpeechSynthesisVoice[] {
    const voices = this.synth.getVoices();
    if (language) {
      const langCode = SPEECH_LANG_CODES[language].split("-")[0];
      return voices.filter((voice) => voice.lang.startsWith(langCode));
    }
    return voices;
  }
}

/**
 * SPEECH-TO-TEXT (STT) CLASS
 * Converts speech to text using Web Speech API
 */
export class SpeechToText {
  private recognition: any; // SpeechRecognition type
  private isListening: boolean = false;

  constructor() {
    // Check if browser supports speech recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech-to-Text not supported in this browser");
      return;
    }

    // Create recognition instance
    this.recognition = new SpeechRecognition();
    
    // Configure recognition
    this.recognition.continuous = false; // Stop after one result
    this.recognition.interimResults = true; // Get interim results while speaking
    this.recognition.maxAlternatives = 1; // Number of alternative transcriptions
  }

  /**
   * Start listening for speech
   * @param language - Language to recognize
   * @param callbacks - Callback functions for results and errors
   */
  startListening(
    language: Language = "en",
    callbacks: {
      onResult?: (transcript: string, isFinal: boolean) => void;
      onEnd?: () => void;
      onError?: (error: any) => void;
    } = {}
  ) {
    if (!this.recognition) {
      callbacks.onError?.({ message: "Speech recognition not supported" });
      return;
    }

    // Set language
    this.recognition.lang = SPEECH_LANG_CODES[language];

    // Set up event handlers
    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      const isFinal = result.isFinal;

      callbacks.onResult?.(transcript, isFinal);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      callbacks.onEnd?.();
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      callbacks.onError?.(event);
    };

    // Start recognition
    try {
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      callbacks.onError?.(error);
    }
  }

  /**
   * Stop listening
   */
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Check if currently listening
   */
  isActive(): boolean {
    return this.isListening;
  }
}

/**
 * Create singleton instances for easy use throughout the app
 */
export const tts = new TextToSpeech();
export const stt = new SpeechToText();

/**
 * Utility function to speak text with current language
 * @param text - Text to speak
 * @param language - Language code
 */
export const speak = (text: string, language: Language = "en") => {
  tts.speak(text, language);
};

/**
 * Utility function to stop speaking
 */
export const stopSpeaking = () => {
  tts.stop();
};
