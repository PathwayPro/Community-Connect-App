import { useUserStore } from '../store';

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
  | 'approve:opportunity'
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
    'approve:opportunity',
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
    'delete:thread'
  ],
  USER: ['edit:profile', 'create:thread', 'edit:thread', 'delete:thread']
};

export const useRole = () => {
  const { user } = useUserStore();
  const role = user?.role as UserRole;

  // Check if user has a specific role
  const hasRole = (requiredRole: UserRole): boolean => {
    if (!role) return false;
    if (requiredRole === 'ADMIN') return role === 'ADMIN';
    if (requiredRole === 'MENTOR') return role === 'ADMIN' || role === 'MENTOR';
    if (requiredRole === 'USER')
      return role === 'ADMIN' || role === 'MENTOR' || role === 'USER';
    return false;
  };

  // Check if user has a specific permission
  const hasPermission = (
    requiredPermission: Permission,
    resourceOwnerId?: string
  ): boolean => {
    if (!role) return false;

    // First check if user has the permission based on role
    const hasRolePermission =
      rolePermissions[role]?.includes(requiredPermission) || false;

    // If no role permission or no user, deny access
    if (!hasRolePermission || !user) return false;

    // Check ownership for specific permissions
    if (
      ownershipRequiredPermissions.includes(requiredPermission) &&
      role !== 'ADMIN'
    ) {
      // If resourceOwnerId is provided, check if user is the owner
      if (resourceOwnerId) {
        return resourceOwnerId === user.id?.toString();
      }
      // If no resourceOwnerId provided when required, default to false for safety
      return false;
    }

    // For permissions that don't require ownership or for admins, return the role-based permission
    return hasRolePermission;
  };

  // Check if user has all of the specified permissions
  const hasAllPermissions = (
    requiredPermissions: Permission[],
    resourceOwnerId?: string
  ): boolean => {
    if (!role) return false;
    return requiredPermissions.every((permission) =>
      hasPermission(permission, resourceOwnerId)
    );
  };

  // Check if user has any of the specified permissions
  const hasAnyPermission = (
    requiredPermissions: Permission[],
    resourceOwnerId?: string
  ): boolean => {
    if (!role) return false;
    return requiredPermissions.some((permission) =>
      hasPermission(permission, resourceOwnerId)
    );
  };

  return {
    role,
    hasRole,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission
  };
};

export default useRole;
