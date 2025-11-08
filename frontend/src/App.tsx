import { useState } from "react";
import ConfigForm from "./components/ConfigForm";
import EventsChart from "./components/EventCharts";
import "./App.css";

function App() {
  const [displayCharts, setDisplayCharts] = useState<boolean>(false);
  const toggleCharts = () => setDisplayCharts(!displayCharts);

  return (
    <div className="app">
      <div className="app-container">
        <h1 className="app-title">Controle de Iluminação</h1>
        <p className="app-subtitle">Sistema inteligente com Pico W</p>
        {displayCharts ? <EventsChart /> : <ConfigForm />}
        <button className="app-chart-button" onClick={toggleCharts}>
          {displayCharts ? "Voltar" : "🗓️ Estatísticas de uso"}
        </button>
      </div>
    </div>
  );
}

export default App;

