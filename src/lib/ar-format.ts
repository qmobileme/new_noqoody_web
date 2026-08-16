/**
 * Arabic (ar-QA) localisation helpers.
 * Converts numbers, dates and punctuation to Arabic conventions so Arabic
 * copy reads natively while English copy stays untouched.
 */

const AR_LOCALE = "ar-QA-u-nu-arab";

/** Format any number with Arabic-Indic digits and Arabic grouping. */
export function arNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(AR_LOCALE, options).format(value);
}

/** Format a currency amount (QAR by default) in Arabic conventions. */
export function arCurrency(value: number, currency = "QAR"): string {
  return new Intl.NumberFormat(AR_LOCALE, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

/** Format a date in Arabic conventions. */
export function arDate(value: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(AR_LOCALE, options ?? { dateStyle: "long" }).format(date);
}

const DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/**
 * Convert Latin digits and punctuation inside a mixed string to Arabic forms.
 * Useful for short display strings such as "24/7" or "+15%".
 */
export function arText(input: string): string {
  return input
    .replace(/[0-9]/g, (d) => DIGITS[Number(d)] ?? d)
    .replace(/,/g, "،")
    .replace(/;/g, "؛")
    .replace(/\?/g, "؟")
    .replace(/%/g, "٪");
}
