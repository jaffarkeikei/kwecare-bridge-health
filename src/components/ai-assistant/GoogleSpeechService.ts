// GoogleSpeechService.ts - Service for handling Google Cloud Speech-to-Text functionality

interface GoogleSpeechServiceConfig {
  keyFilePath: string;
}

class GoogleSpeechService {
  private isInitialized = false;
  private keyFilePath: string | null = null;
  private isSpeaking = false;
  private speakingAudio: HTMLAudioElement | null = null;

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

  async synthesizeSpeech(text: string, voiceType: string = 'female'): Promise<string> {
    console.log('synthesizeSpeech called with text:', text.substring(0, 50) + '...');
    
    if (!this.isInitialized) {
      console.warn('Google Text-to-Speech API not initialized, using mock service');
    }
    
    // In a real implementation, this would call the Google Cloud Text-to-Speech API
    // through a backend proxy for security reasons
    
    try {
      // For development/demo, we're creating a mock audio URL
      // In production, you would send the text to a backend endpoint that uses
      // Google Cloud Text-to-Speech API with proper credentials
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo purposes, we'll create a mock audio URL using browser's speech synthesis
      // but in production, this would be a URL to an audio file from Google's TTS API
      const audioUrl = await this.createMockAudioUrl(text, voiceType);
      
      console.log('Generated audio URL for speech synthesis');
      return audioUrl;
    } catch (error) {
      console.error('Error in speech synthesis:', error);
      throw error;
    }
  }

  // Helper function to create a mock audio URL using browser's speech synthesis
  // This simulates what Google's Text-to-Speech API would return
  private async createMockAudioUrl(text: string, voiceType: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Create a speech synthesis utterance
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Get available voices and select based on voiceType
        const voices = window.speechSynthesis.getVoices();
        
        // Select voice based on voiceType
        let selectedVoice = null;
        
        if (voiceType === 'female') {
          selectedVoice = voices.find(voice => 
            (voice.name.toLowerCase().includes('samantha') || 
             voice.name.toLowerCase().includes('female') ||
             voice.name.toLowerCase().includes('google us female')) &&
            voice.lang.startsWith('en')
          );
        } else if (voiceType === 'male') {
          selectedVoice = voices.find(voice => 
            (voice.name.toLowerCase().includes('daniel') || 
             voice.name.toLowerCase().includes('male') ||
             voice.name.toLowerCase().includes('google us male')) && 
            voice.lang.startsWith('en')
          );
        } else {
          selectedVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('google') && 
            voice.lang.startsWith('en')
          );
        }
        
