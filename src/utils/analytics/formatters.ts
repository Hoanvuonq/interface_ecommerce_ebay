/**
 * Format number with thousand separators
 * @param value Number to format
 * @returns Formatted string (e.g., "1,234,567")
 */
export function formatNumber(value: number | undefined | null): string {
    if (value === undefined || value === null || isNaN(value)) {
        return '0';
    }
    return new Intl.NumberFormat('vi-VN').format(Math.round(value));
}

/**
 * Format currency in VND
 * @param value Amount in VND
 * @returns Formatted currency string (e.g., "1,234,567 ₫")
 */
export function formatCurrency(value: number | undefined | null): string {
    if (value === undefined || value === null || isNaN(value)) {
        return '0 ₫';
    }
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

/**
 * Format currency in short form for charts
 * @param value Amount in VND
 * @returns Short formatted string (e.g., "1.2M", "345K")
 */
export function formatCurrencyShort(value: number | undefined | null): string {
    if (value === undefined || value === null || isNaN(value)) {
        return '0';
    }

    const absValue = Math.abs(value);

    if (absValue >= 1_000_000_000) {
        return `${(value / 1_000_000_000).toFixed(1)}B`;
    }
    if (absValue >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1)}M`;
    }
    if (absValue >= 1_000) {
        return `${(value / 1_000).toFixed(1)}K`;
    }
    return value.toString();
}

/**
 * Format percentage with + or - sign
 * @param value Percentage value (-100 to +100)
 * @param decimals Number of decimal places (default: 1)
 * @returns Formatted percentage (e.g., "+15.5%", "-3.2%")
 */
export function formatPercentage(
    value: number | undefined | null,
    decimals: number = 1
): string {
    if (value === undefined || value === null || isNaN(value)) {
        return '0%';
    }

    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Format date to Vietnamese format
 * @param dateString ISO date string
 * @returns Formatted date (e.g., "25/11/2024")
 */
export function formatDate(dateString: string | undefined | null): string {
    if (!dateString) {
        return '';
    }

    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(date);
    } catch (error) {
        console.error('Invalid date:', dateString);
        return '';
    }
}

/**
 * Format date to relative string (e.g., "Hôm nay", "Hôm qua")
 * @param dateString ISO date string
 * @returns Relative date string
 */
export function formatRelativeDate(dateString: string | undefined | null): string {
    if (!dateString) {
        return '';
    }

    try {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Reset time part for comparison
        date.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        yesterday.setHours(0, 0, 0, 0);

        if (date.getTime() === today.getTime()) {
            return 'Hôm nay';
        }
        if (date.getTime() === yesterday.getTime()) {
            return 'Hôm qua';
        }

        return formatDate(dateString);
    } catch (error) {
        return formatDate(dateString);
    }
}

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 */
export function getTodayISO(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

/**
 * Get yesterday's date in ISO format
 */
export function getYesterdayISO(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
}

/**
 * Parse ISO date string to Date object
 * @param dateString ISO date string
 * @returns Date object or null if invalid
 */
export function parseISODate(dateString: string | undefined | null): Date | null {
    if (!dateString) {
        return null;
    }

    try {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
    } catch (error) {
        return null;
    }
}
