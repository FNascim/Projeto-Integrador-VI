import { useState } from "react";

type FeedbackType = "success" | "error" | null;

interface UseFeedbackReturn {
  feedback: string | null;
  feedbackType: FeedbackType;
  showFeedback: (message: string, type: FeedbackType) => void;
  clearFeedback: () => void;
}

export function useFeedback(): UseFeedbackReturn {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(null);

  const showFeedback = (message: string, type: FeedbackType) => {
    setFeedback(message);
    setFeedbackType(type);

    setTimeout(() => {
      setFeedback(null);
      setFeedbackType(null);
    }, 3000);
  };

  const clearFeedback = () => {
    setFeedback(null);
    setFeedbackType(null);
  };

  return {
    feedback,
    feedbackType,
    showFeedback,
    clearFeedback,
  };
}
