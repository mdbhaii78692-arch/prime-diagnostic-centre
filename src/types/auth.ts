export type AdminRole = 
  | 'SUPER_ADMIN' 
  | 'LAB_ADMINISTRATOR' 
  | 'BOOKING_STAFF' 
  | 'PHLEBOTOMIST' 
  | 'CATALOGUE_MANAGER';

export interface AdminUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  lastLogin?: string;
  badgeNumber?: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resourceType: 'BOOKING' | 'TEST_CATALOGUE' | 'AUTHENTICATION' | 'EXPORT' | 'SETTINGS';
  resourceId?: string;
  ipAddress?: string;
  details: string;
}
