import {
  Chart,
  TimeScale,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { getUsageByDay } from "../utils/chartHelpers";
import { isWithinInterval, subDays, formatISO } from "date-fns";
import type { ChartOptions } from "chart.js";
import type { EventLog } from "../types/eventLog";
import "chartjs-adapter-date-fns";

Chart.register(
  TimeScale,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface UsageChartProps {
  events: EventLog[];
  interval: string;
}

// Mostra o tempo de uso da lâmpada
export default function UsageChart({ events, interval }: UsageChartProps) {
  const today = Date.now();
  const startOfInterval = subDays(today, Number(interval));
  const eventsOnInterval = events.filter(eventLog =>
    isWithinInterval(eventLog.timestamp, { start: startOfInterval, end: today })
  );

  const data = {
    datasets: [
      {
        label: "Tempo ligada (h)",
        data: getUsageByDay(eventsOnInterval),
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    plugins: {
      legend: {
        labels: {
          color: "#ced4da",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#ced4da" },
        border: { color: "#ced4da" },
        type: "time",
        time: {
          unit: "day",
        },
        min: formatISO(startOfInterval),
      },
      y: { ticks: { color: "#ced4da" }, border: { color: "#ced4da" } },
    },
    elements: {
      bar: {
        backgroundColor: "#213547",
      },
    },
  };

  return <Bar options={options} data={data} />;
}

