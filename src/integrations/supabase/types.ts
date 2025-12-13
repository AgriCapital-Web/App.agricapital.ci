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
      account_requests: {
        Row: {
          created_at: string
          departement_id: string | null
          district_id: string | null
          email: string
          id: string
          motif: string | null
          nom_complet: string
          region_id: string | null
          statut: string | null
          telephone: string | null
        }
        Insert: {
          created_at?: string
          departement_id?: string | null
          district_id?: string | null
          email: string
          id?: string
          motif?: string | null
          nom_complet: string
          region_id?: string | null
          statut?: string | null
          telephone?: string | null
        }
        Update: {
          created_at?: string
          departement_id?: string | null
          district_id?: string | null
          email?: string
          id?: string
          motif?: string | null
          nom_complet?: string
          region_id?: string | null
          statut?: string | null
          telephone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_requests_departement_id_fkey"
            columns: ["departement_id"]
            isOneToOne: false
            referencedRelation: "departements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_requests_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_requests_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      configurations_systeme: {
        Row: {
          categorie: string
          cle: string
          created_at: string
          description: string | null
          id: string
          modifiable: boolean | null
          type_valeur: string
          updated_at: string
          valeur: string
        }
        Insert: {
          categorie?: string
          cle: string
          created_at?: string
          description?: string | null
          id?: string
          modifiable?: boolean | null
          type_valeur?: string
          updated_at?: string
          valeur: string
        }
        Update: {
          categorie?: string
          cle?: string
          created_at?: string
          description?: string | null
          id?: string
          modifiable?: boolean | null
          type_valeur?: string
          updated_at?: string
          valeur?: string
        }
        Relationships: []
      }
      departements: {
        Row: {
          created_at: string
          district_id: string | null
          id: string
          nom: string
        }
        Insert: {
          created_at?: string
          district_id?: string | null
          id?: string
          nom: string
        }
        Update: {
          created_at?: string
          district_id?: string | null
          id?: string
          nom?: string
        }
        Relationships: [
          {
            foreignKeyName: "departements_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
      districts: {
        Row: {
          created_at: string
          id: string
          nom: string
          region_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          nom: string
          region_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          nom?: string
          region_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "districts_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      offres: {
        Row: {
          actif: boolean | null
          avantages: Json | null
          code: string
          contribution_mensuelle_par_ha: number
          couleur: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          montant_da_par_ha: number
          nom: string
          ordre: number | null
          updated_at: string
        }
        Insert: {
          actif?: boolean | null
          avantages?: Json | null
          code: string
          contribution_mensuelle_par_ha?: number
          couleur?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          montant_da_par_ha?: number
          nom: string
          ordre?: number | null
          updated_at?: string
        }
        Update: {
          actif?: boolean | null
          avantages?: Json | null
          code?: string
          contribution_mensuelle_par_ha?: number
          couleur?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          montant_da_par_ha?: number
          nom?: string
          ordre?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      paiements: {
        Row: {
          created_at: string
          date_paiement: string | null
          fedapay_transaction_id: string | null
          id: string
          metadata: Json | null
          mode_paiement: string | null
          montant: number
          plantation_id: string | null
          reference: string | null
          souscripteur_id: string | null
          statut: string | null
          type_paiement: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_paiement?: string | null
          fedapay_transaction_id?: string | null
          id?: string
          metadata?: Json | null
          mode_paiement?: string | null
          montant: number
          plantation_id?: string | null
          reference?: string | null
          souscripteur_id?: string | null
          statut?: string | null
          type_paiement?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_paiement?: string | null
          fedapay_transaction_id?: string | null
          id?: string
          metadata?: Json | null
          mode_paiement?: string | null
          montant?: number
          plantation_id?: string | null
          reference?: string | null
          souscripteur_id?: string | null
          statut?: string | null
          type_paiement?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "paiements_plantation_id_fkey"
            columns: ["plantation_id"]
            isOneToOne: false
            referencedRelation: "plantations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paiements_souscripteur_id_fkey"
            columns: ["souscripteur_id"]
            isOneToOne: false
            referencedRelation: "souscripteurs"
            referencedColumns: ["id"]
          },
        ]
      }
      plantations: {
        Row: {
          age_plantation: number | null
          annee_plantation: number | null
          coordonnees_gps: string | null
          created_at: string
          created_by: string | null
          date_plantation: string | null
          densite_plants: number | null
          departement_id: string | null
          district_id: string | null
          id: string
          latitude: number | null
          localite: string | null
          longitude: number | null
          montant_contribution_mensuelle: number | null
          montant_da: number | null
          nom: string | null
          region_id: string | null
          sous_prefecture_id: string | null
          souscripteur_id: string
          statut: string | null
          superficie_ha: number
          type_culture: string | null
          updated_at: string
          variete: string | null
          village_id: string | null
        }
        Insert: {
          age_plantation?: number | null
          annee_plantation?: number | null
          coordonnees_gps?: string | null
          created_at?: string
          created_by?: string | null
          date_plantation?: string | null
          densite_plants?: number | null
          departement_id?: string | null
          district_id?: string | null
          id?: string
          latitude?: number | null
          localite?: string | null
          longitude?: number | null
          montant_contribution_mensuelle?: number | null
          montant_da?: number | null
          nom?: string | null
          region_id?: string | null
          sous_prefecture_id?: string | null
          souscripteur_id: string
          statut?: string | null
          superficie_ha?: number
          type_culture?: string | null
          updated_at?: string
          variete?: string | null
          village_id?: string | null
        }
        Update: {
          age_plantation?: number | null
          annee_plantation?: number | null
          coordonnees_gps?: string | null
          created_at?: string
          created_by?: string | null
          date_plantation?: string | null
          densite_plants?: number | null
          departement_id?: string | null
          district_id?: string | null
          id?: string
          latitude?: number | null
          localite?: string | null
          longitude?: number | null
          montant_contribution_mensuelle?: number | null
          montant_da?: number | null
          nom?: string | null
          region_id?: string | null
          sous_prefecture_id?: string | null
          souscripteur_id?: string
          statut?: string | null
          superficie_ha?: number
          type_culture?: string | null
          updated_at?: string
          variete?: string | null
          village_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plantations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plantations_departement_id_fkey"
            columns: ["departement_id"]
            isOneToOne: false
            referencedRelation: "departements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plantations_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plantations_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plantations_sous_prefecture_id_fkey"
            columns: ["sous_prefecture_id"]
            isOneToOne: false
            referencedRelation: "sous_prefectures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plantations_souscripteur_id_fkey"
            columns: ["souscripteur_id"]
            isOneToOne: false
            referencedRelation: "souscripteurs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plantations_village_id_fkey"
            columns: ["village_id"]
            isOneToOne: false
            referencedRelation: "villages"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          actif: boolean | null
          created_at: string
          email: string | null
          equipe_id: string | null
          id: string
          nom_complet: string | null
          photo_url: string | null
          role: string | null
          telephone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          actif?: boolean | null
          created_at?: string
          email?: string | null
          equipe_id?: string | null
          id?: string
          nom_complet?: string | null
          photo_url?: string | null
          role?: string | null
          telephone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          actif?: boolean | null
          created_at?: string
          email?: string | null
          equipe_id?: string | null
          id?: string
          nom_complet?: string | null
          photo_url?: string | null
          role?: string | null
          telephone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      promotions: {
        Row: {
          active: boolean | null
          applique_toutes_offres: boolean | null
          created_at: string
          date_debut: string
          date_fin: string
          description: string | null
          id: string
          nom: string
          pourcentage_reduction: number
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          applique_toutes_offres?: boolean | null
          created_at?: string
          date_debut?: string
          date_fin: string
          description?: string | null
          id?: string
          nom: string
          pourcentage_reduction?: number
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          applique_toutes_offres?: boolean | null
          created_at?: string
          date_debut?: string
          date_fin?: string
          description?: string | null
          id?: string
          nom?: string
          pourcentage_reduction?: number
          updated_at?: string
        }
        Relationships: []
      }
      promotions_offres: {
        Row: {
          created_at: string
          id: string
          offre_id: string
          promotion_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          offre_id: string
          promotion_id: string
        }
        Update: {
          created_at?: string
          id?: string
          offre_id?: string
          promotion_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotions_offres_offre_id_fkey"
            columns: ["offre_id"]
            isOneToOne: false
            referencedRelation: "offres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotions_offres_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["id"]
          },
        ]
      }
      regions: {
        Row: {
          code: string | null
          created_at: string
          id: string
          nom: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: string
          nom: string
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: string
          nom?: string
        }
        Relationships: []
      }
      sous_prefectures: {
        Row: {
          created_at: string
          departement_id: string | null
          id: string
          nom: string
        }
        Insert: {
          created_at?: string
          departement_id?: string | null
          id?: string
          nom: string
        }
        Update: {
          created_at?: string
          departement_id?: string | null
          id?: string
          nom?: string
        }
        Relationships: [
          {
            foreignKeyName: "sous_prefectures_departement_id_fkey"
            columns: ["departement_id"]
            isOneToOne: false
            referencedRelation: "departements"
            referencedColumns: ["id"]
          },
        ]
      }
      souscripteurs: {
        Row: {
          adresse: string | null
          created_at: string
          date_naissance: string | null
          departement_id: string | null
          district_id: string | null
          email: string | null
          id: string
          lieu_naissance: string | null
          localite: string | null
          nationalite: string | null
          nom: string
          numero_piece: string | null
          offre_id: string | null
          photo_url: string | null
          piece_recto_url: string | null
          piece_verso_url: string | null
          prenoms: string | null
          region_id: string | null
          sous_prefecture_id: string | null
          statut: string | null
          technico_commercial_id: string | null
          telephone: string
          type_piece: string | null
          updated_at: string
          village_id: string | null
        }
        Insert: {
          adresse?: string | null
          created_at?: string
          date_naissance?: string | null
          departement_id?: string | null
          district_id?: string | null
          email?: string | null
          id?: string
          lieu_naissance?: string | null
          localite?: string | null
          nationalite?: string | null
          nom: string
          numero_piece?: string | null
          offre_id?: string | null
          photo_url?: string | null
          piece_recto_url?: string | null
          piece_verso_url?: string | null
          prenoms?: string | null
          region_id?: string | null
          sous_prefecture_id?: string | null
          statut?: string | null
          technico_commercial_id?: string | null
          telephone: string
          type_piece?: string | null
          updated_at?: string
          village_id?: string | null
        }
        Update: {
          adresse?: string | null
          created_at?: string
          date_naissance?: string | null
          departement_id?: string | null
          district_id?: string | null
          email?: string | null
          id?: string
          lieu_naissance?: string | null
          localite?: string | null
          nationalite?: string | null
          nom?: string
          numero_piece?: string | null
          offre_id?: string | null
          photo_url?: string | null
          piece_recto_url?: string | null
          piece_verso_url?: string | null
          prenoms?: string | null
          region_id?: string | null
          sous_prefecture_id?: string | null
          statut?: string | null
          technico_commercial_id?: string | null
          telephone?: string
          type_piece?: string | null
          updated_at?: string
          village_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "souscripteurs_departement_id_fkey"
            columns: ["departement_id"]
            isOneToOne: false
            referencedRelation: "departements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "souscripteurs_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "souscripteurs_offre_id_fkey"
            columns: ["offre_id"]
            isOneToOne: false
            referencedRelation: "offres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "souscripteurs_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "souscripteurs_sous_prefecture_id_fkey"
            columns: ["sous_prefecture_id"]
            isOneToOne: false
            referencedRelation: "sous_prefectures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "souscripteurs_technico_commercial_id_fkey"
            columns: ["technico_commercial_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "souscripteurs_village_id_fkey"
            columns: ["village_id"]
            isOneToOne: false
            referencedRelation: "villages"
            referencedColumns: ["id"]
          },
        ]
      }
      villages: {
        Row: {
          created_at: string
          id: string
          nom: string
          sous_prefecture_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          nom: string
          sous_prefecture_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          nom?: string
          sous_prefecture_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "villages_sous_prefecture_id_fkey"
            columns: ["sous_prefecture_id"]
            isOneToOne: false
            referencedRelation: "sous_prefectures"
            referencedColumns: ["id"]
          },
        ]
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
