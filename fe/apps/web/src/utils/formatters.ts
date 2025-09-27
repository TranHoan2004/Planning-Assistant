/**
 * Utility functions for formatting data in reports
 */

/**
 * Format currency value to Vietnamese Dong format
 * @param value - String or number value to format
 * @returns Formatted currency string (e.g., "1.000.000 ₫")
 */
export const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency === 'VND' ? 'VND' : 'USD',
    minimumFractionDigits: 0
  }).format(amount)
}

/**
 * Format percentage value
 * @param value - String or number value to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string (e.g., "12.34%")
 */
export const formatPercentage = (
  value: string | number,
  decimals: number = 2
): string => {
  const num = parseFloat(value?.toString() || '0')
  return `${num.toFixed(decimals)}%`
}

/**
 * Format number with Vietnamese locale
 * @param value - String or number value to format
 * @returns Formatted number string (e.g., "1.234.567")
 */
export const formatNumber = (value: string | number): string => {
  const num = parseFloat(value?.toString() || '0')
  return new Intl.NumberFormat('vi-VN').format(num)
}

/**
 * Create animation key for components based on data values
 * @param values - Array of values to create stable key
 * @returns Stable animation key string
 */
export const createAnimationKey = (...values: (string | number)[]): string => {
  return values.map((v) => v?.toString() || '0').join('-')
}
