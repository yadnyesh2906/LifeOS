import { VALIDATION } from '../constants/validation';

export const validation = {
  isValidEmail(email: string): boolean {
    return VALIDATION.EMAIL_REGEX.test(email);
  },
  isValidPassword(password: string): boolean {
    return password.length >= VALIDATION.PASSWORD_MIN_LENGTH;
  },
};

export default validation;
