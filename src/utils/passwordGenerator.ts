/**
 * Password Generator Utility
 * Generates secure random passwords with customizable options
 */

export interface PasswordOptions {
  length?: number;
  includeUppercase?: boolean;
  includeLowercase?: boolean;
  includeNumbers?: boolean;
  includeSpecialChars?: boolean;
}

/**
 * Generates a secure random password
 * @param options Configuration options for password generation
 * @returns A randomly generated secure password
 */
export const generateSecurePassword = (
  options: PasswordOptions = {}
): string => {
  const {
    length = 12,
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSpecialChars = true,
  } = options;

  // Character sets
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  // Build character pool based on options
  let charPool = "";
  if (includeUppercase) charPool += uppercase;
  if (includeLowercase) charPool += lowercase;
  if (includeNumbers) charPool += numbers;
  if (includeSpecialChars) charPool += specialChars;

  // If no character types selected, use all
  if (charPool.length === 0) {
    charPool = uppercase + lowercase + numbers + specialChars;
  }

  // Ensure at least one character from each selected type
  let password = "";
  if (includeUppercase) {
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
  }
  if (includeLowercase) {
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
  }
  if (includeNumbers) {
    password += numbers[Math.floor(Math.random() * numbers.length)];
  }
  if (includeSpecialChars) {
    password += specialChars[Math.floor(Math.random() * specialChars.length)];
  }

  // Fill remaining length with random characters from the pool
  const remainingLength = length - password.length;
  for (let i = 0; i < remainingLength; i++) {
    password += charPool[Math.floor(Math.random() * charPool.length)];
  }

  // Shuffle the password to avoid predictable patterns
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

/**
 * Copies text to clipboard
 * @param text Text to copy
 * @returns Promise that resolves to true if successful, false otherwise
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
};

/**
 * Validates password strength
 * @param password Password to validate
 * @returns Object with validation results
 */
export const validatePasswordStrength = (password: string) => {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password);
  const hasMinLength = password.length >= 8;

  const strength = [
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    hasMinLength,
  ].filter(Boolean).length;

  return {
    isValid: strength >= 4,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    hasMinLength,
    strength: strength >= 5 ? "strong" : strength >= 3 ? "medium" : "weak",
  };
};
