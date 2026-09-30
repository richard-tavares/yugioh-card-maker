export function sanitizeInteger(input: string, min: number, max: number): string {
    const parsed = parseInt(input.replace(/\D/g, ""), 10);
    return isNaN(parsed) ? "" : String(Math.min(Math.max(parsed, min), max));
}

export function sanitizeStat(input: string, max: number): string {
    return input.includes("?") ? "?" : sanitizeInteger(input, 0, max);
}

export function sanitizeDigits(input: string, maxLength: number): string {
    return input.replace(/\D/g, "").slice(0, maxLength);
}
