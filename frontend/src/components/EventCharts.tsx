import { useState } from "react";
import { useEventLog } from "../hooks/useEventLog";
import UsageChart from "./UsageChart";
import "./EventCharts.css";

type ChartInterval = "7" | "30" | "60";

export default function EventsChart() {
  const { eventList, loading, error } = useEventLog();
  const [chartInterval, setChartInterval] = useState<ChartInterval>("7");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const newCategory = e.target.value as ChartInterval;
    setChartInterval(newCategory);
  };

  return (
    <section className="event-charts">
      <div className="event-charts-header">
        <h2>Tempo de uso</h2>
        <form method="post" className="chart-form">
          <select
            className="chart-form-select"
            name="interval"
            value={chartInterval}
            onChange={handleChange}
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="60">Últimos 60 dias</option>
          </select>
        </form>
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <div className="chart-loading">
          <div className="chart-loading-spinner"></div>
          <p className="chart-loading-label">Carregando...</p>
        </div>
      ) : (
        <UsageChart events={eventList} interval={chartInterval} />
      )}
    </section>
  );
}

