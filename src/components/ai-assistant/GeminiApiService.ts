// This service integrates with Google's Gemini API

interface GeminiConfig {
  apiKey: string;
  modelVersion?: string;
}

interface GeminiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface PatientData {
  name: string;
  age: number;
  gender: string;
  conditions: string[];
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
  }>;
  allergies: string[];
  recentVitals: Record<string, any>;
  [key: string]: any;
}

interface GeminiRequestOptions {
  temperature?: number;
  maxTokens?: number;
  safetySettings?: any[];
  language?: string;
}

class GeminiApiService {
  private apiKey: string;
  private modelVersion: string;
  private baseUrl: string;
  private isInitialized: boolean = false;

  constructor() {
    this.apiKey = '';
    this.modelVersion = 'gemini-2.0-flash';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
  }

  /**
   * Initialize the Gemini API with your API key
   */
  public initialize(config: GeminiConfig): void {
    this.apiKey = config.apiKey;
    if (config.modelVersion) {
      this.modelVersion = config.modelVersion;
    }
    this.isInitialized = true;
    console.log('Gemini API initialized with model:', this.modelVersion);
  }

  /**
   * Check if the API has been initialized
   */
  public isApiInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Generate a contextual response using the Gemini API
   * 
   * @param messages - Array of conversation messages
   * @param patientData - Patient medical data for context
   * @param options - Optional configuration for the request
   * @returns Promise with the generated response
   */
  public async generateResponse(
    messages: GeminiMessage[],
    patientData: PatientData,
    options: GeminiRequestOptions = {}
  ): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('Gemini API not initialized. Call initialize() first.');
    }

    // If no API key is provided, use mock responses
    if (!this.apiKey) {
      console.warn('No Gemini API key provided. Using mock responses.');
      return this.getMockResponse(messages[messages.length - 1].content, patientData, options.language);
    }

    try {
      // Create context with patient data and language preference
      const contextPrompt = this.buildContextualPrompt(patientData, options.language);
      
      // Prepare the conversation history
      let conversationText = contextPrompt + "\n\n";
      
      // Add previous messages
      for (const msg of messages) {
        const role = msg.role === 'assistant' ? 'AI' : 'User';
        conversationText += `${role}: ${msg.content}\n`;
      }
      
      // Build API request
      const endpoint = `${this.baseUrl}/models/${this.modelVersion}:generateContent?key=${this.apiKey}`;
      
      const payload = {
        contents: [{
          parts: [{ text: conversationText }]
        }],
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.maxTokens || 800,
        }
      };
      
      // Make API request
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Gemini API error: ${response.status} ${errorData}`);
      }
      
      const data = await response.json();
      
      // Extract the generated text from the response
      if (data.candidates && 
          data.candidates[0] && 
          data.candidates[0].content && 
          data.candidates[0].content.parts && 
          data.candidates[0].content.parts[0]) {
        let response = data.candidates[0].content.parts[0].text;
        
        // Clean up response by removing any "AI:" prefix that might be in the response
        let cleanedResponse = response;
        // Check for "AI:" prefix at the start of the response and remove it
        if (cleanedResponse.startsWith("AI:")) {
          cleanedResponse = cleanedResponse.substring(3).trim();
        }
        
        // Enhance the formatting of the response
        cleanedResponse = this.enhanceResponseFormatting(cleanedResponse);
        
        return cleanedResponse;
      } else {
        throw new Error('Unexpected response format from Gemini API');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // Fall back to mock response
      const mockResponse = this.getMockResponse(messages[messages.length - 1].content, patientData, options.language);
      return this.enhanceResponseFormatting(mockResponse);
    }
  }

  /**
   * Build a contextual prompt that includes patient information and language preference
   */
  private buildContextualPrompt(patientData: PatientData, language?: string): string {
    // Add language instruction if a specific language is requested
    const languageInstruction = language && language !== 'en' 
      ? `\nIMPORTANT: Please respond in ${this.getLanguageName(language)} language.` 
      : '';
    
    // Create a system prompt that includes patient data for context
    return `
You are Dr. AIDA, an advanced AI health assistant for ${patientData.name}, a ${patientData.age}-year-old ${patientData.gender}.
Patient medical context:
- Medical conditions: ${patientData.conditions.join(', ')}
- Current medications: ${patientData.medications.map(med => `${med.name} ${med.dosage} ${med.frequency}`).join(', ')}
- Allergies: ${patientData.allergies.join(', ')}
- Recent vitals: ${Object.entries(patientData.recentVitals).map(([key, value]) => `${key}: ${value}`).join(', ')}

