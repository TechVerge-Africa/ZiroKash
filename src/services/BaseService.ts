import { supabase } from '@/integrations/supabase/client';
import { SupabaseClient } from '@supabase/supabase-js';
import { TransactionError } from '@/types/supabase';

export class BaseService {
  protected supabase: SupabaseClient;
  private static instances = new Map<string, BaseService>();

  protected constructor() {
    this.supabase = supabase;
  }

  protected static getInstance(): BaseService {
    const name = this.name;
    if (!BaseService.instances.has(name)) {
      BaseService.instances.set(name, new this());
    }
    return BaseService.instances.get(name) as BaseService;
  }

  protected async handleError(error: any): Promise<never> {
    console.error(`[${this.constructor.name}] Error:`, error);
    
    if (error instanceof TransactionError) {
      throw error;
    }

    throw new TransactionError(
      error.message || 'An unexpected error occurred',
      'INTERNAL_ERROR',
      500
    );
  }

  protected parseDate(date: string | null): Date | null {
    return date ? new Date(date) : null;
  }

  protected async withTransaction<T>(
    callback: () => Promise<T>
  ): Promise<T> {
    try {
      // Start transaction
      await this.supabase.rpc('begin_transaction');
      
      // Execute the callback
      const result = await callback();
      
      // Commit transaction
      await this.supabase.rpc('commit_transaction');
      
      return result;
    } catch (error) {
      // Rollback on error
      await this.supabase.rpc('rollback_transaction');
      throw error;
    }
  }

  protected formatResponse<T, R>(
    data: T | null,
    formatter: (item: T) => R
  ): R | null {
    return data ? formatter(data) : null;
  }

  protected async validateUser(userId: string): Promise<void> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (error || !data) {
      throw new TransactionError(
        'User not found',
        'USER_NOT_FOUND',
        404
      );
    }
  }

  protected async checkRateLimit(
    userId: string,
    action: string,
    limit: number,
    window: number
  ): Promise<void> {
    const key = `rate_limit:${userId}:${action}`;
    const current = await this.getRateLimit(key);

    if (current >= limit) {
      throw new TransactionError(
        'Rate limit exceeded',
        'RATE_LIMIT_EXCEEDED',
        429
      );
    }

    await this.incrementRateLimit(key, window);
  }

  private async getRateLimit(key: string): Promise<number> {
    const { data } = await this.supabase
      .from('rate_limits')
      .select('count')
      .eq('key', key)
      .single();

    return data?.count || 0;
  }

  private async incrementRateLimit(key: string, window: number): Promise<void> {
    await this.supabase.rpc('increment_rate_limit', {
      p_key: key,
      p_window: window
    });
  }
}