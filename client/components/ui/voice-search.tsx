import React from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "./button";
import { useVoiceSearch } from "@/hooks/use-voice-search";
import { VoiceFeedback } from "./voice-feedback";

interface VoiceSearchProps {
  onResult: (transcript: string) => void;
  className?: string;
}

export const VoiceSearch: React.FC<VoiceSearchProps> = ({
  onResult,
  className = "",
}) => {
  const { isListening, isLoading, error, toggleListening } =
    useVoiceSearch(onResult);

  return (
    <>
      <div className={`${className} flex items-center justify-center`}>
        <Button
          type="button"
          variant={isListening ? "destructive" : "outline"}
          size="icon"
          onClick={toggleListening}
          className="relative bg-white hover:bg-gray-100 border-none"
          disabled={!!error || isLoading}
          title={error || "Voice Search"}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-flipkart-blue" />
          ) : isListening ? (
            <MicOff className="h-4 w-4 text-red-500" />
          ) : (
            <Mic className="h-4 w-4 text-flipkart-blue" />
          )}
        </Button>
        {error && (
          <div className="absolute mt-2 text-xs text-red-500 bg-white p-2 rounded shadow-md z-50">
            {error}
          </div>
        )}
      </div>

      {/* Visual feedback when listening */}
      <VoiceFeedback isActive={isListening && !isLoading} />
    </>
  );
};
