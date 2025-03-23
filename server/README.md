# Google Cloud Text-to-Speech Server

This is a simple Express server that provides a secure way to use Google Cloud Text-to-Speech API.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure your Google Cloud credentials file is available at:
```
/Users/jaffars/Desktop/secret-api/kwecare-013968477a5d.json
```
   Or set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable.

3. Start the server:
```bash
npm start
```

## Testing

Once the server is running, you can test it with:

```bash
curl -X POST http://localhost:3001/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello, this is a test of Google Cloud Text-to-Speech API with Chirp HD voices.", "voiceType":"female"}'
```

Or open a browser and navigate to:
```
http://localhost:3001/api/test
```

## Usage from the Frontend

The frontend should make POST requests to `/api/tts` with:
- `text`: The text to convert to speech
- `voiceType`: "female", "male", or "neutral"

The response contains an `audioUrl` that can be used to play the generated speech.

## Troubleshooting

- CORS issues: The server is configured to allow requests from `http://localhost:5173` and `http://localhost:8080`. If you're using a different port, update the CORS configuration in `server.js`.

- Credentials: Make sure your Google Cloud credentials have access to the Text-to-Speech API and are properly formatted.

- Audio files: Audio files are stored in the `public` directory and are accessible via `/public/speech-{timestamp}.mp3`. 