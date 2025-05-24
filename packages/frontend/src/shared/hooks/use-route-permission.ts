import { useEffect, useRef, useState } from 'react';
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';
import {
  Permission,
  UserRole,
  useRole
} from '@/features/user-profile/hooks/useRole';

interface RoutePermissionOptions {
  requiredPermissions?: Permission[];
  requiredRoles?: UserRole[];
  resourceOwnerId?: string;
  // Optional fallback route to navigate to when permission is denied
  fallbackRoute?: string;
  // Message to display when permission is denied
  permissionDeniedMessage?: string;
}

export function useRoutePermission({
  requiredPermissions,
  requiredRoles,
  resourceOwnerId,
  fallbackRoute = '/',
  permissionDeniedMessage = 'You do not have permission to access this page.'
}: RoutePermissionOptions) {
  const { showAlert } = useAlertDialog();
  const { hasRole, hasAllPermissions, role } = useRole();
  const hasCheckedPermission = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate current access state
  const isAuthorized =
    role &&
    (requiredRoles && requiredRoles.length > 0
      ? requiredRoles.some((roleRequired) => hasRole(roleRequired))
      : true) &&
    (requiredPermissions && requiredPermissions.length > 0
      ? hasAllPermissions(requiredPermissions, resourceOwnerId)
      : true);

  useEffect(() => {
    // If role is loaded, we're no longer loading
    if (role !== undefined) {
      setIsLoading(false);
    }

    // Skip if user data not loaded yet
    if (!role) {
      return;
    }

    // Only check permission once to prevent infinite loops
    if (!hasCheckedPermission.current) {
      hasCheckedPermission.current = true;

      if (!isAuthorized) {
        showAlert({
          title: 'Access Denied',
          description: permissionDeniedMessage,
          type: 'warning',
          redirect: fallbackRoute
        });
      }
    }
  }, [role, isAuthorized, showAlert, fallbackRoute, permissionDeniedMessage]);

  return { isAuthorized, isLoading, hasAccess: isAuthorized };
}
