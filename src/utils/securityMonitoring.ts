interface SecurityEvent {
  type: 'auth_failure' | 'auth_success' | 'suspicious_activity' | 'admin_action';
  details: Record<string, any>;
  timestamp: string;
  userAgent: string;
  ip?: string;
}

class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private maxEvents = 100;

  logEvent(type: SecurityEvent['type'], details: Record<string, any>) {
    const event: SecurityEvent = {
      type,
      details,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };

    console.log('Security Event:', event);
    
    // Add to local storage for debugging
    this.events.push(event);
    
    // Keep only the most recent events
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }
    
    // Store in localStorage for persistence
    try {
      localStorage.setItem('security_events', JSON.stringify(this.events.slice(-20)));
    } catch (error) {
      console.warn('Could not store security events:', error);
    }
  }

  logAuthFailure(email: string, error: any) {
    this.logEvent('auth_failure', {
      email: email.substring(0, 3) + '***', // Partially mask email
      errorMessage: error.message,
      errorCode: error.status || error.code,
      url: window.location.href
    });
  }

  logAuthSuccess(email: string) {
    this.logEvent('auth_success', {
      email: email.substring(0, 3) + '***', // Partially mask email
      url: window.location.href
    });
  }

  logSuspiciousActivity(details: Record<string, any>) {
    this.logEvent('suspicious_activity', details);
  }

  logAdminAction(action: string, details: Record<string, any>) {
    this.logEvent('admin_action', {
      action,
      ...details
    });
  }

  getRecentEvents(limit = 10): SecurityEvent[] {
    return this.events.slice(-limit);
  }

  exportEvents(): string {
    return JSON.stringify(this.events, null, 2);
  }
}

export const securityMonitor = new SecurityMonitor();
