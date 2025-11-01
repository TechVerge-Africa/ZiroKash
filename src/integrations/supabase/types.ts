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
      bills: {
        Row: {
          account_number: string
          amount: number
          bill_type: string
          biller_code: string
          biller_name: string
          created_at: string | null
          due_date: string | null
          external_reference: string | null
          id: string
          metadata: Json | null
          paid_at: string | null
          status: Database["public"]["Enums"]["transaction_status"] | null
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          account_number: string
          amount: number
          bill_type: string
          biller_code: string
          biller_name: string
          created_at?: string | null
          due_date?: string | null
          external_reference?: string | null
          id?: string
          metadata?: Json | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          account_number?: string
          amount?: number
          bill_type?: string
          biller_code?: string
          biller_name?: string
          created_at?: string | null
          due_date?: string | null
          external_reference?: string | null
          id?: string
          metadata?: Json | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bills_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      blockchain_addresses: {
        Row: {
          address: string
          blockchain_network: string
          created_at: string | null
          id: string
          phone_number: string | null
          private_key_encrypted: string
          updated_at: string | null
          user_id: string
          wallet_id: string
        }
        Insert: {
          address: string
          blockchain_network: string
          created_at?: string | null
          id?: string
          phone_number?: string | null
          private_key_encrypted: string
          updated_at?: string | null
          user_id: string
          wallet_id: string
        }
        Update: {
          address?: string
          blockchain_network?: string
          created_at?: string | null
          id?: string
          phone_number?: string | null
          private_key_encrypted?: string
          updated_at?: string | null
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blockchain_addresses_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      corporate_collections: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          customer_email: string
          description: string | null
          expires_at: string | null
          id: string
          merchant_id: string
          paid_at: string | null
          payment_url: string | null
          reference: string
          status: Database["public"]["Enums"]["transaction_status"] | null
          updated_at: string | null
          webhook_data: Json | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          customer_email: string
          description?: string | null
          expires_at?: string | null
          id?: string
          merchant_id: string
          paid_at?: string | null
          payment_url?: string | null
          reference: string
          status?: Database["public"]["Enums"]["transaction_status"] | null
          updated_at?: string | null
          webhook_data?: Json | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          customer_email?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          merchant_id?: string
          paid_at?: string | null
          payment_url?: string | null
          reference?: string
          status?: Database["public"]["Enums"]["transaction_status"] | null
          updated_at?: string | null
          webhook_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "corporate_collections_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
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
      fraud_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          id: string
          is_resolved: boolean | null
          metadata: Json | null
          resolved_at: string | null
          resolved_by: string | null
          risk_score: number
          transaction_id: string | null
          user_id: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          risk_score: number
          transaction_id?: string | null
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          risk_score?: number
          transaction_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fraud_alerts_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
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
      merchants: {
        Row: {
          api_key: string | null
          business_address: string | null
          business_email: string
          business_name: string
          business_phone: string | null
          business_registration_number: string | null
          commission_rate: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          settlement_account_id: string | null
          updated_at: string | null
          user_id: string
          verification_status: Database["public"]["Enums"]["kyc_status"] | null
          webhook_url: string | null
        }
        Insert: {
          api_key?: string | null
          business_address?: string | null
          business_email: string
          business_name: string
          business_phone?: string | null
          business_registration_number?: string | null
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          settlement_account_id?: string | null
          updated_at?: string | null
          user_id: string
          verification_status?: Database["public"]["Enums"]["kyc_status"] | null
          webhook_url?: string | null
        }
        Update: {
          api_key?: string | null
          business_address?: string | null
          business_email?: string
          business_name?: string
          business_phone?: string | null
          business_registration_number?: string | null
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          settlement_account_id?: string | null
          updated_at?: string | null
          user_id?: string
          verification_status?: Database["public"]["Enums"]["kyc_status"] | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          email_enabled: boolean | null
          id: string
          sms_enabled: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_enabled?: boolean | null
          id?: string
          sms_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_enabled?: boolean | null
          id?: string
          sms_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          account_details: Json
          created_at: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          method_type: string
          provider: string
          provider_reference: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_details: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          method_type: string
          provider: string
          provider_reference: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_details?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          method_type?: string
          provider?: string
          provider_reference?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      phone_otps: {
        Row: {
          attempts: number | null
          created_at: string | null
          expires_at: string
          id: string
          otp_hash: string
          phone: string
          verified: boolean | null
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          expires_at: string
          id?: string
          otp_hash: string
          phone: string
          verified?: boolean | null
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          expires_at?: string
          id?: string
          otp_hash?: string
          phone?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          country_code: string | null
          created_at: string
          date_of_birth: string | null
          full_name: string | null
          id: string
          kyc_documents: Json | null
          kyc_status: Database["public"]["Enums"]["kyc_status"] | null
          phone: string | null
          phone_verified: boolean | null
          updated_at: string
          user_id: string
          verification_level: number | null
          wallet_address: string | null
        }
        Insert: {
          address?: string | null
          country_code?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string | null
          id?: string
          kyc_documents?: Json | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          phone?: string | null
          phone_verified?: boolean | null
          updated_at?: string
          user_id: string
          verification_level?: number | null
          wallet_address?: string | null
        }
        Update: {
          address?: string | null
          country_code?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string | null
          id?: string
          kyc_documents?: Json | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          phone?: string | null
          phone_verified?: boolean | null
          updated_at?: string
          user_id?: string
          verification_level?: number | null
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
          blockchain_network: string | null
          created_at: string
          currency: string
          description: string | null
          external_reference: string | null
          from_wallet_id: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          processed_at: string | null
          recipient_address: string | null
          sender_address: string | null
          status: string
          to_wallet_id: string | null
          transaction_fee: number | null
          transaction_type: string
          updated_at: string
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          amount: number
          blockchain_hash?: string | null
          blockchain_network?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          external_reference?: string | null
          from_wallet_id?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          processed_at?: string | null
          recipient_address?: string | null
          sender_address?: string | null
          status?: string
          to_wallet_id?: string | null
          transaction_fee?: number | null
          transaction_type: string
          updated_at?: string
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          amount?: number
          blockchain_hash?: string | null
          blockchain_network?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          external_reference?: string | null
          from_wallet_id?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          processed_at?: string | null
          recipient_address?: string | null
          sender_address?: string | null
          status?: string
          to_wallet_id?: string | null
          transaction_fee?: number | null
          transaction_type?: string
          updated_at?: string
          user_id?: string
          webhook_url?: string | null
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
      user_identifiers: {
        Row: {
          created_at: string | null
          id: string
          identifier_type: string
          identifier_value: string
          is_verified: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          identifier_type: string
          identifier_value: string
          is_verified?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          identifier_type?: string
          identifier_value?: string
          is_verified?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      user_pins: {
        Row: {
          created_at: string | null
          failed_attempts: number | null
          id: string
          locked_until: string | null
          pin_hash: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          failed_attempts?: number | null
          id?: string
          locked_until?: string | null
          pin_hash: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          failed_attempts?: number | null
          id?: string
          locked_until?: string | null
          pin_hash?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      virtual_cards: {
        Row: {
          card_holder_name: string
          card_number: string
          created_at: string | null
          cvv: string
          daily_limit: number | null
          expiry_month: number
          expiry_year: number
          id: string
          spending_limit: number | null
          status: Database["public"]["Enums"]["card_status"] | null
          updated_at: string | null
          user_id: string
          wallet_id: string
        }
        Insert: {
          card_holder_name: string
          card_number: string
          created_at?: string | null
          cvv: string
          daily_limit?: number | null
          expiry_month: number
          expiry_year: number
          id?: string
          spending_limit?: number | null
          status?: Database["public"]["Enums"]["card_status"] | null
          updated_at?: string | null
          user_id: string
          wallet_id: string
        }
        Update: {
          card_holder_name?: string
          card_number?: string
          created_at?: string | null
          cvv?: string
          daily_limit?: number | null
          expiry_month?: number
          expiry_year?: number
          id?: string
          spending_limit?: number | null
          status?: Database["public"]["Enums"]["card_status"] | null
          updated_at?: string | null
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "virtual_cards_wallet_id_fkey"
            columns: ["wallet_id"]
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
          blockchain_network: string | null
          created_at: string
          currency: string
          daily_limit: number | null
          id: string
          is_active: boolean | null
          monthly_limit: number | null
          on_chain_balance: number | null
          stablecoin_contract: string | null
          updated_at: string
          user_id: string
          wallet_type: string
        }
        Insert: {
          balance?: number
          blockchain_address?: string | null
          blockchain_network?: string | null
          created_at?: string
          currency?: string
          daily_limit?: number | null
          id?: string
          is_active?: boolean | null
          monthly_limit?: number | null
          on_chain_balance?: number | null
          stablecoin_contract?: string | null
          updated_at?: string
          user_id: string
          wallet_type: string
        }
        Update: {
          balance?: number
          blockchain_address?: string | null
          blockchain_network?: string | null
          created_at?: string
          currency?: string
          daily_limit?: number | null
          id?: string
          is_active?: boolean | null
          monthly_limit?: number | null
          on_chain_balance?: number | null
          stablecoin_contract?: string | null
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
      cleanup_expired_otps: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      card_status: "active" | "frozen" | "cancelled"
      kyc_status: "pending" | "verified" | "rejected"
      transaction_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "cancelled"
      transaction_type:
        | "p2p"
        | "bill_payment"
        | "merchant_payment"
        | "corporate_collection"
        | "deposit"
        | "withdraw"
      user_role: "user" | "merchant" | "admin"
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
    Enums: {
      card_status: ["active", "frozen", "cancelled"],
      kyc_status: ["pending", "verified", "rejected"],
      transaction_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "cancelled",
      ],
      transaction_type: [
        "p2p",
        "bill_payment",
        "merchant_payment",
        "corporate_collection",
        "deposit",
        "withdraw",
      ],
      user_role: ["user", "merchant", "admin"],
    },
  },
} as const
