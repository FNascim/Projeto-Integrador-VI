# Sistema de Controle de Iluminação - Frontend

Sistema inteligente de controle de iluminação com Pico W, desenvolvido em React + TypeScript + Vite.

## 🏗️ Arquitetura Reestruturada

O projeto foi reestruturado para seguir boas práticas de separação de responsabilidades:

### 📁 Estrutura de Pastas

```
src/
├── components/          # Componentes React
│   ├── ConfigForm.tsx   # Formulário principal
│   ├── ConfigForm.css   # Estilos do formulário
│   ├── VoiceControl.tsx # Controle de voz
│   ├── FeedbackMessage.tsx # Mensagens de feedback
│   └── ConfigFormFields.tsx # Campos do formulário
├── hooks/               # Hooks customizados
│   ├── useConfig.ts     # Gerenciamento de configurações
│   ├── useVoiceControl.ts # Controle de comandos de voz
│   └── useFeedback.ts   # Sistema de feedback
├── services/            # Serviços de API
│   └── api.ts          # Comunicação com backend
├── types/               # Definições de tipos
│   ├── config.ts       # Tipos de configuração
│   └── global.d.ts     # Declarações globais
├── constants/           # Constantes da aplicação
│   └── appConstants.ts  # Comandos de voz, opções, etc.
├── utils/               # Utilitários
│   └── helpers.ts      # Funções auxiliares
└── App.tsx             # Componente principal
```

### 🎨 Separação de Responsabilidades

#### **CSS (Estilos)**

- `App.css` - Estilos principais da aplicação
- `ConfigForm.css` - Estilos específicos do formulário
- Design responsivo e acessível
- Uso de classes semânticas

#### **TypeScript (Lógica)**

- **Hooks customizados** para lógica complexa
- **Componentes** focados apenas em apresentação
- **Serviços** para comunicação com API
- **Utilitários** para funções auxiliares

#### **HTML/JSX (Estrutura)**

- Componentes semanticamente estruturados
- Separação clara entre apresentação e lógica
- Props bem definidas e tipadas

### 🔧 Principais Melhorias

#### **1. Hooks Customizados**

```typescript
// useConfig - Gerenciamento de estado das configurações
const { config, loading, error, updateConfigData } = useConfig();

// useVoiceControl - Lógica de comandos de voz
const { voiceSupported, listening, startListening } = useVoiceControl();

// useFeedback - Sistema de notificações
const { feedback, showFeedback } = useFeedback();
```

#### **2. Componentes Específicos**

- `VoiceControl` - Interface de controle por voz
- `FeedbackMessage` - Exibição de mensagens
- `ConfigFormFields` - Campos do formulário

#### **3. Constantes Centralizadas**

```typescript
// Comandos de voz organizados
export const VOICE_COMMANDS = {
  MODO_AUTOMATICO: "modo automático",
  LIGAR_LUZES: "ligar luzes",
  // ...
} as const;
```

#### **4. Utilitários**

```typescript
// Funções auxiliares reutilizáveis
export function checkSpeechRecognitionSupport(): boolean;
export function createSpeechRecognition(): SpeechRecognition | null;
```

### 🚀 Benefícios da Reestruturação

1. **Manutenibilidade**: Código mais organizado e fácil de manter
2. **Reutilização**: Componentes e hooks reutilizáveis
3. **Testabilidade**: Lógica separada facilita testes unitários
4. **Performance**: Componentes otimizados e re-renders controlados
5. **Escalabilidade**: Estrutura preparada para crescimento do projeto
6. **Legibilidade**: Código mais limpo e autodocumentado

### 🎨 Design System

- **Cores**: Sistema de cores consistente
- **Tipografia**: Hierarquia visual clara
- **Espaçamento**: Grid system responsivo
- **Componentes**: Interface moderna e intuitiva

## 🛠️ Comandos de Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 🗣️ Comandos de Voz Disponíveis

- "modo automático" - Ativa modo automático
- "ligar luzes" - Liga as luzes manualmente
- "desativar luzes" - Desliga as luzes
- "movimento on/off" - Controla sensor PIR
- "luminosidade on/off" - Controla sensor LDR

## 🌐 Tecnologias

- **React 18** - Framework frontend
- **TypeScript** - Tipagem estática
- **Vite** - Build tool moderna
- **CSS3** - Estilos modernos e responsivos
- **Web Speech API** - Reconhecimento de voz
  import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
globalIgnores(['dist']),
{
files: ['**/*.{ts,tsx}'],
extends: [
// Other configs...
// Enable lint rules for React
reactX.configs['recommended-typescript'],
// Enable lint rules for React DOM
reactDom.configs.recommended,
],
languageOptions: {
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])

```

```
