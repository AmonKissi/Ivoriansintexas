import { useAuth } from '@/contexts/AuthContext';

// 1. Helper Function: Get Role Name from Level
export function getRoleName(level: number): string {
  if (level >= 6) return 'Owner';
  if (level === 5) return 'Administrator';
  if (level === 4) return 'Moderator';
  if (level === 3) return 'Member III';
  if (level === 2) return 'Member II';
  return 'Member';
}

// 2. Helper Function: Get Role Tailwind Classes from Level
export function getRoleColor(level: number): string {
  if (level >= 6) return 'bg-amber-500/10 text-amber-600 border-amber-200';
  if (level === 5) return 'bg-primary/10 text-primary border-primary/20';
  if (level === 4) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
  if (level === 3) return 'bg-slate-100 text-slate-700 border-slate-200';
  if (level === 2) return 'bg-slate-100 text-slate-600 border-slate-200';
  return 'bg-slate-50 text-slate-500 border-slate-100';
}

// 3. Main Hook for Permissions and Current User Role
export function useUserRole() {
  const { user } = useAuth();
  
  // Default to level 1 if user isn't loaded yet
  const level = user?.level || 1;

  return {
    level,
    roleName: getRoleName(level),
    roleColor: getRoleColor(level),
    // Permissions logic
    isModerator: level >= 4,
    isAdmin: level >= 5,
    isOwner: level >= 6,
    canPostEvents: level >= 1, // Everyone level 1 and up can post
    canModerate: level >= 4,
    canManageUsers: level >= 5,
    canAccessSystem: level >= 6
  };
}