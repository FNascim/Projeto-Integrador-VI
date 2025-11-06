import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options: ChartOptions<"line"> = {
  plugins: {
    legend: {
      labels: {
        color: "#ced4da",
      },
    },
  },
  scales: {
    x: { ticks: { color: "#ced4da" }, border: { color: "#ced4da" } },
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

interface UsageChartProps {
  data: ChartData<"line">;
}

// Mostra o tempo de uso da lâmpada
export default function UsageChart({ data }: UsageChartProps) {
  return <Line options={options} data={data} />;
}

