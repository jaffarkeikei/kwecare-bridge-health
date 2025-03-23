import React, { useState, useEffect, useRef, useContext } from "react";
import { Bot, User, Send, X, Loader2, Brain, History, Activity, FileHeart, Sparkles, Mic, Volume2, VolumeX, Headphones, Settings, Globe } from "lucide-react";
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

// Mock patient data - in a real app this would come from your backend
const mockPatientData = {
  name: "Sarah Johnson",
  age: 42,
  gender: "Female",
  conditions: ["Type 2 Diabetes", "Hypertension"],
  medications: [
    { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
    { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" }
  ],
  allergies: ["Penicillin", "Shellfish"],
  lastVisit: "2023-03-15",
  upcomingAppointment: "2023-04-22",
  recentVitals: {
    bloodPressure: "138/85",
    heartRate: 76,
    bloodSugar: "142 mg/dL",
    weight: "168 lbs"
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
interface PersonalDoctorAIProps {
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

const PersonalDoctorAI: React.FC<PersonalDoctorAIProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);
  const [currentSpeakingMessageId, setCurrentSpeakingMessageId] = useState<string | null>(null);
  const [voicePersona, setVoicePersona] = useState<string>("female");
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
  const doctorName = "Dr. AIDA";
  const doctorPersonality = "compassionate, knowledgeable, and culturally aware";
  
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
  
  // Initial greeting from the AI
  useEffect(() => {
    if (isOpen && !isMounted) {
      const initialMessage: Message = {
        id: "system-welcome",
        role: "assistant",
        content: `Hello ${mockPatientData.name}, I'm ${doctorName}, your personal AI health assistant. I'm here to help you with any health questions or concerns you might have. I have access to your health records and can provide tailored advice based on your medical history. How can I assist you today?`,
        timestamp: new Date()
      };
      
      setMessages([initialMessage]);
      setIsMounted(true);
    }
  }, [isOpen, isMounted]);

  // Focus on input when component opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Disable body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Disable scrolling on body
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Re-enable scrolling when component unmounts
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle escape key press to close modal
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);
  
  // Handle typing effect when AI speaks
  useEffect(() => {
    if (currentSpeakingMessageId && typingIndex > 0) {
      const message = messages.find(msg => msg.id === currentSpeakingMessageId);
      if (message && typingIndex < message.content.length) {
        const typingTimeout = setTimeout(() => {
          setTypingIndex(prev => prev + 1);
        }, 30); // Adjust typing speed here
        
        return () => clearTimeout(typingTimeout);
      }
    }
  }, [typingIndex, currentSpeakingMessageId, messages]);

  // Function to toggle recording
  const toggleRecording = async () => {
    if (isRecording) {
      // If we're already recording, stop it
      console.log("Stopping recording");
      
      // Stop MediaRecorder if active
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      
      // Stop Web Speech API if active
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      setIsRecording(false);
    } else {
      try {
        console.log("Starting recording...");
        
        // Try using Web Speech API first if available (more reliable in browsers)
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
          console.log("Using Web Speech API (browser native)");
          return useWebSpeechRecognition();
        }
        
        // Fall back to MediaRecorder + Google Cloud if Web Speech API isn't available
        console.log("Using MediaRecorder + Google Speech API");
        
        // Check browser support for MediaRecorder
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error("Media recording not supported in this browser");
          alert("Voice recording is not supported in your browser. Try Chrome or Edge.");
          return;
        }

        // Verify Google Speech API is initialized
        if (!googleSpeechService.isApiInitialized()) {
          console.warn("Google Speech API not initialized. Using mock service.");
          const keyFilePath = import.meta.env.VITE_GOOGLE_SPEECH_KEY_PATH || '';
          if (keyFilePath) {
            googleSpeechService.initialize(keyFilePath);
          } else {
            console.warn('Missing Google Speech API key path. Will use mock responses.');
          }
        }
        
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } 
        });
        
        console.log("Microphone access granted");
        
        // Create media recorder with supported options
        let options;
        if (MediaRecorder.isTypeSupported('audio/webm')) {
          options = {mimeType: 'audio/webm'};
        } else {
          options = {};
        }
        
        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        
        // Set up event handlers
        mediaRecorder.ondataavailable = (e) => {
          console.log("Data available event, data size:", e.data.size);
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };
        
        mediaRecorder.onstop = async () => {
          console.log("MediaRecorder stopped, processing audio...");
          console.log("Audio chunks collected:", audioChunksRef.current.length);
          
          if (audioChunksRef.current.length === 0) {
            console.warn("No audio chunks collected");
            setIsRecording(false);
            return;
          }
          
          // Create blob from chunks
          const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
          console.log("Created audio blob of type", mediaRecorder.mimeType, "size:", audioBlob.size);
          
          // Convert blob to array buffer for the Google Speech API
          const arrayBuffer = await audioBlob.arrayBuffer();
          console.log("Converted to ArrayBuffer, size:", arrayBuffer.byteLength);
          
          try {
            // Show transcribing indicator
            setInputMessage("Transcribing...");
            
            // Send audio to Google Speech API
            console.log("Sending to Google Speech API for transcription");
            const transcript = await googleSpeechService.transcribeAudio(arrayBuffer);
            console.log("Received transcript:", transcript);
            
            if (transcript && transcript.trim()) {
              setInputMessage(transcript);
              
              // Auto-submit after a short delay
              setTimeout(() => {
                if (inputRef.current && inputRef.current.form) {
                  inputRef.current.form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                }
              }, 500);
            } else {
              setInputMessage("");
              console.warn("Empty transcript received");
            }
          } catch (error) {
            console.error("Error with Google Speech API:", error);
            setInputMessage("");
            alert("Sorry, I couldn't understand what you said. Please try again.");
          } finally {
            // Stop all tracks
            stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
          }
        };
        
        // Add error logging
        mediaRecorder.onerror = (event) => {
          console.error("MediaRecorder error:", event);
          setIsRecording(false);
          alert("Error recording audio");
        };
        
        // Start recording with a time slice to get data frequently
        mediaRecorder.start(1000); // Get data every second
        setInputMessage("Recording... (speak now)");
        setIsRecording(true);
        console.log("MediaRecorder started with mimeType:", mediaRecorder.mimeType);
        
      } catch (error) {
        console.error("Recording initialization error:", error);
        setIsRecording(false);
        alert("Couldn't access your microphone. Please check permissions and try again.");
      }
    }
  };
  
  // Function to use Web Speech API directly
  const useWebSpeechRecognition = () => {
    try {
      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      
      // Configure recognition
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      // Set up event handlers
      recognition.onstart = () => {
        console.log("Web Speech recognition started");
        setIsRecording(true);
        setInputMessage("Listening...");
      };
      
      recognition.onresult = (event) => {
        console.log("Speech recognition result received");
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join(' ');
        
        console.log("Web Speech API transcript:", transcript);
        setInputMessage(transcript);
      };
      
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Web Speech recognition error:", event.error);
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          alert("Microphone access denied. Please allow microphone access in your browser settings.");
        }
      };
      
      recognition.onend = () => {
        console.log("Web Speech recognition ended");
        setIsRecording(false);
        
        // If there's input, submit it after a short delay
        setTimeout(() => {
          if (inputRef.current?.value && 
              inputRef.current.value.trim() && 
              inputRef.current.value !== "Listening...") {
            const form = inputRef.current.form;
            if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
          }
        }, 500);
      };
      
      // Start recognition
      recognition.start();
    } catch (error) {
      console.error("Web Speech API error:", error);
      setIsRecording(false);
      alert("Speech recognition failed. Trying another method...");
      
      // Fall back to mock input if Web Speech API fails
      setInputMessage("What should I do to manage my diabetes?");
      setTimeout(() => {
        if (inputRef.current && inputRef.current.form) {
          inputRef.current.form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      }, 500);
    }
  };
  
  // Function to toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    if (!isMuted) {
      // If we're unmuting, stop any ongoing speech
      stopSpeaking();
    }
  };
  
  // Function to toggle voice selector
  const toggleVoiceSelector = () => {
    setShowVoiceSelector(!showVoiceSelector);
  };
  
  // Function to toggle language selector
  const toggleLanguageSelector = () => {
    setShowLanguageSelector(!showLanguageSelector);
    // Close the voice selector if it's open
    if (showVoiceSelector) {
      setShowVoiceSelector(false);
    }
  };
  
  // Function to select language
  const selectLanguage = (languageCode: string, languageName: string) => {
    setSelectedLanguage({ code: languageCode, name: languageName });
    setShowLanguageSelector(false);
  };
  
  // Function to clean text from markdown and HTML before speaking
  const cleanTextForSpeech = (text: string): string => {
    // Remove HTML tags
    let cleanedText = text.replace(/<[^>]*>/g, '');
    
    // Remove markdown formatting
    // Remove ** ** bold formatting
    cleanedText = cleanedText.replace(/\*\*(.*?)\*\*/g, '$1');
    
    // Remove * for bullet points
    cleanedText = cleanedText.replace(/^\s*\*\s+/gm, '• ');
    
    // Remove any remaining asterisks
    cleanedText = cleanedText.replace(/\*/g, '');
    
    // Remove other markdown formatting
    cleanedText = cleanedText.replace(/\_\_|\_{1,2}|\#{1,6}\s|\`{1,3}/g, '');
    
    return cleanedText;
  };
  
  // Function to speak text
  const speakText = async (text: string, messageId: string) => {
    try {
      // If muted, don't speak
      if (isMuted) {
        return;
      }
      
      // Cancel any ongoing speech
      if (isSpeaking) {
        stopSpeaking();
      }
      
      setIsSpeaking(true);
      setCurrentSpeakingMessageId(messageId);
      setTypingIndex(0); // Reset typing index
      
      // Use Google TTS API with selected language
      console.log(`Using Google TTS API to speak in ${selectedLanguage.name}`);
      
      // Call the GoogleSpeechService to speak text with language
      await googleSpeechService.speakText(text, voicePersona, selectedLanguage.code);
      
      // Set up a listener for when Google TTS finishes speaking
      const checkSpeakingInterval = setInterval(() => {
        if (!googleSpeechService.isCurrentlySpeaking()) {
          clearInterval(checkSpeakingInterval);
          setIsSpeaking(false);
          setCurrentSpeakingMessageId(null);
        }
      }, 100);
    } catch (error) {
      console.error("Error with Google TTS:", error);
      setIsSpeaking(false);
      setCurrentSpeakingMessageId(null);
      
      // Fall back to browser's speech synthesis if Google TTS fails
      if (synthRef.current) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = selectedLanguage.code;
        utterance.onend = () => {
          setIsSpeaking(false);
          setCurrentSpeakingMessageId(null);
        };
        synthRef.current.speak(utterance);
      }
    }
  };
  
  // Function to stop speaking
  const stopSpeaking = () => {
    // Stop Google TTS
    googleSpeechService.stopSpeaking();
    
    // Also stop browser speech synthesis as fallback
    if (synthRef.current && isSpeaking) {
      synthRef.current.cancel();
    }
    
    setIsSpeaking(false);
    setCurrentSpeakingMessageId(null);
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
    
    // Navigate to provider dashboard if the user is a provider
    if (userType === "provider") {
      navigate('/provider-dashboard');
    }
    
    // Call the parent's onClose to actually close the dialog
    setTimeout(() => {
      onClose();
    }, 10);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isGenerating) return;
    
    // Stop recording if active
    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsGenerating(true);
    
    try {
      // Check if Gemini API is initialized
      if (!geminiApiService.isApiInitialized()) {
        // Get API key from environment variables or use a fallback for development
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
        
        if (!apiKey) {
          console.warn('No Gemini API key found in environment variables. Using mock responses.');
        }
        
        // Initialize with the Gemini API key
        geminiApiService.initialize({ apiKey });
      }
      
      // Format messages for the API
      const formattedMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add the new user message
      formattedMessages.push({
        role: userMessage.role,
        content: userMessage.content
      });
      
      // Get response from Gemini API with language preference
      const aiResponse = await geminiApiService.generateResponse(
        formattedMessages,
        mockPatientData,
        { 
          temperature: 0.7,
          language: selectedLanguage.code
        }
      );
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Auto-speak the response if not muted
      if (!isMuted) {
        const plainTextResponse = aiResponse.replace(/<[^>]*>/g, ''); // Remove HTML tags
        const cleanedText = cleanTextForSpeech(plainTextResponse);
        speakText(cleanedText, assistantMessage.id);
      }
      
    } catch (error) {
      console.error("Error generating AI response:", error);
      
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "system",
        content: "I'm sorry, I encountered an error processing your request. Please try again later.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to generate contextual suggestions based on patient data and user's question
  const getContextualSuggestions = () => {
    // Default suggestions based on patient's medical conditions
    const patientConditionSuggestions = [] as string[];
    
    // Add suggestions based on patient's medical conditions
    mockPatientData.conditions.forEach(condition => {
      if (condition.toLowerCase().includes('diabetes')) {
        patientConditionSuggestions.push(
          "How can I lower my blood sugar naturally?",
          "What foods are best for my diabetes?",
          "How does exercise affect my blood sugar?"
        );
      }
      if (condition.toLowerCase().includes('hypertension')) {
        patientConditionSuggestions.push(
          "What lifestyle changes help with blood pressure?",
          "How can I monitor my blood pressure at home?",
          "What foods help lower blood pressure?"
        );
      }
    });
    
    // Add suggestions based on patient's medications
    const medicationSuggestions = mockPatientData.medications.map(med => 
      `What should I know about ${med.name}?`
    );
    
    // Combine all suggestions
    const allSuggestions = [
      ...patientConditionSuggestions,
      ...medicationSuggestions,
      "When should I schedule my next checkup?",
      "What preventive screenings do I need?",
      "How can I improve my overall health?"
    ];
    
    // If there's a user question, try to provide contextual follow-ups
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
      
      if (lastUserMessage) {
        const query = lastUserMessage.content.toLowerCase();
        
        // Specific follow-up suggestions based on current topic
        if (query.includes('diabetes') || query.includes('blood sugar') || query.includes('glucose')) {
          return [
            "What's a healthy blood sugar range for me?",
            "How often should I check my blood sugar?",
            "Can stress affect my blood sugar levels?"
          ];
        } else if (query.includes('blood pressure') || query.includes('hypertension')) {
          return [
            "Is my current blood pressure reading concerning?",
            "How does salt impact my blood pressure?",
            "What time of day should I take my blood pressure medicine?"
          ];
        } else if (query.includes('medication') || query.includes('medicine') || query.includes('drug')) {
          return [
            "Are there any side effects I should watch for?",
            "Should I take my medications with food?",
            "Can I take these medications together?"
          ];
        } else if (query.includes('diet') || query.includes('food') || query.includes('eat')) {
          return [
            "What foods should I limit with my conditions?",
            "Are there specific diets good for diabetes?",
            "How many meals should I eat per day?"
          ];
        } else if (query.includes('exercise') || query.includes('activity') || query.includes('workout')) {
          return [
            "What exercises are safe with my conditions?",
            "How often should I exercise?",
            "Can exercise replace medication?"
          ];
        }
      }
    }
    
    // If we don't have context-specific suggestions, use a random selection from all suggestions
    const shuffled = [...allSuggestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  // Get current three suggestions
  const currentSuggestions = getContextualSuggestions();

  // Handle sending a suggestion
  const handleSendSuggestion = (suggestion: string) => {
    setInputMessage(suggestion);
    setTimeout(() => {
      if (inputRef.current) {
        const form = inputRef.current.form;
        if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }, 100);
  };

  // Function to play the last assistant message
  const playLastAssistantMessage = () => {
    const assistantMessages = messages.filter(msg => msg.role === 'assistant');
    if (assistantMessages.length > 0) {
      const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];
      const plainTextResponse = lastAssistantMessage.content.replace(/<[^>]*>/g, '');
      const cleanedText = cleanTextForSpeech(plainTextResponse);
      speakText(cleanedText, lastAssistantMessage.id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8" onClick={handleClose}>
      <div 
        ref={modalRef}
        className="bg-card w-full max-w-3xl rounded-xl shadow-lg border border-border flex flex-col h-[80vh] overflow-hidden transition-all duration-300 ease-in-out transform animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-5"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30 shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src="/ai-doctor-avatar.png" />
              <AvatarFallback className="bg-primary/10 text-primary">
                <Brain className="h-6 w-6 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">{doctorName}</h2>
                <Badge variant="outline" className="font-normal text-xs flex items-center gap-1">
                  <SparklesIcon className="h-3 w-3" />
                  <span>Gemini AI</span>
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <p className="text-xs text-muted-foreground">Personal Health Assistant</p>
                <Badge variant="outline" className="ml-1 bg-primary/5 text-[10px] py-0 px-1 font-semibold">
                  <Volume2 className="h-2 w-2 mr-0.5" />
                  {googleSpeechService.isApiEnabled() ? "Google Neural2" : "Browser TTS"}
                </Badge>
                <Badge variant="outline" className="ml-1 bg-primary/5 text-[10px] py-0 px-1 font-semibold">
                  <Globe className="h-2 w-2 mr-0.5" />
                  {selectedLanguage.name}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Voice Selection Button */}
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleVoiceSelector}
                className="text-primary border-primary/30 h-8 w-8"
                aria-label="Select voice"
                title="Select voice"
              >
                <Settings className="h-4 w-4" />
              </Button>
              
              {/* Voice selector dropdown */}
              {showVoiceSelector && (
                <div className="absolute right-0 mt-1 w-48 bg-card rounded-md shadow-lg border border-border z-50">
                  <div className="p-1 text-xs font-medium text-muted-foreground flex items-center">
                    <SparklesIcon className="h-3 w-3 mr-1 text-primary" />
                    <span>Voice Selection</span>
                  </div>
                  <div className="px-1 pb-1">
                    <Button
                      variant={voicePersona === "female" ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() => {
                        setVoicePersona("female");
                        setShowVoiceSelector(false);
                      }}
                    >
                      Female Voice
                    </Button>
                    <Button
                      variant={voicePersona === "male" ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() => {
                        setVoicePersona("male");
                        setShowVoiceSelector(false);
                      }}
                    >
                      Male Voice
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Language Selection Button */}
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleLanguageSelector}
                className="text-primary border-primary/30 h-8 w-8"
                aria-label="Select language"
                title="Select language"
              >
                <Globe className="h-4 w-4" />
              </Button>
              
              {/* Language selector dropdown */}
              {showLanguageSelector && (
                <div className="absolute right-0 mt-1 w-48 bg-card rounded-md shadow-lg border border-border z-50">
                  <div className="p-1 text-xs font-medium text-muted-foreground flex items-center">
                    <Globe className="h-3 w-3 mr-1 text-primary" />
                    <span>Language Selection</span>
                  </div>
                  <div className="px-1 pb-1 max-h-60 overflow-y-auto">
                    {supportedLanguages.map((language) => (
                      <Button
                        key={language.code}
                        variant={selectedLanguage.code === language.code ? "default" : "ghost"}
                        size="sm"
                        className="w-full justify-start text-xs mb-1"
                        onClick={() => selectLanguage(language.code, language.name)}
                      >
                        {language.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Play Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={playLastAssistantMessage}
              className="text-primary border-primary/30 h-8 w-8"
              aria-label="Play last message"
              title="Play last message"
              disabled={!messages.some(msg => msg.role === 'assistant') || isMuted || isSpeaking}
            >
              <Headphones className="h-4 w-4" />
            </Button>
            
            {/* Mute/Unmute Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleMute}
              className="text-primary border-primary/30 h-8 w-8"
              aria-label={isMuted ? "Unmute" : "Mute"}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            
            {/* Play/Stop Button when speaking */}
            {isSpeaking && (
              <Button
                variant="outline"
                size="icon"
                onClick={stopSpeaking}
                className="text-primary border-primary/30 h-8 w-8"
                aria-label="Stop speaking"
                title="Stop speaking"
              >
                <VolumeX className="h-4 w-4" />
              </Button>
            )}
            
            {/* Close Button */}
            <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full hover:bg-red-200/10 hover:text-red-400">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>
        
        {/* Patient Info Banner */}
        <div className="bg-primary/5 p-3 flex items-center justify-between flex-wrap gap-2 shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <FileHeart className="h-4 w-4 text-primary" />
            <span className="font-medium">Patient:</span>
            <span>{mockPatientData.name}, {mockPatientData.age}</span>
            <span className="hidden md:inline-flex">•</span>
            <div className="hidden md:flex items-center gap-1">
              <Activity className="h-4 w-4 text-amber-500" />
              <span className="text-xs">{mockPatientData.conditions.join(", ")}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              <span className="font-normal">BP:</span> {mockPatientData.recentVitals.bloodPressure}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <span className="font-normal">BG:</span> {mockPatientData.recentVitals.bloodSugar}
            </Badge>
          </div>
        </div>
        
        {/* Chat Messages */}
        <ScrollArea className="flex-1 overflow-y-auto h-0 px-4 no-scrollbar">
          <div className="py-4 space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3 max-w-[85%]`}>
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8 mt-0.5">
                      <AvatarImage src="/ai-doctor-avatar.png" />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <Brain className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8 mt-0.5">
                      <AvatarImage src="" alt="User" />
                      <AvatarFallback className="bg-secondary">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`rounded-lg px-4 py-2.5 
                    ${message.role === 'assistant' 
                      ? 'bg-muted border border-border/50 text-foreground' 
                      : 'bg-primary text-primary-foreground'
                    } ${message.role === 'system' ? 'italic text-muted-foreground' : ''}`}
                  >
                    {message.role === 'assistant' ? (
                      <div 
                        className="text-sm text-left"
                        dangerouslySetInnerHTML={{ 
                          __html: currentSpeakingMessageId === message.id && typingIndex > 0 
                            ? formatMessageContent(message.content.substring(0, typingIndex)) 
                            : formatMessageContent(message.content) 
                        }}
                        data-formatted="true"
                      />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap text-left">{message.content}</p>
                    )}
                    <div className="mt-1.5 text-xs opacity-70 text-right">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="flex flex-row gap-3 max-w-[85%]">
                  <Avatar className="h-8 w-8 mt-0.5">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Brain className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg px-4 py-2.5 bg-muted border border-border/50 text-foreground">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">Generating response...</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {/* Suggestions - show after every AI response */}
        {messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
          <div className="px-4 py-3 border-t border-border bg-muted/20 shrink-0">
            <p className="text-xs text-muted-foreground mb-2">Ask me about:</p>
            <div className="flex flex-wrap gap-2">
              {currentSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 whitespace-nowrap"
                  onClick={() => handleSendSuggestion(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="border-t border-border p-3 shrink-0">
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isRecording ? "Recording..." : "Ask your health question..."}
              className={`flex-grow ${isRecording ? 'border-primary' : ''}`}
              disabled={isGenerating}
              onKeyDown={(e) => {
                // Trap focus within modal
                if (e.key === 'Tab' && !e.shiftKey) {
                  const closeButton = modalRef.current?.querySelector('button[aria-label="Close"]');
                  if (closeButton && document.activeElement === e.currentTarget) {
                    e.preventDefault();
                    (closeButton as HTMLElement).focus();
                  }
                }
              }}
            />
            <Button
              type="button"
              size="icon"
              onClick={toggleRecording}
              className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
              disabled={isGenerating}
              aria-label={isRecording ? "Stop recording" : "Start voice input"}
              title={isRecording ? "Stop recording" : "Start voice input"}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button 
              type="submit" 
              size="icon" 
              disabled={!inputMessage.trim() || isGenerating}
              className="bg-primary hover:bg-primary/90"
              aria-label="Send message"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="mt-2 text-xs text-muted-foreground flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span>Powered by Google Gemini</span>
            </div>
            <p>Your data is private and secure</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalDoctorAI; 