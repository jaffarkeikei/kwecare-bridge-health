// Simple Express server that provides a secure proxy to Google Cloud TTS API
const express = require('express');
const cors = require('cors');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for the frontend
app.use(cors({
  origin: 'http://localhost:5173' // Default Vite dev server port
}));
app.use(express.json());

// Create a client with the service account key
let ttsClient;
try {
  // Path to your Google service account key
  const keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS || 
                     '/Users/jaffars/Desktop/secret-api/kwecare-013968477a5d.json';
  
  ttsClient = new TextToSpeechClient({
    keyFilename: keyFilePath
  });
  console.log('Google Cloud TTS client initialized successfully');
} catch (error) {
  console.error('Error initializing Google Cloud TTS client:', error);
}

// Endpoint for text-to-speech
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voiceType } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
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
      default:
        voiceConfig = {
          languageCode: 'en-US',
          name: 'en-US-Neural2-A', // Neural Chirp HD neutral voice
          ssmlGender: 'NEUTRAL'
        };
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
    
    console.log(`Sending TTS request for text: "${text.substring(0, 50)}..."`);
    
    // Call Google Cloud TTS API
    const [response] = await ttsClient.synthesizeSpeech(request);
    
    // Write the audio content to a temporary file
    const fileName = `speech-${Date.now()}.mp3`;
    const outputFile = path.join(__dirname, 'public', fileName);
    
    // Ensure the public directory exists
    if (!fs.existsSync(path.join(__dirname, 'public'))) {
      fs.mkdirSync(path.join(__dirname, 'public'), { recursive: true });
    }
    
    // Write the binary audio content to file
    fs.writeFileSync(outputFile, response.audioContent, 'binary');
    
    // Return the URL to the audio file
    const audioUrl = `/public/${fileName}`;
    console.log(`Generated audio file: ${audioUrl}`);
    
    res.json({ audioUrl });
  } catch (error) {
    console.error('Error generating speech:', error);
    res.status(500).json({ error: 'Failed to generate speech', details: error.message });
  }
});

// Serve static files from the public directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
  console.log(`TTS Server running on port ${PORT}`);
  console.log(`Access the API at http://localhost:${PORT}/api/tts`);
}); 