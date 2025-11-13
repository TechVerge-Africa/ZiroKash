/**
 * Request Validation Utilities using Zod
 */

import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { ZiroPayError, ErrorCodes } from './errors.ts';

/**
 * Ghana phone number regex (starts with 0, 10 digits)
 */
const GHANA_PHONE_REGEX = /^0\d{9}$/;

/**
 * Merchant onboarding schema
 */
export const MerchantOnboardingSchema = z.object({
  business_name: z.string().min(2, 'Business name must be at least 2 characters').max(200),
  business_email: z.string().email('Invalid email address'),
  business_phone: z.string().regex(GHANA_PHONE_REGEX, 'Invalid Ghana phone number (format: 0XXXXXXXXX)'),
  contact_person: z.string().min(2, 'Contact person name must be at least 2 characters').max(100),
  merchant_type: z.enum(['school', 'church', 'ngo', 'association', 'business', 'other'])
});

/**
 * Settlement Account Schemas
 */
export const MomoSettlementSchema = z.object({
  type: z.literal('momo'),
  provider: z.enum(['mtn', 'vodafone', 'airteltigo']),
  phone: z.string().regex(GHANA_PHONE_REGEX, 'Invalid Ghana phone number'),
  account_name: z.string().min(2).max(200),
});

export const BankSettlementSchema = z.object({
  type: z.literal('bank'),
  bank_name: z.string().min(2).max(200),
  account_number: z.string().min(5).max(50),
  account_name: z.string().min(2).max(200),
  branch: z.string().optional(),
});

export const SettlementAccountSchema = z.discriminatedUnion('type', [
  MomoSettlementSchema,
  BankSettlementSchema,
]);

/**
 * PIN schema (4 digits)
 */
export const PinSchema = z.string().regex(/^\d{4}$/, 'PIN must be exactly 4 digits');

/**
 * Payment form schema
 */
export const PaymentFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().optional(),
  fields: z.array(z.object({
    name: z.string(),
    label: z.string(),
    type: z.string(),
    required: z.boolean().optional(),
    options: z.array(z.string()).optional()
  }))
});

/**
 * Form submission schema
 */
export const FormSubmissionSchema = z.object({
  form_id: z.string().uuid('Invalid form ID'),
  payer_name: z.string().min(2, 'Name must be at least 2 characters'),
  payer_email: z.string().email('Invalid email address'),
  amount: z.number().positive('Amount must be positive'),
  submission_data: z.record(z.any())
});

/**
 * Mobile Money deposit schema
 */
export const MomoDepositSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  phone: z.string().regex(GHANA_PHONE_REGEX, 'Invalid Ghana phone number'),
  provider: z.enum(['mtn', 'vod', 'tgo'], { errorMap: () => ({ message: 'Invalid provider. Use: mtn, vod, or tgo' }) })
});

/**
 * Bank transfer schema
 */
export const BankTransferSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  bank_code: z.string().min(3, 'Invalid bank code'),
  account_number: z.string().min(10, 'Invalid account number'),
  account_name: z.string().optional()
});

/**
 * Wallet transfer schema
 */
export const WalletTransferSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  recipient_id: z.string().uuid('Invalid recipient ID'),
  description: z.string().optional()
});

/**
 * Validate request body against schema
 */
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new ZiroPayError(
        ErrorCodes.VALIDATION_ERROR,
        `Validation failed: ${messages}`,
        400,
        error.errors
      );
    }
    throw error;
  }
}

/**
 * Validate Ghana phone number
 */
export function isValidGhanaPhone(phone: string): boolean {
  return GHANA_PHONE_REGEX.test(phone);
}

/**
 * Validate amount (must be positive and in GHS)
 */
export function validateAmount(amount: number): void {
  if (!amount || amount <= 0) {
    throw new ZiroPayError(
      ErrorCodes.VALIDATION_ERROR,
      'Amount must be greater than zero',
      400
    );
  }
  
  // Check for reasonable limits (max 10,000,000 pesewas = 100,000 GHS)
  if (amount > 10000000) {
    throw new ZiroPayError(
      ErrorCodes.VALIDATION_ERROR,
      'Amount exceeds maximum limit',
      400
    );
  }
}
