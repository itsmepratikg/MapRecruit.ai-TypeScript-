
import { AccessSettings, PermissionType, AccessLevel } from '../types';

export const hasAccess = (
  user: { id: string; clientId?: string },
  itemAccess?: AccessSettings
): boolean => {
  if (!itemAccess) return true; // Default to public if no settings

  // 1. Owner always has access
  if (user.id === itemAccess.ownerId) return true;

  // 2. Check Specific Shared Rules (Explicit Allow)
  const userRule = itemAccess.sharedWith.find(
    (rule) => rule.entityType === 'USER' && rule.entityId === user.id
  );
  if (userRule) return true;

  // 3. Check Access Level Logic
  switch (itemAccess.level) {
    case 'COMPANY':
      return true; // Everyone can view
    case 'CLIENT':
      // Check if user belongs to the same client
      return !!(itemAccess.clientId && user.clientId === itemAccess.clientId);
    case 'PRIVATE':
      return false; // Only owner and specific shares (checked above)
    default:
      return false;
  }
};

export const canEdit = (
  user: { id: string },
  itemAccess?: AccessSettings
): boolean => {
  if (!itemAccess) return true; // Default open if undefined

  // 1. Owner always has edit
  if (user.id === itemAccess.ownerId) return true;

  // 2. Check Specific Shared Rules
  const userRule = itemAccess.sharedWith.find(
    (rule) => rule.entityType === 'USER' && rule.entityId === user.id
  );
  
  if (userRule && userRule.permission === 'EDIT') return true;

  return false;
};
