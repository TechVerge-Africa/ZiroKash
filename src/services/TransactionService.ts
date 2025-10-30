import { BaseService } from './BaseService';
import { 
  Transaction,
  TransactionFee,
  DbTransaction,
  InsertTransaction,
  Tables
} from '@/types/supabase';

export class TransactionService extends BaseService {
  private static RATE_LIMIT = {
    create: { limit: 100, window: 3600 }, // 100 transactions per hour
    query: { limit: 1000, window: 3600 }  // 1000 queries per hour
  };

  public static getInstance(): TransactionService {
    return BaseService.getInstance.call(this) as TransactionService;
  }

  public async createTransaction(
    amount: number,
    currency: string,
    type: Tables['transactions']['Row']['transaction_type'],
    description: string
  ): Promise<Transaction> {
    try {
      await this.checkRateLimit(
        'system',
        'create_transaction',
        TransactionService.RATE_LIMIT.create.limit,
        TransactionService.RATE_LIMIT.create.window
      );

      // Get the current user's ID from the session
      const { data: { user }, error: authError } = await this.supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const transaction: InsertTransaction = {
        amount,
        currency,
        transaction_type: type,
        description,
        status: 'pending',
        user_id: user.id,
        created_at: new Date().toISOString()
      };

      const { data, error } = await this.supabase
        .from('transactions')
        .insert(transaction)
        .select()
        .single();

      if (error) throw error;
      return this.formatTransaction(data);

    } catch (error) {
      return this.handleError(error);
    }
  }

  public async calculateFees(amount: number, type: string): Promise<TransactionFee> {
    try {
      const { data: feeStructure, error } = await this.supabase
        .from('fee_structures')
        .select('*')
        .eq('type', type)
        .single();

      if (error) throw error;
      if (!feeStructure) {
        throw new Error('Fee structure not found');
      }

      const fee: TransactionFee = {
        amount: feeStructure.type === 'fixed' 
          ? feeStructure.amount 
          : (amount * (feeStructure.percentage || 0)) / 100,
        currency: feeStructure.currency,
        type: feeStructure.type,
        description: feeStructure.description
      };

      return fee;

    } catch (error) {
      return this.handleError(error);
    }
  }

  public async getTransactionHistory(userId: string, limit = 10): Promise<Transaction[]> {
    try {
      await this.validateUser(userId);
      await this.checkRateLimit(
        userId,
        'query_transactions',
        TransactionService.RATE_LIMIT.query.limit,
        TransactionService.RATE_LIMIT.query.window
      );

      const { data, error } = await this.supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data.map(this.formatTransaction);

    } catch (error) {
      return this.handleError(error);
    }
  }

  private formatTransaction(transaction: DbTransaction): Transaction {
    const { created_at, updated_at, ...rest } = transaction;
    return {
      ...rest,
      createdAt: this.parseDate(created_at)!,
      updatedAt: this.parseDate(updated_at)!
    };
  }
}