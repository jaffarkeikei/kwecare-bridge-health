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
    
    // Check if this is provider data (we use the gender field to determine this)
    if (patientData.gender === "Provider") {
      // Create a system prompt that includes provider data for context
      return `
You are AIDA, an advanced AI assistant for ${patientData.name}, a healthcare provider with ${patientData.age} years of experience, specializing in ${patientData.specialty} at ${patientData.clinic}.

Provider context:
- Patients (${(patientData as any).patients?.length || 0} total): ${(patientData as any).patients?.map((p: any) => `${p.name} (${p.age}, ${p.conditions.join(', ')})`).join('; ') || 'None'}
- Recent alerts: ${(patientData as any).recentAlerts?.map((a: any) => `${a.patientName}: ${a.alert} (${a.severity})`).join('; ') || 'None'}
- Upcoming appointments: ${(patientData as any).upcomingAppointments?.map((a: any) => `${a.patient}: ${a.time} (${a.type})`).join('; ') || 'None'}
- Performance metrics: Patient satisfaction: ${(patientData as any).performanceMetrics?.patientSatisfaction || 'N/A'}%, Treatment effectiveness: ${(patientData as any).performanceMetrics?.treatmentEffectiveness || 'N/A'}%

Instructions:
1. Provide accurate, professional healthcare information and insights tailored to a medical provider.
2. Help the provider analyze patient data, interpret clinical information, and identify treatment patterns.
3. Offer evidence-based suggestions while recognizing the provider's expertise and decision-making authority.
4. Maintain a professional, concise tone appropriate for healthcare settings.
5. Prioritize alerts and information based on clinical significance.
6. When providing structured information like treatment summaries or patient overviews, use proper formatting:
   - Use **Section Titles:** for headers (with the colon)
   - Use * bullet points for lists
   - Add blank lines between paragraphs
   - Keep lists consistently formatted for readability${languageInstruction}
`;
    } else {
      // Original patient-focused prompt
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
   * Helper method to get patient-specific mock response when requested by providers
   */
  private getMockPatientDetailResponse(patientName: string, patientData: any): string {
    // Find the patient in the provider's patient list
    const patient = patientData.patients?.find((p: any) => 
      p.name.toLowerCase().includes(patientName.toLowerCase())
    );
    
    if (!patient) {
      return `I don't have detailed information about a patient named "${patientName}" in your current patient list.`;
    }
    
    // Get relevant alerts for this patient
    const patientAlerts = patientData.recentAlerts?.filter((a: any) => 
      a.patientId === patient.id
    ) || [];
    
    // Generate a detailed patient report
    return `**Patient Summary - ${patient.name}:**

* ${patient.age}-year-old ${patient.gender.toLowerCase()} with ${patient.conditions.join(', ')}
* Last visit: ${patient.lastVisit}
* Upcoming appointment: ${patient.upcomingAppointment}

${patientAlerts.length > 0 ? `**Recent Alerts:**\n${patientAlerts.map((a: any) => `* ${a.alert} (${a.severity.toUpperCase()}) - ${a.date}`).join('\n')}` : '**Recent Alerts:** None'}

**Treatment Considerations:**
* Continue monitoring for complications related to ${patient.conditions[0]}
* Evaluate medication adherence at next appointment
* Consider additional screenings based on risk factors
* Update care plan to address recent clinical findings

**Next Steps:**
* ${patientAlerts.length > 0 ? 'Address recent alerts as priority items' : 'Routine follow-up at next scheduled appointment'}
* Review recent lab results and vital trends
* Assess response to current treatment protocol
* Document updated recommendations in patient record`;
  }

  /**
   * Mock response generator for fallback when API fails
   */
  private getMockResponse(userInput: string, patientData: PatientData, language?: string): string {
    const input = userInput.toLowerCase();

    // Check if provider is asking about a specific patient
    if (patientData.gender === "Provider") {
      // Check if this is a query about a specific patient
      const patientNames = (patientData as any).patients?.map((p: any) => p.name.toLowerCase()) || [];
      
      for (const name of patientNames) {
        const [firstName, lastName] = name.split(' ');
        if (input.includes(name) || 
            (firstName && input.includes(firstName)) || 
            (lastName && input.includes(lastName))) {
          // This is a query about a specific patient
          return this.getMockPatientDetailResponse(name, patientData);
        }
      }
      
      // Continue with general provider responses
      if (input.includes('high-risk') || input.includes('urgent') || input.includes('alert')) {
        return `**Critical Alerts:**

* David Wilson reported increased chest pain 5 hours ago (CRITICAL)
* David Wilson missed last 3 medication check-ins (HIGH)
* Sarah Johnson's blood glucose consistently elevated for 5 days (MODERATE)

**Recommended Actions:**

* Contact David Wilson immediately for chest pain assessment
* Schedule urgent follow-up for medication compliance with David Wilson
* Review Sarah Johnson's diabetes management plan at tomorrow's appointment`;
      }
      
      if (input.includes('appointment') || input.includes('schedule') || input.includes('today')) {
        return `**Today's Appointments:**

* 2:30 PM - David Wilson (Virtual Follow-up)
  * Focus areas: Medication compliance, Recent chest pain reports
  * Last visit: Feb 28, 2023
  * Conditions: Coronary Artery Disease, COPD

**Tomorrow's Schedule:**

* 10:00 AM - Sarah Johnson (Virtual Medication Review)
  * Focus: Diabetes management, Blood glucose readings
  * Last visit: March 15, 2023

**Notes:**
* No scheduling conflicts detected
* 2 telemedicine visits, 0 in-person visits
* David Wilson's appointment flagged as high-priority due to recent alerts`;
      }
      
      if (input.includes('patient') || input.includes('sarah') || input.includes('johnson')) {
        return `**Patient Summary - Sarah Johnson:**

* 42-year-old female with Type 2 Diabetes and Hypertension
* Last visit: March 15, 2023
* Upcoming appointment: April 22, 2023

**Recent Concerns:**
* Blood glucose readings consistently elevated (138-165 mg/dL) for 5 days
* Reported increased fatigue and thirst

**Current Medications:**
* Metformin 500mg twice daily
* Lisinopril 10mg once daily

**Treatment Considerations:**
* Consider adjusting Metformin dosage based on continuous glucose monitoring
* Review dietary compliance and physical activity levels
* Evaluate for signs of diabetic complications at next visit`;
      }
      
      if (input.includes('performance') || input.includes('metric') || input.includes('satisfaction')) {
        return `**Provider Performance Metrics:**

* Patient Satisfaction: 94% (↑2% from last quarter)
* Treatment Effectiveness: 88% (↑1% from last quarter)
* Timeliness of Care: 91% (no change)
* Documentation Completeness: 96% (↑3% from last quarter)

**Strengths:**
* Patient satisfaction scores in the top 15% of providers
* Excellent documentation practices
* Effective chronic disease management protocols

**Areas for Improvement:**
* Follow-up appointment scheduling timeliness
* Preventive screening completion rates
* Virtual care experience ratings`;
      }

      // Default provider response for other queries
      return `I don't have specific information about that query in my offline mode. In online mode, I could help you with detailed information about:

* Patient clinical summaries and treatment plans
* Analysis of patient trends and outcomes
* Clinical decision support and medication guidance
* Performance metrics and practice optimizations
* Documentation assistance and coding support

Would you like information about your upcoming appointments, recent alerts, or specific patients instead?`;
    } else {
      // Patient-specific responses (original logic)
      if (input.includes('blood sugar') || input.includes('glucose') || input.includes('diabetes')) {
        return `**Managing Your Blood Sugar Levels:**

* Your recent reading of 142 mg/dL is slightly elevated above target range (70-130 mg/dL)
* Continue taking Metformin 500mg twice daily as prescribed

**Lifestyle Recommendations:**
* Aim for 30 minutes of walking after meals to help lower glucose spikes
* Consider replacing refined carbohydrates with whole grains and increasing fiber intake
* Stay hydrated with at least 8 glasses of water daily

If you experience symptoms like extreme thirst, frequent urination, or unusual fatigue, please contact your healthcare provider right away.`;
      }
      
      if (input.includes('blood pressure') || input.includes('hypertension')) {
        return `**Managing Your Blood Pressure:**

* Your recent reading of 138/85 is slightly elevated (optimal is below 120/80)
* Continue taking Lisinopril 10mg daily as prescribed by your doctor

**Lifestyle Management:**
* Reduce sodium intake to less than 2,300mg daily (about 1 teaspoon of salt)
* Practice stress reduction techniques like deep breathing or meditation for 10 minutes daily
* Maintain your exercise routine of at least 150 minutes of moderate activity weekly

Remember to measure your blood pressure at the same time each day and bring your log to your next appointment on April 22nd.`;
      }
      
      if (input.includes('diet') || input.includes('meal') || input.includes('eat')) {
        return `**Recommended Diet for Your Conditions:**

**Breakfast:**
* Steel-cut oatmeal with berries and cinnamon (no added sugar)
* 1-2 boiled eggs for protein
* Unsweetened tea or coffee

**Lunch:**
* Grilled chicken or fish (3-4 oz)
* Large portion of non-starchy vegetables
* Small serving of whole grains (½ cup brown rice or quinoa)
* Olive oil and vinegar dressing

**Dinner:**
* Lean protein such as fish, tofu, or legumes
* 2 cups of vegetables (roasted, steamed, or in salad)
* Small serving of complex carbohydrates

**Snacks:**
* Small handful of nuts
* Greek yogurt with berries
* Vegetable sticks with hummus

**Foods to Limit:**
* Processed foods high in sodium
* Refined carbohydrates and added sugars
* Saturated and trans fats`;
      }
      
      if (input.includes('medication') || input.includes('metformin') || input.includes('lisinopril')) {
        return `**Your Current Medications:**

* Metformin (500mg)
  * Purpose: Controls blood sugar levels for Type 2 Diabetes
  * Dosage: Take one tablet twice daily with meals
  * Common side effects: Stomach upset, diarrhea (usually temporary)
  * Take with food to minimize digestive discomfort

* Lisinopril (10mg)
  * Purpose: Lowers blood pressure for Hypertension
  * Dosage: Take one tablet once daily, typically in the morning
  * Common side effects: Dry cough, dizziness
  * Avoid potassium supplements without consulting your doctor

**Important Reminders:**
* Do not stop taking these medications without consulting your doctor
* Store medications at room temperature away from moisture
* Refill your prescriptions at least 5 days before running out
* Bring all medication bottles to your next appointment on April 22nd`;
      }
      
      if (input.includes('appointment') || input.includes('checkup') || input.includes('visit')) {
        return `**Upcoming Appointment Information:**

* Date: April 22, 2023
* Provider: Dr. Rebecca Taylor
* Type: Regular follow-up and medication review
* Location: KweCare Health Center, Suite 205

**Preparation:**
* Bring a list of all current medications and supplements
* Continue monitoring and recording your blood sugar and blood pressure daily
* Fast for 8 hours before appointment for lab work
* Prepare questions about your diabetes management and any new symptoms

Would you like me to set a reminder for your appointment or help you prepare specific questions for your doctor?`;
      }
      
      // Default response for other queries
      return `I don't have specific information about that query in my offline mode. In online mode, I could provide you with personalized health information based on your medical history.

Based on your conditions of Type 2 Diabetes and Hypertension, I can help with:
* Blood sugar management strategies
* Blood pressure control tips
* Diet and nutrition advice
* Medication information
* Exercise recommendations

Would you like information about any of these topics instead?`;
    }
  }
}

// Create singleton instance
export const geminiApiService = new GeminiApiService();
export default geminiApiService; 