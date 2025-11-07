import {
  Chart,
  TimeScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { getUsageByDay } from "../utils/chartHelpers";
import { isWithinInterval, subDays } from "date-fns";
import type { ChartOptions } from "chart.js";
import type { EventLog } from "../types/eventLog";
import "chartjs-adapter-date-fns";

Chart.register(
  TimeScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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

  const options: ChartOptions<"line"> = {
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
      },
      y: { ticks: { color: "#ced4da" }, border: { color: "#ced4da" } },
    },
    elements: {
      line: {
        backgroundColor: "#213547",
        borderColor: "#213547",
      },
      point: {
        backgroundColor: "#213547",
        radius: 4,
      },
    },
  };

  return <Line options={options} data={data} />;
}