        // Fallback to any English voice if preferred voice not found
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
        }
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        
        // Adjust speech parameters based on persona
        if (voiceType === 'female') {
          utterance.rate = 0.92;
          utterance.pitch = 1.05;
        } else if (voiceType === 'male') {
          utterance.rate = 0.90;
          utterance.pitch = 0.95;
        } else {
          utterance.rate = 0.95;
          utterance.pitch = 1.0;
        }
        
        // In a real implementation with Google's TTS API, we'd return a URL to an audio file
        // For this mock implementation, we'll simulate this by creating a "fake" URL
        // In production, this would be replaced with the actual Google TTS API call
        
        // Simulate a URL that would be returned from Google's TTS API
        setTimeout(() => {
          // This is just a mock URL - in reality, this would be a valid audio URL
          // from Google's Text-to-Speech API
          const mockAudioUrl = "mock-google-tts-url:" + Date.now();
          resolve(mockAudioUrl);
        }, 300);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Method to speak text using the generated audio URL
  async speakText(text: string, voiceType: string = 'female'): Promise<void> {
    try {
      // Stop any ongoing speech
      this.stopSpeaking();
      
      console.log("Using Google Chirp HD voice technology (simulated)");

      // First, ensure voices are loaded
      if (window.speechSynthesis.getVoices().length === 0) {
        await new Promise<void>((resolve) => {
          const checkVoices = () => {
            if (window.speechSynthesis.getVoices().length > 0) {
              resolve();
            } else {
              window.speechSynthesis.onvoiceschanged = () => {
                if (window.speechSynthesis.getVoices().length > 0) {
                  resolve();
                }
              };
              setTimeout(resolve, 1000);
            }
          };
          checkVoices();
        });
      }
      
      // Get available voices
      const voices = window.speechSynthesis.getVoices();
      console.log("Available voices:", voices.map(v => `${v.name} (${v.lang})`));
      
      // Define Chirp HD persona characteristics
      const chirpVoiceNames = {
        female: ["Google UK English Female", "Google US English Female", "Karen", "Samantha", "Victoria"],
        male: ["Google UK English Male", "Google US English Male", "Daniel", "Tom"],
        neutral: ["Google US English", "Google Australia", "Google India"]
      };
      
      // Try to find voices matching Google's Chirp HD characteristics
      let selectedVoice = null;
      
      // 1. Try to find voices that match Chirp HD quality by name
      if (voiceType === 'female') {
        for (const name of chirpVoiceNames.female) {
          const found = voices.find(v => v.name.includes(name));
          if (found) {
            selectedVoice = found;
            console.log(`Found high-quality female voice: ${found.name}`);
            break;
          }
        }
      } else if (voiceType === 'male') {
        for (const name of chirpVoiceNames.male) {
          const found = voices.find(v => v.name.includes(name));
          if (found) {
            selectedVoice = found;
            console.log(`Found high-quality male voice: ${found.name}`);
            break;
          }
        }
      } else {
        for (const name of chirpVoiceNames.neutral) {
          const found = voices.find(v => v.name.includes(name));
          if (found) {
            selectedVoice = found;
            console.log(`Found high-quality neutral voice: ${found.name}`);
            break;
          }
        }
      }
      
      // 2. If no specific voice found, try any Google voice
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en'));
      }
      
      // 3. Last resort - any English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith('en'));
      }
      
      // Create utterance with Chirp HD-like settings
      const utterance = new SpeechSynthesisUtterance();
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log(`Using Chirp HD voice (simulated): ${selectedVoice.name}`);
      } else {
        console.warn("No suitable premium voice found for Chirp HD simulation");
      }
      
      // Process text to remove HTML and improve pronunciation
      const processedText = this.preprocessTextForBetterSpeech(text);
      utterance.text = processedText;
      
      // Customize voice parameters to sound more like Chirp HD
      // These are tuned specifically to mimic Google's premium voices
      if (voiceType === 'female') {
        utterance.rate = 0.9;     // Slightly slower for clarity
        utterance.pitch = 1.02;   // Slightly higher pitch
      } else if (voiceType === 'male') {
        utterance.rate = 0.85;    // Slower for male voices
        utterance.pitch = 0.95;   // Lower pitch
      } else {
        utterance.rate = 0.88;    // Balanced rate
        utterance.pitch = 1.0;    // Neutral pitch
      }
      
      // Full volume for all voices
      utterance.volume = 1.0;
      
      // SSML-like preprocessing for better speech patterns
      // This simulates the SSML capabilities in Google Cloud Text-to-Speech
      // Set status and begin speaking
      this.isSpeaking = true;
      
      // Use chunking approach for all text to ensure reliability
      console.log("Using advanced chunking for Chirp HD simulation");
      const chunks = this.chunkText(processedText);
      
      // Pre-process each chunk to add pauses and emphasis
      const enhancedChunks = chunks.map(chunk => {
        // Add slight pauses at punctuation
        return chunk
          .replace(/([.!?]),/g, '$1. ')  // Convert comma after period to actual pause
          .replace(/([,;])/g, '$1 ');    // Add slight space after commas/semicolons
      });
      
      // Speak each chunk sequentially with Chirp HD-like settings
      for (const chunk of enhancedChunks) {
        if (!this.isSpeaking) break;
        
        const chunkUtterance = new SpeechSynthesisUtterance(chunk);
        if (selectedVoice) chunkUtterance.voice = selectedVoice;
        
        // Copy settings
        chunkUtterance.rate = utterance.rate;
        chunkUtterance.pitch = utterance.pitch;
        chunkUtterance.volume = utterance.volume;
        
        // Speak with proper pacing (like Chirp HD)
        await new Promise<void>((resolve) => {
          chunkUtterance.onend = () => resolve();
          chunkUtterance.onerror = () => resolve();
          window.speechSynthesis.speak(chunkUtterance);
        });
        
        // Brief pause between chunks (makes it sound more natural)
        await new Promise(resolve => setTimeout(resolve, 150));
      }
      
      this.isSpeaking = false;
      console.log("Chirp HD voice playback complete");
      
    } catch (error) {
      console.error("Error in Chirp HD speech synthesis:", error);
      this.isSpeaking = false;
      
      // Attempt basic fallback
      try {
        window.speechSynthesis.cancel();
        const fallbackUtterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(fallbackUtterance);
      } catch (e) {
        console.error("Even fallback speech failed");
      }
    }
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
  
  // Method to check if speaking
  isCurrentlySpeaking(): boolean {
    return this.isSpeaking;
  }
  
  // Method to stop speaking
  stopSpeaking(): void {
    if (this.isSpeaking) {
      // In a real implementation, we would stop the audio element
      
      // For this demo, we'll use the browser's speech synthesis
      window.speechSynthesis.cancel();
      
      this.isSpeaking = false;
      console.log("Stopped speaking");
    }
  }
}

// Create and export a singleton instance
const googleSpeechService = new GoogleSpeechService();
export default googleSpeechService; 