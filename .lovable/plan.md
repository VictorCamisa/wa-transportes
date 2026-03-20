

## Criar conta admin mayte@watransportes.com

A pagina de login atual so tem formulario de entrada (sign in), nao tem cadastro (sign up). Para resolver isso, vou criar uma funcao backend temporaria que registra o usuario admin diretamente no sistema.

### Acoes

1. **Criar uma funcao backend `create-admin-user`** que:
   - Usa a chave de servico (service role) para criar o usuario `mayte@watransportes.com` com senha `Admin123`
   - Automaticamente confirma o email (sem necessidade de verificacao)
   - O trigger `handle_new_user` ja existente criara o perfil automaticamente

2. **Atribuir role de admin** via INSERT na tabela `user_roles` para o usuario recem-criado

3. **Executar a funcao** para criar a conta e verificar que tudo funcionou

4. **Remover a funcao backend** apos o uso (por seguranca, nao deve ficar disponivel permanentemente)

### Resultado esperado

Voce podera fazer login na tela atual com:
- **Email:** mayte@watransportes.com
- **Senha:** Admin123

### Detalhes tecnicos

- Edge function usara `supabase.auth.admin.createUser()` com `email_confirm: true`
- Apos criar o usuario, insere na `user_roles` com role `admin`
- A funcao sera protegida e removida depois do primeiro uso
