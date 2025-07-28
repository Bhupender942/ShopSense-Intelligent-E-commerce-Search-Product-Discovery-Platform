# Flipkart Grid 7.0 Project

This is a Flipkart clone project with a voice search feature.

## Running the Project

1. Install dependencies:

```
npm install
```

2. Start the development server:

```
npm run dev
```

3. Build for production:

```
npm run build
```

4. Start the production server:

```
npm start
```

## Voice Search Feature

The project includes a voice search feature that allows users to search for products using their voice. This feature uses the Web Speech API, which is supported in most modern browsers.

### How to Use Voice Search

1. Click on the microphone icon next to the search bar.
2. Allow microphone access if prompted by your browser.
3. Speak your search query clearly.
4. The search will automatically execute once you stop speaking.

### Browser Compatibility

The voice search feature works in the following browsers:

- Google Chrome (desktop and mobile)
- Microsoft Edge
- Safari (iOS 14.5+ and macOS)
- Firefox (with flag enabled)

### Implementation Details

The voice search feature is implemented using:

- Web Speech API for speech recognition
- React hooks for state management
- Custom hook (`useVoiceSearch`) for reusability
- Visual feedback component to indicate when the microphone is active

### Troubleshooting

If you encounter issues with voice search:

1. Make sure your browser supports the Web Speech API.
2. Check that you've granted microphone permissions to the website.
3. Try using Google Chrome, which has the best support for the Web Speech API.
4. Ensure you're in a quiet environment for better recognition accuracy.

## Project Structure

- `client/components/ui/voice-search.tsx`: Main voice search component
- `client/components/ui/voice-feedback.tsx`: Visual feedback for voice search
- `client/hooks/use-voice-search.ts`: Custom hook for voice search functionality
