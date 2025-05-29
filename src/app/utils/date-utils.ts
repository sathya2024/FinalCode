export function toDateInputValue(dateStr: string): string {
    if (!dateStr) return '';
    return dateStr.length > 10 ? dateStr.substring(0, 10) : dateStr;
  }
  