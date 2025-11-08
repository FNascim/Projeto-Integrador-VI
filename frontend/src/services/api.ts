import axios from "axios";
import type { Config } from "../types/config";
import type { EventLog } from "../types/eventLog";

const API_BASE = "http://127.0.0.1:5000";

export const getConfig = async (): Promise<Config> => {
  const res = await axios.get<Config>(`${API_BASE}/config`);
  return res.data;
};

export const updateConfig = async (data: Config): Promise<void> => {
  await axios.post(`${API_BASE}/config`, data);
};

export const getEvents = async (): Promise<EventLog[]> => {
  const res = await axios.get<EventLog[]>(`${API_BASE}/events`);
  return res.data;
};

