
Objetivo: corrigir o fluxo de criação de usuários para que o admin continue logado e o novo usuário já nasça com role/permissões corretas, sem cair na tela “Acesso Limitado”.

1. Diagnóstico confirmado
- O problema principal é o uso de `supabase.auth.signUp()` dentro do `UserForm`.
- Esse método troca a sessão atual para o usuário recém-criado.
- Como o novo usuário ainda não tem registro em `user_roles`, `usePermissions()` retorna sem acesso e o dashboard mostra “Acesso Limitado”.
- Além disso, o campo `role` hoje vai só para metadata do signup, mas o sistema real usa `user_roles` como fonte de verdade.
- E o insert em `user_permissions` falha por RLS porque, após a troca de sessão, quem está tentando gravar já não é mais o admin original.

2. Mudança de arquitetura
- Remover a criação de usuário direto do cliente.
- Criar uma função de backend segura para “criar usuário”, chamada pelo formulário interno.
- Essa função deve:
  - criar a conta de autenticação sem trocar a sessão do admin
  - gravar role em `user_roles` quando aplicável
  - gravar permissões em `user_permissions`
  - confiar no trigger existente para criar `profiles`, usando apenas ajuste complementar se necessário
- Resultado esperado: o admin continua no painel e o novo usuário passa a existir completo no sistema.

3. Ajustes no frontend
- Atualizar `src/components/dashboard/UserForm.tsx` para:
  - parar de usar `supabase.auth.signUp()`
  - chamar a nova função de backend
  - enviar `username`, `email`, `password`, `role` e permissões selecionadas
  - mostrar mensagens de sucesso/erro mais claras
- Manter o formulário dentro da tela de usuários, como você pediu, mas com execução 100% segura por backend.

4. Ajustes de RBAC
- Garantir que:
  - “Administrador” grave em `user_roles`
  - “Usuário” não dependa de metadata para acesso
  - permissões selecionadas sejam persistidas corretamente em `user_permissions`
- Se o usuário for admin, decidir se:
  - recebe apenas role admin, ou
  - também recebe permissões explícitas para manter compatibilidade visual
- Minha recomendação: manter `admin` em `user_roles` como fonte principal e tratar permissões explícitas como opcionais.

5. Correções de consistência
- Remover a lógica frágil de “esperar e criar profile manualmente” no fluxo de criação, porque o projeto já foi desenhado para sincronizar perfil automaticamente.
- Revisar as queries de listagem de usuários (`UsersManagement` / `EmployeeProfile`) para evitar dependência quebrada de relacionamento implícito com `user_permissions`, já que há indício de erro de relacionamento na consulta atual.
- Garantir invalidação correta das queries após criação do usuário.

6. Segurança
- Manter criação de usuários restrita a admins.
- Não usar role em `profiles`.
- Não confiar em metadata do auth para autorização.
- Centralizar criação de conta + role + permissões no backend para evitar novas falhas de sessão e RLS.

7. Validação após implementação
- Testar criação de usuário comum
- Testar criação de admin
- Confirmar que o admin criador permanece logado
- Confirmar que o novo usuário não derruba a tela em “Acesso Limitado” quando tiver acesso configurado
- Confirmar que a listagem de usuários e perfil individual continuam funcionando

Detalhes técnicos
- Arquivos que provavelmente serão alterados:
  - `src/components/dashboard/UserForm.tsx`
  - `src/components/dashboard/UsersManagement.tsx`
  - `src/components/dashboard/EmployeeProfile.tsx`
  - nova função de backend para criação segura de usuários
  - possivelmente uma migration pequena se for necessário ajustar política/relacionamento de leitura
- Não pretendo mexer em `src/integrations/supabase/client.ts` nem em `types.ts`.
- A correção principal não é visual; é de fluxo de autenticação e RBAC.

Resumo da causa raiz
```text
Hoje:
Admin cria usuário -> signUp troca sessão -> novo usuário entra sem user_roles ->
dashboard calcula zero permissões -> aparece "Acesso Limitado"

Depois da correção:
Admin cria usuário -> backend cria conta sem trocar sessão ->
role/permissões são gravadas corretamente -> admin continua no painel
```
