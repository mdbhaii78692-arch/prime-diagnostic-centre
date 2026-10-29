import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, AdminRole, SecurityAuditLog } from '../types/auth';

interface AuthContextType {
  currentUser: AdminUser | null;
  isAuthenticated: boolean;
  login: (usernameOrEmail: string, passkey: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  auditLogs: SecurityAuditLog[];
  logSecurityEvent: (action: string, resourceType: SecurityAuditLog['resourceType'], details: string, resourceId?: string) => void;
  hasRole: (allowedRoles: AdminRole[]) => boolean;
}

// Authorized laboratory personnel profiles
const AUTHORIZED_STAFF_ACCOUNTS: Array<{ user: AdminUser; secretHash: string }> = [
  {
    user: {
      id: 'staff-001',
      username: 'admin',
      fullName: 'Dr. R. K. Sharma (Chief Pathologist & Lab Director)',
      email: 'director@primediagnostic.in',
      role: 'SUPER_ADMIN',
      isActive: true,
      badgeNumber: 'PDC-DIR-01'
    },
    secretHash: 'Prime@2026Admin'
  },
  {
    user: {
      id: 'staff-002',
      username: 'labadmin',
      fullName: 'Amina Shaikh (Laboratory Operations Head)',
      email: 'ops@primediagnostic.in',
      role: 'LAB_ADMINISTRATOR',
      isActive: true,
      badgeNumber: 'PDC-OPS-04'
    },
    secretHash: 'LabAdmin#2026'
  },
  {
    user: {
      id: 'staff-003',
      username: 'dispatch',
      fullName: 'Santosh Kamble (Home Collection Dispatch Staff)',
      email: 'dispatch@primediagnostic.in',
      role: 'BOOKING_STAFF',
      isActive: true,
      badgeNumber: 'PDC-DSP-12'
    },
    secretHash: 'Dispatch@Kurla'
  },
  {
    user: {
      id: 'staff-004',
      username: 'catalogue',
      fullName: 'Pooja Nair (Medical Information Specialist)',
      email: 'catalogue@primediagnostic.in',
      role: 'CATALOGUE_MANAGER',
      isActive: true,
      badgeNumber: 'PDC-CAT-07'
    },
    secretHash: 'Catalogue#2026'
  }
];

const INITIAL_AUDIT_LOGS: SecurityAuditLog[] = [
  {
    id: 'log-001',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    actor: 'System Security Engine',
    action: 'SYSTEM_BOOTSTRAP',
    resourceType: 'SETTINGS',
    details: 'Master Diagnostic Catalogue initialized with 2,520+ verified laboratory parameters. DPDP Act 2023 access controls active.'
  },
  {
    id: 'log-002',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    actor: 'Amina Shaikh (ops@primediagnostic.in)',
    action: 'SERVICE_ZONE_CHECK',
    resourceType: 'SETTINGS',
    details: 'Home sample collection radius confirmed for Kurla East, Nehru Nagar, Chembur, Ghatkopar, and surrounding Mumbai districts.'
  }
];

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  login: async () => ({ success: false }),
  logout: () => {},
  auditLogs: [],
  logSecurityEvent: () => {},
  hasRole: () => false
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>(INITIAL_AUDIT_LOGS);

  // Restore authenticated session from sessionStorage (Strictly NOT stored insecurely in permanent storage)
  useEffect(() => {
    try {
      const session = sessionStorage.getItem('pdc_auth_session');
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed && parsed.id && parsed.role) {
          setCurrentUser(parsed);
        }
      }
      const storedLogs = localStorage.getItem('pdc_audit_trail');
      if (storedLogs) {
        setAuditLogs(JSON.parse(storedLogs));
      }
    } catch {
      // ignore
    }
  }, []);

  const logSecurityEvent = (
    action: string,
    resourceType: SecurityAuditLog['resourceType'],
    details: string,
    resourceId?: string
  ) => {
    const entry: SecurityAuditLog = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actor: currentUser ? `${currentUser.fullName} (${currentUser.role})` : 'Anonymous / Patient Client',
      action,
      resourceType,
      resourceId,
      details
    };

    setAuditLogs((prev) => {
      const updated = [entry, ...prev.slice(0, 99)];
      try {
        localStorage.setItem('pdc_audit_trail', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const login = async (usernameOrEmail: string, passkey: string): Promise<{ success: boolean; message?: string }> => {
    const trimmedInput = usernameOrEmail.trim().toLowerCase();
    const match = AUTHORIZED_STAFF_ACCOUNTS.find(
      (acc) =>
        (acc.user.username.toLowerCase() === trimmedInput || acc.user.email.toLowerCase() === trimmedInput) &&
        acc.secretHash === passkey
    );

    if (!match) {
      logSecurityEvent(
        'LOGIN_FAILED',
        'AUTHENTICATION',
        `Failed authentication attempt for identity '${usernameOrEmail}'. Access denied.`
      );
      return {
        success: false,
        message: 'Invalid staff credentials or unauthorized access key.'
      };
    }

    if (!match.user.isActive) {
      logSecurityEvent(
        'LOGIN_BLOCKED_INACTIVE',
        'AUTHENTICATION',
        `Access denied for deactivated account: ${match.user.email}`
      );
      return {
        success: false,
        message: 'This staff account has been suspended or deactivated.'
      };
    }

    const sessionUser: AdminUser = {
      ...match.user,
      lastLogin: new Date().toISOString()
    };

    setCurrentUser(sessionUser);
    try {
      sessionStorage.setItem('pdc_auth_session', JSON.stringify(sessionUser));
    } catch {
      // ignore
    }

    logSecurityEvent(
      'LOGIN_SUCCESS',
      'AUTHENTICATION',
      `Staff ${sessionUser.fullName} (${sessionUser.role}) logged in successfully.`
    );

    return { success: true };
  };

  const logout = () => {
    if (currentUser) {
      logSecurityEvent(
        'LOGOUT',
        'AUTHENTICATION',
        `Staff ${currentUser.fullName} logged out.`
      );
    }
    setCurrentUser(null);
    try {
      sessionStorage.removeItem('pdc_auth_session');
    } catch {
      // ignore
    }
  };

  const hasRole = (allowedRoles: AdminRole[]): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'SUPER_ADMIN') return true; // Super admin possesses full capabilities
    return allowedRoles.includes(currentUser.role);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        auditLogs,
        logSecurityEvent,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
