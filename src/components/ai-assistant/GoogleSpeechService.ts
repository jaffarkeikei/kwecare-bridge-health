// GoogleSpeechService.ts - Service for handling Google Cloud Speech-to-Text functionality

interface GoogleSpeechServiceConfig {
  keyFilePath: string;
}

class GoogleSpeechService {
  private isInitialized = false;
  private keyFilePath: string | null = null;
  private isSpeaking = false;
  private speakingAudio: HTMLAudioElement | null = null;
  private backendUrl = 'http://localhost:3002'; // Backend server URL
  private useFallbackOnly = true; // Always use browser speech for now until Google Cloud is enabled

  initialize(keyFilePath: string) {
    this.keyFilePath = keyFilePath;
    this.isInitialized = true;
    console.log('Google Speech-to-Text API configured with key file path');
    return true;
  }

  isApiInitialized() {
    return this.isInitialized;
  }

  async transcribeAudio(audioBuffer: ArrayBuffer): Promise<string> {
    console.log('transcribeAudio called with buffer size:', audioBuffer.byteLength);
    
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
      
      const mockResponses = [
        "I've been having headaches for the past week.",
        "What foods should I avoid with my diabetes?",
        "How often should I check my blood pressure?",
        "I'm feeling dizzy when I stand up too quickly.",
        "Should I be worried about my blood sugar readings?",
      ];
      
      // Return a random mock response
      const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      console.log('Returning mock transcription:', response);
      return response;
    } catch (error) {
      // Even if there's an error, return a mock response so the UI flow continues
      console.error('Error in speech transcription, using fallback response:', error);
      return "I have a question about my health condition.";
    }
  }

  // Method to speak text using Google Cloud TTS API
  async speakText(text: string, voiceType: string = 'female'): Promise<void> {
    try {
      // Stop any ongoing speech
      this.stopSpeaking();
      
      // If fallback only is set, skip Google TTS entirely
      if (this.useFallbackOnly) {
        console.log("Using browser speech synthesis (fallback mode enabled)");
        this.fallbackToLocalSpeech(text, voiceType);
        return;
      }
      
      console.log("Using real Google Cloud Text-to-Speech API");
      
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
        this.fallbackToLocalSpeech(text, voiceType);
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
          voiceType: voiceType
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
        }
        
        throw new Error(`Failed to get speech: ${errorData.error}`);
      }
      
      // Get the audio URL from the response
      const data = await response.json();
      const audioUrl = `${this.backendUrl}${data.audioUrl}`;
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
        this.fallbackToLocalSpeech(text, voiceType);
      };
      
      // Play the audio
      await audio.play();
      console.log("Started playing Google Cloud TTS audio");
      
    } catch (error) {
      console.error("Error using Google Cloud TTS:", error);
      this.isSpeaking = false;
      
      // Fall back to browser's speech synthesis
      console.log("Falling back to browser speech synthesis");
      this.fallbackToLocalSpeech(text, voiceType);
    }
  }
  
  // Toggle fallback mode on/off
  setUseFallbackOnly(useFallback: boolean): void {
    this.useFallbackOnly = useFallback;
    console.log(`Speech synthesis fallback mode ${useFallback ? 'enabled' : 'disabled'}`);
  }
  
  // Fallback method using browser's speech synthesis
  private fallbackToLocalSpeech(text: string, voiceType: string): void {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Get available voices
      const voices = window.speechSynthesis.getVoices();
      
      // Try to find a good voice
      let selectedVoice = null;
      if (voiceType === 'female') {
        selectedVoice = voices.find(v => 
          v.name.includes('Female') && v.lang.startsWith('en')
        );
      } else if (voiceType === 'male') {
        selectedVoice = voices.find(v => 
          v.name.includes('Male') && v.lang.startsWith('en')
        );
      } else {
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