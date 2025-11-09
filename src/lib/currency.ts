/**
 * Currency Formatting Utilities for Ghana Cedis (GHS)
 */

/**
 * Format amount in Ghana Cedis
 */
export function formatGHS(amount: number): string {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format amount from pesewas to GHS
 */
export function formatPesewas(pesewas: number): string {
  return formatGHS(pesewas / 100);
}

/**
 * Convert GHS to pesewas (for Paystack)
 */
export function ghsToPesewas(ghs: number): number {
  return Math.round(ghs * 100);
}

/**
 * Convert pesewas to GHS
 */
export function pesewasToGHS(pesewas: number): number {
  return pesewas / 100;
}

/**
 * Get Ghana Cedis symbol
 */
export function getGHSSymbol(): string {
  return 'GH₵';
}
