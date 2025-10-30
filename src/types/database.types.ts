export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

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
          metadata: Json
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
          metadata?: Json
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
          metadata?: Json
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
          metadata: Json
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
          metadata?: Json
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
          metadata?: Json
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}