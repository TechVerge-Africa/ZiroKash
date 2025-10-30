// Financial Types
export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  type: 'credit' | 'debit';
  status: 'pending' | 'completed' | 'failed';
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  type: 'fiat' | 'crypto';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'bank' | 'mobile_money';
  provider: string;
  isDefault: boolean;
  lastFour?: string;
  expiryDate?: string;
  metadata: Record<string, any>;
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