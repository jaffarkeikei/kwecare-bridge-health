// Simple Express server that provides a secure proxy to Google Cloud TTS API
const express = require('express');
const cors = require('cors');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002; // Using port 3002 to avoid conflicts

// Enable CORS for the frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080', 'http://localhost:3000', 'http://localhost:5175', 'http://localhost:5174'] // Allow multiple origins
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
    const { text, voiceType } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // Clean up text - remove any "Hello Sarah" prefixes
    const cleanedText = text.replace(/^(Hello Sarah,?\s*)/i, '');
    
    // Remove any "1. AI:" prefix
    const withoutAIPrefix = cleanedText.replace(/^(?:1\. )?AI:\s*/i, '');
    
    // Replace asterisk bullet points with ordinals for better TTS reading
    const withOrdinals = withoutAIPrefix.replace(/\n\s*\*\s*/g, (match, index, fullText) => {
      // Count how many asterisks have appeared before this one
      const previousAsterisks = fullText.substring(0, index).match(/\n\s*\*\s*/g) || [];
      const count = previousAsterisks.length;
      
      // Convert count to ordinal word
      let ordinal;
      switch(count) {
        case 0: ordinal = "First, "; break;
        case 1: ordinal = "Second, "; break;
        case 2: ordinal = "Third, "; break;
        case 3: ordinal = "Fourth, "; break;
        case 4: ordinal = "Fifth, "; break;
        case 5: ordinal = "Sixth, "; break;
        case 6: ordinal = "Seventh, "; break;
        case 7: ordinal = "Eighth, "; break;
        case 8: ordinal = "Ninth, "; break;
        case 9: ordinal = "Tenth, "; break;
        default: ordinal = `Item ${count + 1}, `;
      }
      
      return `\n${ordinal}`;
    });
    
    // Final processed text
    const finalText = withOrdinals;
    
    // Configure voice based on the selected type
    let voiceConfig;
    switch(voiceType) {
      case 'female':
        voiceConfig = {
          languageCode: 'en-US',
          name: 'en-US-Neural2-F', // Neural Chirp HD female voice
          ssmlGender: 'FEMALE'
        };
        break;
      case 'male':
        voiceConfig = {
          languageCode: 'en-US',
          name: 'en-US-Neural2-D', // Neural Chirp HD male voice
          ssmlGender: 'MALE'
        };
        break;
      case 'neutral':
        // For 'neutral', use the female voice as fallback since neutral isn't supported
        console.log('Neutral gender not supported by Google TTS, falling back to female voice');
        voiceConfig = {
          languageCode: 'en-US',
          name: 'en-US-Neural2-F', // Neural Chirp HD female voice as fallback
          ssmlGender: 'FEMALE'
        };
        break;
      default:
        // Default to female voice
        voiceConfig = {
          languageCode: 'en-US',
          name: 'en-US-Neural2-F', // Neural Chirp HD female voice
          ssmlGender: 'FEMALE'
        };
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
      const audioUrl = `/public/${fileName}`;
      return res.json({ 
        audioUrl,
        fallback: true,
        message: 'Using browser speech synthesis due to API not being enabled'
      });
    }
    
    // Build the request
    const request = {
      input: { text: finalText },
      voice: voiceConfig,
      audioConfig: {
        audioEncoding: 'MP3',
        pitch: 0,
        speakingRate: 1.0
      },
    };
    
    console.log(`Sending TTS request for text: "${finalText.substring(0, 50)}..."`);
    
    try {
      // Call Google Cloud TTS API
      const [response] = await ttsClient.synthesizeSpeech(request);
      
      // Write the binary audio content to file
      fs.writeFileSync(outputFile, response.audioContent, 'binary');
      
      // Return the URL to the audio file
      const audioUrl = `/public/${fileName}`;
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
        const audioUrl = `/public/${fileName}`;
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

// Add a test endpoint to check if server is working
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'TTS Server is working!',
    apiEnabled
  });
});

// Special route for audio files with proper headers
app.get('/public/:filename', (req, res, next) => {
  const filename = req.params.filename;
  
  // Only process MP3 files
  if (!filename.endsWith('.mp3')) {
    return next(); // Let the default static middleware handle it
  }
  
  const filePath = path.join(__dirname, 'public', filename);
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`Audio file not found: ${filePath}`);
      return res.status(404).json({ error: 'Audio file not found' });
    }
    
    // Add specific headers for audio files
    res.set({
      'Content-Type': 'audio/mpeg',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=0',
      'Access-Control-Allow-Origin': '*' // Allow any origin to access the audio
    });
    
    // Stream the file
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

// Serve static files from the public directory
app.use('/public', express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.mp3')) {
      res.set('Content-Type', 'audio/mpeg');
      res.set('Accept-Ranges', 'bytes');
      res.set('Access-Control-Allow-Origin', '*');
    }
  }
}));

// Add a middleware to handle CORS preflight requests for all routes
app.options('*', cors());

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