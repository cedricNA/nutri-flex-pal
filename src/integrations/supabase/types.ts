export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
          calcium: number | null
          calories: number
          carbs: number
          category: string
          created_at: string | null
          fat: number
          fiber: number
          id: string
          image: string | null
          iron: number | null
          magnesium: number | null
          name: string
          potassium: number | null
          protein: number
          salt: number | null
          sodium: number | null
          unit: string
          vitamin_c: number | null
          vitamin_d: number | null
        }
        Insert: {
          calcium?: number | null
          calories: number
          carbs?: number
          category: string
          created_at?: string | null
          fat?: number
          fiber?: number
          id?: string
          image?: string | null
          iron?: number | null
          magnesium?: number | null
          name: string
          potassium?: number | null
          protein?: number
          salt?: number | null
          sodium?: number | null
          unit?: string
          vitamin_c?: number | null
          vitamin_d?: number | null
        }
        Update: {
          calcium?: number | null
          calories?: number
          carbs?: number
          category?: string
          created_at?: string | null
          fat?: number
          fiber?: number
          id?: string
          image?: string | null
          iron?: number | null
          magnesium?: number | null
          name?: string
          potassium?: number | null
          protein?: number
          salt?: number | null
          sodium?: number | null
          unit?: string
          vitamin_c?: number | null
          vitamin_d?: number | null
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
          created_at: string | null
          date: string
          food_id: string
          id: string
          meal_type: string
          quantity: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string
          food_id: string
          id?: string
          meal_type: string
          quantity: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          food_id?: string
          id?: string
          meal_type?: string
          quantity?: number
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
            foreignKeyName: "meal_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      user_food_favorites: {
        Row: {
          created_at: string | null
          food_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          food_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          food_id?: string
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
            foreignKeyName: "user_food_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
          goal_type: string
          id: string
          is_active: boolean | null
          target_value: number
          title: string
          unit: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_value?: number | null
          deadline?: string | null
          description?: string | null
          goal_type: string
          id?: string
          is_active?: boolean | null
          target_value: number
          title: string
          unit: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_value?: number | null
          deadline?: string | null
          description?: string | null
          goal_type?: string
          id?: string
          is_active?: boolean | null
          target_value?: number
          title?: string
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
      [_ in never]: never
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
