# KweCare AI Doctor Assistant

This module implements a personalized AI health assistant that provides patients with tailored medical advice based on their health records and personal information.

## Features

- **Personalized Health Advice**: Uses patient-specific data to provide contextual responses
- **Chat Interface**: Natural conversational interface for patients to ask health questions
- **Google Gemini Integration**: Powered by Google's Gemini AI for advanced language understanding
- **Cultural Sensitivity**: Designed to respect cultural preferences and contexts
- **Medical Record Integration**: Access to patient records for informed responses

## Components

### 1. PersonalDoctorButton

A UI component that displays the AI Doctor button in the header and manages the modal state.

```tsx
import { PersonalDoctorButton } from "@/components/ai-assistant";

// In your component
<PersonalDoctorButton />
```

### 2. PersonalDoctorAI

The main dialog component that displays the chat interface and handles user interactions.

```tsx
import { PersonalDoctorAI } from "@/components/ai-assistant";

// In your component
<PersonalDoctorAI 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)} 
/>
```

### 3. GeminiApiService

Service for interfacing with Google's Gemini API with context-aware prompting.

```tsx
import { geminiApiService } from "@/components/ai-assistant";

// Initialize the service with your API key
geminiApiService.initialize({ 
  apiKey: 'YOUR_GEMINI_API_KEY',
  modelVersion: 'gemini-1.5-pro'
});

// Generate response
const response = await geminiApiService.generateResponse(
  messages,
  patientData,
  { temperature: 0.7 }
);
```

## Setup

### 1. Google Gemini API Setup

1. Sign up for Google AI Studio and get an API key
2. Initialize the Gemini service with your API key

```tsx
// In your app initialization
import { geminiApiService } from "@/components/ai-assistant";

geminiApiService.initialize({ 
  apiKey: process.env.GEMINI_API_KEY || 'YOUR_API_KEY'
});
```

### 2. Customizing the AI Doctor

The AI Doctor can be customized with different personalities or specialties:

```tsx
// In PersonalDoctorAI.tsx
const doctorName = "Dr. AIDA"; // Change to your preferred name
const doctorPersonality = "compassionate, knowledgeable, and culturally aware";
```

### 3. Integrating with Patient Records

For full functionality, integrate with your patient record system:

```tsx
// Replace mockPatientData with real patient data from your backend
const patientData = await fetchPatientData(patientId);
```

## Best Practices

1. **Privacy**: Ensure all patient data is handled securely and with proper consent
2. **Transparency**: Clearly communicate to patients that they are interacting with an AI
3. **Human Oversight**: Include a mechanism for escalating to human healthcare providers when needed
4. **Accuracy**: Regularly review and update the AI responses for medical accuracy
5. **Cultural Context**: Ensure the AI is trained on diverse cultural health practices

## Limitations

- The AI should not be used for emergency medical situations
- All advice should be validated by healthcare professionals
- The AI does not replace proper medical diagnosis or treatment

## Future Enhancements

- Voice interface for accessibility
- Image analysis for visual symptoms
- Integration with wearable health devices
- Multi-language support
- Appointment scheduling capabilities 