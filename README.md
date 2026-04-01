# Teste de Guerrilha

Aplicação em Next.js para coletar respostas sobre o jogo `Mestres do Sistema` e visualizar os resultados em um dashboard compartilhado.

## Como funciona

- Cada aparelho pede o nome do coletor na primeira abertura.
- Esse nome fica salvo localmente no navegador daquele aparelho.
- Todas as respostas são enviadas para o Supabase.
- O dashboard lê do mesmo banco compartilhado, então vários celulares conseguem alimentar a mesma base.

## Requisitos

- Node.js 20+ recomendado
- npm
- Um projeto no Supabase

## Instalação local

1. Instale as dependências:

```bash
npm install
```

2. Crie o arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=SUA_CHAVE_PUBLICA
```

Também aceitamos:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=SUA_CHAVE_PUBLICA
```

Se preferir, também funciona com:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON
```

3. Rode o projeto:

```bash
npm run dev
```

4. Abra `http://localhost:3000`

## Configuração do Supabase

### 1. Criar o projeto

No Supabase, crie um projeto novo.

### 2. Pegar URL e chave pública

No painel do Supabase:

- `Settings`
- `API`

Copie:

- `Project URL`
- `publishable key` de preferência
- ou `anon public` se esse for o formato disponível no seu painel

E coloque esses valores no `.env.local`.

### 3. Criar a tabela e as políticas

Abra o `SQL Editor` do Supabase e rode o conteúdo do arquivo [supabase/schema.sql](./supabase/schema.sql).

Esse script cria:

- tabela `public.responses`
- coluna `payload` com a resposta completa
- leitura pública para o app
- inserção pública para o app

## Estrutura dos dados

Cada resposta salva inclui:

- dados preenchidos no formulário
- `id`
- `ts`
- `coletor`

O campo `coletor` identifica quem estava usando aquele aparelho no momento da coleta.

## Uso em vários celulares

### Primeiro acesso em cada aparelho

1. Abra o app.
2. Informe o nome do coletor.
3. Esse nome ficará salvo localmente no navegador daquele aparelho.

### Durante a coleta

- O formulário salva no banco compartilhado.
- O dashboard mostra as respostas do banco compartilhado.
- O nome do coletor aparece no topo e também é salvo junto com cada resposta.

### Trocar de pessoa no mesmo aparelho

Use o botão `Trocar coletor` no topo do app.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Publicação

Se for publicar, configure estas variáveis no ambiente de deploy:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Depois gere um novo build.

## Observações importantes

- Não existe login.
- Qualquer pessoa com acesso ao app consegue enviar respostas.
- O dashboard também consegue ler as respostas sem autenticação.
- Isso foi escolhido para manter a operação simples em campo.

## Arquivos importantes

- [src/app/page.tsx](./src/app/page.tsx): fluxo principal da aplicação
- [src/components/CollectorGate.tsx](./src/components/CollectorGate.tsx): identificação local do coletor
- [src/components/Dashboard.tsx](./src/components/Dashboard.tsx): dashboard
- [src/lib/helpers.ts](./src/lib/helpers.ts): leitura, escrita e exportação
- [src/lib/supabase.ts](./src/lib/supabase.ts): cliente do Supabase
- [supabase/schema.sql](./supabase/schema.sql): criação da tabela e políticas
