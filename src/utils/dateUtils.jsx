/**
 * Date/Time Utilities for POS System
 * Includes formatting, parsing, and date math functions
 */

// Main formatting function
export const formatDateTime = (date, options = {}) => {
    if (!date) return 'N/A';
    
    const dt = new Date(date);
    if (isNaN(dt.getTime())) return 'Invalid Date';
  
    const defaults = {
      dateStyle: 'medium',
      timeStyle: 'short',
      hour12: true
    };
  
    const mergedOptions = { ...defaults, ...options };
    
    return new Intl.DateTimeFormat('en-US', mergedOptions).format(dt);
  };
  
  // Specific format presets
  export const formatDate = (date) => 
    formatDateTime(date, { timeStyle: undefined });
  
  export const formatTime = (date) => 
    formatDateTime(date, { dateStyle: undefined });
  
  export const formatShortDate = (date) =>
    formatDateTime(date, { 
      dateStyle: 'short', 
      timeStyle: undefined 
    });
  
  export const formatLongDateTime = (date) =>
    formatDateTime(date, {
      dateStyle: 'full',
      timeStyle: 'long'
    });
  
  // Relative time formatting (e.g., "2 hours ago")
  export const formatRelativeTime = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
  
    for (const [unit, seconds] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / seconds);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
      }
    }
    
    return 'Just now';
  };
  
  // Date math utilities
  export const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  
  export const addHours = (date, hours) => {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
  };
  
  export const startOfDay = (date) => {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  };
  
  export const endOfDay = (date) => {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  };
  
  // Date range utilities
  export const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };
  
  export const isToday = (date) => {
    return isSameDay(new Date(), date);
  };
  
  export const isYesterday = (date) => {
    return isSameDay(addDays(new Date(), -1), date);
  };
  
  // Date validation
  export const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date.getTime());
  };
  
  // Date parsing (with format options)
  export const parseDateString = (dateString, format = 'YYYY-MM-DD') => {
    if (!dateString) return null;
    
    // Basic ISO format detection
    if (dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
      const dt = new Date(dateString);
      return isValidDate(dt) ? dt : null;
    }
    
    // Handle other formats as needed
    // Add additional format parsers here
    
    return null;
  };
  
  // Business date utilities
  export const isBusinessDay = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // Not Sunday or Saturday
  };
  
  export const nextBusinessDay = (date) => {
    let result = addDays(date, 1);
    while (!isBusinessDay(result)) {
      result = addDays(result, 1);
    }
    return result;
  };
  
  // Timezone utilities
  export const toLocalTime = (date) => {
    if (!date) return null;
    const dt = new Date(date);
    return new Date(dt.getTime() - dt.getTimezoneOffset() * 60000);
  };
  
  export const toUTCTime = (date) => {
    if (!date) return null;
    const dt = new Date(date);
    return new Date(dt.getTime() + dt.getTimezoneOffset() * 60000);
  };
  
  // Duration formatting (e.g., "2h 30m")
  export const formatDuration = (milliseconds) => {
    if (!milliseconds) return '0m';
    
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes % 60 > 0) parts.push(`${minutes % 60}m`);
    
    return parts.join(' ') || '0m';
  };
  
  // Export all functions
  export default {
    formatDateTime,
    formatDate,
    formatTime,
    formatShortDate,
    formatLongDateTime,
    formatRelativeTime,
    addDays,
    addHours,
    startOfDay,
    endOfDay,
    isSameDay,
    isToday,
    isYesterday,
    isValidDate,
    parseDateString,
    isBusinessDay,
    nextBusinessDay,
    toLocalTime,
    toUTCTime,
    formatDuration
  };