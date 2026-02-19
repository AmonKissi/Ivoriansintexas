import { useAuth } from '@/contexts/AuthContext';

/**
 * 1. Helper Function: Get Role Name from Level
 * Returns the professional title associated with the clearance level.
 */
export function getRoleName(level: number): string {
  if (level >= 6) return 'Owner';
  if (level === 5) return 'Administrator';
  if (level === 4) return 'Moderator';
  if (level === 3) return 'Member III';
  if (level === 2) return 'Member II';
  if (level === 1) return 'Member';
  return 'Banned'; // Level 0 Registry
}

/**
 * 2. Helper Function: Get Role Tailwind Classes from Level
 * Upgraded with prestige styling for levels 4-6 including shadows and borders.
 */
export function getRoleColor(level: number): string {
  switch (true) {
    case level >= 6:
      // OWNER: Gold Glow + Black Font
      return 'bg-amber-500/10 text-amber-600 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.1)] font-black italic';
    case level === 5:
      // ADMIN: Primary Indigo + Strong Border
      return 'bg-primary/10 text-primary border-primary/40 font-bold';
    case level === 4:
      // MODERATOR: Cyan/Blue + Semi-bold
      return 'bg-blue-500/10 text-blue-600 border-blue-300 font-semibold';
    case level === 3:
      return 'bg-slate-100 text-slate-700 border-slate-200';
    case level === 2:
      return 'bg-slate-100 text-slate-600 border-slate-200';
    case level === 1:
      return 'bg-slate-50 text-slate-500 border-slate-100';
    case level === 0:
      // BANNED: Red Warning
      return 'bg-red-500/10 text-red-600 border-red-200 opacity-60 italic';
    default:
      return 'bg-slate-50 text-slate-400 border-transparent';
  }
}

/**
 * 3. Main Hook for Permissions and Current User Role
 * Provides a unified way to check authorization levels across the application.
 */
export function useUserRole() {
  const { user } = useAuth();
  
  // Strict nullish check: 0 is a valid level (banned), so we use ?? instead of ||
  const level = user?.level ?? 1;

  return {
    level,
    roleNumber: level, // Interface parity for AdminDashboard
    roleName: getRoleName(level),
    roleColor: getRoleColor(level),
    
    // Authorization Flags
    isBanned: level === 0,
    isUser: level >= 1,
    isModerator: level >= 4,
    isAdmin: level >= 5,
    isOwner: level >= 6,
    
    // Feature Gatekeeping
    canPostEvents: level >= 1, 
    canModerate: level >= 4,
    canManageUsers: level >= 5,
    canAccessSystem: level >= 6,

    // Visualization Helpers
    controlPercentage: level >= 6 ? 100 : level === 5 ? 60 : level === 4 ? 30 : 0
  };
}