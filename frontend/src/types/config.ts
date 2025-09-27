export interface Config {
  modo: 'auto' | 'manual_on' | 'manual_off';
  usar_pir: boolean;
  usar_ldr: boolean;
  usar_horario: boolean;
  horario_inicio: string;
  horario_fim: string;
}
