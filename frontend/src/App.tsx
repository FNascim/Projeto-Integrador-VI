import ConfigForm from "./components/ConfigForm";
import "./App.css";

function App() {
  return (
    <div className="app">
      <div className="app-container">
        <h1 className="app-title">Controle de Iluminação</h1>
        <p className="app-subtitle">Sistema inteligente com Pico W</p>
        <ConfigForm />
      </div>
    </div>
  );
}

export default App;
