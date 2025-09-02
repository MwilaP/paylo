export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validateEmail(email: string): void {
  if (!isValidEmail(email)) {
    throw new Error(`Invalid email address: ${email}`);
  }
}