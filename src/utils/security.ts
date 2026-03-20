
// Security utilities for rate limiting and additional protections

interface RateLimitStore {
  [key: string]: {
    count: number;
    lastReset: number;
  };
}

class SecurityUtils {
  private static rateLimitStore: RateLimitStore = {};

  /**
   * Simple client-side rate limiting
   * @param key - unique identifier for the action (e.g., 'form-submit', 'login-attempt')
   * @param maxAttempts - maximum attempts allowed in the time window
   * @param windowMs - time window in milliseconds
   * @returns true if action is allowed, false if rate limited
   */
  static checkRateLimit(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const entry = this.rateLimitStore[key];

    if (!entry || now - entry.lastReset > windowMs) {
      // Reset or create new entry
      this.rateLimitStore[key] = {
        count: 1,
        lastReset: now
      };
      return true;
    }

    if (entry.count >= maxAttempts) {
      return false; // Rate limited
    }

    entry.count++;
    return true;
  }

  /**
   * Clear rate limit for a specific key (useful after successful operations)
   */
  static clearRateLimit(key: string): void {
    delete this.rateLimitStore[key];
  }

  /**
   * Sanitize HTML content to prevent XSS
   */
  static sanitizeHtml(input: string): string {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  /**
   * Generate a simple CSRF-like token for forms
   */
  static generateFormToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  /**
   * Validate form token (basic implementation)
   */
  static validateFormToken(token: string, maxAge: number = 300000): boolean {
    if (!token || token.length < 10) return false;
    
    // Extract timestamp from token
    const parts = token.split('');
    const timestampPart = parts.slice(-8).join('');
    const timestamp = parseInt(timestampPart, 36);
    
    if (isNaN(timestamp)) return false;
    
    return Date.now() - timestamp < maxAge;
  }

  /**
   * Log security events (in a real app, this would send to your monitoring service)
   */
  static logSecurityEvent(event: string, details: any): void {
    console.warn(`[SECURITY] ${event}:`, {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...details
    });
  }
}

export default SecurityUtils;
