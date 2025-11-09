/**
 * Production Error Handling Utilities for ZiroPay
 */

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

/**
 * Standard error codes for ZiroPay
 */
export const ErrorCodes = {
  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  MISSING_FIELD: 'MISSING_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // Business logic errors
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  WALLET_NOT_FOUND: 'WALLET_NOT_FOUND',
  MERCHANT_NOT_FOUND: 'MERCHANT_NOT_FOUND',
  MERCHANT_NOT_APPROVED: 'MERCHANT_NOT_APPROVED',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // System errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
} as const;

/**
 * Standard CORS headers for edge functions
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Handle errors and return standardized error response
 */
export function handleError(error: any, operation: string): Response {
  console.error(`[${operation}] Error:`, error);
  
  // Determine error code and message
  let code = ErrorCodes.INTERNAL_ERROR;
  let message = 'An unexpected error occurred';
  let status = 500;
  
  if (error.code && ErrorCodes[error.code as keyof typeof ErrorCodes]) {
    code = error.code;
    message = error.message;
  } else if (error.message) {
    message = error.message;
  }
  
  // Set appropriate HTTP status
  if (code === ErrorCodes.UNAUTHORIZED || code === ErrorCodes.INVALID_TOKEN) {
    status = 401;
  } else if (code === ErrorCodes.VALIDATION_ERROR || code === ErrorCodes.MISSING_FIELD || code === ErrorCodes.INVALID_FORMAT) {
    status = 400;
  } else if (code === ErrorCodes.RATE_LIMIT_EXCEEDED) {
    status = 429;
  }
  
  const apiError: ApiError = {
    code,
    message,
    details: Deno.env.get('ENVIRONMENT') === 'development' ? error.stack : undefined,
    timestamp: new Date().toISOString()
  };
  
  return new Response(
    JSON.stringify({ success: false, error: apiError }),
    { 
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

/**
 * Return successful response
 */
export function successResponse<T>(data: T, status = 200): Response {
  const response: ApiResponse<T> = {
    success: true,
    data
  };
  
  return new Response(
    JSON.stringify(response),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

/**
 * Custom error class for ZiroPay
 */
export class ZiroPayError extends Error {
  code: string;
  status: number;
  details?: any;
  
  constructor(code: string, message: string, status = 500, details?: any) {
    super(message);
    this.name = 'ZiroPayError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}
