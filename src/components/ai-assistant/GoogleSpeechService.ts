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
  private useFallbackOnly = false; // Set to false to use Google Cloud TTS

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
      
      // Log the received URL for debugging
      console.log("Received audio URL:", data.audioUrl);
      
      // Check for fallback message
      if (data.fallback) {
        console.log("Server returned fallback message:", data.message);
        this.fallbackToLocalSpeech(text, voiceType);
        return;
      }
      
      // Build the full URL and check if it's valid
      const audioUrl = `${this.backendUrl}${data.audioUrl}`;
      console.log("Full audio URL:", audioUrl);
      
      // Create a dummy audio element to test the URL
      const testAudio = new Audio();
      testAudio.src = audioUrl;
      
      // Test if the file exists by sending a HEAD request
      try {
        const headResponse = await fetch(audioUrl, { method: 'HEAD' });
        if (!headResponse.ok) {
          console.error("Audio file not accessible:", headResponse.status);
          throw new Error(`Audio file not accessible: ${headResponse.status}`);
        }
        
        console.log("Audio file verified:", audioUrl);
      } catch (headError) {
        console.error("Error checking audio file:", headError);
        this.fallbackToLocalSpeech(text, voiceType);
        return;
      }
      
      // Create and play the audio with proper user-interaction handling
      const audio = new Audio();
      
      // Important: Only set the src after attaching event handlers
      // This helps with some browser quirks around event timing
      
      // Set up event handlers first
      audio.onended = () => {
        console.log("Audio playback ended normally");
        this.isSpeaking = false;
        this.speakingAudio = null;
      };
      
      audio.onerror = (event) => {
        const error = (event as unknown as { target: HTMLAudioElement }).target.error;
        console.error("Audio playback error:", error?.code, error?.message);
        this.isSpeaking = false;
        this.speakingAudio = null;
        
        // Fall back to browser's speech synthesis in case of audio loading error
        this.fallbackToLocalSpeech(text, voiceType);
      };
      
      // Only after handlers are attached, set the source
      audio.src = audioUrl;
      
      // Store reference
      this.speakingAudio = audio;
      
      // Special handling for Safari and iOS
      audio.preload = 'auto';
      
      try {
        // Try to load the audio first (important to catch errors early)
        await new Promise<void>((resolve, reject) => {
          const loadHandler = () => {
            console.log("Audio loaded successfully");
            audio.removeEventListener('canplaythrough', loadHandler);
            resolve();
          };
          
          const errorHandler = (e: Event) => {
            console.error("Error loading audio:", e);
            audio.removeEventListener('error', errorHandler);
            reject(new Error("Failed to load audio"));
          };
          
          audio.addEventListener('canplaythrough', loadHandler);
          audio.addEventListener('error', errorHandler);
          
          // Manually start loading
          audio.load();
          
          // Set a timeout in case loading takes too long
          setTimeout(() => {
            audio.removeEventListener('canplaythrough', loadHandler);
            audio.removeEventListener('error', errorHandler);
            console.warn("Audio loading timed out, attempting to play anyway");
            resolve();
          }, 3000);
        });
        
        // Now try to play (this must be from user gesture in modern browsers)
        console.log("Attempting to play audio...");
        await audio.play();
        console.log("Started playing Google Cloud TTS audio");
      } catch (playError) {
        console.error("Failed to play audio:", playError);
        
        // Try to create a specialized solution for Chrome
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
          try {
            console.log("Attempting alternate playback method with AudioContext...");
            
            // Create a new AudioContext
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const audioContext = new AudioContext();
            
            // Fetch the audio file
            const response = await fetch(audioUrl);
            const arrayBuffer = await response.arrayBuffer();
            
            // Decode the audio data
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            
            // Create a buffer source
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            
            // Play the audio
            source.start(0);
            
            // Handle completion
            source.onended = () => {
              console.log("AudioContext playback ended");
              this.isSpeaking = false;
              this.speakingAudio = null;
            };
            
            console.log("Playing audio using AudioContext");
            return;
          } catch (contextError) {
            console.error("AudioContext playback failed:", contextError);
          }
        }
        
        // If we got here, all playback methods failed
        console.error("All audio playback methods failed, falling back to browser speech");
        this.fallbackToLocalSpeech(text, voiceType);
      }
      
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
  
  // Add a better local speech fallback method
  private fallbackToLocalSpeech(text: string, voiceType: string = 'neutral'): void {
    if (!window.speechSynthesis) {
      console.error("Browser does not support speech synthesis");
      return;
    }
    
    console.log("Using browser's native speech synthesis as fallback");
    
    // Preprocess text to improve pronunciation
    text = this.preprocessTextForSpeech(text);
    
    // Create and configure utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice based on selected persona
    const voices = window.speechSynthesis.getVoices();
    
    // If voices aren't loaded yet, wait for them
    if (voices.length === 0) {
      console.log("No voices available yet, waiting for voices to load...");
      
      // Some browsers need this event to get voices
      window.speechSynthesis.onvoiceschanged = () => {
        this.selectVoiceAndSpeak(utterance, voiceType);
      };
      
      // Safety timeout in case event never fires
      setTimeout(() => {
        this.selectVoiceAndSpeak(utterance, voiceType);
      }, 1000);
    } else {
      // Voices are already loaded
      this.selectVoiceAndSpeak(utterance, voiceType);
    }
  }
  
  // Helper to select voice and speak
  private selectVoiceAndSpeak(utterance: SpeechSynthesisUtterance, voiceType: string): void {
    const voices = window.speechSynthesis.getVoices();
    
    if (voices.length > 0) {
      console.log(`Available voices (${voices.length}):`, voices.map(v => `${v.name} (${v.lang})`).join(', '));
      
      // Try to find an English voice that matches the requested type
      let selectedVoice = null;
      
      if (voiceType === 'female') {
        // Female voices often contain 'female' or woman-sounding names
        selectedVoice = voices.find(v => 
          (v.name.toLowerCase().includes('female') || 
           v.name.toLowerCase().includes('woman') ||
           v.name.toLowerCase().includes('girl') ||
           /samantha|victoria|karen|tessa|monica|amy/i.test(v.name)) && 
          v.lang.startsWith('en')
        );
      } else if (voiceType === 'male') {
        // Male voices often contain 'male' or man-sounding names
        selectedVoice = voices.find(v => 
          (v.name.toLowerCase().includes('male') || 
           v.name.toLowerCase().includes('man') ||
           v.name.toLowerCase().includes('guy') ||
           /daniel|david|tom|alex|john|nathan/i.test(v.name)) && 
          v.lang.startsWith('en')
        );
      }
      
      // If we couldn't find a gender-specific voice, just use any English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith('en'));
      }
      
      // If we found a voice, use it
      if (selectedVoice) {
        console.log("Selected voice:", selectedVoice.name);
        utterance.voice = selectedVoice;
      } else {
        console.warn("Could not find appropriate voice, using default");
      }
    } else {
      console.warn("No voices available for browser speech synthesis");
    }
    
    // Add event handlers
    utterance.onend = () => {
      console.log("Browser speech synthesis completed");
      this.isSpeaking = false;
      this.speakingAudio = null;
    };
    
    utterance.onerror = (event) => {
      console.error("Browser speech synthesis error:", event);
      this.isSpeaking = false;
      this.speakingAudio = null;
    };
    
    // Set parameters for better voice quality
    utterance.rate = 1.0;  // Normal speed
    utterance.pitch = 1.0; // Normal pitch
    utterance.volume = 1.0; // Full volume
    
    // Speak
    console.log("Starting browser speech synthesis");
    window.speechSynthesis.speak(utterance);
  }
  
  // Preprocess text to improve speech quality
  private preprocessTextForSpeech(text: string): string {
    // Remove HTML tags
    text = text.replace(/<[^>]*>/g, '');
    
    // Remove any "1. AI:" prefix
    text = text.replace(/^(?:1\. )?AI:\s*/i, '');
    
    // Replace bullet points with ordinals
    const ordinals = ["First", "Second", "Third", "Fourth", "Fifth", 
                      "Sixth", "Seventh", "Eighth", "Ninth", "Tenth"];
    let bulletCount = 0;
    
    text = text.replace(/\n\s*\*\s*/g, () => {
      const ordinal = bulletCount < ordinals.length 
        ? ordinals[bulletCount] 
        : `Item ${bulletCount + 1}`;
      bulletCount++;
      return `\n${ordinal}, `;
    });
    
    // Add pauses after punctuation for better rhythm
    text = text.replace(/([.!?])\s/g, '$1, ');
    
    // Improve pronunciation of common abbreviations
    text = text.replace(/Dr\./g, "Doctor ");
    text = text.replace(/Mr\./g, "Mister ");
    text = text.replace(/Mrs\./g, "Misses ");
    text = text.replace(/Ms\./g, "Miss ");
    text = text.replace(/Ph\.D\./g, "P H D ");
    text = text.replace(/M\.D\./g, "M D ");
    
    return text;
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
    
    // Replace asterisk bullet points with numbered points
    let bulletCount = 0;
    text = text.replace(/\n\s*\*\s*/g, () => {
      bulletCount++;
      return `\n${bulletCount}. `;
    });
    
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