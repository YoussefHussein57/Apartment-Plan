export function money(n: number): string {
  return `${Math.round(n).toLocaleString('en-US')} ج.م`;
}

export function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

export function dateAr(d: string | null): string {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
}
