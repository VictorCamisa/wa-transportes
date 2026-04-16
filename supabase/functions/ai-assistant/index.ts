import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;

const tools = [
  {
    type: "function",
    function: {
      name: "query_servicos",
      description: "Consulta serviços de transporte cadastrados. Use para listar, buscar ou filtrar serviços por empresa, data, status, motorista, cidade, etc.",
      parameters: {
        type: "object",
        properties: {
          empresa: { type: "string", description: "Filtrar por nome da empresa" },
          status: { type: "string", description: "Filtrar por status: pendente, em_andamento, concluido, cancelado, faturado, pago" },
          limit: { type: "number", description: "Número máximo de resultados (padrão 10)" },
          ordem: { type: "string", enum: ["recentes", "antigos"], description: "Ordenação por data" },
          mes: { type: "number", description: "Filtrar por mês (1-12)" },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "abrir_formulario_servico",
      description: "Abre o formulário de cadastro de serviço para o usuário preencher. Use sempre que o usuário quiser criar/cadastrar um novo serviço. NÃO peça os dados por texto, sempre abra o formulário.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "query_custos",
      description: "Consulta custos/despesas operacionais cadastrados.",
      parameters: {
        type: "object",
        properties: {
          tipo: { type: "string", description: "Tipo de custo (combustível, manutenção, pedágio, etc)" },
          limit: { type: "number", description: "Número máximo de resultados (padrão 10)" },
          mes: { type: "number", description: "Filtrar por mês (1-12)" },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "query_empresas",
      description: "Lista empresas clientes cadastradas no sistema.",
      parameters: {
        type: "object",
        properties: {
          ativa: { type: "boolean", description: "Filtrar por status ativa/inativa" },
          busca: { type: "string", description: "Buscar por nome" },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "query_motoristas",
      description: "Lista motoristas cadastrados.",
      parameters: {
        type: "object",
        properties: {
          status: { type: "string", description: "Filtrar por status" },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "query_veiculos",
      description: "Lista veículos da frota.",
      parameters: {
        type: "object",
        properties: {
          status: { type: "string", description: "Filtrar por status" },
          tipo: { type: "string", description: "Filtrar por tipo" },
        },
        required: [],
      },
    },
  },
];

async function executeTool(name: string, args: Record<string, any>): Promise<string> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  switch (name) {
    case "query_servicos": {
      let query = supabase.from("servicos").select("*").order("data_servico", { ascending: args.ordem === "antigos" }).limit(args.limit || 10);
      if (args.empresa) query = query.ilike("empresa", `%${args.empresa}%`);
      if (args.status) query = query.eq("status", args.status);
      if (args.mes) {
        const year = new Date().getFullYear();
        const m = String(args.mes).padStart(2, "0");
        query = query.gte("data_servico", `${year}-${m}-01`).lte("data_servico", `${year}-${m}-31`);
      }
      const { data, error } = await query;
      if (error) return JSON.stringify({ error: error.message });
      return JSON.stringify({ total: data?.length || 0, servicos: data });
    }
    case "abrir_formulario_servico": {
      return JSON.stringify({ action: "open_service_form" });
    }
    case "query_custos": {
      let query = supabase.from("custos").select("*").order("data_vencimento", { ascending: false }).limit(args.limit || 10);
      if (args.tipo) query = query.ilike("tipo", `%${args.tipo}%`);
      if (args.mes) {
        const year = new Date().getFullYear();
        const m = String(args.mes).padStart(2, "0");
        query = query.gte("data_vencimento", `${year}-${m}-01`).lte("data_vencimento", `${year}-${m}-31`);
      }
      const { data, error } = await query;
      if (error) return JSON.stringify({ error: error.message });
      return JSON.stringify({ total: data?.length || 0, custos: data });
    }
    case "query_empresas": {
      let query = supabase.from("empresas").select("*").order("nome");
      if (args.ativa !== undefined) query = query.eq("ativa", args.ativa);
      if (args.busca) query = query.ilike("nome", `%${args.busca}%`);
      const { data, error } = await query;
      if (error) return JSON.stringify({ error: error.message });
      return JSON.stringify({ total: data?.length || 0, empresas: data });
    }
    case "query_motoristas": {
      let query = supabase.from("motoristas").select("*").order("nome");
      if (args.status) query = query.eq("status", args.status);
      const { data, error } = await query;
      if (error) return JSON.stringify({ error: error.message });
      return JSON.stringify({ total: data?.length || 0, motoristas: data });
    }
    case "query_veiculos": {
      let query = supabase.from("veiculos").select("*").order("placa");
      if (args.status) query = query.eq("status", args.status);
      if (args.tipo) query = query.eq("tipo", args.tipo);
      const { data, error } = await query;
      if (error) return JSON.stringify({ error: error.message });
      return JSON.stringify({ total: data?.length || 0, veiculos: data });
    }
    default:
      return JSON.stringify({ error: `Tool ${name} not found` });
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();

    const systemPrompt = `Você é o assistente virtual da W&A Transportes, um sistema de gestão de transporte e logística.

Você pode ajudar os usuários a:
- Consultar serviços, custos, empresas, motoristas e veículos
- Criar novos serviços de transporte (abrindo o formulário)
- Responder dúvidas sobre como usar o sistema
- Fornecer resumos e relatórios rápidos

Regras:
- Sempre responda em português brasileiro
- Seja conciso e objetivo
- IMPORTANTE: Quando o usuário quiser criar/cadastrar um serviço, SEMPRE use a ferramenta abrir_formulario_servico para abrir o formulário. NUNCA peça os dados por texto.
- Formate valores monetários como R$ X.XXX,XX
- Formate datas como DD/MM/YYYY
- Use markdown para formatar respostas quando apropriado (listas, negrito, etc)
- Quando mostrar resultados de consultas, organize de forma clara e legível`;

    let allMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    // Loop for tool calling (max 3 iterations)
    let pendingAction: string | null = null;
    for (let i = 0; i < 3; i++) {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: allMessages,
          tools,
          stream: false,
        }),
      });

      if (!response.ok) {
        const status = response.status;
        if (status === 429) {
          return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns segundos." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (status === 402 || status === 401) {
          return new Response(JSON.stringify({ error: "Erro de autenticação com a API OpenAI. Verifique a chave." }), {
            status: status,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const errText = await response.text();
        console.error("AI error:", status, errText);
        throw new Error(`AI gateway error: ${status}`);
      }

      const data = await response.json();
      const choice = data.choices?.[0];

      if (!choice) throw new Error("No response from AI");

      const msg = choice.message;

      // If no tool calls, return the final text
      if (!msg.tool_calls || msg.tool_calls.length === 0) {
        return new Response(JSON.stringify({ content: msg.content, ...(pendingAction ? { action: pendingAction } : {}) }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Process tool calls
      allMessages.push(msg);

      for (const tc of msg.tool_calls) {
        const args = typeof tc.function.arguments === "string" ? JSON.parse(tc.function.arguments) : tc.function.arguments;
        console.log(`Tool call: ${tc.function.name}`, args);
        const result = await executeTool(tc.function.name, args);
        
        // Check if tool result contains an action
        try {
          const parsed = JSON.parse(result);
          if (parsed.action) pendingAction = parsed.action;
        } catch {}
        
        allMessages.push({
          role: "tool",
          tool_call_id: tc.id,
          content: result,
        });
      }
      // Loop continues to let AI process tool results
    }

    return new Response(JSON.stringify({ content: "Desculpe, não consegui processar sua solicitação. Tente reformular." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro interno" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
