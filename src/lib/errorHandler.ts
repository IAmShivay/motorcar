// Comprehensive error handling utility

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  field?: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: ApiError[];
  status?: number;
}

export function getErrorMessage(error: any): string {
  // Handle network errors
  if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
    return 'Unable to connect to server. Please check your internet connection.';
  }

  // Handle timeout errors
  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  // Handle HTTP errors
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        return data?.message || 'Invalid request. Please check your input.';
      case 401:
        return data?.message || 'Authentication failed. Please log in again.';
      case 403:
        return data?.message || 'You do not have permission to perform this action.';
      case 404:
        return data?.message || 'The requested resource was not found.';
      case 409:
        return data?.message || 'A conflict occurred. The resource may already exist.';
      case 413:
        return data?.message || 'File too large. Please use a smaller file.';
      case 422:
        return data?.message || 'Validation failed. Please check your input.';
      case 429:
        return data?.message || 'Too many requests. Please try again later.';
      case 500:
        return data?.message || 'Internal server error. Please try again later.';
      case 502:
        return 'Server is temporarily unavailable. Please try again later.';
      case 503:
        return 'Service is temporarily unavailable. Please try again later.';
      default:
        return data?.message || `An error occurred (${status}). Please try again.`;
    }
  }

  // Handle JavaScript errors
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Fallback for unknown errors
  return 'An unexpected error occurred. Please try again.';
}

export function handleFormErrors(error: any): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  if (error.response?.data?.errors) {
    // Handle validation errors from backend
    error.response.data.errors.forEach((err: ApiError) => {
      if (err.field) {
        fieldErrors[err.field] = err.message;
      }
    });
  }

  return fieldErrors;
}

export function isNetworkError(error: any): boolean {
  return (
    error.code === 'NETWORK_ERROR' ||
    error.message === 'Network Error' ||
    !error.response
  );
}

export function isAuthError(error: any): boolean {
  return error.response?.status === 401;
}

export function isValidationError(error: any): boolean {
  return error.response?.status === 400 || error.response?.status === 422;
}

export function isServerError(error: any): boolean {
  return error.response?.status >= 500;
}

export function logError(error: any, context?: string) {
  const errorInfo = {
    message: getErrorMessage(error),
    context,
    timestamp: new Date().toISOString(),
    stack: error.stack,
    response: error.response?.data,
    status: error.response?.status,
  };

  console.error('Error logged:', errorInfo);

  // In production, you might want to send this to an error tracking service
  // like Sentry, LogRocket, or Bugsnag
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }
}

export class AppError extends Error {
  public status: number;
  public code?: string;
  public field?: string;

  constructor(message: string, status: number = 500, code?: string, field?: string) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.field = field;
  }
}

export function createErrorHandler(context: string) {
  return (error: any) => {
    logError(error, context);
    return getErrorMessage(error);
  };
}

// Form validation helpers
export function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters long';
  return null;
}

export function validateRequired(value: any, fieldName: string): string | null {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
}

export function validatePhoneNumber(phone: string): string | null {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phone) return 'Phone number is required';
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return 'Please enter a valid phone number';
  }
  return null;
}
