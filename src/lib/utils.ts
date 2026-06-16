export function formatCUP(price: number): string {
  return `${price.toFixed(2)} CUP`;
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
