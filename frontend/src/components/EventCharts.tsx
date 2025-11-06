import { useState } from "react";
import { useEventLog } from "../hooks/useEventLog";
import "./EventCharts.css";

type ChartInterval = "week" | "month" | "year";

export default function EventsChart() {
  const { eventList, loading, error } = useEventLog();
  const [chartInterval, setChartInterval] = useState<ChartInterval>("week");

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
          <option value="week">Semana atual</option>
          <option value="month">Mês atual</option>
          <option value="year">Ano atual</option>
        </select>
      </form>

      <p>TODO tipo de dado: {chartInterval}</p>
    </section>
  );
}

