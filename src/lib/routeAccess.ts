import { getAdminOnlyPaths, getRouteByPathname } from '@/config/appRoutes';

/**
 * Get the logged-in user's type from localStorage ('admin' | 'client' | null).
 */
export function getLoggedInUserType(): string | null {
  try {
    const user = localStorage.getItem('loggedInUser');
    if (!user) return null;
    const data = JSON.parse(user);
    return data?.type ?? null;
  } catch {
    return null;
  }
}

/** Admin-only path patterns derived from config (for path matching). */
function getAdminOnlyPatterns(): string[] {
  const paths = getAdminOnlyPaths();
  return [...new Set(paths)]; // unique
}

/**
 * Returns true if the given pathname is an admin-only route (not accessible to Client).
 * Uses central config from @/config/appRoutes.
 */
export function isAdminOnlyPath(pathname: string): boolean {
  const route = getRouteByPathname(pathname);
  if (route) return route.access === 'admin';
  const normalized = pathname.replace(/\/+$/, '') || '/';
  for (const pattern of getAdminOnlyPatterns()) {
    if (pattern.endsWith('/')) {
      if (normalized === pattern.slice(0, -1) || normalized.startsWith(pattern)) return true;
    } else {
      if (normalized === pattern) return true;
    }
  }
  return false;
}

/**
 * Returns true if the current user can access the given pathname.
 * Client users cannot access admin-only paths.
 */
export function isRouteAccessibleForUser(pathname: string): boolean {
  const userType = getLoggedInUserType();
  if (userType === 'admin') return true;
  if (!isAdminOnlyPath(pathname)) return true;
  return false;
}
