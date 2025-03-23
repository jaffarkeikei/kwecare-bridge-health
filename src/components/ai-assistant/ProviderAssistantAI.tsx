import React, { useState, useEffect, useRef, useContext } from "react";
import { Bot, User, Send, X, Loader2, Stethoscope, History, Activity, FileHeart, Sparkles, Mic, Volume2, VolumeX, Headphones, Settings, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AuthContext } from "@/App";
import { Sparkles as SparklesIcon } from "lucide-react";
import geminiApiService from "./GeminiApiService";
import googleSpeechService from "./GoogleSpeechService";
import { useNavigate } from "react-router-dom";

// Type declarations for the Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  interpretation: any;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
  prototype: SpeechRecognition;
}

// Extend the Window interface to include Web Speech API
declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

// Mock provider data - in a real app this would come from your backend
const mockProviderData = {
  name: "Dr. Rebecca Taylor",
  specialty: "Family Medicine",
  experience: 15,
  clinic: "KweCare Health Center",
  languages: ["English", "French"],
  patients: [
    { 
      id: 1, 
      name: "Sarah Johnson", 
      age: 42, 
      gender: "Female", 
      conditions: ["Type 2 Diabetes", "Hypertension"],
      lastVisit: "2023-03-15",
      upcomingAppointment: "2023-04-22"
    },
    { 
      id: 2, 
      name: "David Wilson", 
      age: 58, 
      gender: "Male", 
      conditions: ["Coronary Artery Disease", "COPD"],
      lastVisit: "2023-02-28",
      upcomingAppointment: "2023-03-30"
    },
    { 
      id: 3, 
      name: "Michael Chen", 
      age: 32, 
      gender: "Male", 
      conditions: ["Asthma", "Allergic Rhinitis"],
      lastVisit: "2023-04-05",
      upcomingAppointment: "2023-06-10"
    },
    { 
      id: 4, 
      name: "Maria Rodriguez", 
      age: 45, 
      gender: "Female", 
      conditions: ["Generalized Anxiety Disorder", "Insomnia"],
      lastVisit: "2023-03-22",
      upcomingAppointment: "2023-04-19"
    }
  ],
  recentAlerts: [
    { patientId: 1, patientName: "Sarah Johnson", alert: "Blood glucose consistently elevated for 5 days", severity: "moderate", date: "2 days ago" },
    { patientId: 2, patientName: "David Wilson", alert: "Missed last 3 medication check-ins", severity: "high", date: "1 day ago" },
    { patientId: 2, patientName: "David Wilson", alert: "Reported increased chest pain", severity: "critical", date: "5 hours ago" }
  ],
  upcomingAppointments: [
    { id: 1, patient: "David Wilson", time: "Today, 2:30 PM", type: "Follow-up", virtual: true },
    { id: 2, patient: "Sarah Johnson", time: "Tomorrow, 10:00 AM", type: "Medication Review", virtual: true },
    { id: 3, patient: "Michael Chen", time: "Apr 25, 1:15 PM", type: "Asthma Assessment", virtual: false }
  ],
  performanceMetrics: {
    patientSatisfaction: 94,
    treatmentEffectiveness: 88,
    timelinessOfCare: 91,
    documentationCompleteness: 96
  }
};

// Message type definition
interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

// State for tracking when AI is generating a response
interface ProviderAssistantAIProps {
  isOpen: boolean;
  onClose: () => void;
}

// Add supported languages
const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ru', name: 'Russian' }
];

// Helper function to format message content with better styling
const formatMessageContent = (content: string) => {
  if (!content) return '';
  
  // Trim content to remove any leading/trailing whitespace
  content = content.trim();
  
  // Remove any "AI:" prefix that might be in the existing messages
  if (content.startsWith("AI:")) {
    content = content.substring(3).trim();
  }
  
  // Remove any leading tab or spaces from each line
  content = content.replace(/^[ \t]+/gm, '');
  
  // Format section headers (e.g., **Breakfast:**)
  content = content.replace(/\*\*(.*?):\*\*/g, '<h3 class="font-semibold text-primary my-2 text-left">$1:</h3>');
  
  // Format bullet points with proper spacing and styling
  content = content.replace(/\* (.*?)(?=\n|$)/g, '<li class="ml-5 pl-1 text-left">$1</li>');
  
  // Wrap bullet point lists in ul tags
  content = content.replace(/<li.*?>(.*?)<\/li>(\s*<li.*?>.*?<\/li>)*/gs, '<ul class="my-2 text-left">$&</ul>');
  
  // Add special styling for meal plan sections
  content = content.replace(/<h3.*?>(Breakfast|Lunch|Dinner|Snacks):(.*?)<\/h3>/g, 
    '<div class="meal-plan-section text-left"><h3 class="font-semibold text-primary my-1 text-left">$1:$2</h3>');
  
  // Close the meal plan sections
  content = content.replace(/<h3.*?>((?!Breakfast|Lunch|Dinner|Snacks).+?):(.*?)<\/h3>/g, 
    '</div><h3 class="font-semibold text-primary my-1 text-left">$1:$2</h3>');
    
  // Fix any unclosed meal plan sections at the end
  if (content.includes('<div class="meal-plan-section') && 
      !content.endsWith('</div>')) {
    content += '</div>';
  }
  
  // Format nutritional information with badges
  content = content.replace(/\((\d+\s*(calories|kcal|g protein|g carbs|g fat))\)/gi, 
    '<span class="nutrient-info text-left">$1</span>');
  
  // Format paragraphs
  const paragraphs = content.split('\n\n').filter(p => p.trim());
  if (paragraphs.length > 1) {
    return '<div class="ai-message-content text-content-left">' + 
           paragraphs.map(p => {
             // Don't double-wrap elements already wrapped in tags
             if (p.trim().startsWith('<') && p.trim().endsWith('>')) {
               return p;
             }
             return `<p class="mb-3 text-left">${p.trim()}</p>`;
           }).join('') + 
           '</div>';
  }
  
  return '<div class="ai-message-content text-content-left">' + content + '</div>';
};

