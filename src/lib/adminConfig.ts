const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";

export function isAdminUser(email: string | null | undefined): boolean {
  if (!email || !ADMIN_EMAIL) return false;
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
