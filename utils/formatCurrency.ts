// utils/formatCurrency.ts
export function formatSAR(value: string | number): string {
  if (!value && value !== 0) return ''
  return `<span class="sar-icon">&#xe900;</span> ${value}`
}
