export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];

  // Check minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  // Check for at least 1 letter
  if (!/[a-zA-Z]/.test(password)) {
    errors.push('Password must contain at least 1 letter');
  }

  // Check for at least 1 number
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least 1 number');
  }

  // Check for at least 1 special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least 1 special character');
  }

  return errors;
}; 