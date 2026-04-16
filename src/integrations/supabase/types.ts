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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      checklists: {
        Row: {
          created_at: string
          criado_por: string | null
          data: string
          id: string
          items: Json
          km: number | null
          nome_motorista: string
          placa: string
        }
        Insert: {
          created_at?: string
          criado_por?: string | null
          data?: string
          id?: string
          items?: Json
          km?: number | null
          nome_motorista: string
          placa: string
        }
        Update: {
          created_at?: string
          criado_por?: string | null
          data?: string
          id?: string
          items?: Json
          km?: number | null
          nome_motorista?: string
          placa?: string
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          address: string | null
          city: string | null
          cnpj: string | null
          email: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          state: string | null
          updated_at: string
          updated_by: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          cnpj?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          state?: string | null
          updated_at?: string
          updated_by?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          cnpj?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          state?: string | null
          updated_at?: string
          updated_by?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      custos: {
        Row: {
          categoria: string | null
          created_at: string
          data_vencimento: string
          descricao: string
          forma_pagamento: string
          id: string
          tipo: string
          valor_numerico: number
          valor_texto: string
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          data_vencimento: string
          descricao: string
          forma_pagamento: string
          id?: string
          tipo: string
          valor_numerico: number
          valor_texto: string
        }
        Update: {
          categoria?: string | null
          created_at?: string
          data_vencimento?: string
          descricao?: string
          forma_pagamento?: string
          id?: string
          tipo?: string
          valor_numerico?: number
          valor_texto?: string
        }
        Relationships: []
      }
      custos_maio: {
        Row: {
          created_at: string
          data_vencimento: string
          descricao: string
          forma_pagamento: string
          id: string
          tipo: string
          valor_numerico: number
          valor_texto: string
        }
        Insert: {
          created_at?: string
          data_vencimento: string
          descricao: string
          forma_pagamento: string
          id?: string
          tipo: string
          valor_numerico: number
          valor_texto: string
        }
        Update: {
          created_at?: string
          data_vencimento?: string
          descricao?: string
          forma_pagamento?: string
          id?: string
          tipo?: string
          valor_numerico?: number
          valor_texto?: string
        }
        Relationships: []
      }
      employee_documents: {
        Row: {
          created_at: string
          document_number: string | null
          document_type: string
          expiry_date: string | null
          file_url: string | null
          id: string
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_number?: string | null
          document_type: string
          expiry_date?: string | null
          file_url?: string | null
          id?: string
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_number?: string | null
          document_type?: string
          expiry_date?: string | null
          file_url?: string | null
          id?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      empresas: {
        Row: {
          ativa: boolean
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          ativa?: boolean
          created_at?: string
          id?: string
          nome: string
        }
        Update: {
          ativa?: boolean
          created_at?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      motoristas: {
        Row: {
          categoria_cnh: string
          cnh: string
          created_at: string
          id: string
          nome: string
          status: string
          telefone: string | null
          vencimento_cnh: string
        }
        Insert: {
          categoria_cnh: string
          cnh: string
          created_at?: string
          id?: string
          nome: string
          status?: string
          telefone?: string | null
          vencimento_cnh: string
        }
        Update: {
          categoria_cnh?: string
          cnh?: string
          created_at?: string
          id?: string
          nome?: string
          status?: string
          telefone?: string | null
          vencimento_cnh?: string
        }
        Relationships: []
      }
      ordens_servico: {
        Row: {
          cidade_destino: string | null
          cidade_origem: string | null
          created_at: string
          criado_por: string | null
          data_aceite: string | null
          data_conclusao: string | null
          data_criacao: string | null
          data_despacho: string | null
          data_inicio_execucao: string | null
          descricao: string | null
          empresa: string | null
          id: string
          motorista_id: string | null
          numero_os: string | null
          status: string
          valor_frete: number | null
          veiculo_id: string | null
        }
        Insert: {
          cidade_destino?: string | null
          cidade_origem?: string | null
          created_at?: string
          criado_por?: string | null
          data_aceite?: string | null
          data_conclusao?: string | null
          data_criacao?: string | null
          data_despacho?: string | null
          data_inicio_execucao?: string | null
          descricao?: string | null
          empresa?: string | null
          id?: string
          motorista_id?: string | null
          numero_os?: string | null
          status?: string
          valor_frete?: number | null
          veiculo_id?: string | null
        }
        Update: {
          cidade_destino?: string | null
          cidade_origem?: string | null
          created_at?: string
          criado_por?: string | null
          data_aceite?: string | null
          data_conclusao?: string | null
          data_criacao?: string | null
          data_despacho?: string | null
          data_inicio_execucao?: string | null
          descricao?: string | null
          empresa?: string | null
          id?: string
          motorista_id?: string | null
          numero_os?: string | null
          status?: string
          valor_frete?: number | null
          veiculo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ordens_servico_motorista_id_fkey"
            columns: ["motorista_id"]
            isOneToOne: false
            referencedRelation: "motoristas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordens_servico_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      posicoes_gps: {
        Row: {
          created_at: string
          id: string
          latitude: number
          longitude: number
          motorista_id: string | null
          ordem_servico_id: string | null
          veiculo_id: string | null
          velocidade: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          latitude: number
          longitude: number
          motorista_id?: string | null
          ordem_servico_id?: string | null
          veiculo_id?: string | null
          velocidade?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
          motorista_id?: string | null
          ordem_servico_id?: string | null
          veiculo_id?: string | null
          velocidade?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posicoes_gps_motorista_id_fkey"
            columns: ["motorista_id"]
            isOneToOne: false
            referencedRelation: "motoristas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posicoes_gps_ordem_servico_id_fkey"
            columns: ["ordem_servico_id"]
            isOneToOne: false
            referencedRelation: "ordens_servico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posicoes_gps_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          initial_password: string | null
          phone: string | null
          position: string | null
          status: string
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          initial_password?: string | null
          phone?: string | null
          position?: string | null
          status?: string
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          initial_password?: string | null
          phone?: string | null
          position?: string | null
          status?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      servicos: {
        Row: {
          cidade: string | null
          created_at: string
          ct_e: string | null
          data_servico: string
          empresa: string
          frete: string | null
          id: string
          motorista: string | null
          nf: string | null
          seguro: string | null
          servico: string | null
          solicitante: string | null
          status: string
          tipo_veiculo: string | null
          valor_numerico: number | null
          valor_texto: string | null
          veiculo: string | null
        }
        Insert: {
          cidade?: string | null
          created_at?: string
          ct_e?: string | null
          data_servico?: string
          empresa: string
          frete?: string | null
          id?: string
          motorista?: string | null
          nf?: string | null
          seguro?: string | null
          servico?: string | null
          solicitante?: string | null
          status?: string
          tipo_veiculo?: string | null
          valor_numerico?: number | null
          valor_texto?: string | null
          veiculo?: string | null
        }
        Update: {
          cidade?: string | null
          created_at?: string
          ct_e?: string | null
          data_servico?: string
          empresa?: string
          frete?: string | null
          id?: string
          motorista?: string | null
          nf?: string | null
          seguro?: string | null
          servico?: string | null
          solicitante?: string | null
          status?: string
          tipo_veiculo?: string | null
          valor_numerico?: number | null
          valor_texto?: string | null
          veiculo?: string | null
        }
        Relationships: []
      }
      servicos_maio: {
        Row: {
          cidade: string | null
          created_at: string
          data_servico: string
          empresa: string
          id: string
          servico: string | null
          solicitante: string | null
          valor_numerico: number | null
          valor_texto: string | null
        }
        Insert: {
          cidade?: string | null
          created_at?: string
          data_servico?: string
          empresa: string
          id?: string
          servico?: string | null
          solicitante?: string | null
          valor_numerico?: number | null
          valor_texto?: string | null
        }
        Update: {
          cidade?: string | null
          created_at?: string
          data_servico?: string
          empresa?: string
          id?: string
          servico?: string | null
          solicitante?: string | null
          valor_numerico?: number | null
          valor_texto?: string | null
        }
        Relationships: []
      }
      tabela_precos: {
        Row: {
          ativo: boolean
          cidade_destino: string
          cidade_origem: string
          created_at: string
          empresa: string | null
          id: string
          tipo_veiculo: string
          valor_base: number
        }
        Insert: {
          ativo?: boolean
          cidade_destino: string
          cidade_origem: string
          created_at?: string
          empresa?: string | null
          id?: string
          tipo_veiculo: string
          valor_base: number
        }
        Update: {
          ativo?: boolean
          cidade_destino?: string
          cidade_origem?: string
          created_at?: string
          empresa?: string | null
          id?: string
          tipo_veiculo?: string
          valor_base?: number
        }
        Relationships: []
      }
      user_permissions: {
        Row: {
          created_at: string | null
          granted_by: string | null
          id: string
          permission: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          granted_by?: string | null
          id?: string
          permission: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          granted_by?: string | null
          id?: string
          permission?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      veiculos: {
        Row: {
          ano: number | null
          capacidade_kg: number | null
          created_at: string
          crlv_vencimento: string | null
          id: string
          marca: string | null
          modelo: string | null
          motorista_id: string | null
          placa: string
          seguro_vencimento: string | null
          status: string
          tipo: string
        }
        Insert: {
          ano?: number | null
          capacidade_kg?: number | null
          created_at?: string
          crlv_vencimento?: string | null
          id?: string
          marca?: string | null
          modelo?: string | null
          motorista_id?: string | null
          placa: string
          seguro_vencimento?: string | null
          status?: string
          tipo: string
        }
        Update: {
          ano?: number | null
          capacidade_kg?: number | null
          created_at?: string
          crlv_vencimento?: string | null
          id?: string
          marca?: string | null
          modelo?: string | null
          motorista_id?: string | null
          placa?: string
          seguro_vencimento?: string | null
          status?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "veiculos_motorista_id_fkey"
            columns: ["motorista_id"]
            isOneToOne: false
            referencedRelation: "motoristas"
            referencedColumns: ["id"]
          },
        ]
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
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
