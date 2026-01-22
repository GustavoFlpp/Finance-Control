# 💰 Finance Control — Full Stack Personal Finance Manager

Aplicação **full stack** para controle financeiro pessoal, desenvolvida com **React + TypeScript** no frontend e **Node.js (Express) + MongoDB** no backend, com autenticação via **JWT**.

O projeto permite que usuários cadastrem, visualizem e gerenciem suas transações financeiras, importem dados via CSV e acompanhem métricas consolidadas por meio de um dashboard interativo.

---

## 🎯 Objetivo do Projeto

Criar uma aplicação realista de controle financeiro que simule um produto em produção, cobrindo:

* Autenticação e rotas protegidas
* CRUD completo associado ao usuário autenticado
* Importação de dados em lote
* Visualização de métricas e insights financeiros
* Arquitetura organizada e escalável

---

## 🧠 Visão Geral da Arquitetura

* **Frontend:** React + Vite + Material UI
* **Backend:** Express + TypeScript
* **Banco de Dados:** MongoDB
* **Autenticação:** JWT (JSON Web Token)
* **Upload de Arquivos:** Multer + PapaParse

> O projeto foi estruturado com separação clara de responsabilidades entre frontend, backend e persistência de dados.

---

## 🚀 Funcionalidades

### 🔐 Autenticação

* Cadastro de usuários
* Login com geração de token JWT
* Proteção de rotas autenticadas
* Persistência de sessão via `localStorage`

### 💸 Gestão de Transações

* Criar, listar, editar e remover transações
* Transações sempre associadas ao usuário autenticado
* Organização por categoria, data e valor

### 📂 Importação via CSV

* Upload de arquivos CSV
* Processamento e inserção em lote de transações
* Integração com backend usando Multer e PapaParse

### 📊 Dashboard Financeiro

* Saldo total
* Receitas e despesas
* Gráficos por categoria
* Insights financeiros simples
* Interface responsiva e intuitiva

### 🎨 Experiência do Usuário

* Tema claro / escuro
* Layout com Sidebar e Header
* Navegação protegida por autenticação

---

## 🛠️ Tecnologias Utilizadas

### Backend

* Node.js
* Express
* TypeScript
* MongoDB + Mongoose
* JWT
* Bcrypt
* Multer
* PapaParse

### Frontend

* React
* TypeScript
* Vite
* Material UI (MUI)
* Axios
* React Router

---

## 📂 Estrutura do Projeto

## 📦 Backend

```
backend/
├── src/
│   ├── middlewares/
│   │   └── auth.ts              # Middleware de autenticação JWT (Bearer Token)
│   │                            # Valida o token, injeta req.user e bloqueia acesso não autenticado
│   │
│   ├── models/
│   │   ├── User.ts              # Schema Mongoose de usuário
│   │   │                        # Campos: name, email (único), passwordHash
│   │   │
│   │   └── Transaction.ts       # Schema Mongoose de transação financeira
│   │                            # Campos: userId, name, value, date, category
│   │
│   ├── routes/
│   │   ├── auth.ts              # Rotas de autenticação (register / login)
│   │   │                        # Hash de senha com bcrypt e geração de JWT
│   │   │
│   │   ├── profile.ts           # Rota protegida para retorno dos dados do usuário autenticado
│   │   │
│   │   ├── transactions.ts      # CRUD completo de transações
│   │   │                        # Todas as operações são filtradas por userId
│   │   │
│   │   └── upload.ts            # Upload protegido de CSV
│   │                            # Usa Multer em memória + PapaParse para inserção em lote
│   │
│   └── index.ts                 # Entry point do backend
│                                # Inicializa Express, aplica middlewares globais,
│                                # conecta ao MongoDB, registra as rotas e sobe o servidor
│
├── package.json                 # Scripts (dev, build, start) e dependências do backend
├── tsconfig.json                # Configuração TypeScript do servidor
└── .gitignore
```

---

## 🎨 Frontend

```
frontend/
├── src/
│   ├── api/
│   │   ├── auth.ts              # Funções de login e registro
│   │   │                        # Salva o token JWT no localStorage
│   │   │
│   │   └── transactions.ts      # Cliente HTTP para operações de transações
│   │                            # Fetch, update e delete (falta export de tipo Transaction)
│   │
│   ├── components/
│   │   ├── Header.tsx           # AppBar com switch de tema, menu do usuário e logout
│   │   ├── Sidebar.tsx          # Drawer de navegação (Dashboard, Despesas, Metas)
│   │   ├── MetricCard.tsx       # Card de métricas (saldo, receitas, despesas)
│   │   ├── TransactionList.tsx  # Lista de transações com ações de editar/excluir
│   │   ├── EditTransactionDialog.tsx
│   │   │                        # Modal para edição de transações
│   │   ├── UploadCSV.tsx        # Upload de CSV no frontend (parse local com PapaParse)
│   │   └── RequireAuth.tsx      # Guard de rota
│   │                            # Redireciona para /login se não houver token
│   │
│   ├── contexts/
│   │   └── TransactionsContext.tsx
│   │                            # Contexto global de transações
│   │                            # Centraliza carregamento, atualização e remoção
│   │
│   ├── hooks/
│   │   └── useTransactions.ts   # Hook alternativo para gerenciamento de transações
│   │                            # Duplica parte da lógica do contexto (ponto de refatoração)
│   │
│   ├── pages/
│   │   ├── AuthPage.tsx         # Container com abas de Login e Registro
│   │   ├── Login.tsx            # Formulário de login
│   │   ├── Register.tsx         # Formulário de cadastro
│   │   ├── Dashboard.tsx        # Dashboard financeiro
│   │   │                        # Cálculo de métricas, gráficos e insights
│   │   ├── Expenses.tsx         # Gestão de despesas
│   │   │                        # Lista, edição, exclusão e upload CSV
│   │   └── Goals.tsx            # Página de metas (placeholder)
│   │
│   ├── services/
│   │   └── api.ts               # Instância Axios com baseURL do backend
│   │
│   ├── themes/
│   │   └── theme.ts             # Configuração de tema Material UI
│   │                            # Paletas light/dark, tipografia e defaults
│   │
│   ├── App.tsx                  # Shell da aplicação
│   │                            # Controla tema, autenticação e layout
│   │
│   └── main.tsx                 # Entry point do React
│                                # Cria root e aplica BrowserRouter
│
├── index.html                   # HTML base do Vite
├── package.json                 # Scripts Vite e dependências do frontend
├── tsconfig.json                # Configuração TypeScript
└── .gitignore
```
---

## ⚙️ Configuração do Ambiente

### 🔧 Backend

1. Instale as dependências:

```bash
npm install
```

2. Crie um arquivo `.env`:

```env
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
PORT=3000
```

3. Execute o servidor:

```bash
npm run dev
```

---

### 💻 Frontend

1. Instale as dependências:

```bash
npm install
```

2. Execute a aplicação:

```bash
npm run dev
```

---

## 🔄 Próximos Passos

* Unificação do gerenciamento de estado de transações
* Centralização do upload CSV exclusivamente via backend
* Implementação de metas financeiras (Goals)
* Paginação e filtros avançados de transações
* Validação de dados no backend
* Deploy em ambiente de produção

---

## 🧑‍💻 Autor

Desenvolvido por **Gustavo Felippe Barbosa**
📌 Projeto pessoal para estudo, prática e portfólio

🔗 [LinkedIn](https://www.linkedin.com)
