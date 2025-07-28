import { useState, useEffect, useCallback } from "react";

interface UseVoiceSearchResult {
  isListening: boolean;
  isLoading: boolean;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
}

export function useVoiceSearch(
  onResult: (transcript: string) => void,
): UseVoiceSearchResult {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      setError("Your browser does not support speech recognition.");
      return;
    }

    let recognitionInstance: any;

    // Initialize speech recognition
    if ("webkitSpeechRecognition" in window) {
      recognitionInstance = new (window as any).webkitSpeechRecognition();
    } else if ("SpeechRecognition" in window) {
      recognitionInstance = new (window as any).SpeechRecognition();
    }

    if (recognitionInstance) {
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onstart = () => {
        setIsLoading(false);
        setIsListening(true);
      };

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: any) => {
        setError(`Error occurred in recognition: ${event.error}`);
        setIsListening(false);
        setIsLoading(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        setIsLoading(false);
      };

      setRecognition(recognitionInstance);
    }

    // Cleanup
    return () => {
      if (recognitionInstance) {
        try {
          recognitionInstance.stop();
        } catch (err) {
          // Ignore errors when stopping during cleanup
        }
      }
    };
  }, [onResult]);

  const startListening = useCallback(() => {
    if (recognition) {
      setError(null);
      setIsLoading(true);
      try {
        recognition.start();
      } catch (err) {
        setError("Error starting speech recognition");
        setIsListening(false);
        setIsLoading(false);
      }
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      try {
        recognition.stop();
      } catch (err) {
        // Ignore errors when stopping
      }
    }
  }, [recognition]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isLoading,
    error,
    startListening,
    stopListening,
    toggleListening,
  };
}
