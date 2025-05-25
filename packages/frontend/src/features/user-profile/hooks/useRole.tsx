import { useUserStore } from '../store';
import { useEffect, useMemo, useCallback } from 'react';

// Define possible roles for type safety
export type UserRole = 'ADMIN' | 'MENTOR' | 'USER' | undefined;

// Define possible permissions
export type Permission =
  | 'create:event'
  | 'edit:event'
  | 'delete:event'
  | 'manage:users'
  | 'view:analytics'
  | 'access:admin-panel'
  | 'edit:profile'
  | 'view:mentees'
  | 'edit:mentees'
  | 'delete:mentees'
  | 'view:mentors'
  | 'edit:mentors'
  | 'delete:mentors'
  | 'create:opportunity'
  | 'edit:opportunity'
  | 'delete:opportunity'
  | 'create:news'
  | 'edit:news'
  | 'delete:news'
  | 'create:resource'
  | 'edit:resource'
  | 'delete:resource'
  | 'create:thread'
  | 'edit:thread'
  | 'delete:thread';

// Define permissions that require ownership check
const ownershipRequiredPermissions = [
  'edit:profile',
  'edit:thread',
  'delete:thread'
];

// Role-based permission mapping
const rolePermissions: Record<Exclude<UserRole, undefined>, Permission[]> = {
  ADMIN: [
    'create:event',
    'edit:event',
    'delete:event',
    'manage:users',
    'view:analytics',
    'access:admin-panel',
    'edit:profile',
    'view:mentees',
    'edit:mentees',
    'delete:mentees',
    'view:mentors',
    'edit:mentors',
    'delete:mentors',
    'create:opportunity',
    'edit:opportunity',
    'delete:opportunity',
    'create:news',
    'edit:news',
    'delete:news',
    'create:resource',
    'edit:resource',
    'delete:resource',
    'create:thread',
    'edit:thread',
    'delete:thread'
  ],
  MENTOR: [
    'edit:profile',
    'view:mentees',
    'edit:mentees',
    'delete:mentees',
    'create:thread',
    'edit:thread',
    'delete:thread',
    'create:event',
    'edit:event',
    'delete:event'
  ],
  USER: ['edit:profile', 'create:thread', 'edit:thread', 'delete:thread']
};

export const useRole = () => {
  const { user, fetchUserProfile } = useUserStore();
  const role = user?.role as UserRole;

  // Fetch user profile only once when the hook is initialized
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Memoize role-checking functions to prevent unnecessary re-creations
  const hasRole = useCallback(
    (requiredRole: UserRole): boolean => {
      if (!role) return false;

      // Check for exact role match or hierarchical access
      if (requiredRole === 'ADMIN') return role === 'ADMIN';
      if (requiredRole === 'MENTOR')
        return role === 'ADMIN' || role === 'MENTOR';
      if (requiredRole === 'USER')
        return role === 'ADMIN' || role === 'MENTOR' || role === 'USER';

      return false;
    },
    [role]
  );

  // Memoize permission-checking function
  const hasPermission = useCallback(
    (requiredPermission: Permission, resourceOwnerId?: string): boolean => {
      // Return false if user or role is undefined
      if (!user || !role) {
        return false;
      }

      // Admin role has all permissions
      if (role === 'ADMIN') {
        return true;
      }

      // Get permissions for this role
      const permissions = rolePermissions[role];

      // Check if the required permission is in the list of permissions for this role
      const hasPermissionForRole = permissions.includes(requiredPermission);

      // If user's role doesn't include this permission, return false immediately
      if (!hasPermissionForRole) {
        return false;
      }

      // For permissions that require ownership check
      if (ownershipRequiredPermissions.includes(requiredPermission)) {
        // If resourceOwnerId is provided, check if user is the owner
        if (resourceOwnerId) {
          return resourceOwnerId === user.id?.toString();
        }
        // If no resourceOwnerId provided when required, default to false for safety
        return false;
      }

      // For permissions that don't require ownership, grant access if they have the permission
      return true;
    },
    [role, user]
  );

  // Memoize multiple permission checking functions
  const hasAllPermissions = useCallback(
    (requiredPermissions: Permission[], resourceOwnerId?: string): boolean => {
      if (!role) return false;
      return requiredPermissions.every((permission) =>
        hasPermission(permission, resourceOwnerId)
      );
    },
    [role, hasPermission]
  );

  const hasAnyPermission = useCallback(
    (requiredPermissions: Permission[], resourceOwnerId?: string): boolean => {
      if (!role) return false;
      return requiredPermissions.some((permission) =>
        hasPermission(permission, resourceOwnerId)
      );
    },
    [role, hasPermission]
  );

  // Memoize the entire returned object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      role,
      hasRole,
      hasPermission,
      hasAllPermissions,
      hasAnyPermission
    }),
    [role, hasRole, hasPermission, hasAllPermissions, hasAnyPermission]
  );
};

export default useRole;
