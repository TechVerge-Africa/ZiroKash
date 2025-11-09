/**
 * Paystack API Integration for Ghana (GHS)
 * Production-ready Paystack service
 */

import { ZiroPayError, ErrorCodes } from './errors.ts';

export interface PaystackInitializeParams {
  email: string;
  amount: number; // in pesewas (GHS * 100)
  reference: string;
  metadata?: any;
  callback_url?: string;
}

export interface PaystackMobileMoneyParams {
  phone: string;
  amount: number; // in pesewas
  reference: string;
  provider: 'mtn' | 'vod' | 'tgo';
  email?: string;
}

export class PaystackService {
  private apiKey: string;
  private baseUrl = 'https://api.paystack.co';
  
  constructor() {
    this.apiKey = Deno.env.get('PAYSTACK_SECRET_KEY') || '';
    if (!this.apiKey) {
      throw new ZiroPayError(
        ErrorCodes.INTERNAL_ERROR,
        'Paystack API key not configured',
        500
      );
    }
  }
  
  /**
   * Initialize a transaction
   */
  async initializeTransaction(params: PaystackInitializeParams) {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...params,
          currency: 'GHS' // Always use Ghana Cedis
        })
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.status) {
        throw new ZiroPayError(
          ErrorCodes.PAYMENT_FAILED,
          result.message || 'Paystack initialization failed',
          400,
          result
        );
      }
      
      return result.data;
    } catch (error) {
      if (error instanceof ZiroPayError) throw error;
      
      throw new ZiroPayError(
        ErrorCodes.EXTERNAL_API_ERROR,
        `Paystack API error: ${error.message}`,
        500,
        error
      );
    }
  }
  
  /**
   * Verify a transaction
   */
  async verifyTransaction(reference: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/transaction/verify/${reference}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );
      
      const result = await response.json();
      
      if (!response.ok || !result.status) {
        throw new ZiroPayError(
          ErrorCodes.PAYMENT_FAILED,
          result.message || 'Paystack verification failed',
          400,
          result
        );
      }
      
      return result.data;
    } catch (error) {
      if (error instanceof ZiroPayError) throw error;
      
      throw new ZiroPayError(
        ErrorCodes.EXTERNAL_API_ERROR,
        `Paystack verification error: ${error.message}`,
        500,
        error
      );
    }
  }
  
  /**
   * Initialize Mobile Money payment
   * Supports: MTN Mobile Money, Vodafone Cash, AirtelTigo Money
   */
  async initializeMobileMoney(params: PaystackMobileMoneyParams) {
    try {
      // Provider mapping
      const providerMap = {
        'mtn': 'mtn',
        'vod': 'vod',
        'tgo': 'tgo'
      };
      
      const response = await fetch(`${this.baseUrl}/charge`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: params.email || 'momo@zirokash.com',
          amount: params.amount,
          currency: 'GHS',
          mobile_money: {
            phone: params.phone,
            provider: providerMap[params.provider]
          },
          reference: params.reference
        })
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.status) {
        throw new ZiroPayError(
          ErrorCodes.PAYMENT_FAILED,
          result.message || 'Mobile money initialization failed',
          400,
          result
        );
      }
      
      return result.data;
    } catch (error) {
      if (error instanceof ZiroPayError) throw error;
      
      throw new ZiroPayError(
        ErrorCodes.EXTERNAL_API_ERROR,
        `Mobile money error: ${error.message}`,
        500,
        error
      );
    }
  }
  
  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(body: string, signature: string): boolean {
    try {
      const hash = crypto.subtle.digest(
        'SHA-512',
        new TextEncoder().encode(Deno.env.get('PAYSTACK_SECRET_KEY') + body)
      );
      
      return hash.toString() === signature;
    } catch (error) {
      console.error('Webhook signature verification error:', error);
      return false;
    }
  }
}
