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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      assessments: {
        Row: {
          activation_score: number | null
          aov: number | null
          company_name: string | null
          consent_rate: number | null
          conversion_rate: number | null
          created_at: string
          data_readiness_score: number | null
          decisioning_score: number | null
          email: string | null
          experimentation_score: number | null
          governance_score: number | null
          growth_readiness_score: number | null
          id: string
          industry_id: string | null
          known_profile_count: number | null
          monthly_web_traffic: number | null
          persona_id: string | null
          share_token: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          activation_score?: number | null
          aov?: number | null
          company_name?: string | null
          consent_rate?: number | null
          conversion_rate?: number | null
          created_at?: string
          data_readiness_score?: number | null
          decisioning_score?: number | null
          email?: string | null
          experimentation_score?: number | null
          governance_score?: number | null
          growth_readiness_score?: number | null
          id?: string
          industry_id?: string | null
          known_profile_count?: number | null
          monthly_web_traffic?: number | null
          persona_id?: string | null
          share_token?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          activation_score?: number | null
          aov?: number | null
          company_name?: string | null
          consent_rate?: number | null
          conversion_rate?: number | null
          created_at?: string
          data_readiness_score?: number | null
          decisioning_score?: number | null
          email?: string | null
          experimentation_score?: number | null
          governance_score?: number | null
          growth_readiness_score?: number | null
          id?: string
          industry_id?: string | null
          known_profile_count?: number | null
          monthly_web_traffic?: number | null
          persona_id?: string | null
          share_token?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessments_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
        ]
      }
      benchmarks: {
        Row: {
          consent_rate_avg: number | null
          conversion_lift_max: number | null
          conversion_lift_min: number | null
          created_at: string
          declared_data_capture_avg: number | null
          example_companies: string | null
          id: string
          industry_id: string | null
          updated_at: string
        }
        Insert: {
          consent_rate_avg?: number | null
          conversion_lift_max?: number | null
          conversion_lift_min?: number | null
          created_at?: string
          declared_data_capture_avg?: number | null
          example_companies?: string | null
          id?: string
          industry_id?: string | null
          updated_at?: string
        }
        Update: {
          consent_rate_avg?: number | null
          conversion_lift_max?: number | null
          conversion_lift_min?: number | null
          created_at?: string
          declared_data_capture_avg?: number | null
          example_companies?: string | null
          id?: string
          industry_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "benchmarks_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
        ]
      }
      content_blocks: {
        Row: {
          content: string
          created_at: string
          id: string
          key: string
          title: string | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          key: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          key?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      growth_play_industries: {
        Row: {
          growth_play_id: string
          industry_id: string
        }
        Insert: {
          growth_play_id: string
          industry_id: string
        }
        Update: {
          growth_play_id?: string
          industry_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "growth_play_industries_growth_play_id_fkey"
            columns: ["growth_play_id"]
            isOneToOne: false
            referencedRelation: "growth_plays"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "growth_play_industries_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
        ]
      }
      growth_play_personas: {
        Row: {
          growth_play_id: string
          persona_id: string
        }
        Insert: {
          growth_play_id: string
          persona_id: string
        }
        Update: {
          growth_play_id?: string
          persona_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "growth_play_personas_growth_play_id_fkey"
            columns: ["growth_play_id"]
            isOneToOne: false
            referencedRelation: "growth_plays"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "growth_play_personas_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
        ]
      }
      growth_plays: {
        Row: {
          activation_prereq: number | null
          asset_url: string | null
          blueconic_value_map: string | null
          complexity: string | null
          consistency_score: number | null
          created_at: string
          data_readiness_prereq: number | null
          data_strength: number | null
          decisioning_prereq: number | null
          deliverables: string | null
          estimated_impact_max: number | null
          estimated_impact_min: number | null
          evidence_coverage: number | null
          experimentation_prereq: number | null
          features_to_use: string | null
          governance_prereq: number | null
          icon_name: string | null
          id: string
          is_active: boolean
          journey_stage: string | null
          jtbd: string | null
          kpis: string | null
          messaging_block: string | null
          name: string
          prerequisites: string | null
          primary_success_metric: string | null
          recency_score: number | null
          relevance_score: number | null
          risk_mitigation: string | null
          time_to_value: string | null
          updated_at: string
          where_to_activate: string | null
        }
        Insert: {
          activation_prereq?: number | null
          asset_url?: string | null
          blueconic_value_map?: string | null
          complexity?: string | null
          consistency_score?: number | null
          created_at?: string
          data_readiness_prereq?: number | null
          data_strength?: number | null
          decisioning_prereq?: number | null
          deliverables?: string | null
          estimated_impact_max?: number | null
          estimated_impact_min?: number | null
          evidence_coverage?: number | null
          experimentation_prereq?: number | null
          features_to_use?: string | null
          governance_prereq?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean
          journey_stage?: string | null
          jtbd?: string | null
          kpis?: string | null
          messaging_block?: string | null
          name: string
          prerequisites?: string | null
          primary_success_metric?: string | null
          recency_score?: number | null
          relevance_score?: number | null
          risk_mitigation?: string | null
          time_to_value?: string | null
          updated_at?: string
          where_to_activate?: string | null
        }
        Update: {
          activation_prereq?: number | null
          asset_url?: string | null
          blueconic_value_map?: string | null
          complexity?: string | null
          consistency_score?: number | null
          created_at?: string
          data_readiness_prereq?: number | null
          data_strength?: number | null
          decisioning_prereq?: number | null
          deliverables?: string | null
          estimated_impact_max?: number | null
          estimated_impact_min?: number | null
          evidence_coverage?: number | null
          experimentation_prereq?: number | null
          features_to_use?: string | null
          governance_prereq?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean
          journey_stage?: string | null
          jtbd?: string | null
          kpis?: string | null
          messaging_block?: string | null
          name?: string
          prerequisites?: string | null
          primary_success_metric?: string | null
          recency_score?: number | null
          relevance_score?: number | null
          risk_mitigation?: string | null
          time_to_value?: string | null
          updated_at?: string
          where_to_activate?: string | null
        }
        Relationships: []
      }
      industries: {
        Row: {
          created_at: string
          id: string
          name: string
          type: Database["public"]["Enums"]["industry_type"]
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          type: Database["public"]["Enums"]["industry_type"]
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["industry_type"]
        }
        Relationships: []
      }
      logos: {
        Row: {
          company_name: string
          created_at: string
          display_order: number
          id: string
          industry_id: string | null
          logo_url: string
        }
        Insert: {
          company_name: string
          created_at?: string
          display_order?: number
          id?: string
          industry_id?: string | null
          logo_url: string
        }
        Update: {
          company_name?: string
          created_at?: string
          display_order?: number
          id?: string
          industry_id?: string | null
          logo_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "logos_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
        ]
      }
      maturity_dimensions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          level_1_label: string
          level_2_label: string
          level_3_label: string
          level_4_label: string
          level_5_label: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          level_1_label: string
          level_2_label: string
          level_3_label: string
          level_4_label: string
          level_5_label: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          level_1_label?: string
          level_2_label?: string
          level_3_label?: string
          level_4_label?: string
          level_5_label?: string
          name?: string
        }
        Relationships: []
      }
      personas: {
        Row: {
          created_at: string
          id: string
          name: string
          type: Database["public"]["Enums"]["persona_type"]
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          type: Database["public"]["Enums"]["persona_type"]
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["persona_type"]
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      industry_type:
        | "retail"
        | "dtc"
        | "cpg"
        | "travel_hospitality"
        | "media_subscription"
      persona_type:
        | "digital_marketing"
        | "ecommerce"
        | "cx_loyalty"
        | "growth"
        | "data_it"
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
      app_role: ["admin", "user"],
      industry_type: [
        "retail",
        "dtc",
        "cpg",
        "travel_hospitality",
        "media_subscription",
      ],
      persona_type: [
        "digital_marketing",
        "ecommerce",
        "cx_loyalty",
        "growth",
        "data_it",
      ],
    },
  },
} as const
