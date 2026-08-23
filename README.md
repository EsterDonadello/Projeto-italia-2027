# 🇮🇹 Projeto Itália 2027 — versão gratuita com sincronização

## Arquitetura

- Front-end: HTML + CSS + JavaScript puro.
- Hospedagem: GitHub Pages (gratuita).
- Banco/autenticação: Supabase (plano gratuito).
- Login: magic link por e-mail.
- Sincronização: cada conta possui uma linha própria na tabela `projects`.
- Segurança: Row Level Security (RLS) impede que um usuário leia/escreva o projeto de outro usuário.
- Uso offline/local: o projeto continua salvando no navegador; quando o usuário entra na conta, os dados podem ser sincronizados.

## Passo a passo

### 1. Criar o banco
Crie um projeto no Supabase e abra o SQL Editor.
Cole e execute todo o conteúdo de `supabase.sql`.

### 2. Configurar o front-end
Abra `config.js` e troque:
- `COLE_AQUI_A_PROJECT_URL`
- `COLE_AQUI_A_PUBLISHABLE_OU_ANON_KEY`

Use somente a chave pública/publishable/anon. NUNCA use `service_role`.

### 3. Configurar o login
No Supabase, configure Authentication > URL Configuration.
Adicione a URL final do GitHub Pages como Site URL e Redirect URL.
Exemplo:
`https://SEU-USUARIO.github.io/projeto-italia/`

### 4. Publicar gratuitamente
Crie um repositório público no GitHub.
Envie:
- index.html
- style.css
- app.js
- config.js
- manifest.webmanifest
- supabase.sql (pode ficar no repositório; não contém segredo)

Depois ative:
Settings > Pages > Deploy from branch > main / root.

O endereço ficará parecido com:
`https://SEU-USUARIO.github.io/projeto-italia/`

### 5. No iPhone
Abra o endereço no Safari.
Toque em Compartilhar > Adicionar à Tela de Início.
A página passa a abrir como um app.

## Importante sobre segurança

A `publishable/anon key` do Supabase é feita para ser usada no front-end. A proteção real vem das políticas RLS do banco.
Não coloque uma `service_role key` no `config.js`.

## Sincronização

Depois de entrar com o mesmo e-mail em dois aparelhos, o projeto fica associado à conta. Alterações são enviadas para o Supabase após uma pequena espera para evitar excesso de gravações.

Para um projeto familiar com poucos usuários, essa arquitetura é simples e barata.
