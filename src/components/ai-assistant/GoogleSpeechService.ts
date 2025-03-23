// GoogleSpeechService.ts - Service for handling Google Cloud Speech-to-Text functionality

interface GoogleSpeechServiceConfig {
  keyFilePath: string;
}

class GoogleSpeechService {
  private isInitialized = false;
  private keyFilePath: string | null = null;
  private isSpeaking = false;
  private speakingAudio: HTMLAudioElement | null = null;
  private backendUrl: string;
  private useFallbackOnly = false; // Default to use Google TTS, only fallback if needed
  private apiEnabled = true; // Assume API is enabled until proven otherwise

  constructor() {
    // Get port from environment variable or use default 3002
    const port = import.meta.env.VITE_TTS_SERVER_PORT || 3002;
    this.backendUrl = `http://localhost:${port}`;
    console.log(`TTS server URL configured as: ${this.backendUrl}`);
  }

  initialize(keyFilePath: string) {
    this.keyFilePath = keyFilePath;
    this.isInitialized = true;
    console.log('Google Speech-to-Text API configured with key file path');
    
    // Test the TTS server connection
    this.testServerConnection();
    
    return true;
  }
  
  // Test the TTS server connection
  async testServerConnection() {
    try {
      const testResponse = await fetch(`${this.backendUrl}/api/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      
      if (testResponse.ok) {
        const data = await testResponse.json();
        this.apiEnabled = data.apiEnabled;
        console.log(`TTS server connection test successful. API enabled: ${this.apiEnabled}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('TTS server connection test failed:', error);
      return false;
    }
  }

  isApiInitialized() {
    return this.isInitialized;
  }

  async transcribeAudio(audioBuffer: ArrayBuffer, language: string = 'en'): Promise<string> {
    console.log(`transcribeAudio called with buffer size: ${audioBuffer.byteLength}, language: ${language}`);
    
    // In a real implementation, this would call the Google Cloud Speech-to-Text API
    // through a backend proxy for security reasons
    
    // For development/demo, we're just simulating the API call
    console.log('Processing audio data of size:', audioBuffer.byteLength);
    
    try {
      // Since we're getting actual audio data, let's provide a good mock response
      // In production, you would send this to a backend that has the Google credentials
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Always return a useful response since we have real audio data
      // In a real implementation, this would be the actual transcription from Google Cloud
      
      // Different responses based on language
      const mockResponses: Record<string, string[]> = {
        en: [
          "I've been having headaches for the past week.",
          "What foods should I avoid with my diabetes?",
          "How often should I check my blood pressure?",
          "I'm feeling dizzy when I stand up too quickly.",
          "Should I be worried about my blood sugar readings?",
        ],
        es: [
          "He tenido dolores de cabeza durante la última semana.",
          "¿Qué alimentos debo evitar con mi diabetes?",
          "¿Con qué frecuencia debo controlar mi presión arterial?",
          "Me siento mareado cuando me levanto demasiado rápido.",
          "¿Debería preocuparme por mis lecturas de azúcar en sangre?",
        ],
        fr: [
          "J'ai des maux de tête depuis une semaine.",
          "Quels aliments dois-je éviter avec mon diabète?",
          "À quelle fréquence dois-je vérifier ma tension artérielle?",
          "Je me sens étourdi quand je me lève trop vite.",
          "Devrais-je m'inquiéter de mes relevés de glycémie?",
        ]
      };
      
      // Get responses for the requested language or fall back to English
      const responses = mockResponses[language.slice(0, 2)] || mockResponses.en;
      
      // Return a random mock response
      const response = responses[Math.floor(Math.random() * responses.length)];
      console.log('Returning mock transcription:', response);
      return response;
    } catch (error) {
      // Even if there's an error, return a mock response so the UI flow continues
      console.error('Error in speech transcription, using fallback response:', error);
      return "I have a question about my health condition.";
    }
  }

  // Method to speak text using Google Cloud TTS API
  async speakText(text: string, voiceType: string = 'female', language: string = 'en'): Promise<void> {
    try {
      // Stop any ongoing speech
      this.stopSpeaking();
      
      // Validate voiceType to prevent "gender neutral voices not supported" error
      if (voiceType !== 'male' && voiceType !== 'female') {
        console.warn(`Invalid voice type "${voiceType}". Defaulting to "female".`);
        voiceType = 'female';
      }
      
      // If fallback only is set, skip Google TTS entirely
      if (this.useFallbackOnly) {
        console.log("Using browser speech synthesis (fallback mode enabled)");
        this.fallbackToLocalSpeech(text, voiceType, language);
        return;
      }
      
      console.log(`Using Google Cloud Text-to-Speech API in language: ${language} with ${voiceType} voice`);
      
      // First check if the server is accessible
      try {
        const testResponse = await fetch(`${this.backendUrl}/api/test`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors' // Explicitly request CORS mode
        });
        
        if (!testResponse.ok) {
          console.warn("TTS server test failed, falling back to browser speech");
          throw new Error("Server connection test failed");
        }
        
        console.log("TTS server connection verified");
      } catch (serverError) {
        console.error("Error connecting to TTS server:", serverError);
        // Fall back to browser's speech synthesis
        this.fallbackToLocalSpeech(text, voiceType, language);
        return;
      }
      
      // Make sure text is clean (no HTML)
      const cleanText = this.preprocessTextForBetterSpeech(text);
      
      // Set speaking status
      this.isSpeaking = true;
      
      // Call the backend API for speech synthesis
      const response = await fetch(`${this.backendUrl}/api/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: cleanText,
          voiceType: voiceType,
          language: language
        }),
        mode: 'cors' // Explicitly request CORS mode
      });
      
      // Check if the request was successful
      if (!response.ok) {
        const errorData = await response.json();
        console.error("TTS API error:", errorData);
        
        // Check if this is a permissions error (API not enabled)
        if (errorData.details && errorData.details.includes("PERMISSION_DENIED")) {
          console.warn("Google Cloud Text-to-Speech API not enabled. Enable it at https://console.developers.google.com/apis/api/texttospeech.googleapis.com/overview");
          // Set fallback mode automatically after encountering this error
          this.useFallbackOnly = true;
          this.apiEnabled = false;
        }
        
        throw new Error(`Failed to get speech: ${errorData.error}`);
      }
      
      // Get the audio URL from the response
      const data = await response.json();
      
      // Check if the response indicates fallback mode
      if (data.fallback) {
        console.log("Server responded with fallback mode. Using browser speech.");
        this.useFallbackOnly = true;
        this.apiEnabled = false;
        this.fallbackToLocalSpeech(text, voiceType, language);
        return;
      }
      
      // Ensure we have the correct URL format by properly joining paths
      // If the audioUrl starts with a slash, we need to remove it to avoid double slashes
      const audioPath = data.audioUrl.startsWith('/') ? data.audioUrl.substring(1) : data.audioUrl;
      const audioUrl = `${this.backendUrl}/${audioPath}`;
      
      console.log("Received audio URL:", audioUrl);
      
      // Create and play the audio
      const audio = new Audio(audioUrl);
      this.speakingAudio = audio;
      
      // Set up event handlers
      audio.onended = () => {
        this.isSpeaking = false;
        this.speakingAudio = null;
      };
      
      audio.onerror = (event) => {
        console.error("Error playing audio:", event);
        this.isSpeaking = false;
        this.speakingAudio = null;
        // Fall back to browser's speech synthesis in case of audio loading error
        this.fallbackToLocalSpeech(text, voiceType, language);
      };
      
      // Play the audio
      await audio.play();
      console.log("Started playing Google Cloud TTS audio");
      
    } catch (error) {
      console.error("Error using Google Cloud TTS:", error);
      this.isSpeaking = false;
      
      // Fall back to browser's speech synthesis
      console.log("Falling back to browser speech synthesis");
      this.fallbackToLocalSpeech(text, voiceType, language);
    }
  }
  
  // Toggle fallback mode on/off
  setUseFallbackOnly(useFallback: boolean): void {
    this.useFallbackOnly = useFallback;
    console.log(`Speech synthesis fallback mode ${useFallback ? 'enabled' : 'disabled'}`);
  }
  
  // Check if the API is enabled
  isApiEnabled(): boolean {
    return this.apiEnabled;
  }
  
  // Fallback method using browser's speech synthesis
  private fallbackToLocalSpeech(text: string, voiceType: string, language: string = 'en'): void {
    try {
      // Validate voiceType
      if (voiceType !== 'male' && voiceType !== 'female') {
        console.warn(`Invalid voice type "${voiceType}" for speech synthesis. Defaulting to "female".`);
        voiceType = 'female';
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set the language
      utterance.lang = language;
      
      // Get available voices
      const voices = window.speechSynthesis.getVoices();
      
      // Try to find a good voice for the selected language
      let selectedVoice = null;
      
      // First try to find a voice that matches both gender preference and language
      if (voiceType === 'female') {
        selectedVoice = voices.find(v => 
          v.name.includes('Female') && v.lang.startsWith(language)
        );
      } else if (voiceType === 'male') {
        selectedVoice = voices.find(v => 
          v.name.includes('Male') && v.lang.startsWith(language)
        );
      }
      
      // If no matching gender+language voice found, try just language match
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith(language));
      }
      
      // If still no match, fall back to any gender preference in English
      if (!selectedVoice) {
        if (voiceType === 'female') {
          selectedVoice = voices.find(v => 
            v.name.includes('Female') && v.lang.startsWith('en')
          );
        } else if (voiceType === 'male') {
          selectedVoice = voices.find(v => 
            v.name.includes('Male') && v.lang.startsWith('en')
          );
        }
      }
      
      // Last resort - any English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith('en'));
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      // Set voice properties
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Speak
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Fallback speech synthesis failed:", e);
    }
  }
  
  // Method to check if speaking
  isCurrentlySpeaking(): boolean {
    return this.isSpeaking;
  }
  
  // Method to stop speaking
  stopSpeaking(): void {
    if (this.isSpeaking) {
      // Stop the audio if it's playing
      if (this.speakingAudio) {
        this.speakingAudio.pause();
        this.speakingAudio.currentTime = 0;
        this.speakingAudio = null;
      }
      
      // Also stop any browser speech synthesis just in case
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      
      this.isSpeaking = false;
      console.log("Stopped speaking");
    }
  }
  
  // Preprocess text to improve speech quality
  private preprocessTextForBetterSpeech(text: string): string {
    // Remove HTML tags
    text = text.replace(/<[^>]*>/g, '');
    
    // Remove markdown formatting characters
    // Remove ** ** bold formatting
    text = text.replace(/\*\*(.*?)\*\*/g, '$1');
    
    // Remove * for bullet points (preserve the content)
    text = text.replace(/^\s*\*\s+/gm, '• ');
    
    // Remove any remaining asterisks
    text = text.replace(/\*/g, '');
    
    // Remove other markdown formatting if present
    text = text.replace(/\_\_|\_{1,2}|\#{1,6}\s|\`{1,3}/g, '');
    
    // Add pauses after punctuation
    text = text.replace(/([.!?])\s/g, '$1, ');
    
    // Improve pronunciation of common medical terms
    const medicalTerms: Record<string, string> = {
      'mg': 'milligrams',
      'mcg': 'micrograms',
      'mmHg': 'millimeters of mercury',
      'BP': 'blood pressure',
      'HR': 'heart rate',
      'BG': 'blood glucose',
      'T2DM': 'type 2 diabetes',
      'HTN': 'hypertension'
    };
    
    // Replace medical abbreviations with full terms
    Object.entries(medicalTerms).forEach(([abbr, full]) => {
      const regex = new RegExp(`\\b${abbr}\\b`, 'g');
      text = text.replace(regex, full);
    });
    
    return text;
  }
  
  // Helper function to split text into smaller chunks for more reliable speech
  private chunkText(text: string): string[] {
    // Split text at sentence boundaries
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks: string[] = [];
    let currentChunk = '';
    
    // Group sentences into chunks of reasonable size
    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length < 150) {
        currentChunk += sentence;
      } else {
        if (currentChunk) chunks.push(currentChunk);
        currentChunk = sentence;
      }
    }
    
    // Add the last chunk if there is one
    if (currentChunk) chunks.push(currentChunk);
    
    return chunks.length > 0 ? chunks : [text];
  }
}

// Create and export a singleton instance
const googleSpeechService = new GoogleSpeechService();
export default googleSpeechService; 