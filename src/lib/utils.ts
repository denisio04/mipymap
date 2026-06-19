export function formatCUP(price: number): string {
  return `${price.toFixed(2)} CUP`;
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function isOpenNow(openingTime: string | null, closingTime: string | null): boolean {
  if (!openingTime || !closingTime) return true;
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  const [oh, om] = openingTime.split(':').map(Number);
  const [ch, cm] = closingTime.split(':').map(Number);
  const open = oh * 60 + om;
  const close = ch * 60 + cm;
  // si cierre < apertura → horario nocturno (ej: 22:00-06:00)
  if (close < open) return current >= open || current <= close;
  return current >= open && current <= close;
}

export function formatTimeRange(openingTime: string | null, closingTime: string | null): string {
  if (!openingTime || !closingTime) return 'Horario no definido';
  return `${openingTime} - ${closingTime}`;
}
