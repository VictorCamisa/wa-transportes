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
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          updated_at?: string
          username?: string
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
      servicos: {
        Row: {
          id: string
          empresa: string
          solicitante: string | null
          servico: string | null
          cidade: string | null
          valor_texto: string | null
          valor_numerico: number | null
          created_at: string
          data_servico: string
          ct_e: string | null
          nf: string | null
          tipo_veiculo: string | null
          veiculo: string | null
          motorista: string | null
          frete: string | null
          seguro: string | null
        }
        Insert: {
          id?: string
          empresa: string
          solicitante?: string | null
          servico?: string | null
          cidade?: string | null
          valor_texto?: string | null
          valor_numerico?: number | null
          created_at?: string
          data_servico?: string
          ct_e?: string | null
          nf?: string | null
          tipo_veiculo?: string | null
          veiculo?: string | null
          motorista?: string | null
          frete?: string | null
          seguro?: string | null
        }
        Update: {
          id?: string
          empresa?: string
          solicitante?: string | null
          servico?: string | null
          cidade?: string | null
          valor_texto?: string | null
          valor_numerico?: number | null
          created_at?: string
          data_servico?: string
          ct_e?: string | null
          nf?: string | null
          tipo_veiculo?: string | null
          veiculo?: string | null
          motorista?: string | null
          frete?: string | null
          seguro?: string | null
        }
        Relationships: []
      }
      custos: {
        Row: {
          id: string
          descricao: string
          data_vencimento: string
          valor_texto: string
          forma_pagamento: string
          tipo: string
          valor_numerico: number
          categoria: string | null
          created_at: string
        }
        Insert: {
          id?: string
          descricao: string
          data_vencimento: string
          valor_texto: string
          forma_pagamento: string
          tipo: string
          valor_numerico: number
          categoria?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          descricao?: string
          data_vencimento?: string
          valor_texto?: string
          forma_pagamento?: string
          tipo?: string
          valor_numerico?: number
          categoria?: string | null
          created_at?: string
        }
        Relationships: []
      }
      motoristas: {
        Row: {
          id: string
          nome: string
          cnh: string
          categoria_cnh: string
          vencimento_cnh: string
          telefone: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          cnh: string
          categoria_cnh: string
          vencimento_cnh: string
          telefone?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          cnh?: string
          categoria_cnh?: string
          vencimento_cnh?: string
          telefone?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      veiculos: {
        Row: {
          id: string
          placa: string
          tipo: string
          marca: string | null
          modelo: string | null
          ano: number | null
          capacidade_kg: number | null
          seguro_vencimento: string | null
          crlv_vencimento: string | null
          status: string
          motorista_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          placa: string
          tipo: string
          marca?: string | null
          modelo?: string | null
          ano?: number | null
          capacidade_kg?: number | null
          seguro_vencimento?: string | null
          crlv_vencimento?: string | null
          status?: string
          motorista_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          placa?: string
          tipo?: string
          marca?: string | null
          modelo?: string | null
          ano?: number | null
          capacidade_kg?: number | null
          seguro_vencimento?: string | null
          crlv_vencimento?: string | null
          status?: string
          motorista_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "veiculos_motorista_id_fkey"
            columns: ["motorista_id"]
            isOneToOne: false
            referencedRelation: "motoristas"
            referencedColumns: ["id"]
          }
        ]
      }
      ordens_servico: {
        Row: {
          id: string
          numero_os: string | null
          servico_id: string | null
          veiculo_id: string | null
          motorista_id: string | null
          status: string
          empresa: string | null
          descricao: string | null
          cidade_origem: string | null
          cidade_destino: string | null
          valor_frete: number | null
          data_criacao: string | null
          data_despacho: string | null
          data_aceite: string | null
          data_inicio_execucao: string | null
          data_conclusao: string | null
          criado_por: string | null
          despachado_por: string | null
          observacoes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          numero_os?: string | null
          servico_id?: string | null
          veiculo_id?: string | null
          motorista_id?: string | null
          status?: string
          empresa?: string | null
          descricao?: string | null
          cidade_origem?: string | null
          cidade_destino?: string | null
          valor_frete?: number | null
          data_criacao?: string | null
          data_despacho?: string | null
          data_aceite?: string | null
          data_inicio_execucao?: string | null
          data_conclusao?: string | null
          criado_por?: string | null
          despachado_por?: string | null
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          numero_os?: string | null
          servico_id?: string | null
          veiculo_id?: string | null
          motorista_id?: string | null
          status?: string
          empresa?: string | null
          descricao?: string | null
          cidade_origem?: string | null
          cidade_destino?: string | null
          valor_frete?: number | null
          data_criacao?: string | null
          data_despacho?: string | null
          data_aceite?: string | null
          data_inicio_execucao?: string | null
          data_conclusao?: string | null
          criado_por?: string | null
          despachado_por?: string | null
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      checklists: {
        Row: {
          id: string
          veiculo_id: string | null
          motorista_id: string | null
          placa: string | null
          nome_motorista: string | null
          data: string
          km: number | null
          items: Json
          observacoes: string | null
          criado_por: string | null
          created_at: string
        }
        Insert: {
          id?: string
          veiculo_id?: string | null
          motorista_id?: string | null
          placa?: string | null
          nome_motorista?: string | null
          data?: string
          km?: number | null
          items?: Json
          observacoes?: string | null
          criado_por?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          veiculo_id?: string | null
          motorista_id?: string | null
          placa?: string | null
          nome_motorista?: string | null
          data?: string
          km?: number | null
          items?: Json
          observacoes?: string | null
          criado_por?: string | null
          created_at?: string
        }
        Relationships: []
      }
      tabela_precos: {
        Row: {
          id: string
          empresa: string | null
          tipo_veiculo: string
          cidade_origem: string
          cidade_destino: string
          valor_base: number
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          empresa?: string | null
          tipo_veiculo: string
          cidade_origem: string
          cidade_destino: string
          valor_base: number
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          empresa?: string | null
          tipo_veiculo?: string
          cidade_origem?: string
          cidade_destino?: string
          valor_base?: number
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      posicoes_gps: {
        Row: {
          id: string
          motorista_id: string | null
          veiculo_id: string | null
          ordem_servico_id: string | null
          latitude: number
          longitude: number
          velocidade: number | null
          precisao: number | null
          created_at: string
        }
        Insert: {
          id?: string
          motorista_id?: string | null
          veiculo_id?: string | null
          ordem_servico_id?: string | null
          latitude: number
          longitude: number
          velocidade?: number | null
          precisao?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          motorista_id?: string | null
          veiculo_id?: string | null
          ordem_servico_id?: string | null
          latitude?: number
          longitude?: number
          velocidade?: number | null
          precisao?: number | null
          created_at?: string
        }
        Relationships: []
      }
      comprovantes_entrega: {
        Row: {
          id: string
          ordem_servico_id: string
          motorista_id: string | null
          foto_url: string | null
          assinatura_url: string | null
          latitude: number | null
          longitude: number | null
          nome_recebedor: string | null
          observacoes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          ordem_servico_id: string
          motorista_id?: string | null
          foto_url?: string | null
          assinatura_url?: string | null
          latitude?: number | null
          longitude?: number | null
          nome_recebedor?: string | null
          observacoes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          ordem_servico_id?: string
          motorista_id?: string | null
          foto_url?: string | null
          assinatura_url?: string | null
          latitude?: number | null
          longitude?: number | null
          nome_recebedor?: string | null
          observacoes?: string | null
          created_at?: string
        }
        Relationships: []
      }
      clientes_portal: {
        Row: {
          id: string
          empresa: string
          token: string
          ativo: boolean
          created_at: string
        }
        Insert: {
          id?: string
          empresa: string
          token?: string
          ativo?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          empresa?: string
          token?: string
          ativo?: boolean
          created_at?: string
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
