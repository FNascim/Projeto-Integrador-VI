export interface EventLog {
  timestamp: string;
  event:
    | "ligada_manual"
    | "desligada_manual"
    | "ligada_auto"
    | "desligada_auto";
  source: string;
}