Instructions:
1. Provide accurate, personalized health advice based on the patient's specific conditions and medications.
2. Be conversational, empathetic, and culturally sensitive.
3. Do not diagnose but help the patient understand their condition and treatments.
4. Encourage the patient to follow up with their healthcare provider for serious concerns.
5. Keep responses concise and focused on the patient's questions.
6. When providing structured information like meal plans or exercise regimens, use proper formatting:
   - Use **Section Titles:** for headers (with the colon)
   - Use * bullet points for lists
   - Add blank lines between paragraphs
   - Keep lists consistently formatted for readability${languageInstruction}
`;
  }

  /**
   * Get language name from language code
   */
  private getLanguageName(code: string): string {
    const languages: Record<string, string> = {
      'en': 'English',
      'fr': 'French',
      'es': 'Spanish',
      'de': 'German',
      'zh': 'Chinese',
      'ja': 'Japanese',
      'ar': 'Arabic',
      'hi': 'Hindi',
      'ru': 'Russian'
    };
    return languages[code] || code;
  }

  /**
   * Process and enhance the AI response for better formatting
   */
  private enhanceResponseFormatting(response: string): string {
    // Trim the entire response
    response = response.trim();

    // Remove any leading whitespace from lines
    response = response.replace(/^[ \t]+/gm, '');
    
    // Make section headers consistent
    response = response.replace(/([A-Za-z]+):\s*\n/g, '**$1:**\n\n');
    
    // Make bullet points consistent
    response = response.replace(/^[•\-○]\s*(.*?)$/gm, '* $1');
    
    // Ensure meal items have bullet points
    response = response.replace(/^([A-Za-z][\w\s]+):(?!\*)/gm, '* $1:');
    
    // Add a line break before lists if missing
    response = response.replace(/([^\n])\n\*/g, '$1\n\n*');
    
    // Ensure paragraph spacing
    response = response.replace(/([.!?])\s*\n([A-Z])/g, '$1\n\n$2');

    // Clean up excessive newlines
    response = response.replace(/\n{3,}/g, '\n\n');
    
    return response;
  }

  /**
   * Mock response generator for fallback when API fails
   */
  private getMockResponse(userInput: string, patientData: PatientData, language?: string): string {
    const input = userInput.toLowerCase();
    
    // Examples of contextual responses based on the patient's data and input
    let response = '';
    
    if (input.includes("diabetes") || input.includes("blood sugar")) {
      response = `Based on your records, your last blood sugar reading was ${patientData.recentVitals.bloodSugar}. This is slightly elevated from the recommended range for someone with Type 2 Diabetes. Have you been following your medication schedule with Metformin ${patientData.medications[0].dosage} ${patientData.medications[0].frequency}? I can suggest some dietary adjustments that might help bring this under better control.`;
    } 
    else if (input.includes("blood pressure") || input.includes("hypertension")) {
      response = `Your most recent blood pressure reading was ${patientData.recentVitals.bloodPressure}, which is better than your previous readings but still slightly above the target range. The Lisinopril appears to be helping, but we might want to discuss some lifestyle modifications during your upcoming appointment.`;
    }
    else if (input.includes("appointment") || input.includes("visit")) {
      response = `Based on your records, your next follow-up appointment should be scheduled soon. Your last visit was where we discussed managing your diabetes and hypertension. Is there anything specific you'd like to prepare for your next appointment?`;
    }
    else if (input.includes("medication") || input.includes("medicine")) {
      response = `You're currently taking ${patientData.medications.length} medications: ${patientData.medications.map(med => `${med.name} ${med.dosage} ${med.frequency}`).join(" and ")}. It's important to take these regularly as prescribed. Have you been experiencing any side effects I should know about?`;
    }
    else {
      // General response for other queries
      response = `Thank you for your question. As your personal health assistant, I'll do my best to help. Based on your health profile, you have a history of ${patientData.conditions.join(" and ")}. Your recent vitals look stable overall. How have you been feeling lately in relation to your question?`;
    }
    
    // If a different language is requested, add note about translation
    if (language && language !== 'en') {
      response += `\n\n[Note: This is a mock response. In production, this would be provided in ${this.getLanguageName(language)}.]`;
    }
    
    return response;
  }
}

// Create singleton instance
export const geminiApiService = new GeminiApiService();
export default geminiApiService; 