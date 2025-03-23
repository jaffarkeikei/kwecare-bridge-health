# KweCare AI Health Assistants

This module implements personalized AI health assistants that provide patients and healthcare providers with tailored medical information based on their specific contexts.

## Features

- **Personalized Health Advice**: Uses patient-specific data to provide contextual responses
- **Provider Clinical Support**: Offers healthcare providers insights on patient data and clinical alerts
- **Chat Interface**: Natural conversational interface for interacting with the AI assistants
- **Google Gemini Integration**: Powered by Google's Gemini AI for advanced language understanding
- **Cultural Sensitivity**: Designed to respect cultural preferences and contexts
- **Medical Record Integration**: Access to patient and provider records for informed responses

## Components

### Patient-Facing Components

#### 1. PersonalDoctorButton

A UI component that displays the AI Doctor button for patients and manages the modal state.

```tsx
import { PersonalDoctorButton } from "@/components/ai-assistant";

// In your component
<PersonalDoctorButton />
```

#### 2. PersonalDoctorAI

The main dialog component that displays the chat interface for patients and handles user interactions.

```tsx
import { PersonalDoctorAI } from "@/components/ai-assistant";

// In your component
<PersonalDoctorAI 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)} 
/>
```

### Provider-Facing Components

#### 1. ProviderAssistantButton

A UI component that displays the AI Assistant button for healthcare providers and manages the modal state.

```tsx
import { ProviderAssistantButton } from "@/components/ai-assistant";

// In your component
<ProviderAssistantButton />
```

#### 2. ProviderAssistantAI

The main dialog component that displays the chat interface for healthcare providers with provider-specific context.

```tsx
import { ProviderAssistantAI } from "@/components/ai-assistant";

// In your component
<ProviderAssistantAI 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)} 
/>
```

### Shared Services

#### GeminiApiService

Service for interfacing with Google's Gemini API with context-aware prompting.

```tsx
import { geminiApiService } from "@/components/ai-assistant";

// Initialize the service with your API key
geminiApiService.initialize({ 
  apiKey: 'YOUR_GEMINI_API_KEY',
  modelVersion: 'gemini-2.0-flash'
});

// Generate response
const response = await geminiApiService.generateResponse(
  messages,
  contextData, // Either patient or provider data
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

### 2. Adding the AI Assistants to your application

#### For Patient UI:

```tsx
// In your header or navigation component
<PersonalDoctorButton className="ml-2" />
```

#### For Provider UI:

```tsx
// In your provider dashboard or navigation component
<ProviderAssistantButton className="ml-2" />
```

### 3. Integrating with Record Systems

For full functionality, integrate with your patient and provider record systems:

```tsx
// Replace mock data with real data from your backend
const patientData = await fetchPatientData(patientId);
const providerData = await fetchProviderData(providerId);
```

## Differences Between AI Doctor and Provider Assistant

1. **AI Doctor (Patient-Facing)**
   - Focuses on personal health advice and education
   - Uses patient-friendly language and explanations
   - Emphasizes lifestyle guidance and medication adherence
   - Features a warm, empathetic tone

2. **Provider Assistant (Healthcare Provider-Facing)**
   - Focuses on clinical insights and patient management
   - Uses professional medical terminology
   - Emphasizes clinical alerts, treatment patterns, and outcomes
   - Features a professional, efficient tone
   - Includes provider performance metrics and analysis

## Best Practices

1. **Privacy**: Ensure all data is handled securely and with proper consent
2. **Transparency**: Clearly communicate that users are interacting with an AI
3. **Human Oversight**: Include a mechanism for escalating to human staff when needed
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