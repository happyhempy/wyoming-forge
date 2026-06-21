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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      affiliates: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          promotion_plan: string | null
          status: Database["public"]["Enums"]["affiliate_status"]
          website: string | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          promotion_plan?: string | null
          status?: Database["public"]["Enums"]["affiliate_status"]
          website?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          promotion_plan?: string | null
          status?: Database["public"]["Enums"]["affiliate_status"]
          website?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: string | null
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          published: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      case_steps: {
        Row: {
          case_id: string
          completed_at: string | null
          created_at: string
          id: string
          status: Database["public"]["Enums"]["step_status"]
          step_name: string
          step_number: number
        }
        Insert: {
          case_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["step_status"]
          step_name: string
          step_number: number
        }
        Update: {
          case_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["step_status"]
          step_name?: string
          step_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "case_steps_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          articles_signature_name: string | null
          articles_signed_at: string | null
          assigned_admin: string | null
          business_purpose: string | null
          business_start_date: string | null
          client_address_line: string | null
          client_city: string | null
          client_country: string | null
          client_postal_code: string | null
          client_state_region: string | null
          created_at: string
          current_step: number
          expired_notification_sent_at: string | null
          expires_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          llc_name: string | null
          package: Database["public"]["Enums"]["package_type"]
          paid_at: string | null
          passport_url: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          products_services: string | null
          renewal_reminder_sent_at: string | null
          sole_owner: boolean | null
          stripe_session_id: string | null
          trade_name: string | null
          updated_at: string
          user_id: string
          years_paid: number
        }
        Insert: {
          articles_signature_name?: string | null
          articles_signed_at?: string | null
          assigned_admin?: string | null
          business_purpose?: string | null
          business_start_date?: string | null
          client_address_line?: string | null
          client_city?: string | null
          client_country?: string | null
          client_postal_code?: string | null
          client_state_region?: string | null
          created_at?: string
          current_step?: number
          expired_notification_sent_at?: string | null
          expires_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          llc_name?: string | null
          package?: Database["public"]["Enums"]["package_type"]
          paid_at?: string | null
          passport_url?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          products_services?: string | null
          renewal_reminder_sent_at?: string | null
          sole_owner?: boolean | null
          stripe_session_id?: string | null
          trade_name?: string | null
          updated_at?: string
          user_id: string
          years_paid?: number
        }
        Update: {
          articles_signature_name?: string | null
          articles_signed_at?: string | null
          assigned_admin?: string | null
          business_purpose?: string | null
          business_start_date?: string | null
          client_address_line?: string | null
          client_city?: string | null
          client_country?: string | null
          client_postal_code?: string | null
          client_state_region?: string | null
          created_at?: string
          current_step?: number
          expired_notification_sent_at?: string | null
          expires_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          llc_name?: string | null
          package?: Database["public"]["Enums"]["package_type"]
          paid_at?: string | null
          passport_url?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          products_services?: string | null
          renewal_reminder_sent_at?: string | null
          sole_owner?: boolean | null
          stripe_session_id?: string | null
          trade_name?: string | null
          updated_at?: string
          user_id?: string
          years_paid?: number
        }
        Relationships: []
      }
      documents: {
        Row: {
          case_id: string
          created_at: string
          document_type: string
          file_name: string
          file_url: string
          id: string
          uploaded_by: string
        }
        Insert: {
          case_id: string
          created_at?: string
          document_type: string
          file_name: string
          file_url: string
          id?: string
          uploaded_by: string
        }
        Update: {
          case_id?: string
          created_at?: string
          document_type?: string
          file_name?: string
          file_url?: string
          id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      email_log: {
        Row: {
          case_id: string
          email_type: string
          id: string
          metadata: Json | null
          recipient_email: string
          sent_at: string
        }
        Insert: {
          case_id: string
          email_type: string
          id?: string
          metadata?: Json | null
          recipient_email: string
          sent_at?: string
        }
        Update: {
          case_id?: string
          email_type?: string
          id?: string
          metadata?: Json | null
          recipient_email?: string
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_log_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          business_type: string
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
        }
        Insert: {
          business_type: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
        }
        Update: {
          business_type?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          case_id: string
          content: string
          created_at: string
          id: string
          sender_id: string
          sender_role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          case_id: string
          content: string
          created_at?: string
          id?: string
          sender_id: string
          sender_role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          case_id?: string
          content?: string
          created_at?: string
          id?: string
          sender_id?: string
          sender_role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: [
          {
            foreignKeyName: "messages_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          case_id: string
          created_at: string
          email: string
          full_name: string
          id: string
          ownership_percentage: number
        }
        Insert: {
          case_id: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          ownership_percentage: number
        }
        Update: {
          case_id?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          ownership_percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "partners_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_any_admin_role: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      affiliate_status: "pending" | "approved" | "rejected"
      app_role: "superadmin" | "admin" | "client"
      package_type: "basic" | "popular" | "premium"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      step_status: "pending" | "in_progress" | "completed" | "locked"
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
      affiliate_status: ["pending", "approved", "rejected"],
      app_role: ["superadmin", "admin", "client"],
      package_type: ["basic", "popular", "premium"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      step_status: ["pending", "in_progress", "completed", "locked"],
    },
  },
} as const
