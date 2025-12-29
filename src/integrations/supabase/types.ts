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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      form_api_keys: {
        Row: {
          api_key: string
          created_at: string | null
          form_id: string
          id: string
          last_used_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          api_key: string
          created_at?: string | null
          form_id: string
          id?: string
          last_used_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          api_key?: string
          created_at?: string | null
          form_id?: string
          id?: string
          last_used_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_api_keys_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "payment_forms"
            referencedColumns: ["id"]
          },
        ]
      }
      form_submissions: {
        Row: {
          amount: number
          created_at: string | null
          form_id: string
          id: string
          payer_email: string | null
          payer_name: string | null
          receipt_url: string | null
          status: string | null
          submission_data: Json
          transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          form_id: string
          id?: string
          payer_email?: string | null
          payer_name?: string | null
          receipt_url?: string | null
          status?: string | null
          submission_data: Json
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          form_id?: string
          id?: string
          payer_email?: string | null
          payer_name?: string | null
          receipt_url?: string | null
          status?: string | null
          submission_data?: Json
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_submissions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "payment_forms"
            referencedColumns: ["id"]
          },
        ]
      }
      merchants: {
        Row: {
          business_address: string | null
          business_email: string
          business_name: string
          business_phone: string | null
          contact_person: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          merchant_type: string | null
          paystack_subaccount_code: string | null
          settlement_account: Json | null
          settlement_account_name: string | null
          settlement_account_number: string | null
          settlement_bank_code: string | null
          settlement_type: string | null
          updated_at: string | null
          user_id: string
          verification_status: Database["public"]["Enums"]["kyc_status"] | null
        }
        Insert: {
          business_address?: string | null
          business_email: string
          business_name: string
          business_phone?: string | null
          contact_person?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          merchant_type?: string | null
          paystack_subaccount_code?: string | null
          settlement_account?: Json | null
          settlement_account_name?: string | null
          settlement_account_number?: string | null
          settlement_bank_code?: string | null
          settlement_type?: string | null
          updated_at?: string | null
          user_id: string
          verification_status?: Database["public"]["Enums"]["kyc_status"] | null
        }
        Update: {
          business_address?: string | null
          business_email?: string
          business_name?: string
          business_phone?: string | null
          contact_person?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          merchant_type?: string | null
          paystack_subaccount_code?: string | null
          settlement_account?: Json | null
          settlement_account_name?: string | null
          settlement_account_number?: string | null
          settlement_bank_code?: string | null
          settlement_type?: string | null
          updated_at?: string | null
          user_id?: string
          verification_status?: Database["public"]["Enums"]["kyc_status"] | null
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          email_notifications: boolean | null
          id: string
          push_notifications: boolean | null
          sms_notifications: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payment_forms: {
        Row: {
          created_at: string | null
          description: string | null
          fields: Json
          id: string
          is_active: boolean | null
          logo_url: string | null
          receipt_template: Json | null
          signature_url: string | null
          theme_color: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          fields?: Json
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          receipt_template?: Json | null
          signature_url?: string | null
          theme_color?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          fields?: Json
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          receipt_template?: Json | null
          signature_url?: string | null
          theme_color?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
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
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          country_code?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          country_code?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      settlements: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          initiated_at: string | null
          merchant_id: string
          metadata: Json | null
          paystack_reference: string | null
          settlement_account: Json
          settlement_type: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          initiated_at?: string | null
          merchant_id: string
          metadata?: Json | null
          paystack_reference?: string | null
          settlement_account: Json
          settlement_type: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          initiated_at?: string | null
          merchant_id?: string
          metadata?: Json | null
          paystack_reference?: string | null
          settlement_account?: Json
          settlement_type?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "settlements_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
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
      wallets: {
        Row: {
          balance: number
          created_at: string | null
          currency: string
          id: string
          updated_at: string | null
          user_id: string
          wallet_type: string
        }
        Insert: {
          balance?: number
          created_at?: string | null
          currency?: string
          id?: string
          updated_at?: string | null
          user_id: string
          wallet_type?: string
        }
        Update: {
          balance?: number
          created_at?: string | null
          currency?: string
          id?: string
          updated_at?: string | null
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
      begin_transaction: { Args: never; Returns: undefined }
      commit_transaction: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
      rollback_transaction: { Args: never; Returns: undefined }
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
  graphql_public: {
    Enums: {},
  },
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
