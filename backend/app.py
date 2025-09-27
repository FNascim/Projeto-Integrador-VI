import json
import os
from datetime import datetime

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

CONFIG_FILE = 'config.json'
EVENT_LOG = 'events.json'

# Configuração padrão
default_config = {
    "modo": "auto",  # auto, manual_on, manual_off
    "usar_pir": True,
    "usar_ldr": True,
    "usar_horario": False,
    "horario_inicio": "18:00",
    "horario_fim": "06:00"
}


def load_config():
    if not os.path.exists(CONFIG_FILE):
        save_config(default_config)
    with open(CONFIG_FILE, 'r') as f:
        return json.load(f)


def save_config(config):
    with open(CONFIG_FILE, 'w') as f:
        json.dump(config, f, indent=2)


def append_event(event_data):
    log = []
    if os.path.exists(EVENT_LOG):
        with open(EVENT_LOG, 'r') as f:
            try:
                log = json.load(f)
            except:
                log = []
    log.append(event_data)
    with open(EVENT_LOG, 'w') as f:
        json.dump(log, f, indent=2)


@app.route('/config', methods=['GET'])
def get_config():
    config = load_config()
    return jsonify(config)


@app.route('/config', methods=['POST'])
def update_config():
    new_config = request.json
    current_config = load_config()

    # Lista de campos válidos
    valid_keys = ['modo', 'usar_pir', 'usar_ldr', 'usar_horario', 'horario_inicio', 'horario_fim']

    # Atualiza apenas os campos válidos
    for key in valid_keys:
        if key in new_config:
            current_config[key] = new_config[key]

    save_config(current_config)
    return jsonify({"status": "Configuração atualizada", "config": current_config}), 200



@app.route('/event', methods=['POST'])
def receive_event():
    data = request.json
    event = {
        "timestamp": datetime.now().isoformat(),
        "event": data.get("event"),
        "source": data.get("source", "pico"),
        "extra": data.get("extra", {})
    }
    append_event(event)
    return jsonify({"status": "Evento registrado"}), 201


@app.route('/events', methods=['GET'])
def get_events():
    if not os.path.exists(EVENT_LOG):
        return jsonify([])
    with open(EVENT_LOG, 'r') as f:
        try:
            events = json.load(f)
        except:
            events = []
    return jsonify(events)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
