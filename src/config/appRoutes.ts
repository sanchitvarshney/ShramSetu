/**
 * Central route config: which module is Admin-only vs Client-accessible.
 * Single source of truth for route access and Admin sidebar items.
 */

export type RouteAccess = 'admin' | 'client' | 'both';

export interface RouteDefinition {
  /** Route path (exact or pattern like /company/:id) */
  path: string;
  /** For dynamic routes, prefix to match (e.g. /company/) */
  pathPrefix?: string;
  /** Display label (e.g. for sidebar) */
  label: string;
  /** admin = only Admin users | client = only Client users | both = both */
  access: RouteAccess;
  /** Shown in AdminLayout sidebar (Company, Clients, Workers, etc.) */
  inAdminSidebar?: boolean;
}

/**
 * All protected app routes with access level.
 * Add or change access here to control Admin vs Client visibility and access.
 */
export const APP_ROUTES: Record<string, RouteDefinition> = {
  // ——— Main (no AdminLayout) ———
  HOME: {
    path: '/',
    label: 'Dashboard',
    access: 'both',
  },
  EMPLOYEE_LIST: {
    path: '/employee-list',
    label: 'Employee List',
    access: 'both',
  },
  PROFILE: {
    path: '/profile',
    label: 'Profile',
    access: 'both',
  },

  // ——— Admin section (AdminLayout sidebar) ———
  COMPANY_LIST: {
    path: '/company/list',
    label: 'Company',
    access: 'admin',
    inAdminSidebar: true,
  },
  COMPANY_DETAIL: {
    path: '/company/:id',
    pathPrefix: '/company/',
    label: 'Company details',
    access: 'admin',
  },
  CLIENT_USER: {
    path: '/client-user',
    label: 'Clients',
    access: 'admin',
    inAdminSidebar: true,
  },
  WORKERS: {
    path: '/workers',
    label: 'Workers',
    access: 'both',
    inAdminSidebar: true,
  },
  ACTIVITY_LOG: {
    path: '/activity-log',
    label: 'Activity Log',
    access: 'both',
    inAdminSidebar: true,
  },
  MASTER: {
    path: '/master',
    label: 'Master',
    access: 'admin',
    inAdminSidebar: true,
  },

  // ——— Invitation ———
  INVITATION_WHATSAPP: {
    path: '/invitation/whatsapp',
    label: 'Invitation (WhatsApp)',
    access: 'both',
  },
  INVITATION_MAIL: {
    path: '/invitation/mail',
    label: 'Invitation (Mail)',
    access: 'both',
  },
  INVITATION_MESSAGE: {
    path: '/invitation/message',
    label: 'Invitation (Message)',
    access: 'both',
  },

  // ——— Job ———
  JOB_CREATE: {
    path: '/job/job-create',
    label: 'Add Job',
    access: 'both',
  },
  JOB_LIST: {
    path: '/job/job-list',
    label: 'Job List',
    access: 'both',
  },
  JOB_APPLICATIONS: {
    path: '/job/job-applications',
    label: 'Job Applications',
    access: 'both',
  },

  // ——— Employee ———
  EMPLOYEE_UPDATE: {
    path: '/employee-update/:id',
    pathPrefix: '/employee-update/',
    label: 'Employee Update',
    access: 'both',
  },
};

/** Ordered list of sidebar items for AdminLayout – Admin user */
export const ADMIN_SIDEBAR_ORDER: (keyof typeof APP_ROUTES)[] = [
  'COMPANY_LIST',
  'CLIENT_USER',
  'WORKERS',
  'ACTIVITY_LOG',
  'MASTER',
];

/** Ordered list of sidebar items for Client (Workers, Activity Log only; Master/Department/Designation are Admin only) */
export const CLIENT_SIDEBAR_ORDER: (keyof typeof APP_ROUTES)[] = [
  'WORKERS',
  'ACTIVITY_LOG',
];

/** First route for Client section (used by MainLayout "Client" link) */
export const CLIENT_FIRST_PATH = APP_ROUTES.WORKERS.path; // '/workers'

/**
 * Get all path patterns that are admin-only (for route guard).
 * Returns exact paths and path prefixes (no param paths like /company/:id).
 */
export function getAdminOnlyPaths(): string[] {
  return Object.values(APP_ROUTES)
    .filter((r) => r.access === 'admin')
    .flatMap((r) =>
      r.pathPrefix ? [r.pathPrefix] : [r.path]
    );
}

/**
 * Get route definition for a pathname (exact match first, then prefix).
 */
export function getRouteByPathname(pathname: string): RouteDefinition | undefined {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  const routes = Object.values(APP_ROUTES);
  for (const route of routes) {
    if (normalized === route.path) return route;
  }
  for (const route of routes) {
    if (route.pathPrefix && normalized.startsWith(route.pathPrefix)) return route;
  }
  return undefined;
}

/**
 * Whether this path is admin-only (not accessible to Client).
 */
export function isAdminOnlyPathFromConfig(pathname: string): boolean {
  const route = getRouteByPathname(pathname);
  if (!route) return false;
  return route.access === 'admin';
}
