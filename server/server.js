// Simple Express server that provides a secure proxy to Google Cloud TTS API
const express = require('express');
const cors = require('cors');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const path = require('path');

const app = express();
// Load environment variables from .env file if dotenv is installed
try {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
  console.log('Loaded environment variables from .env file');
} catch (err) {
  console.log('dotenv not found, using default environment variables');
}

// Use the environment variable for port or default to 3002
const PORT = process.env.VITE_TTS_SERVER_PORT || process.env.PORT || 3002;

// Enable CORS for the frontend - include any potential development ports
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:8080', 'http://localhost:3000']
}));
app.use(express.json());

// Create a client with the service account key
let ttsClient;
let apiEnabled = true; // Flag to track if API is enabled
try {
  // Path to your Google service account key
  const keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS || 
                     '/Users/jaffars/Desktop/secret-api/text to speech/kwacare-da8fb4347ecd.json';
  
  ttsClient = new TextToSpeechClient({
    keyFilename: keyFilePath
  });
  console.log('Google Cloud TTS client initialized successfully');
} catch (error) {
  console.error('Error initializing Google Cloud TTS client:', error);
  apiEnabled = false;
}

// Fallback function to create a simple audio file if the Google API is not available
async function synthesizeSpeechFallback(text, outputFile) {
  // This function would normally use another TTS service or generate a simple audio file
  // For now, we'll just create a text file indicating the fallback
  const fallbackMessage = `Speech synthesis fallback for: ${text}`;
  fs.writeFileSync(outputFile.replace('.mp3', '.txt'), fallbackMessage);
  
  // We still need to create an empty audio file to maintain the expected flow
  // In a production environment, you'd use a local TTS solution
  const emptyAudioFile = Buffer.from('');
  fs.writeFileSync(outputFile, emptyAudioFile);
  
  console.log('Used fallback speech synthesis');
  return true;
}

// Endpoint for text-to-speech
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voiceType, language = 'en' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // Configure voice based on the selected type and language
    let voiceConfig;
    
    // Language code mapping to handle Google's specific voice codes
    const languageMapping = {
      'en': 'en-US',
      'fr': 'fr-FR',
      'es': 'es-ES',
      'de': 'de-DE',
      'zh': 'cmn-CN', // Mandarin Chinese
      'ja': 'ja-JP',
      'ar': 'ar-XA',
      'hi': 'hi-IN',
      'ru': 'ru-RU'
    };
    
    // Get the mapped language code or default to en-US
    const languageCode = languageMapping[language] || 'en-US';
    console.log(`Using language code: ${languageCode} for language: ${language}`);
    
    // Voice selection based on language and gender preference
    if (languageCode === 'en-US') {
      // English has multiple Neural2 voices
      switch(voiceType) {
        case 'female':
          voiceConfig = {
            languageCode: 'en-US',
            name: 'en-US-Neural2-F', // Neural HD female voice
            ssmlGender: 'FEMALE'
          };
          break;
        case 'male':
          voiceConfig = {
            languageCode: 'en-US',
            name: 'en-US-Neural2-D', // Neural HD male voice
            ssmlGender: 'MALE'
          };
          break;
        default:
          voiceConfig = {
            languageCode: 'en-US',
            name: 'en-US-Neural2-A', // Neural HD neutral voice
            ssmlGender: 'NEUTRAL'
          };
      }
    } else {
      // For other languages, use the best available voice
      // Since we can't know all voice names across languages, use gender only
      switch(voiceType) {
        case 'female':
          voiceConfig = {
            languageCode: languageCode,
            ssmlGender: 'FEMALE'
          };
          break;
        case 'male':
          voiceConfig = {
            languageCode: languageCode,
            ssmlGender: 'MALE'
          };
          break;
        default:
          voiceConfig = {
            languageCode: languageCode,
            ssmlGender: 'NEUTRAL'
          };
      }
    }
    
    // Create the file and directory regardless
    const fileName = `speech-${Date.now()}.mp3`;
    const outputFile = path.join(__dirname, 'public', fileName);
    
    // Ensure the public directory exists
    if (!fs.existsSync(path.join(__dirname, 'public'))) {
      fs.mkdirSync(path.join(__dirname, 'public'), { recursive: true });
    }
    
    // If API is already known to be disabled, use fallback immediately
    if (!apiEnabled) {
      await synthesizeSpeechFallback(text, outputFile);
      const audioUrl = `/api/audio/${fileName}`;
      return res.json({ 
        audioUrl,
        fallback: true,
        message: 'Using browser speech synthesis due to API not being enabled'
      });
    }
    
    // Build the request
    const request = {
      input: { text },
      voice: voiceConfig,
      audioConfig: {
        audioEncoding: 'MP3',
        pitch: 0,
        speakingRate: 1.0
      },
    };
    
    console.log(`Sending TTS request for text in ${languageCode}: "${text.substring(0, 50)}..."`);
    
    try {
      // Call Google Cloud TTS API
      const [response] = await ttsClient.synthesizeSpeech(request);
      
      // Write the binary audio content to file
      fs.writeFileSync(outputFile, response.audioContent, 'binary');
      
      // Return the URL to the audio file
      const audioUrl = `/api/audio/${fileName}`;
      console.log(`Generated audio file: ${audioUrl}`);
      
      res.json({ audioUrl });
    } catch (apiError) {
      console.error('Google TTS API error:', apiError.message);
      
      // Check if this is a permissions error
      if (apiError.message && apiError.message.includes('PERMISSION_DENIED')) {
        console.log('API permission denied - switching to fallback mode');
        apiEnabled = false;
        
        // Use fallback synthesis
        await synthesizeSpeechFallback(text, outputFile);
        const audioUrl = `/api/audio/${fileName}`;
        return res.json({ 
          audioUrl, 
          fallback: true,
          message: 'Using browser speech synthesis due to API not being enabled. Visit https://console.developers.google.com/apis/api/texttospeech.googleapis.com/overview to enable the API.'
        });
      }
      
      // For other errors, return the error
      throw apiError;
    }
  } catch (error) {
    console.error('Error generating speech:', error);
    res.status(500).json({ error: 'Failed to generate speech', details: error.message });
  }
});

// Serve static files from the public directory under a dedicated route
app.use('/public', express.static(path.join(__dirname, 'public')));

// Add a dedicated route for audio files to make paths consistent
app.get('/api/audio/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'public', filename);
  
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'audio/mpeg');
    res.sendFile(filePath);
  } else {
    res.status(404).send('Audio file not found');
  }
});

// Add a middleware to handle CORS preflight requests for all routes
app.options('*', cors());

// Add a test endpoint to check if server is working
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'TTS Server is working!',
    apiEnabled
  });
});

// Add a status endpoint to check API status
app.get('/api/status', (req, res) => {
  res.json({
    server: 'running',
    apiEnabled,
    port: PORT
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`TTS Server running on port ${PORT}`);
  console.log(`Server status: ${apiEnabled ? 'Google Cloud TTS API enabled' : 'Using fallback mode'}`);
  console.log(`Test the server: http://localhost:${PORT}/api/test`);
}); 