interface FeedbackMessageProps {
  message: string;
  type: "success" | "error";
}

export default function FeedbackMessage({
  message,
  type,
}: FeedbackMessageProps) {
  return <div className={`feedback-message feedback-${type}`}>{message}</div>;
}
