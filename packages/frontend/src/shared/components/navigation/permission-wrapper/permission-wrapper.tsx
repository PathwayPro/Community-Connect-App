'use client';

import { useRoutePermission } from '@/shared/hooks/use-route-permission';
import { UserRole } from '@/features/user-profile/hooks/useRole';

interface PermissionWrapperProps {
  children: React.ReactNode;
  requiredRoles: UserRole[];
  fallbackRoute: string;
  permissionDeniedMessage: string;
}

export const PermissionWrapper = ({
  children,
  requiredRoles,
  fallbackRoute,
  permissionDeniedMessage
}: PermissionWrapperProps) => {
  const { hasAccess, isLoading } = useRoutePermission({
    requiredRoles,
    fallbackRoute,
    permissionDeniedMessage
  });

  if (isLoading || !hasAccess) {
    return null;
  }

  return children;
};
