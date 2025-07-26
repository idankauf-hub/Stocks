export const getUsernameFromEmail = (email?: string): string =>
  email?.split('@')[0] || 'Investor';
