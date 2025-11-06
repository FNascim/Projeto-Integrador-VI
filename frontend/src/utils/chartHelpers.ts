import { getDay, isSameWeek, isSameDay, endOfDay, startOfDay } from "date-fns";
import type { EventLog } from "../types/eventLog";
import type { ChartData } from "chart.js";

/**
 * Retorna o tempo que a lâmpada ficou ligada durante cada dia da semana atual
 * TODO: tem um jeito mais limpo de fazer isso?
 */
export function getDailyUsageForThisWeek(
  eventList: EventLog[]
): ChartData<"line"> {
  const weekLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
  const today = Date.now();
  // Variável abaixo é temporária para testar os dados
  // const today = "2025-09-25T22:56:47.124235";
  const eventsFromThisWeek = eventList.filter(({ timestamp }) =>
    isSameWeek(today, timestamp)
  );

  // Cada índice corresponde a um dia da semana
  const usage: number[] = new Array(7).fill(0);
  let lastTimeTurnedOn: Date | null = null;

  for (let i = 0; i < eventsFromThisWeek.length; i++) {
    const eventTime = new Date(eventsFromThisWeek[i].timestamp);
    const typeOfEvent = eventsFromThisWeek[i].event;

    if (typeOfEvent === "ligada_manual" || typeOfEvent === "ligada_auto") {
      // Salva a hora que a lâmpada foi ligada
      lastTimeTurnedOn = eventTime;
    } else if (lastTimeTurnedOn) {
      // Se a lâmpada estava ligada calcula o tempo que ficou ligada
      if (isSameDay(lastTimeTurnedOn, eventTime)) {
        // Quando foi ligada e desligada no mesmo dia
        const dayOfTheEvent = getDay(eventTime);
        const timePassed = eventTime.getTime() - lastTimeTurnedOn.getTime();
        usage[dayOfTheEvent] += timePassed;
      } else {
        // Quando foi ligada em um dia e desligada no outro
        const firstDay = getDay(lastTimeTurnedOn);
        const lastDay = getDay(eventTime);
        const timePassedForFirstDay =
          endOfDay(lastTimeTurnedOn).getTime() - lastTimeTurnedOn.getTime();
        const timePassedForLastDay =
          startOfDay(eventTime).getTime() - eventTime.getTime();
        usage[firstDay] += timePassedForFirstDay;
        usage[lastDay] += timePassedForLastDay;
      }

      lastTimeTurnedOn = null;
    }
  }

  const usageInHour = usage.map(valueInMs => valueInMs / 1000 / 60 / 60);

  return {
    labels: weekLabels,
    datasets: [
      {
        label: "Tempo ligada (h)",
        data: usageInHour,
      },
    ],
  };
}

