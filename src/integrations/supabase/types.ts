export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activity_entries: {
        Row: {
          activity_type: string
          calories_burned: number | null
          created_at: string | null
          date: string
          duration_minutes: number
          id: string
          user_id: string
        }
        Insert: {
          activity_type: string
          calories_burned?: number | null
          created_at?: string | null
          date?: string
          duration_minutes: number
          id?: string
          user_id: string
        }
        Update: {
          activity_type?: string
          calories_burned?: number | null
          created_at?: string | null
          date?: string
          duration_minutes?: number
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      calorie_entries: {
        Row: {
          consumed: number
          created_at: string | null
          date: string
          id: string
          target: number
          user_id: string
        }
        Insert: {
          consumed: number
          created_at?: string | null
          date?: string
          id?: string
          target: number
          user_id: string
        }
        Update: {
          consumed?: number
          created_at?: string | null
          date?: string
          id?: string
          target?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calorie_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      category_mappings: {
        Row: {
          ciqual_category: string
          created_at: string | null
          id: string
          simplified_category: string
          updated_at: string | null
        }
        Insert: {
          ciqual_category: string
          created_at?: string | null
          id?: string
          simplified_category: string
          updated_at?: string | null
        }
        Update: {
          ciqual_category?: string
          created_at?: string | null
          id?: string
          simplified_category?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      csv_column_mappings: {
        Row: {
          created_at: string | null
          field_type: string
          id: string
          possible_names: string[]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          field_type: string
          id?: string
          possible_names: string[]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          field_type?: string
          id?: string
          possible_names?: string[]
          updated_at?: string | null
        }
        Relationships: []
      }
      foods: {
        Row: {
          carb_g: number | null
          fat_g: number | null
          fiber_g: number | null
          group_fr: string | null
          id: number
          kcal: number | null
          name_fr: string
          protein_g: number | null
          salt_g: number | null
          sat_fat_g: number | null
          sugars_g: number | null
        }
        Insert: {
          carb_g?: number | null
          fat_g?: number | null
          fiber_g?: number | null
          group_fr?: string | null
          id: number
          kcal?: number | null
          name_fr: string
          protein_g?: number | null
          salt_g?: number | null
          sat_fat_g?: number | null
          sugars_g?: number | null
        }
        Update: {
          carb_g?: number | null
          fat_g?: number | null
          fiber_g?: number | null
          group_fr?: string | null
          id?: number
          kcal?: number | null
          name_fr?: string
          protein_g?: number | null
          salt_g?: number | null
          sat_fat_g?: number | null
          sugars_g?: number | null
        }
        Relationships: []
      }
      hydration_entries: {
        Row: {
          created_at: string | null
          date: string
          glasses_count: number | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string
          glasses_count?: number | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          glasses_count?: number | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hydration_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_entries: {
        Row: {
          eaten_at: string
          food_id: number
          grams: number
          id: string
          user_id: string
        }
        Insert: {
          eaten_at?: string
          food_id: number
          grams: number
          id?: string
          user_id: string
        }
        Update: {
          eaten_at?: string
          food_id?: number
          grams?: number
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_entries_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_entries_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods_clean"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_types: {
        Row: {
          created_at: string | null
          display_name: string
          icon_name: string
          id: string
          sort_order: number | null
          type_key: string
        }
        Insert: {
          created_at?: string | null
          display_name: string
          icon_name: string
          id?: string
          sort_order?: number | null
          type_key: string
        }
        Update: {
          created_at?: string | null
          display_name?: string
          icon_name?: string
          id?: string
          sort_order?: number | null
          type_key?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_plans: {
        Row: {
          created_at: string | null
          description: string | null
          duration: number
          id: string
          is_active: boolean | null
          name: string
          target_calories: number
          target_carbs: number
          target_fat: number
          target_protein: number
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration?: number
          id?: string
          is_active?: boolean | null
          name: string
          target_calories: number
          target_carbs: number
          target_fat: number
          target_protein: number
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration?: number
          id?: string
          is_active?: boolean | null
          name?: string
          target_calories?: number
          target_carbs?: number
          target_fat?: number
          target_protein?: number
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      planned_meal_foods: {
        Row: {
          food_id: number
          grams: number | null
          id: string
          planned_meal_id: string
          target_date: string
          user_id: string | null
        }
        Insert: {
          food_id: number
          grams?: number | null
          id?: string
          planned_meal_id: string
          target_date?: string
          user_id?: string | null
        }
        Update: {
          food_id?: number
          grams?: number | null
          id?: string
          planned_meal_id?: string
          target_date?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "planned_meal_foods_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planned_meal_foods_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods_clean"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planned_meal_foods_planned_meal_id_fkey"
            columns: ["planned_meal_id"]
            isOneToOne: false
            referencedRelation: "planned_meals"
            referencedColumns: ["id"]
          },
        ]
      }
      planned_meals: {
        Row: {
          created_at: string | null
          id: string
          meal_order: number
          meal_time: string
          meal_type_id: string | null
          name: string
          plan_id: string | null
          target_calories: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          meal_order?: number
          meal_time: string
          meal_type_id?: string | null
          name: string
          plan_id?: string | null
          target_calories: number
        }
        Update: {
          created_at?: string | null
          id?: string
          meal_order?: number
          meal_time?: string
          meal_type_id?: string | null
          name?: string
          plan_id?: string | null
          target_calories?: number
        }
        Relationships: [
          {
            foreignKeyName: "planned_meals_meal_type_id_fkey"
            columns: ["meal_type_id"]
            isOneToOne: false
            referencedRelation: "meal_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planned_meals_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "nutrition_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          activity_level: string | null
          age: number | null
          carbs_goal: number | null
          created_at: string | null
          daily_calories: number | null
          email: string
          fat_goal: number | null
          height: number | null
          id: string
          name: string
          protein_goal: number | null
          updated_at: string | null
          weight: number | null
          weight_target: number | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          carbs_goal?: number | null
          created_at?: string | null
          daily_calories?: number | null
          email: string
          fat_goal?: number | null
          height?: number | null
          id: string
          name: string
          protein_goal?: number | null
          updated_at?: string | null
          weight?: number | null
          weight_target?: number | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          carbs_goal?: number | null
          created_at?: string | null
          daily_calories?: number | null
          email?: string
          fat_goal?: number | null
          height?: number | null
          id?: string
          name?: string
          protein_goal?: number | null
          updated_at?: string | null
          weight?: number | null
          weight_target?: number | null
        }
        Relationships: []
      }
      sleep_entries: {
        Row: {
          created_at: string | null
          date: string
          hours_slept: number
          id: string
          quality_score: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string
          hours_slept: number
          id?: string
          quality_score?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          hours_slept?: number
          id?: string
          quality_score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_food_favorites: {
        Row: {
          created_at: string | null
          food_id: number
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          food_id: number
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          food_id?: number
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_food_favorites_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_food_favorites_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods_clean"
            referencedColumns: ["id"]
          },
        ]
      }
      user_goals: {
        Row: {
          created_at: string | null
          current_value: number | null
          deadline: string | null
          description: string | null
          end_date: string | null
          goal_type: string
          id: string
          is_active: boolean | null
          start_date: string | null
          target_value: number
          title: string
          tracking_interval: string | null
          tracking_repetition: number | null
          tracking_type: string | null
          unit: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_value?: number | null
          deadline?: string | null
          description?: string | null
          end_date?: string | null
          goal_type: string
          id?: string
          is_active?: boolean | null
          start_date?: string | null
          target_value: number
          title: string
          tracking_interval?: string | null
          tracking_repetition?: number | null
          tracking_type?: string | null
          unit: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_value?: number | null
          deadline?: string | null
          description?: string | null
          end_date?: string | null
          goal_type?: string
          id?: string
          is_active?: boolean | null
          start_date?: string | null
          target_value?: number
          title?: string
          tracking_interval?: string | null
          tracking_repetition?: number | null
          tracking_type?: string | null
          unit?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          analytics_opt_in: boolean | null
          animations: boolean | null
          compact_view: boolean | null
          created_at: string | null
          dark_mode: boolean | null
          email_notifications: boolean | null
          hydration_reminders: boolean | null
          id: string
          language: string | null
          meal_reminders: boolean | null
          profile_public: boolean | null
          push_notifications: boolean | null
          share_progress: boolean | null
          timezone: string | null
          units: string | null
          updated_at: string | null
          user_id: string
          weekly_reports: boolean | null
        }
        Insert: {
          analytics_opt_in?: boolean | null
          animations?: boolean | null
          compact_view?: boolean | null
          created_at?: string | null
          dark_mode?: boolean | null
          email_notifications?: boolean | null
          hydration_reminders?: boolean | null
          id?: string
          language?: string | null
          meal_reminders?: boolean | null
          profile_public?: boolean | null
          push_notifications?: boolean | null
          share_progress?: boolean | null
          timezone?: string | null
          units?: string | null
          updated_at?: string | null
          user_id: string
          weekly_reports?: boolean | null
        }
        Update: {
          analytics_opt_in?: boolean | null
          animations?: boolean | null
          compact_view?: boolean | null
          created_at?: string | null
          dark_mode?: boolean | null
          email_notifications?: boolean | null
          hydration_reminders?: boolean | null
          id?: string
          language?: string | null
          meal_reminders?: boolean | null
          profile_public?: boolean | null
          push_notifications?: boolean | null
          share_progress?: boolean | null
          timezone?: string | null
          units?: string | null
          updated_at?: string | null
          user_id?: string
          weekly_reports?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      weight_entries: {
        Row: {
          created_at: string | null
          date: string
          id: string
          user_id: string
          weight: number
        }
        Insert: {
          created_at?: string | null
          date?: string
          id?: string
          user_id: string
          weight: number
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          user_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "weight_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      foods_clean: {
        Row: {
          carb_g: number | null
          fat_g: number | null
          fiber_g: number | null
          group_fr: string | null
          id: number | null
          kcal: number | null
          name_fr: string | null
          protein_g: number | null
          salt_g: number | null
          sat_fat_g: number | null
          sugars_g: number | null
        }
        Insert: {
          carb_g?: number | null
          fat_g?: number | null
          fiber_g?: never
          group_fr?: string | null
          id?: number | null
          kcal?: number | null
          name_fr?: string | null
          protein_g?: number | null
          salt_g?: never
          sat_fat_g?: never
          sugars_g?: never
        }
        Update: {
          carb_g?: number | null
          fat_g?: number | null
          fiber_g?: never
          group_fr?: string | null
          id?: number | null
          kcal?: number | null
          name_fr?: string | null
          protein_g?: number | null
          salt_g?: never
          sat_fat_g?: never
          sugars_g?: never
        }
        Relationships: []
      }
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "admin"
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
      app_role: ["user", "admin"],
    },
  },
} as const
