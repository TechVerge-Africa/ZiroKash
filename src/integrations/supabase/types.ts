export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      credit_cards: {
        Row: {
          card_name: string
          card_number: string
          card_type: string
          created_at: string
          credit_limit: number
          current_balance: number
          due_date: string | null
          id: string
          is_active: boolean
          is_frozen: boolean
          minimum_payment: number
          security_settings: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          card_name: string
          card_number: string
          card_type?: string
          created_at?: string
          credit_limit?: number
          current_balance?: number
          due_date?: string | null
          id?: string
          is_active?: boolean
          is_frozen?: boolean
          minimum_payment?: number
          security_settings?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          card_name?: string
          card_number?: string
          card_type?: string
          created_at?: string
          credit_limit?: number
          current_balance?: number
          due_date?: string | null
          id?: string
          is_active?: boolean
          is_frozen?: boolean
          minimum_payment?: number
          security_settings?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      crypto_portfolio: {
        Row: {
          balance: number
          created_at: string
          current_price: number
          id: string
          name: string
          profit_loss: number
          profit_loss_percentage: number
          purchase_price: number
          symbol: string
          total_value: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          current_price?: number
          id?: string
          name: string
          profit_loss?: number
          profit_loss_percentage?: number
          purchase_price?: number
          symbol: string
          total_value?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          current_price?: number
          id?: string
          name?: string
          profit_loss?: number
          profit_loss_percentage?: number
          purchase_price?: number
          symbol?: string
          total_value?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      investments: {
        Row: {
          asset_name: string
          asset_type: string
          created_at: string
          current_price: number
          current_value: number
          id: string
          profit_loss: number
          profit_loss_percentage: number
          purchase_price: number
          shares_owned: number
          symbol: string | null
          total_invested: number
          updated_at: string
          user_id: string
        }
        Insert: {
          asset_name: string
          asset_type: string
          created_at?: string
          current_price?: number
          current_value?: number
          id?: string
          profit_loss?: number
          profit_loss_percentage?: number
          purchase_price?: number
          shares_owned?: number
          symbol?: string | null
          total_invested?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          asset_name?: string
          asset_type?: string
          created_at?: string
          current_price?: number
          current_value?: number
          id?: string
          profit_loss?: number
          profit_loss_percentage?: number
          purchase_price?: number
          shares_owned?: number
          symbol?: string | null
          total_invested?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
          wallet_address: string | null
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
          wallet_address?: string | null
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
          wallet_address?: string | null
        }
        Relationships: []
      }
      savings_plans: {
        Row: {
          created_at: string
          current_amount: number
          id: string
          monthly_contribution: number
          plan_name: string
          status: string
          target_amount: number
          target_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_amount?: number
          id?: string
          monthly_contribution: number
          plan_name: string
          status?: string
          target_amount: number
          target_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_amount?: number
          id?: string
          monthly_contribution?: number
          plan_name?: string
          status?: string
          target_amount?: number
          target_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          blockchain_hash: string | null
          created_at: string
          currency: string
          description: string | null
          from_wallet_id: string | null
          id: string
          recipient_address: string | null
          sender_address: string | null
          status: string
          to_wallet_id: string | null
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          blockchain_hash?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          from_wallet_id?: string | null
          id?: string
          recipient_address?: string | null
          sender_address?: string | null
          status?: string
          to_wallet_id?: string | null
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          blockchain_hash?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          from_wallet_id?: string | null
          id?: string
          recipient_address?: string | null
          sender_address?: string | null
          status?: string
          to_wallet_id?: string | null
          transaction_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_from_wallet_id_fkey"
            columns: ["from_wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_to_wallet_id_fkey"
            columns: ["to_wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number
          blockchain_address: string | null
          created_at: string
          currency: string
          id: string
          updated_at: string
          user_id: string
          wallet_type: string
        }
        Insert: {
          balance?: number
          blockchain_address?: string | null
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
          user_id: string
          wallet_type: string
        }
        Update: {
          balance?: number
          blockchain_address?: string | null
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
          user_id?: string
          wallet_type?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
