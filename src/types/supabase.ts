export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          currency: string
          status: 'pending' | 'completed' | 'failed' | 'cancelled'
          transaction_type: 'credit' | 'debit' | 'transfer' | 'exchange'
          description: string
          metadata: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          currency: string
          status?: 'pending' | 'completed' | 'failed' | 'cancelled'
          transaction_type: 'credit' | 'debit' | 'transfer' | 'exchange'
          description: string
          metadata?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          currency?: string
          status?: 'pending' | 'completed' | 'failed' | 'cancelled'
          transaction_type?: 'credit' | 'debit' | 'transfer' | 'exchange'
          description?: string
          metadata?: any
          created_at?: string
          updated_at?: string
        }
      }
      wallets: {
        Row: {
          id: string
          user_id: string
          balance: number
          currency: string
          type: 'fiat' | 'crypto'
          is_active: boolean
          metadata: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          balance: number
          currency: string
          type: 'fiat' | 'crypto'
          is_active?: boolean
          metadata?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          balance?: number
          currency?: string
          type?: 'fiat' | 'crypto'
          is_active?: boolean
          metadata?: any
          created_at?: string
          updated_at?: string
        }
      }
      fee_structures: {
        Row: {
          id: string
          type: 'fixed' | 'percentage'
          amount: number
          percentage?: number
          currency: string
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          type: 'fixed' | 'percentage'
          amount: number
          percentage?: number
          currency: string
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          type?: 'fixed' | 'percentage'
          amount?: number
          percentage?: number
          currency?: string
          description?: string
          created_at?: string
        }
      }
      payment_methods: {
        Row: {
          id: string
          user_id: string
          type: 'card' | 'bank' | 'mobile_money'
          provider: string
          is_default: boolean
          last_four?: string
          expiry_date?: string
          metadata: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'card' | 'bank' | 'mobile_money'
          provider: string
          is_default?: boolean
          last_four?: string
          expiry_date?: string
          metadata?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'card' | 'bank' | 'mobile_money'
          provider?: string
          is_default?: boolean
          last_four?: string
          expiry_date?: string
          metadata?: any
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Supabase table types
export type Tables = Database['public']['Tables']

// Transaction Types
export type DbTransaction = Tables['transactions']['Row']
export type InsertTransaction = Tables['transactions']['Insert']
export type UpdateTransaction = Tables['transactions']['Update']

// Wallet Types
export type DbWallet = Tables['wallets']['Row']
export type InsertWallet = Tables['wallets']['Insert']
export type UpdateWallet = Tables['wallets']['Update']

// Payment Types
export type DbPaymentMethod = Tables['payment_methods']['Row']
export type InsertPaymentMethod = Tables['payment_methods']['Insert']
export type UpdatePaymentMethod = Tables['payment_methods']['Update']

// Fee Types
export type DbFeeStructure = Tables['fee_structures']['Row']

// Domain Types
export interface Transaction extends Omit<DbTransaction, 'created_at' | 'updated_at'> {
  createdAt: Date;
  updatedAt: Date;
}

export interface Wallet extends Omit<DbWallet, 'created_at' | 'updated_at'> {
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethod extends Omit<DbPaymentMethod, 'created_at' | 'updated_at'> {
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionFee {
  amount: number;
  currency: string;
  type: 'fixed' | 'percentage';
  description: string;
}

export interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  timestamp: Date;
}

// Utility Types
export type TransactionType = 'credit' | 'debit' | 'transfer' | 'exchange'
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled'
export type WalletType = 'fiat' | 'crypto'
export type PaymentMethodType = 'card' | 'bank' | 'mobile_money'

// Error Types
export class TransactionError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number
  ) {
    super(message);
    this.name = 'TransactionError';
  }
}

export class InsufficientFundsError extends TransactionError {
  constructor(message = 'Insufficient funds') {
    super(message, 'INSUFFICIENT_FUNDS', 400);
  }
}

export class InvalidTransactionError extends TransactionError {
  constructor(message: string) {
    super(message, 'INVALID_TRANSACTION', 400);
  }
}