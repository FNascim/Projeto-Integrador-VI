import { CONFIG_OPTIONS } from "../constants/appConstants";
import type { Config } from "../types/config";

interface ConfigFormFieldsProps {
  config: Config | null;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export default function ConfigFormFields({
  config,
  onChange,
}: ConfigFormFieldsProps) {
  return (
    <>
      <div className="form-group">
        <label className="form-label">
          Modo:
          <select
            name="modo"
            value={config?.modo ?? ""}
            onChange={onChange}
            className="form-select"
          >
            {CONFIG_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="usar_pir"
            checked={!!config?.usar_pir}
            onChange={onChange}
            className="form-checkbox"
          />
          Usar sensor de movimento (PIR)
        </label>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="usar_ldr"
            checked={!!config?.usar_ldr}
            onChange={onChange}
            className="form-checkbox"
          />
          Usar sensor de luminosidade (LDR)
        </label>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="usar_horario"
            checked={!!config?.usar_horario}
            onChange={onChange}
            className="form-checkbox"
          />
          Usar horário programado
        </label>
      </div>

      <div className="time-inputs">
        <div className="time-input-group">
          <label className="form-label">
            Horário Início:
            <input
              type="time"
              name="horario_inicio"
              value={config?.horario_inicio ?? ""}
              onChange={onChange}
              className="form-input"
            />
          </label>
        </div>

        <div className="time-input-group">
          <label className="form-label">
            Horário Fim:
            <input
              type="time"
              name="horario_fim"
              value={config?.horario_fim ?? ""}
              onChange={onChange}
              className="form-input"
            />
          </label>
        </div>
      </div>
    </>
  );
}
