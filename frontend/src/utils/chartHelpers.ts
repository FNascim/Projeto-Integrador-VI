import { isToday, endOfDay, startOfDay, formatISO } from "date-fns";
import type { EventLog } from "../types/eventLog";

/**
 * Para o cálculo do tempo de uso é necessário que:
 * 1. O primeiro evento do dia deve ser do tipo 'ligada'
 * 2. O último evento do dia deve ser do tipo 'desligada'
 * 3. O número de eventos ligada e desligada usados no cálculo deve ser o mesmo
 *    3.1. Eventos repetidos sem um par diretamente em sequência são ignorados
 *
 * Funcionamento:
 *   - eventos do tipo 'ligada' tem timestamp negativo
 *   - eventos do tipo 'desligada' tem timestamp positivo
 *   - calcula-se a diferença quando 'ligada' e 'desligada' vem em sequência
 *   - a soma das diferenças é o tempo de uso no dia
 */

/**
 * Essa função cuida dos pontos 1 e 2 adicionando eventos no início e fim
 * do dia, se necessário.
 * O array de entrada é modificado diretamente por referência
 */
const handleEventsBetweenDays = (eventList: EventLog[]): void => {
  const firstEvent = eventList[0];
  const lastEvent = eventList[eventList.length - 1];

  // Se a lâmpada estava ligada antes do início do dia
  if (
    firstEvent.event === "desligada_auto" ||
    firstEvent.event === "desligada_manual"
  ) {
    // Adicione um evento de ligar no início do dia
    eventList.unshift({
      timestamp: formatISO(startOfDay(firstEvent.timestamp)),
      event: "ligada_auto",
      source: "pico",
    });
  }

  // Se a lâmpada foi deixada ligada ao final do dia
  if (
    lastEvent.event === "ligada_auto" ||
    lastEvent.event === "ligada_manual"
  ) {
    // Se o dia ainda não acabou
    if (isToday(lastEvent.timestamp)) {
      // Adicione um evento de desligar a lâmpada agora
      eventList.push({
        timestamp: formatISO(Date.now()),
        event: "desligada_auto",
        source: "pico",
      });
    } else {
      // Adicione um evento de desligar ao final do dia
      eventList.push({
        timestamp: formatISO(endOfDay(firstEvent.timestamp)),
        event: "desligada_auto",
        source: "pico",
      });
    }
  }
};

interface UsageByDay {
  x: string;
  y: number;
}

interface GroupOfEvents {
  [key: string]: EventLog[];
}

export function getUsageByDay(eventList: EventLog[]): UsageByDay[] {
  // Agrupa os eventos por dia
  // @ts-expect-error esse método é recente e o typescript gera alguns erros
  const groupedEventsByDay: GroupOfEvents = Object.groupBy(
    eventList,
    ({ timestamp }: { timestamp: string }) =>
      formatISO(timestamp, { representation: "date" })
  );

  // Ajusta os dados
  Object.values(groupedEventsByDay).forEach(eventArray => {
    handleEventsBetweenDays(eventArray);
  });

  // Cria os objetos do tipo { x: 'date', y: 'valor' }
  const result = Object.entries(groupedEventsByDay).map(([key, value]) => {
    let totalTime: number = 0;

    // Calcula o tempo total que a lâmpada ficou ligada
    for (let i = 0; i < value.length; i++) {
      const currentEvent = value[i];
      const nextEvent = value[i + 1];

      if (
        (currentEvent.event === "ligada_auto" ||
          currentEvent.event === "ligada_manual") &&
        nextEvent &&
        (nextEvent.event === "desligada_auto" ||
          nextEvent.event === "desligada_manual")
      ) {
        totalTime =
          totalTime +
          new Date(nextEvent.timestamp).getTime() -
          new Date(currentEvent.timestamp).getTime();
      }
    }

    return { x: key, y: totalTime / 1000 / 60 / 60 };
  });

  return result;
}

