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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      blog_authors: {
        Row: {
          avatar_url: string | null
          bio_ar: string | null
          bio_en: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          title_ar: string | null
          title_en: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio_ar?: string | null
          bio_en?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          title_ar?: string | null
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio_ar?: string | null
          bio_en?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          title_ar?: string | null
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      blog_post_revisions: {
        Row: {
          action: string
          actor_id: string | null
          changed_fields: string[]
          created_at: string
          id: string
          post_id: string
          slug: string
          snapshot: Json
          title_en: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          changed_fields?: string[]
          created_at?: string
          id?: string
          post_id: string
          slug: string
          snapshot: Json
          title_en?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          changed_fields?: string[]
          created_at?: string
          id?: string
          post_id?: string
          slug?: string
          snapshot?: Json
          title_en?: string | null
        }
        Relationships: []
      }
      blog_post_slug_redirects: {
        Row: {
          created_at: string
          id: string
          new_slug: string
          old_slug: string
          post_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          new_slug: string
          old_slug: string
          post_id: string
        }
        Update: {
          created_at?: string
          id?: string
          new_slug?: string
          old_slug?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_slug_redirects_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author: string | null
          category: string | null
          content_ar: string | null
          content_en: string
          created_at: string
          excerpt_ar: string | null
          excerpt_en: string | null
          featured_image: string | null
          id: string
          keywords: string[] | null
          meta_description_ar: string | null
          meta_description_en: string | null
          preview_token: string
          published: boolean | null
          published_at: string | null
          scheduled_at: string | null
          slug: string
          title_ar: string | null
          title_en: string
          updated_at: string
          view_count: number
        }
        Insert: {
          author?: string | null
          category?: string | null
          content_ar?: string | null
          content_en: string
          created_at?: string
          excerpt_ar?: string | null
          excerpt_en?: string | null
          featured_image?: string | null
          id?: string
          keywords?: string[] | null
          meta_description_ar?: string | null
          meta_description_en?: string | null
          preview_token?: string
          published?: boolean | null
          published_at?: string | null
          scheduled_at?: string | null
          slug: string
          title_ar?: string | null
          title_en: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          author?: string | null
          category?: string | null
          content_ar?: string | null
          content_en?: string
          created_at?: string
          excerpt_ar?: string | null
          excerpt_en?: string | null
          featured_image?: string | null
          id?: string
          keywords?: string[] | null
          meta_description_ar?: string | null
          meta_description_en?: string | null
          preview_token?: string
          published?: boolean | null
          published_at?: string | null
          scheduled_at?: string | null
          slug?: string
          title_ar?: string | null
          title_en?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          read: boolean
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          read?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          read?: boolean
        }
        Relationships: []
      }
      event_rsvps: {
        Row: {
          company: string | null
          created_at: string
          email: string
          event_name: string
          full_name: string
          guests: string
          id: string
          notes: string | null
          phone: string | null
          status: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          event_name: string
          full_name: string
          guests?: string
          id?: string
          notes?: string | null
          phone?: string | null
          status?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          event_name?: string
          full_name?: string
          guests?: string
          id?: string
          notes?: string | null
          phone?: string | null
          status?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          cover_image: string | null
          created_at: string
          description: string | null
          ends_at: string | null
          id: string
          location: string | null
          published: boolean
          registration_url: string | null
          slug: string
          sort_order: number
          starts_at: string | null
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          location?: string | null
          published?: boolean
          registration_url?: string | null
          slug: string
          sort_order?: number
          starts_at?: string | null
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          location?: string | null
          published?: boolean
          registration_url?: string | null
          slug?: string
          sort_order?: number
          starts_at?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          company: string | null
          created_at: string
          email: string
          form_type: string
          full_name: string
          id: string
          industry: string | null
          message: string | null
          monthly_volume: string | null
          phone: string | null
          status: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          form_type: string
          full_name: string
          id?: string
          industry?: string | null
          message?: string | null
          monthly_volume?: string | null
          phone?: string | null
          status?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          form_type?: string
          full_name?: string
          id?: string
          industry?: string | null
          message?: string | null
          monthly_volume?: string | null
          phone?: string | null
          status?: string
        }
        Relationships: []
      }
      order_products: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          image: string | null
          max_quantity: number
          min_quantity: number
          name: string
          slug: string
          sort_order: number
          specs: string[]
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          max_quantity?: number
          min_quantity?: number
          name: string
          slug: string
          sort_order?: number
          specs?: string[]
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          max_quantity?: number
          min_quantity?: number
          name?: string
          slug?: string
          sort_order?: number
          specs?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      pos_orders: {
        Row: {
          business_name: string
          contact_name: string
          created_at: string
          email: string
          existing_merchant: boolean
          id: string
          items: Json
          monthly_volume: string
          phone: string
          reference: string
          staff_note: string | null
          status: string
          total_units: number
          updated_at: string
        }
        Insert: {
          business_name: string
          contact_name: string
          created_at?: string
          email: string
          existing_merchant?: boolean
          id?: string
          items?: Json
          monthly_volume: string
          phone: string
          reference: string
          staff_note?: string | null
          status?: string
          total_units?: number
          updated_at?: string
        }
        Update: {
          business_name?: string
          contact_name?: string
          created_at?: string
          email?: string
          existing_merchant?: boolean
          id?: string
          items?: Json
          monthly_volume?: string
          phone?: string
          reference?: string
          staff_note?: string | null
          status?: string
          total_units?: number
          updated_at?: string
        }
        Relationships: []
      }
      pos_products: {
        Row: {
          accent_color: string
          best_for: string | null
          checklist: string[]
          created_at: string
          datasheet_url: string | null
          description: string | null
          features: Json
          gallery: string[]
          hero_image: string | null
          id: string
          intro_body: string | null
          intro_headline: string | null
          name: string
          published: boolean
          slug: string
          sort_order: number
          specs: Json
          tagline: string | null
          updated_at: string
        }
        Insert: {
          accent_color?: string
          best_for?: string | null
          checklist?: string[]
          created_at?: string
          datasheet_url?: string | null
          description?: string | null
          features?: Json
          gallery?: string[]
          hero_image?: string | null
          id?: string
          intro_body?: string | null
          intro_headline?: string | null
          name: string
          published?: boolean
          slug: string
          sort_order?: number
          specs?: Json
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          accent_color?: string
          best_for?: string | null
          checklist?: string[]
          created_at?: string
          datasheet_url?: string | null
          description?: string | null
          features?: Json
          gallery?: string[]
          hero_image?: string | null
          id?: string
          intro_body?: string | null
          intro_headline?: string | null
          name?: string
          published?: boolean
          slug?: string
          sort_order?: number
          specs?: Json
          tagline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      shortlink_payments: {
        Row: {
          amount_minor: number
          code: string
          created_at: string
          currency: string
          customer_masked: string | null
          description: string | null
          expires_at: string
          failure_reason: string | null
          id: string
          merchant_name: string
          paid_at: string | null
          provider_event_id: string | null
          reference: string
          status: string
          updated_at: string
        }
        Insert: {
          amount_minor: number
          code: string
          created_at?: string
          currency?: string
          customer_masked?: string | null
          description?: string | null
          expires_at?: string
          failure_reason?: string | null
          id?: string
          merchant_name?: string
          paid_at?: string | null
          provider_event_id?: string | null
          reference: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount_minor?: number
          code?: string
          created_at?: string
          currency?: string
          customer_masked?: string | null
          description?: string | null
          expires_at?: string
          failure_reason?: string | null
          id?: string
          merchant_name?: string
          paid_at?: string | null
          provider_event_id?: string | null
          reference?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      submission_throttle: {
        Row: {
          created_at: string
          fingerprint: string
          form_type: string
          id: string
        }
        Insert: {
          created_at?: string
          fingerprint: string
          form_type: string
          id?: string
        }
        Update: {
          created_at?: string
          fingerprint?: string
          form_type?: string
          id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_post_views: { Args: { _slug: string }; Returns: undefined }
      publish_scheduled_posts: { Args: never; Returns: number }
    }
    Enums: {
      app_role: "admin" | "editor" | "user" | "superadmin"
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
      app_role: ["admin", "editor", "user", "superadmin"],
    },
  },
} as const
