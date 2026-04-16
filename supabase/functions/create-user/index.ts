import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verify caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify caller with their JWT
    const callerClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user: caller }, error: callerError } = await callerClient.auth.getUser();
    if (callerError || !caller) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check caller is admin
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: callerRoles } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "admin");

    if (!callerRoles || callerRoles.length === 0) {
      return new Response(JSON.stringify({ error: "Apenas administradores podem criar usuários" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse request body
    const { username, email, password, role, permissions } = await req.json();

    if (!email || !password || !username) {
      return new Response(JSON.stringify({ error: "Email, senha e nome são obrigatórios" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create auth user (does NOT switch caller's session)
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username },
    });

    if (authError) {
      let msg = "Erro ao criar usuário";
      if (authError.message.includes("already been registered") || authError.message.includes("already registered")) {
        msg = "Este email já está registrado no sistema";
      }
      return new Response(JSON.stringify({ error: msg }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const newUserId = authData.user.id;

    // Store initial password in profile
    const { error: profileUpdateError } = await adminClient
      .from("profiles")
      .update({ initial_password: password })
      .eq("id", newUserId);
    if (profileUpdateError) {
      console.error("Erro ao salvar senha inicial:", profileUpdateError);
    }

    // Insert role if admin
    if (role === "admin") {
      const { error: roleError } = await adminClient
        .from("user_roles")
        .insert({ user_id: newUserId, role: "admin" });
      if (roleError) {
        console.error("Erro ao inserir role:", roleError);
      }
    }

    // Insert permissions
    if (permissions && permissions.length > 0) {
      const permsData = permissions.map((p: string) => ({
        user_id: newUserId,
        permission: p,
        granted_by: caller.id,
      }));
      const { error: permError } = await adminClient
        .from("user_permissions")
        .insert(permsData);
      if (permError) {
        console.error("Erro ao inserir permissões:", permError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, user_id: newUserId, email }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Erro inesperado:", err);
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
