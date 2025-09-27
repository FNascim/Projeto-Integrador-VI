# 💡 Sistema de Automação de Iluminação Residencial

Sistema inteligente de automação de iluminação residencial com foco em economia de energia, desenvolvido como Projeto Integrador VI pelos alunos da UNIVESP.

## 📋 Descrição

Este projeto consiste em um sistema completo de automação residencial que controla a iluminação de forma inteligente, utilizando sensores de movimento (PIR), luminosidade (LDR) e controle por horário. O sistema é composto por três partes principais: firmware para Raspberry Pi Pico W, backend em Python com Flask, e frontend web em React com TypeScript.

## 🏗️ Arquitetura do Sistema

```
┌─────────────────┐    Wi-Fi     ┌─────────────────┐    HTTP    ┌─────────────────┐
│  Raspberry Pi   │◄────────────►│     Backend     │◄──────────►│    Frontend     │
│     Pico W      │              │   Flask API     │            │   React App     │
│                 │              │                 │            │                 │
│ • Sensor PIR    │              │ • Configurações │            │ • Interface Web │
│ • Sensor LDR    │              │ • Log eventos   │            │ • Controle voz  │
│ • Relé          │              │ • API REST      │            │ • Configurações │
└─────────────────┘              └─────────────────┘            └─────────────────┘
```

## 🚀 Funcionalidades

### 🎯 Modos de Operação
- **Automático**: Controle baseado em sensores (PIR/LDR) e horário
- **Manual ON**: Força as luzes ligadas
- **Manual OFF**: Força as luzes desligadas

### 📱 Controles Disponíveis
- **Interface Web**: Painel de controle completo
- **Comandos de Voz**: Controle por reconhecimento de voz
- **Sensores Automáticos**: PIR (movimento) e LDR (luminosidade)
- **Programação por Horário**: Liga/desliga automaticamente

### 📊 Monitoramento
- Log de eventos em tempo real
- Histórico de ativações
- Status dos sensores
- Consumo otimizado de energia

## 🛠️ Tecnologias Utilizadas

### Hardware
- **Raspberry Pi Pico W** - Microcontrolador principal
- **Sensor PIR** - Detecção de movimento
- **Sensor LDR** - Detecção de luminosidade
- **Módulo Relé** - Controle da iluminação

### Backend
- **Python 3.x** - Linguagem principal
- **Flask** - Framework web
- **Flask-CORS** - Suporte a CORS
- **JSON** - Armazenamento de configurações e logs

### Frontend
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Axios** - Cliente HTTP
- **Web Speech API** - Reconhecimento de voz

## 📁 Estrutura do Projeto

```
Projeto-Integrador-VI/
├── README.md
├── backend/                    # API Flask
│   ├── app.py                 # Servidor principal
│   ├── config.json            # Configurações do sistema
│   ├── events.json            # Log de eventos
│   └── requirements.txt       # Dependências Python
├── frontend/                   # Interface web React
│   ├── src/
│   │   ├── components/
│   │   │   └── ConfigForm.tsx # Formulário de configuração
│   │   ├── services/
│   │   │   └── api.ts         # Cliente API
│   │   ├── types/
│   │   │   └── config.ts      # Tipos TypeScript
│   │   ├── App.tsx            # Componente principal
│   │   └── main.tsx           # Entry point
│   ├── package.json
│   └── vite.config.ts
└── RaspberryPiPicoW/          # Firmware do microcontrolador
    └── main.py                # Código principal do Pico W
```

## 🔧 Configuração e Instalação

### Pré-requisitos
- Python 3.8+
- Node.js 18+
- Raspberry Pi Pico W
- Sensores PIR e LDR
- Módulo relé

### 1. Backend (Flask API)

```bash
cd backend
pip install -r requirements.txt
python app.py
```

A API estará disponível em `http://localhost:5000`

### 2. Frontend (React App)

```bash
cd frontend
npm install
npm run dev
```

A aplicação web estará disponível em `http://localhost:5173`

### 3. Raspberry Pi Pico W

1. Configure as credenciais Wi-Fi no arquivo `main.py`:
```python
ssid = 'SEU_WIFI'
password = 'SUA_SENHA'
API_BASE = 'http://IP_DO_BACKEND:5000'
```

2. Faça as conexões dos sensores:
   - PIR → GPIO 16
   - LDR → GPIO 26 (ADC)
   - Relé → GPIO 15

3. Carregue o código no Pico W usando Thonny ou similar

## 🌐 API Endpoints

### Configurações
- `GET /config` - Obter configurações atuais
- `POST /config` - Atualizar configurações

### Eventos
- `POST /event` - Registrar novo evento
- `GET /events` - Obter histórico de eventos

### Exemplo de Configuração
```json
{
  "modo": "auto",
  "usar_pir": true,
  "usar_ldr": true,
  "usar_horario": false,
  "horario_inicio": "18:00",
  "horario_fim": "06:00"
}
```

## 🎮 Comandos de Voz

O sistema suporta os seguintes comandos em português:

- **"Modo automático"** - Ativa o modo automático
- **"Ligar luzes"** - Força as luzes ligadas
- **"Desativar luzes"** - Força as luzes desligadas
- **"Ativar sensor de movimento"** - Habilita o PIR
- **"Desativar sensor de movimento"** - Desabilita o PIR
- **"Ativar sensor de luz"** - Habilita o LDR
- **"Desativar sensor de luz"** - Desabilita o LDR

## ⚡ Funcionalidades de Economia de Energia

- **Detecção inteligente**: Liga apenas quando necessário
- **Timeout configurável**: Desliga automaticamente após período sem movimento
- **Sensor de luminosidade**: Evita ligar durante o dia
- **Programação por horário**: Controle baseado em períodos específicos
- **Logs de consumo**: Monitora padrões de uso

## 🔍 Monitoramento e Logs

O sistema registra automaticamente:
- Eventos de liga/desliga
- Detecções de movimento
- Mudanças de configuração
- Horários de ativação
- Fonte da ação (manual/automática)

## 🤝 Contribuição

Este projeto foi desenvolvido como parte do Projeto Integrador VI da UNIVESP. Contribuições são bem-vindas!

## 📄 Licença

Este projeto é desenvolvido para fins acadêmicos como parte do curso de Engenharia da UNIVESP.

## 👥 Equipe de Desenvolvimento

Desenvolvido pelos alunos da UNIVESP como Projeto Integrador VI.

---

**🎓 UNIVESP - Universidade Virtual do Estado de São Paulo**  
**Projeto Integrador VI - Engenharia de Computação**