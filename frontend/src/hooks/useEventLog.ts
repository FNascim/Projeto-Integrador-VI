import { useState, useEffect } from "react";
import { getEvents } from "../services/api";
import type { EventLog } from "../types/eventLog";

interface useEventLogReturn {
  eventList: EventLog[];
  loading: boolean;
  error: string | null;
}

export function useEventLog(): useEventLogReturn {
  const [eventList, setEventList] = useState<EventLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEvents();
      setEventList(data);
    } catch (err) {
      console.error("Erro ao buscar dados de uso", err);
      setError("Erro ao buscar dados de uso.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    eventList,
    loading,
    error,
  };
}

