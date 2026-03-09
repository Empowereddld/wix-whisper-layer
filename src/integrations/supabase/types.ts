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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string
          id: string
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string
          id?: string
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          body: string | null
          created_at: string
          featured_image_url: string | null
          id: string
          published_at: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          featured_image_url?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          featured_image_url?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          company_name: string
          created_at: string
          email: string
          first_name: string
          id: string
          interested_in: string[] | null
          last_name: string | null
          position: string | null
          preferred_timeline: string | null
          questions: string
          role: string | null
        }
        Insert: {
          company_name: string
          created_at?: string
          email: string
          first_name: string
          id?: string
          interested_in?: string[] | null
          last_name?: string | null
          position?: string | null
          preferred_timeline?: string | null
          questions: string
          role?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          interested_in?: string[] | null
          last_name?: string | null
          position?: string | null
          preferred_timeline?: string | null
          questions?: string
          role?: string | null
        }
        Relationships: []
      }
      discount_codes: {
        Row: {
          applies_to: string
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          expiry_date: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          percent_off: number
          product_id: string | null
          uses_count: number
          uses_remaining: number | null
        }
        Insert: {
          applies_to?: string
          code: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          expiry_date?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          percent_off?: number
          product_id?: string | null
          uses_count?: number
          uses_remaining?: number | null
        }
        Update: {
          applies_to?: string
          code?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          expiry_date?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          percent_off?: number
          product_id?: string | null
          uses_count?: number
          uses_remaining?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "discount_codes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      email_campaigns: {
        Row: {
          audience: string
          body: string | null
          created_at: string
          id: string
          recipient_count: number | null
          sent_at: string | null
          subject: string
        }
        Insert: {
          audience?: string
          body?: string | null
          created_at?: string
          id?: string
          recipient_count?: number | null
          sent_at?: string | null
          subject: string
        }
        Update: {
          audience?: string
          body?: string | null
          created_at?: string
          id?: string
          recipient_count?: number | null
          sent_at?: string | null
          subject?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number | null
          created_at: string
          customer_name: string | null
          email: string | null
          id: string
          product: string | null
          status: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          customer_name?: string | null
          email?: string | null
          id?: string
          product?: string | null
          status?: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          customer_name?: string | null
          email?: string | null
          id?: string
          product?: string | null
          status?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string
          currency: string
          id: string
          is_active: boolean
          price: number
          resource_id: string
          stripe_price_id: string | null
          tax_rate: number | null
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          price?: number
          resource_id: string
          stripe_price_id?: string | null
          tax_rate?: number | null
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          price?: number
          resource_id?: string
          stripe_price_id?: string | null
          tax_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: true
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age_range: Database["public"]["Enums"]["age_range"] | null
          country: string | null
          created_at: string
          first_name: string
          id: string
          job_title: string | null
          last_name: string | null
          organization_name: string | null
          referred_by: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          welcome_dismissed: boolean
        }
        Insert: {
          age_range?: Database["public"]["Enums"]["age_range"] | null
          country?: string | null
          created_at?: string
          first_name: string
          id: string
          job_title?: string | null
          last_name?: string | null
          organization_name?: string | null
          referred_by?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          welcome_dismissed?: boolean
        }
        Update: {
          age_range?: Database["public"]["Enums"]["age_range"] | null
          country?: string | null
          created_at?: string
          first_name?: string
          id?: string
          job_title?: string | null
          last_name?: string | null
          organization_name?: string | null
          referred_by?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          welcome_dismissed?: boolean
        }
        Relationships: []
      }
      purchases: {
        Row: {
          amount_paid: number
          currency: string
          id: string
          product_id: string
          purchased_at: string
          resource_id: string
          status: string
          stripe_payment_intent_id: string | null
          user_id: string
        }
        Insert: {
          amount_paid?: number
          currency?: string
          id?: string
          product_id: string
          purchased_at?: string
          resource_id: string
          status?: string
          stripe_payment_intent_id?: string | null
          user_id: string
        }
        Update: {
          amount_paid?: number
          currency?: string
          id?: string
          product_id?: string
          purchased_at?: string
          resource_id?: string
          status?: string
          stripe_payment_intent_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_requests: {
        Row: {
          audience: string
          context: string | null
          created_at: string
          id: string
          status: string
          topic: string
          user_id: string
        }
        Insert: {
          audience: string
          context?: string | null
          created_at?: string
          id?: string
          status?: string
          topic: string
          user_id: string
        }
        Update: {
          audience?: string
          context?: string | null
          created_at?: string
          id?: string
          status?: string
          topic?: string
          user_id?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          age_ranges: string[] | null
          created_at: string
          description: string | null
          download_count: number | null
          file_url: string | null
          id: string
          is_published: boolean
          languages: string[] | null
          resource_type: Database["public"]["Enums"]["resource_type"]
          roles: string[] | null
          settings: string[] | null
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          age_ranges?: string[] | null
          created_at?: string
          description?: string | null
          download_count?: number | null
          file_url?: string | null
          id?: string
          is_published?: boolean
          languages?: string[] | null
          resource_type: Database["public"]["Enums"]["resource_type"]
          roles?: string[] | null
          settings?: string[] | null
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          age_ranges?: string[] | null
          created_at?: string
          description?: string | null
          download_count?: number | null
          file_url?: string | null
          id?: string
          is_published?: boolean
          languages?: string[] | null
          resource_type?: Database["public"]["Enums"]["resource_type"]
          roles?: string[] | null
          settings?: string[] | null
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: []
      }
      saved_resources: {
        Row: {
          id: string
          resource_id: string
          saved_at: string
          user_id: string
        }
        Insert: {
          id?: string
          resource_id: string
          saved_at?: string
          user_id: string
        }
        Update: {
          id?: string
          resource_id?: string
          saved_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_resources_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      share_events: {
        Row: {
          id: string
          resource_id: string
          shared_at: string
          user_id: string
        }
        Insert: {
          id?: string
          resource_id: string
          shared_at?: string
          user_id: string
        }
        Update: {
          id?: string
          resource_id?: string
          shared_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "share_events_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      user_downloads: {
        Row: {
          downloaded_at: string
          id: string
          resource_id: string
          user_id: string
        }
        Insert: {
          downloaded_at?: string
          id?: string
          resource_id: string
          user_id: string
        }
        Update: {
          downloaded_at?: string
          id?: string
          resource_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_downloads_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notes: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          note: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          note: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string
          user_id?: string
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
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          notes: string | null
          role: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          role?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_resource_price: { Args: { p_resource_id: string }; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_download_count: {
        Args: { resource_id: string }
        Returns: undefined
      }
    }
    Enums: {
      age_range: "0-4" | "5-7" | "8-10" | "11-13" | "14+" | "not_applicable"
      app_role: "admin" | "moderator" | "user"
      resource_type:
        | "poster"
        | "guide"
        | "checklist"
        | "handout"
        | "activity"
        | "bundle"
        | "infographic"
      user_role: "parent" | "slp" | "educator" | "school_leader" | "other"
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
      age_range: ["0-4", "5-7", "8-10", "11-13", "14+", "not_applicable"],
      app_role: ["admin", "moderator", "user"],
      resource_type: [
        "poster",
        "guide",
        "checklist",
        "handout",
        "activity",
        "bundle",
        "infographic",
      ],
      user_role: ["parent", "slp", "educator", "school_leader", "other"],
    },
  },
} as const
