import { useState } from "react";
import { useEventLog } from "../hooks/useEventLog";
import UsageChart from "./UsageChart";
import "./EventCharts.css";

type ChartInterval = "7" | "30" | "365";

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
      <h2>Tempo de uso</h2>

      {error && <p className="error-message">{error}</p>}

      <form method="post">
        <select
          className="chart-form-select"
          name="interval"
          value={chartInterval}
          onChange={handleChange}
        >
          <option value="7">Semana atual</option>
          <option value="30">Mês atual</option>
          <option value="365">Ano atual</option>
        </select>
      </form>
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <UsageChart events={eventList} interval={chartInterval} />
      )}
    </section>
  );
}

