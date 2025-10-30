import { BaseService } from './BaseService';
import { 
  Wallet, 
  DbWallet, 
  InsertWallet,
  TransactionError,
  WalletType
} from '@/types/supabase';

export class WalletService extends BaseService {
  private static RATE_LIMIT = {
    create: { limit: 5, window: 3600 }, // 5 wallets per hour
    transfer: { limit: 100, window: 3600 } // 100 transfers per hour
  };

  public static getInstance(): WalletService {
    return BaseService.getInstance.call(this) as WalletService;
  }

  public async createWallet(
    userId: string,
    currency: string,
    type: WalletType
  ): Promise<Wallet> {
    try {
      await this.validateUser(userId);
      await this.checkRateLimit(
        userId,
        'create_wallet',
        WalletService.RATE_LIMIT.create.limit,
        WalletService.RATE_LIMIT.create.window
      );

      const wallet: InsertWallet = {
        user_id: userId,
        currency,
        type,
        balance: 0,
        is_active: true,
        created_at: new Date().toISOString()
      };

      const { data, error } = await this.supabase
        .from('wallets')
        .insert(wallet)
        .select()
        .single();

      if (error) throw error;
      return this.formatWallet(data);

    } catch (error) {
      return this.handleError(error);
    }
  }

  public async getWallet(walletId: string): Promise<Wallet> {
    try {
      const { data, error } = await this.supabase
        .from('wallets')
        .select('*')
        .eq('id', walletId)
        .single();

      if (error) throw error;
      if (!data) {
        throw new TransactionError(
          'Wallet not found',
          'WALLET_NOT_FOUND',
          404
        );
      }

      return this.formatWallet(data);

    } catch (error) {
      return this.handleError(error);
    }
  }

  public async getUserWallets(userId: string): Promise<Wallet[]> {
    try {
      await this.validateUser(userId);

      const { data, error } = await this.supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(this.formatWallet);

    } catch (error) {
      return this.handleError(error);
    }
  }

  public async updateWalletBalance(
    walletId: string,
    amount: number,
    operation: 'credit' | 'debit'
  ): Promise<Wallet> {
    return this.withTransaction(async () => {
      try {
        const wallet = await this.getWallet(walletId);

        if (!wallet.is_active) {
          throw new TransactionError(
            'Wallet is inactive',
            'WALLET_INACTIVE',
            400
          );
        }

        const newBalance = operation === 'credit'
          ? wallet.balance + amount
          : wallet.balance - amount;

        if (newBalance < 0) {
          throw new TransactionError(
            'Insufficient funds',
            'INSUFFICIENT_FUNDS',
            400
          );
        }

        const { data, error } = await this.supabase
          .from('wallets')
          .update({ balance: newBalance, updated_at: new Date().toISOString() })
          .eq('id', walletId)
          .select()
          .single();

        if (error) throw error;
        return this.formatWallet(data);

      } catch (error) {
        return this.handleError(error);
      }
    });
  }

  private formatWallet(wallet: DbWallet): Wallet {
    return {
      ...wallet,
      createdAt: this.parseDate(wallet.created_at)!,
      updatedAt: this.parseDate(wallet.updated_at)!
    };
  }
}