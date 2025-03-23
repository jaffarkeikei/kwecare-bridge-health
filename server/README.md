# KweCare Text-to-Speech Server

This Express server provides a secure proxy to Google Cloud Text-to-Speech API for the KweCare application, enabling high-quality voice synthesis with fallback capabilities.

## Features

- **Google Cloud TTS Integration**: Secure access to Neural2 high-definition voices
- **Voice Type Selection**: Support for male, female, and neutral voice options
- **Fallback Mechanism**: Graceful degradation when the API is unavailable
- **CORS Protection**: Security for cross-origin requests
- **Server-side Caching**: Audio file storage for performance optimization

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure Google Cloud credentials:
   - Option 1: Place your credentials file at the location specified in the server.js file
   - Option 2: Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable
   - Option 3: Edit the server.js file to point to your credentials

3. Start the server:
```bash
npm start
```

## Testing

Once the server is running, you can test it with:

```bash
curl -X POST http://localhost:3002/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello, this is a test of Google Cloud Text-to-Speech API with Neural2 HD voices.", "voiceType":"female"}'
```

Or verify server status:
```
http://localhost:3002/api/status
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/tts` | POST | Convert text to speech |
| `/api/test` | GET | Test if server is running |
| `/api/status` | GET | Check server and API status |

### TTS Request Format

```json
{
  "text": "Text to convert to speech",
  "voiceType": "female" // "female", "male", or "neutral"
}
```

### TTS Response Format

```json
{
  "audioUrl": "/public/speech-1234567890.mp3"
}
```

## Integration with KweCare Frontend

This server is designed to work with the KweCare frontend application:

1. Frontend sends text and voice preferences to this server
2. Server securely communicates with Google Cloud TTS
3. Generated audio is stored on the server
4. URL to the audio file is returned to the frontend
5. Frontend plays the audio through an HTML5 audio element

## Fallback Strategy

If Google Cloud TTS API is unavailable:

1. Server detects API unavailability
2. Response includes `fallback: true` flag
3. Frontend falls back to browser's native Web Speech API
4. User experience continues with degraded voice quality

## Environment Variables

- `PORT`: Server port (default: 3002)
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to Google Cloud credentials file

## Security Considerations

- Google Cloud credentials are never exposed to the client
- CORS is configured to only allow specific origins
- No sensitive information is logged in the console

## Troubleshooting

- **CORS Issues**: Update the CORS configuration in `server.js` if using different origins
- **API Permission Denied**: Ensure your Google Cloud project has the Text-to-Speech API enabled
- **Audio File Access**: Check the `public` directory permissions if audio files aren't accessible 