// Add this to the type declarations
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

const ProviderAssistantAI: React.FC<ProviderAssistantAIProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);
  const [currentSpeakingMessageId, setCurrentSpeakingMessageId] = useState<string | null>(null);
  const [voicePersona, setVoicePersona] = useState<"male" | "female">("male");
  const [isMuted, setIsMuted] = useState(false);
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState({ code: 'en', name: 'English' });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const { userType } = useContext(AuthContext);
  const navigate = useNavigate();

  // Simulate the AI persona
  const assistantName = "AIDA";
  const assistantPersonality = "professional, knowledgeable, and efficient";
  
  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Initialize Google Speech API
    const keyFilePath = import.meta.env.VITE_GOOGLE_SPEECH_KEY_PATH || '';
    if (keyFilePath) {
      googleSpeechService.initialize(keyFilePath);
    } else {
      console.warn('No Google Speech API key file path found in environment variables');
    }
    
    // For browser speech synthesis (text-to-speech)
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      
      // Load voices - Chrome needs this event to get all voices
      const loadVoices = () => {
        // Store voices in a ref to access them later
        const voices = synthRef.current?.getVoices() || [];
        console.log(`Loaded ${voices.length} speech synthesis voices`);
      };
      
      // Chrome loads voices asynchronously
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
      
      // Load voices immediately (works in Safari/Firefox)
      loadVoices();
    }
    
    return () => {
      // Clean up speech synthesis when component unmounts
      if (synthRef.current && utteranceRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);
  
  // Ensure isMounted is reset when the component is closed and reopened
  useEffect(() => {
    if (!isOpen) {
      setIsMounted(false);
    }
  }, [isOpen]);
  
  // Initial greeting from the AI
  useEffect(() => {
    if (isOpen && !isMounted) {
      const initialMessage: Message = {
        id: "system-welcome",
        role: "assistant",
        content: `Hello Dr. ${mockProviderData.name.split(' ')[1]}, I'm ${assistantName}, your healthcare provider AI assistant. I have access to your patient data, clinical alerts, appointment schedule, and practice metrics. How can I assist you today?`,
        timestamp: new Date()
      };
      
      setMessages([initialMessage]);
      setIsMounted(true);
    }
  }, [isOpen, isMounted]);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);
  
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);
  
  // Clean up on unmount or close
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);
  
  // Completely revise speech recognition to ensure it works properly
  // Toggle recording state
  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error("Error stopping speech recognition:", error);
        }
      }
      
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch (error) {
          console.error("Error stopping media recorder:", error);
        }
      }
      
      setIsRecording(false);
    } else {
      // Start recording - always try browser speech recognition first as it's most reliable
      try {
        // Check microphone permissions first
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Store the stream for later use
        const tracks = stream.getAudioTracks();
        
        // Always use Web Speech API since it's more reliable
        const webSpeechSuccess = await useWebSpeechRecognition();
        
        // If Web Speech API fails or isn't available, try Google Speech API
        if (!webSpeechSuccess) {
          const googleSpeechSuccess = await useGoogleSpeechAPI(stream);
          
          if (!googleSpeechSuccess) {
            // If both methods fail, clean up
            tracks.forEach(track => track.stop());
            throw new Error("Both speech recognition methods failed");
          }
        }
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setIsRecording(false);
        
        // Provide feedback to user
        setInputMessage("Error accessing microphone. Please check browser permissions.");
      }
    }
  };
  
  // Web Speech API for speech recognition
  const useWebSpeechRecognition = async () => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn("Web Speech API not supported in this browser, trying Google Speech API");
      return false;
    }
    
    try {
      recognitionRef.current = new SpeechRecognition();
      
      // Configure recognition
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = selectedLanguage.code;
      recognitionRef.current.maxAlternatives = 1;
      
      // Start recognition
      recognitionRef.current.start();
      setIsRecording(true);
      
      // Handle results
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        
        setInputMessage(transcript);
        
        // If the result is final and has meaningful content, submit it
        const lastResult = event.results[event.results.length - 1];
        if (lastResult?.isFinal && transcript.trim().length > 2) {
          // Stop recognition before submitting
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
          
          // Submit after a small delay
          setTimeout(() => {
            handleSubmit({
              preventDefault: () => {}
            } as React.FormEvent);
          }, 500);
        }
      };
      
      // Handle when speech recognition ends
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
      
      // Handle errors
      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setInputMessage("Microphone access denied. Please check browser permissions.");
        }
      };
      
      return true;
    } catch (error) {
      console.error("Error initializing Web Speech Recognition:", error);
      return false;
    }
  };
  
  // Google Speech API for speech recognition
  const useGoogleSpeechAPI = async (stream?: MediaStream) => {
    if (!googleSpeechService.isApiEnabled()) {
      console.warn("Google Speech API not enabled");
      return false;
    }
    
    try {
      // Use the provided stream or request microphone access if not provided
      const audioStream = stream || await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(audioStream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        // Create audio blob from chunks
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        
        try {
          // Convert Blob to ArrayBuffer before transcribing
          const arrayBuffer = await audioBlob.arrayBuffer();
          
          // Transcribe using Google Speech API
          const transcription = await googleSpeechService.transcribeAudio(arrayBuffer, selectedLanguage.code);
          
          if (transcription && transcription.trim()) {
            setInputMessage(transcription);
            
            // Auto-submit if the transcription is complete
            if (transcription.trim().length > 2) {
              // Add a small delay to allow the user to see what was transcribed
              setTimeout(() => {
                handleSubmit({
                  preventDefault: () => {}
                } as React.FormEvent);
              }, 500);
            }
          }
        } catch (transcriptionError) {
          console.error("Error transcribing audio:", transcriptionError);
          setInputMessage("Error transcribing your speech. Please try again.");
        }
      };
      
      // Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Stop recording after 10 seconds (maximum speech duration)
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, 10000);
      
      return true;
    } catch (error) {
      console.error("Error initializing Google Speech API:", error);
      return false;
    }
  };
  
  // Toggle mute state for text-to-speech
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isSpeaking) {
      stopSpeaking();
    }
  };
  
  // Toggle voice selector 
  const toggleVoiceSelector = () => {
    setShowVoiceSelector(!showVoiceSelector);
    setShowLanguageSelector(false);
  };
  
  // Toggle language selector
  const toggleLanguageSelector = () => {
    setShowLanguageSelector(!showLanguageSelector);
    setShowVoiceSelector(false);
  };
  
  // Select language
  const selectLanguage = (languageCode: string, languageName: string) => {
    setSelectedLanguage({ code: languageCode, name: languageName });
    setShowLanguageSelector(false);
  };
  
  // Select voice type
  const selectVoiceType = (voiceType: "male" | "female") => {
    setVoicePersona(voiceType);
    setShowVoiceSelector(false);
  };
  
  // Clean text for better speech synthesis
  const cleanTextForSpeech = (text: string): string => {
    if (!text) return '';
    
    // Remove HTML tags
    let cleanedText = text.replace(/<[^>]*>/g, '');
    
    // Remove Markdown formatting
    cleanedText = cleanedText.replace(/\*\*(.*?)\*\*/g, '$1');
    cleanedText = cleanedText.replace(/\*(.*?)\*/g, '$1');
    
    // Convert bullet points to natural speech
    cleanedText = cleanedText.replace(/^\s*[\*\-]\s*(.*?)$/gm, '$1. ');
    
    // Add small pauses for paragraph breaks
    cleanedText = cleanedText.replace(/\n\n/g, '. ');
    
    // Remove any excessive whitespace
    cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
    
    return cleanedText;
  };
  
  // Speak the text using text-to-speech
  const speakText = async (text: string, messageId: string) => {
    if (isMuted) return;
    
    const cleanedText = cleanTextForSpeech(text);
    
    // Stop any current speech
    stopSpeaking();
    
    if (googleSpeechService.isApiEnabled()) {
      // Use Google Text-to-Speech API for better quality
      try {
        setIsSpeaking(true);
        setCurrentSpeakingMessageId(messageId);
        
        // Start audio playback using Google TTS - pass voicePersona to fix gender neutral voice error
        await googleSpeechService.speakText(cleanedText, voicePersona, selectedLanguage.code);
        
        setIsSpeaking(false);
        setCurrentSpeakingMessageId(null);
      } catch (error: any) {
        console.error("Error with Google TTS:", error);
        
        // Check for specific error related to gender neutral voices
        if (error?.message?.includes("Gender neutral voices are not supported")) {
          console.warn("Gender neutral voices not supported - switching to specific gender voice");
          // Ensure we're using a specific gender
          if (voicePersona !== "male" && voicePersona !== "female") {
            setVoicePersona("male");
          }
        }
        
        // Fall back to browser speech synthesis
        console.log("Falling back to browser speech synthesis");
        useBrowserSpeechSynthesis(cleanedText, messageId);
      }
    } else {
      // Use browser speech synthesis
      useBrowserSpeechSynthesis(cleanedText, messageId);
    }
  };
  
  // Use browser speech synthesis
  const useBrowserSpeechSynthesis = (text: string, messageId: string) => {
    if (!window.speechSynthesis || !text) return;
    
    try {
      // Create a new utterance
      utteranceRef.current = new SpeechSynthesisUtterance(text);
      
      // Set language
      utteranceRef.current.lang = selectedLanguage.code;
      
      // Set voice characteristics based on persona
      const voices = window.speechSynthesis.getVoices();
      
      // Find voices matching the selected language
      const languageVoices = voices.filter(voice => 
        voice.lang.startsWith(selectedLanguage.code) || 
        (selectedLanguage.code === 'en' && voice.lang.startsWith('en-'))
      );
      
      // First try to find a voice matching both language and gender
      // Use more specific gender filtering to avoid neutral voices
      const genderVoices = languageVoices.filter(voice => {
        const voiceName = voice.name.toLowerCase();
        if (voicePersona === 'female') {
          return (voiceName.includes('female') || voiceName.includes('woman')) && 
                 !voiceName.includes('male') && 
                 !voiceName.includes('neutral');
        } else { // male
          return (voiceName.includes('male') || voiceName.includes('man')) && 
                 !voiceName.includes('female') && 
                 !voiceName.includes('neutral');
        }
      });
      
      // Choose a voice with preference for quality voices
      let selectedVoice = null;
      
      if (genderVoices.length > 0) {
        // Priority for neural/enhanced voices
        const enhancedVoice = genderVoices.find(voice => 
          voice.name.includes('Neural') || 
          voice.name.includes('Enhanced') || 
          voice.name.includes('Wavenet')
        );
        
        selectedVoice = enhancedVoice || genderVoices[0];
      } else if (languageVoices.length > 0) {
        // If no gender-specific voice is found, try to find one that's definitely not neutral
        const nonNeutralVoice = languageVoices.find(voice => 
          !voice.name.toLowerCase().includes('neutral')
        );
        
        // Fall back to any voice in selected language
        selectedVoice = nonNeutralVoice || languageVoices[0];
      } else {
        // Fall back to default voice
        selectedVoice = voices.find(voice => voice.default) || voices[0];
      }
      
      if (selectedVoice) {
        utteranceRef.current.voice = selectedVoice;
        console.log(`Using voice: ${selectedVoice.name} (${selectedVoice.lang})`);
      }
      
      // Set other properties
      utteranceRef.current.rate = 1.0;
      utteranceRef.current.pitch = voicePersona === 'female' ? 1.1 : 0.9;
      utteranceRef.current.volume = 1.0;
      
      // Set speaking state
      setIsSpeaking(true);
      setCurrentSpeakingMessageId(messageId);
      
      // Handle speech end
      utteranceRef.current.onend = () => {
        setIsSpeaking(false);
        setCurrentSpeakingMessageId(null);
      };
      
      // Handle errors
      utteranceRef.current.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setIsSpeaking(false);
        setCurrentSpeakingMessageId(null);
      };
      
      // Start speaking
      window.speechSynthesis.speak(utteranceRef.current);
    } catch (error) {
      console.error("Error during speech synthesis:", error);
      setIsSpeaking(false);
      setCurrentSpeakingMessageId(null);
    }
  };
  
  // Stop current speech
  const stopSpeaking = () => {
    if (googleSpeechService.isApiEnabled()) {
      googleSpeechService.stopSpeaking();
    }
    
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    setIsSpeaking(false);
    setCurrentSpeakingMessageId(null);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const userInput = inputMessage.trim();
    if (!userInput) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userInput,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsGenerating(true);
    
    // Stop any current speech
    stopSpeaking();
    
    try {
      // Generate initial partial response
      const aiMessageId = `assistant-${Date.now()}`;
      
      // Add initial AI message as placeholder
      setMessages(prev => [
        ...prev, 
        {
          id: aiMessageId,
          role: "assistant",
          content: "",
          timestamp: new Date()
        }
      ]);
      
      // Generate response using Gemini API (or mock if not initialized)
      if (!geminiApiService.isApiInitialized()) {
        // Initialize with a default API key if not already done
        // In production, you'd want to get this from environment variable
        geminiApiService.initialize({ 
          apiKey: import.meta.env.VITE_GEMINI_API_KEY || ""
        });
      }
      
      // Prepare the provider data in the format expected by the API service
      const providerContextData = {
        name: mockProviderData.name,
        age: mockProviderData.experience, // Reusing the field for years of experience
        gender: "Provider", // Mark this as a provider context
        conditions: [], // Not applicable for providers
        medications: [], // Not applicable for providers
        allergies: [], // Not applicable for providers
        recentVitals: {}, // Not applicable for providers
        specialty: mockProviderData.specialty,
        clinic: mockProviderData.clinic,
        patients: mockProviderData.patients,
        recentAlerts: mockProviderData.recentAlerts,
        upcomingAppointments: mockProviderData.upcomingAppointments,
        performanceMetrics: mockProviderData.performanceMetrics
      };
      
      // Get all messages in the format expected by the API
      const apiMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add the new user message
      apiMessages.push({
        role: userMessage.role,
        content: userMessage.content
      });
      
      // Get response using Gemini API
      const response = await geminiApiService.generateResponse(
        apiMessages, 
        providerContextData, 
        { 
          temperature: 0.7, 
          maxTokens: 800,
          language: selectedLanguage.code
        }
      );
      
      // Update AI message with the response
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId
          ? { ...msg, content: response }
          : msg
      ));
      
      // Wait briefly then speak the response if not muted
      if (!isMuted) {
        // Small delay to allow UI to update
        setTimeout(() => {
          speakText(response, aiMessageId);
        }, 500);
      }
    } catch (error) {
      console.error("Error generating response:", error);
      
      // Add error message
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Get contextual suggestions for the user
  const getContextualSuggestions = () => {
    // Find patients with critical alerts
    const patientsWithCriticalAlerts = mockProviderData.recentAlerts
      .filter(alert => alert.severity === "critical")
      .map(alert => alert.patientName);
    
    // Create specific suggestions for critical patients
    const criticalPatientSuggestions = patientsWithCriticalAlerts.map(name => 
      `What's the status of ${name}'s chest pain alert?`
    );
    
    // Find patients with appointments today
    const todaysAppointments = mockProviderData.upcomingAppointments
      .filter(apt => apt.time.includes("Today"))
      .map(apt => apt.patient);
    
    // Create specific suggestions for today's appointments
    const appointmentSuggestions = todaysAppointments.map(name => 
      `Prepare for ${name}'s appointment today`
    );
    
    // Default suggestions for provider common tasks
    const providerSuggestions = [
      "Show my high-risk patients",
      "Summarize today's urgent alerts",
      "What appointments do I have today?",
      "Review my performance metrics"
    ];

    // Specific suggestions for different provider tasks
    const patientManagementSuggestions = [
      "Give me a summary of Sarah Johnson's case",
      "What's David Wilson's treatment plan?",
      "Who needs medication review this week?",
      "Show patients with missed appointments"
    ];

    const clinicalSuggestions = [
      "Explain treatment options for resistant hypertension",
      "What are the latest guidelines for diabetes management?",
      "Help me interpret these lab results",
      "Suggest alternative medications for patients with drug allergies"
    ];

    // If there's a user question, try to provide contextual follow-ups
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
      
      if (lastUserMessage) {
        const query = lastUserMessage.content.toLowerCase();
        
        // Check if the query is about a specific patient
        const matchedPatient = mockProviderData.patients.find(patient => 
          query.toLowerCase().includes(patient.name.toLowerCase()) ||
          (patient.name.split(' ')[0] && query.toLowerCase().includes(patient.name.split(' ')[0].toLowerCase()))
        );
        
        if (matchedPatient) {
          return [
            `What are ${matchedPatient.name}'s recent vital signs?`,
            `When is ${matchedPatient.name}'s next appointment?`,
            `Show me ${matchedPatient.name}'s medication list`,
            `What's ${matchedPatient.name}'s treatment history?`
          ];
        }
        
        // Specific follow-up suggestions based on current topic
        if (query.includes('patient') || query.includes('sarah') || query.includes('david') || query.includes('michael') || query.includes('maria')) {
          return [
            "What are their recent vital signs?",
            "When is their next appointment?",
            "Show me their medication list",
            "What's their treatment history?"
          ];
        } else if (query.includes('alert') || query.includes('critical') || query.includes('urgent')) {
          return [
            "Which patients need immediate attention?",
            "What's the status of the chest pain alert?",
            "Are there any medication compliance issues?",
            "Sort alerts by severity"
          ];
        } else if (query.includes('appointment') || query.includes('schedule') || query.includes('visit')) {
          return [
            "What's my schedule for tomorrow?",
            "How many telemedicine visits this week?",
            "Which patients need follow-up appointments?",
            "Any appointment conflicts to resolve?"
          ];
        } else if (query.includes('metric') || query.includes('performance') || query.includes('outcome')) {
          return [
            "How has my patient satisfaction changed?",
            "What's my documentation completeness score?",
            "Compare my outcomes to clinic average",
            "Areas where I can improve?"
          ];
        } else if (query.includes('diabetes') || query.includes('hypertension') || query.includes('cardiac')) {
          return [
            "Show me patients with uncontrolled diabetes",
            "What are the latest treatment protocols?",
            "Medication adherence statistics",
            "Compare treatment outcomes by approach"
          ];
        }
      }
    }
    
    // If there are critical patients or today's appointments, prioritize those
    if (criticalPatientSuggestions.length > 0 || appointmentSuggestions.length > 0) {
      const priorityList = [
        ...criticalPatientSuggestions,
        ...appointmentSuggestions,
        ...providerSuggestions
      ];
      return priorityList.slice(0, 4);
    }
    
    // If we don't have context-specific suggestions, use a random mix
    const allSuggestions = [
      ...providerSuggestions,
      ...patientManagementSuggestions,
      ...clinicalSuggestions
    ];
    
    const shuffled = [...allSuggestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  };
  
  // Handle sending suggestion as a message
  const handleSendSuggestion = (suggestion: string) => {
    setInputMessage(suggestion);
    setTimeout(() => {
      handleSubmit({
        preventDefault: () => {}
      } as React.FormEvent);
    }, 100);
  };
  
  // Play last assistant message
  const playLastAssistantMessage = () => {
    const lastAssistantMessage = [...messages].reverse().find(msg => msg.role === 'assistant');
    if (lastAssistantMessage) {
      speakText(lastAssistantMessage.content, lastAssistantMessage.id);
    }
  };

  // Handle the modal close properly
  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Prevent event bubbling
    }
    
    // Stop any speech before closing
    stopSpeaking();
    
    // Stop any ongoing recording
    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (error) {
          console.error("Error stopping speech recognition:", error);
        }
      }
      
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch (error) {
          console.error("Error stopping media recorder:", error);
        }
      }
      
      setIsRecording(false);
    }
    
    // Reset all state
    setMessages([]);
    setInputMessage("");
    setIsMounted(false);
    setIsGenerating(false);
    setCurrentSpeakingMessageId(null);
    setShowLanguageSelector(false);
    setShowVoiceSelector(false);
    
    // Navigate to the provider dashboard
    navigate('/provider-dashboard');
    
    // Call the parent's onClose to actually close the dialog
    setTimeout(() => {
      onClose();
    }, 10);
  };

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8" 
      onClick={handleClose}
      style={{ overflowY: 'hidden' }}
    >
      <div 
        ref={modalRef}
        className="bg-card w-full max-w-3xl rounded-xl shadow-lg border border-border flex flex-col h-[80vh] overflow-hidden transition-all duration-300 ease-in-out transform animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-5"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30 shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-blue-500/20">
              <AvatarImage src="/ai-assistant-avatar.png" />
              <AvatarFallback className="bg-blue-600/10 text-blue-600">
                <Stethoscope className="h-6 w-6 text-blue-600" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">{assistantName}</h2>
                <Badge variant="outline" className="font-normal text-xs flex items-center gap-1">
                  <SparklesIcon className="h-3 w-3" />
                  <span>Gemini AI</span>
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <p className="text-xs text-muted-foreground">Healthcare Provider Assistant</p>
                <Badge variant="outline" className="ml-1 bg-primary/5 text-[10px] py-0 px-1 font-semibold">
                  <Volume2 className="h-2 w-2 mr-0.5" />
                  {googleSpeechService.isApiEnabled() ? "Google Neural2" : "Browser TTS"}
                </Badge>
                <Badge variant="outline" className="ml-1 bg-primary/5 text-[10px] py-0 px-1 font-semibold">
                  <Globe className="h-2 w-2 mr-0.5" />
                  {selectedLanguage.name}
                </Badge>
                <Badge variant="outline" className="ml-1 bg-primary/5 text-[10px] py-0 px-1 font-semibold">
                  <Settings className="h-2 w-2 mr-0.5" />
                  {voicePersona === "male" ? "Male Voice" : "Female Voice"}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Language selector */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLanguageSelector();
                }}
                className="h-8 w-8"
              >
                <Globe className="h-4 w-4" />
              </Button>
              
              {showLanguageSelector && (
                <div 
                  className="absolute right-0 top-full mt-1 bg-card border border-border rounded-md shadow-md overflow-hidden z-10 min-w-40"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-2 border-b border-border">
                    <p className="text-xs font-medium">Select Language</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {supportedLanguages.map(lang => (
                      <button
                        key={lang.code}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-muted/50 flex items-center justify-between ${
                          selectedLanguage.code === lang.code ? 'bg-muted' : ''
                        }`}
                        onClick={() => selectLanguage(lang.code, lang.name)}
                      >
                        {lang.name}
                        {selectedLanguage.code === lang.code && (
                          <Sparkles className="h-3 w-3" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Voice type selector */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleVoiceSelector();
                }}
                className="h-8 w-8"
              >
                <Settings className="h-4 w-4" />
              </Button>
              
              {showVoiceSelector && (
                <div 
                  className="absolute right-0 top-full mt-1 bg-card border border-border rounded-md shadow-md overflow-hidden z-10 min-w-40"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-2 border-b border-border">
                    <p className="text-xs font-medium">Select Voice</p>
                  </div>
                  <div>
                    <button
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-muted/50 flex items-center justify-between ${
                        voicePersona === 'male' ? 'bg-muted' : ''
                      }`}
                      onClick={() => selectVoiceType('male')}
                    >
                      Male Voice
                      {voicePersona === 'male' && (
                        <Sparkles className="h-3 w-3" />
                      )}
                    </button>
                    <button
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-muted/50 flex items-center justify-between ${
                        voicePersona === 'female' ? 'bg-muted' : ''
                      }`}
                      onClick={() => selectVoiceType('female')}
                    >
                      Female Voice
                      {voicePersona === 'female' && (
                        <Sparkles className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Stop speaking button */}
            {isSpeaking && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  stopSpeaking();
                }}
                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                title="Stop Speaking"
              >
                <Headphones className="h-4 w-4" />
              </Button>
            )}
            
            {/* Mute toggle button */}
            <Button
              variant={isMuted ? "secondary" : "ghost"}
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              className={`h-8 w-8 ${isMuted ? 'bg-red-100 text-red-600 hover:bg-red-200' : ''}`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
              title="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Provider Context Header */}
          <div className="bg-blue-50/80 rounded-lg p-3 mb-4 border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-blue-600" />
                <div>
                  <span className="text-sm font-medium">Provider: {mockProviderData.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">• {mockProviderData.specialty}, {mockProviderData.clinic}</span>
                </div>
              </div>
              <Badge variant="outline" className="text-blue-700 bg-blue-50 border-blue-200">
                {mockProviderData.patients.length} Active Patients
              </Badge>
            </div>
            
            <div className="mt-3 grid grid-cols-4 gap-3">
              <div className="bg-white rounded border border-blue-100 p-2 text-center">
                <div className="text-sm font-medium">{mockProviderData.recentAlerts.length}</div>
                <div className="text-xs text-muted-foreground">Critical Alerts</div>
              </div>
              <div className="bg-white rounded border border-blue-100 p-2 text-center">
                <div className="text-sm font-medium">{mockProviderData.upcomingAppointments.filter(a => a.time.includes("Today")).length}</div>
                <div className="text-xs text-muted-foreground">Today's Appts</div>
              </div>
              <div className="bg-white rounded border border-blue-100 p-2 text-center">
                <div className="text-sm font-medium">{mockProviderData.performanceMetrics.patientSatisfaction}%</div>
                <div className="text-xs text-muted-foreground">Patient Satisfaction</div>
              </div>
              <div className="bg-white rounded border border-blue-100 p-2 text-center">
                <div className="text-sm font-medium">{mockProviderData.performanceMetrics.treatmentEffectiveness}%</div>
                <div className="text-xs text-muted-foreground">Treatment Success</div>
              </div>
            </div>
            
            {/* Patient Summary Section - Critical patients */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-blue-700">High Priority Patients</h3>
                <Badge variant="outline" className="text-red-600 bg-red-50 border-red-200 text-xs">
                  {mockProviderData.recentAlerts.length} Alerts
                </Badge>
              </div>
              
              <div className="space-y-2">
                {/* Show patients with alerts */}
                {Array.from(new Set(mockProviderData.recentAlerts.map(alert => alert.patientId))).map(patientId => {
                  const patient = mockProviderData.patients.find(p => p.id === patientId);
                  const patientAlerts = mockProviderData.recentAlerts.filter(a => a.patientId === patientId);
                  const criticalAlert = patientAlerts.find(a => a.severity === "critical");
                  
                  if (!patient) return null;
                  
                  return (
                    <div key={patientId} className={`p-2 rounded-md border ${criticalAlert ? 'bg-red-50 border-red-200' : 'bg-white border-blue-100'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${criticalAlert ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`} />
                          <span className="text-sm font-medium">{patient.name}</span>
                          <span className="text-xs text-muted-foreground">• {patient.age} y/o {patient.gender}</span>
                        </div>
                        <div>
                          {patient.conditions.slice(0, 2).map((condition, i) => (
                            <Badge key={i} variant="outline" className="text-[10px] ml-1">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {criticalAlert ? (
                          <span className="text-red-600 font-medium">{criticalAlert.alert}</span>
                        ) : (
                          <span>{patientAlerts[0].alert}</span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Next appointment today */}
                {mockProviderData.upcomingAppointments
                  .filter(apt => apt.time.includes("Today"))
                  .slice(0, 1)
                  .map((apt, i) => {
                    const patient = mockProviderData.patients.find(p => p.name === apt.patient);
                    if (!patient) return null;
                    
                    return (
                      <div key={`apt-${i}`} className="p-2 rounded-md border border-blue-100 bg-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                            <span className="text-sm font-medium">{patient.name}</span>
                            <span className="text-xs text-muted-foreground">• {apt.time}</span>
                          </div>
                          <Badge variant="outline" className="text-[10px]">
                            {apt.type}
                          </Badge>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Next appointment ({apt.virtual ? "Virtual" : "In-person"})
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex flex-col ${
                message.role === "user" ? "items-end" : "items-start"
              } mb-4`}
            >
              <div className="flex items-start gap-3 max-w-[85%]">
                {/* Avatar for assistant */}
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 mt-0.5 border border-blue-500/20">
                    <AvatarFallback className="bg-blue-600/10 text-blue-600">
                      <Stethoscope className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                {/* Message content */}
                <div
                  className={`rounded-xl px-4 py-2.5 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  } ${
                    message.role === "assistant" && currentSpeakingMessageId === message.id
                      ? "speaking-animation border border-blue-400/30"
                      : ""
                  }`}
                >
                  {message.role === "user" ? (
                    <p>{message.content}</p>
                  ) : (
                    <div
                      className="prose prose-sm max-w-none prose-p:leading-normal prose-p:my-1 dark:prose-invert"
                      dangerouslySetInnerHTML={{
                        __html: formatMessageContent(message.content || "Thinking..."),
                      }}
                    />
                  )}
                </div>
                
                {/* Avatar for user */}
                {message.role === "user" && (
                  <Avatar className="h-8 w-8 mt-0.5">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
              
              {/* Play button for assistant messages */}
              {message.role === "assistant" && message.content && (
                <div className="ml-11 mt-1 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => speakText(message.content, message.id)}
                    disabled={isSpeaking && currentSpeakingMessageId === message.id}
                  >
                    {isSpeaking && currentSpeakingMessageId === message.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Headphones className="h-3 w-3" />
                    )}
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                    }).format(message.timestamp)}
                  </span>
                </div>
              )}
            </div>
          ))}
          
          {/* Loading indicator */}
          {isGenerating && (
            <div className="flex items-start gap-3 max-w-[85%]">
              <Avatar className="h-8 w-8 mt-0.5">
                <AvatarFallback className="bg-blue-600/10 text-blue-600">
                  <Stethoscope className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-xl px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-blue-600/60 animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-blue-600/60 animate-bounce delay-75" />
                  <div className="h-2 w-2 rounded-full bg-blue-600/60 animate-bounce delay-150" />
                </div>
              </div>
            </div>
          )}
          
          {/* Empty div for scrolling reference */}
          <div ref={messagesEndRef} />
        </ScrollArea>
        
        {/* Suggested questions */}
        {messages.length > 0 && !isGenerating && (
          <div className="px-4 py-2.5 border-t border-border grid grid-cols-2 gap-2">
            {getContextualSuggestions().map((suggestion, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSendSuggestion(suggestion);
                }}
                className="text-xs bg-muted hover:bg-muted/80 transition-colors text-left px-3 py-1.5 rounded-md"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        
        {/* Input area */}
        <div className="p-4 border-t border-border shrink-0">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                toggleRecording();
              }}
              className={`flex-shrink-0 ${isRecording ? "text-red-500" : ""}`}
            >
              <Mic className="h-5 w-5" />
            </Button>
            
            <Input
              ref={inputRef}
              type="text"
              placeholder="Ask anything about your patients, alerts, appointments, or clinical needs..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1"
              disabled={isRecording}
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Buttons container */}
            <div className="flex gap-1">
              {/* Stop speaking button (mobile-friendly placement) */}
              {isSpeaking && (
                <Button
                  type="button" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    stopSpeaking();
                  }}
                  className="flex-shrink-0 border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Headphones className="h-5 w-5 mr-1" />
                  <span>Stop</span>
                </Button>
              )}
              
              <Button
                type="submit"
                onClick={(e) => e.stopPropagation()}
                disabled={!inputMessage.trim() || isGenerating}
                className="flex-shrink-0"
              >
                {isGenerating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProviderAssistantAI; 