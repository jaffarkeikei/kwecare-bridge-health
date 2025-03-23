import React, { useState, useEffect, useRef, useContext } from "react";
import { Bot, User, Send, X, Loader2, Brain, History, Activity, FileHeart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AuthContext } from "@/App";
import { Sparkles as SparklesIcon } from "lucide-react";
import geminiApiService from "./GeminiApiService";

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

// Helper function to format message content with better styling
const formatMessageContent = (content: string) => {
  if (!content) return '';
  
  // Trim content to remove any leading/trailing whitespace
  content = content.trim();
  
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

const PersonalDoctorAI: React.FC<PersonalDoctorAIProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { userType } = useContext(AuthContext);

  // Simulate the AI persona
  const doctorName = "Dr. AIDA";
  const doctorPersonality = "compassionate, knowledgeable, and culturally aware";
  
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isGenerating) return;
    
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
      
      // Get response from Gemini API
      const aiResponse = await geminiApiService.generateResponse(
        formattedMessages,
        mockPatientData,
        { temperature: 0.7 }
      );
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8" onClick={onClose}>
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
              <p className="text-xs text-muted-foreground">Your Personal AI Health Assistant</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="text-muted-foreground hover:bg-red-100 hover:text-red-500 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Button>
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
                        dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }}
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
              placeholder="Ask your health question..."
              className="flex-grow"
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