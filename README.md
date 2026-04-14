
[![CI/CD Pipeline](https://github.com/alex-correa-dev/fin-tech-x/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/alex-correa-dev/fin-tech-x/actions/workflows/ci-cd.yml)
[![Code Quality](https://github.com/alex-correa-dev/fin-tech-x/actions/workflows/code-quality.yml/badge.svg)](https://github.com/alex-correa-dev/fin-tech-x/actions/workflows/code-quality.yml)

# 💰 FinTechX - Chat Inteligente com IA

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-336791.svg)](https://www.postgresql.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-1.5%20Flash-4285F4.svg)](https://deepmind.google/technologies/gemini/)
[![Jest](https://img.shields.io/badge/Jest-29.x-C21325.svg)](https://jestjs.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Sobre o Projeto

A **FinTechX** é uma plataforma inovadora que oferece um **chat inteligente alimentado por IA** para atendimento ao cliente no setor financeiro. O projeto foi desenvolvido como parte de um desafio técnico para demonstrar habilidades em desenvolvimento full-stack, arquitetura limpa e integração com modelos de linguagem de última geração.

### 🎯 Objetivo

Criar uma aplicação completa onde usuários possam:
- ✅ Criar conta e fazer login de forma segura
- ✅ Interagir com um assistente virtual inteligente (Google Gemini AI)
- ✅ Obter respostas personalizadas sobre a FinTechX
- ✅ Manter histórico de conversas

### 🏗️ Arquitetura do Backend

O backend segue os princípios da **Clean Architecture**, garantindo:
- **Separação de responsabilidades** entre domínio, aplicação e infraestrutura
- **Independência de frameworks** (trocar Express por Fastify é fácil)
- **Independência de banco de dados** (trocar PostgreSQL por MongoDB é simples)
- **Testabilidade** total de todas as camadas
- **Código type-safe** com TypeScript

```text
┌─────────────────────────────────────────────────────┐
│ INTERFACES                                          │
│ (Controllers, Middlewares, Validators)              │
├─────────────────────────────────────────────────────┤
│ APPLICATION                                         │
│ (Services, DTOs, Ports)                             │
├─────────────────────────────────────────────────────┤
│ DOMAIN                                              │
│ (Entities, Use Cases, Repository Interfaces)        │
├─────────────────────────────────────────────────────┤
│ INFRASTRUCTURE                                      │
│ (Database, Repositories, AI, Security, HTTP)        │
└─────────────────────────────────────────────────────┘
```

### 🎨 Arquitetura do Frontend

O frontend foi construído com foco em **componentização**, **manutenibilidade** e **experiência do usuário**:

```text
┌─────────────────────────────────────────────────────┐
│ COMPONENTES (UI Layer) │
│ (Login, Register, Dashboard, ChatInterface, Message)│
├─────────────────────────────────────────────────────┤
│ SERVICES (Business Logic Layer) │
│ (API Service, Auth Service, Chat Service) │
├─────────────────────────────────────────────────────┤
│ CONTEXTS (State Management) │
│ (Theme Context - Dark/Light Mode) │
├─────────────────────────────────────────────────────┤
│ TYPES (Type Safety Layer) │
│ (Interfaces e tipos compartilhados) │
└─────────────────────────────────────────────────────┘
```

## 🚀 Tecnologias Utilizadas

### Backend
| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| Node.js | 20.x | Runtime JavaScript |
| TypeScript | 5.x | Tipagem estática |
| Express | 4.x | Framework HTTP |
| PostgreSQL | 15.x | Banco de dados relacional |
| JWT | 9.x | Autenticação |
| Bcrypt | 5.x | Hash de senhas |
| Google Gemini AI | 2.5 Flash | Modelo de linguagem |
| Jest | 29.x | Testes unitários |

### Frontend
| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| React | 18.x | Biblioteca UI |
| TypeScript | 5.x | Tipagem estática |
| SCSS Modules | 1.x | Estilização encapsulada |
| React Router DOM | 6.x | Roteamento client-side |
| Fetch API | Nativo | Requisições HTTP |
| Jest + Testing Library | 29.x | Testes unitários e integração |

### Ferramentas de Desenvolvimento
- **Nodemon** - Hot-reload durante desenvolvimento
- **TS-Node** - Execução direta de TypeScript
- **Jest** - Testes unitários e coverage
- **ESLint + Prettier** - Padronização de código
- **React Scripts** - Build e desenvolvimento do frontend

## 📁 Estrutura do Projeto

```text
fintechx/
├── backend/
│ ├── src/
│ │ ├── domain/ # Camada mais interna (regras de negócio)
│ │ │ ├── entities/ # User, ChatMessage
│ │ │ ├── repositories/ # Interfaces IUserRepository, IChatRepository
│ │ │ └── usecases/ # RegisterUser, LoginUser, AskQuestion
│ │ ├── application/ # Casos de uso da aplicação
│ │ │ ├── services/ # AuthService, GeminiService
│ │ │ ├── ports/ # IAuthService, IAIProvider
│ │ │ └── dtos/ # AuthDTO, ChatDTO
│ │ ├── infrastructure/ # Implementações concretas
│ │ │ ├── database/ # PostgresDatabase
│ │ │ ├── repositories/ # PostgresUserRepository, PostgresChatRepository
│ │ │ ├── ai/ # GeminiProvider, AIProviderFactory
│ │ │ ├── security/ # JWTService, BcryptService
│ │ │ └── http/ # Server, Routes
│ │ ├── interfaces/ # Adaptadores
│ │ │ ├── controllers/ # AuthController, ChatController
│ │ │ ├── middlewares/ # authMiddleware, errorHandler
│ │ │ └── validators/ # authValidator
│ │ ├── shared/ # Utilitários
│ │ │ ├── types/ # Interfaces compartilhadas
│ │ │ ├── errors/ # AppError
│ │ │ └── constants/ # Mensagens do sistema
│ │ └── config/ # Configurações (env, database, gemini)
│ ├── .env # Variáveis de ambiente
│ ├── jest.config.js # Configuração do Jest
│ ├── tsconfig.json # Configuração do TypeScript
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── components/ # Componentes React (cada um com seu SCSS)
│ │ │ ├── Login/ # Página de login
│ │ │ ├── Register/ # Página de registro
│ │ │ ├── Dashboard/ # Dashboard principal
│ │ │ ├── ChatInterface/ # Interface do chat
│ │ │ ├── Message/ # Componente de mensagem
│ │ │ └── ThemeToggle/ # Alternador de tema
│ │ ├── contexts/ # Contextos React (ThemeContext)
│ │ ├── services/ # Serviços (API, Auth, Chat)
│ │ ├── types/ # Tipos TypeScript compartilhados
│ │ ├── styles/ # Estilos globais e variáveis
│ │ ├── App.tsx # Componente principal
│ │ └── index.tsx # Ponto de entrada
│ ├── public/ # Arquivos estáticos
│ ├── .env # Variáveis de ambiente
│ ├── tsconfig.json # Configuração do TypeScript
│ └── package.json
│
└── README.md
```


## 🔧 Pré-requisitos

- **Node.js** (v20 ou superior)
- **PostgreSQL** (v15 ou superior)
- **npm**
- **Conta Google** para API Key do Gemini (gratuita)

## 📦 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/alex-correa-dev/fin-tech-x.git
cd fin-tech-x
```

### 2. Configurar o Backend

```bash
cd backend
npm install
```

#### Configurar variáveis de ambiente

Crie um arquivo `.env` na pasta `backend`:

```env
# Servidor
PORT=5000
NODE_ENV=development

# Banco de Dados
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fintechx_db

# JWT
JWT_SECRET=fintechx_super_secret_key_change_this_in_production

# Google Gemini AI
GEMINI_API_KEY=sua_chave_api_gemini_aqui
GEMINI_MODEL_NAME=gemini-2.5-flash-lite
```

#### Obter API Key do Google Gemini (Gratuita)

1. Acesse [Google AI Studio](https://aistudio.google.com/app/api-keys)

2. Faça login com sua conta Google

3. Clique em "Create API Key"

4. Copie a chave gerada

5. Cole no campo `GEMINI_API_KEY` do `.env`

#### Configurar o Banco de Dados

```bash
# Criar banco de dados
psql -U postgres -c "CREATE DATABASE fintechx_db;"

# Ou usar o comando alternativo (Linux/Mac)
sudo -i -u postgres psql -c "CREATE DATABASE fintechx_db;"
```

### 3. Configurar o Frontend

```bash
cd frontend
npm install
```

#### Configurar variáveis de ambiente do frontend

Crie um arquivo `.env` na pasta `frontend`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Executando o Projeto

### Modo Desenvolvimento

#### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

#### Saída esperada:

```text
🚀 Servidor rodando na porta 5000
📝 Ambiente: development
🤖 IA Provider: gemini-2.5-flash-lite
✅ Conectado ao PostgreSQL
✅ Tabelas criadas/verificadas
```

#### Terminal 2 - Frontend

```bash
cd frontend
npm start
```

Acesse: `http://localhost:3000`

### Modo Produção

#### Backend

```bash
cd backend
npm run build
npm start
```

#### Frontend

```bash
cd frontend
npm run build
npx serve -s build
```

## 🧪 Testes

#### Backend

```bash
cd backend
npm test                # Executar todos os testes
npm run test:watch      # Modo watch
npm run test:coverage   # Com cobertura
npm test -- User.spec.ts # Teste específico
```

### Frontend

```bash
cd frontend
npm test                # Executar todos os testes
npm run test:watch      # Modo watch
npm run test:coverage   # Com cobertura
npm test -- Login.test.tsx # Teste específico
```

### Estrutura dos Testes

Os testes unitários seguem o princípio de ***ficar ao lado do código*** (colocated tests):

```text
src/
├── domain/
│   └── entities/
│       ├── User.ts
│       └── User.spec.ts        # Teste ao lado do código
├── application/
│   └── dtos/
│       ├── AuthDTO.ts
│       └── AuthDTO.spec.ts     # Teste ao lado do código
└── infrastructure/
    └── security/
        ├── JWTService.ts
        └── JWTService.spec.ts  # Teste ao lado do código
```

### Cobertura de Testes

#### Backend:

- ✅ Domain Entities - Validações e regras de negócio
- ✅ Use Cases - Fluxos principais (registro, login, chat)
- ✅ DTOs - Validações de dados
- ✅ Security Services - JWT, Bcrypt
- ✅ Repositories - Operações de banco (com mocks)
- ✅ AI Provider - Integração com Gemini

#### Frontend:

- ✅ Componentes - Renderização e interações
- ✅ Services - Chamadas API e lógica de negócio
- ✅ Contexts - Gerenciamento de estado (ThemeContext)
- ✅ Integração - Fluxos completos (login → dashboard → chat)

### 🎯 Funcionalidades

#### Autenticação

- ✅ Registro de novos usuários
- ✅ Login com JWT
- ✅ Proteção de rotas autenticadas

#### Chat Inteligente

- ✅ Interface estilo ChatGPT
- ✅ Respostas personalizadas usando Google Gemini AI
- ✅ Contexto da FinTechX (horários, escritórios, segurança, etc.)
- ✅ Perguntas sugeridas para facilitar interação
- ✅ Indicador de digitação
- ✅ Suporte a perguntas em linguagem natural

#### Base de Conhecimento da FinTechX

| Pergunta | Resposta |
| :--- | :--- |
| Horários de atendimento | Segunda a sexta 9h-18h, sábado 9h-13h |
| Localização dos escritórios | São Paulo (Av. Paulista) e Rio de Janeiro (Av. Rio Branco)
| Fundadores | Ana Silva e Carlos Mendes (2020)
| Segurança de dados | Criptografia ponta a ponta, 2FA, LGPD
| E-mails suspeitos | Encaminhar para segurança@fintechx.com
| Educação financeira | Blog, webinars, curso gratuito
| Promoções | Newsletter no site ou app

## 🐛 Solução de Problemas

### Erro: "Connection to PostgreSQL failed"

```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql  # Linux
brew services list | grep postgres # Mac
net start | findstr postgres       # Windows

# Iniciar PostgreSQL
sudo systemctl start postgresql    # Linux
brew services start postgresql     # Mac
```

### Erro: "Peer authentication failed"

```bash
# No Linux/Mac, usar sudo
sudo -i -u postgres psql
CREATE DATABASE fintechx_db;
\q
```

### Erro: "Gemini API key not found"

- Verifique se a chave está no arquivo `.env`
- Obtenha uma chave gratuita em [Google AI Studio](https://aistudio.google.com/app/apikey)

### Erro: "Port 5000 already in use"

```bash
# Mudar a porta no .env
PORT=5001

# Ou matar o processo
lsof -ti:5000 | xargs kill -9  # Linux/Mac
```

## 📝 Decisões Técnicas

### Backend

#### Por que Clean Architecture?

- ****Separação clara de responsabilidades****
- ****Independência de frameworks e bibliotecas****
- ****Facilidade para trocar implementações**** (ex: PostgreSQL → MongoDB)
- ****Testabilidade máxima**** (cada camada pode ser testada isoladamente)
- ****Código mais expressivo e autodocumentado****

#### Por que Google Gemini AI?

- ****Gratuito**** para desenvolvimento (tier generoso)
- ****Sem necessidade de cartão de crédito**** para começar
- ****Modelo Flash rápido e eficiente**** para chat
- ****Contexto de 1M tokens**** (muito maior que concorrentes)
- ****Facilidade de implementação****

#### Por que TypeScript no Backend?

### Frontend

#### Por que React com TypeScript?

- ****Type safety**** reduz erros em produção
- ****Melhor experiência de desenvolvimento**** (autocomplete, refatoração)
- ****Código auto-documentado****
- ****Facilita manutenção em equipe****

### Por que SCSS Modules?

- ****Estilos encapsulados por componente****
- ****Variáveis globais reutilizáveis****
- ****Animações e responsividade integradas****
- ****Manutenção mais fácil que CSS puro****

### Por que RSCSS (Reasonable System for CSS Stylesheet Structure)?

- **Nomenclatura intuitiva** - Componentes com duas palavras, elementos com uma
- **Aninhamento claro** - Hierarquia visual usando o seletor >
- **Evita especificidade excessiva** - Menos necessidade de !important
- **Fácil manutenção** - Componentes independentes e reutilizáveis
- **Escalável** - Fácil adicionar novos componentes sem conflitos

```text
// Exemplo RSCSS
.chat-interface {           // Componente (2 palavras)
  > .header { }              // Elemento (1 palavra)
  > .messages { }            // Elemento (1 palavra)
  
  &.-loading { }             // Variante (começa com -)
}
```

## 🔄 Fluxo de Dados

```text
1. Usuário acessa frontend (React)
2. Faz login/registro → Backend (JWT)
3. Token armazenado no localStorage
4. Acessa chat autenticado
5. Envia pergunta → Backend
6. Backend chama Gemini AI (com contexto da FinTechX)
7. Resposta é salva no PostgreSQL
8. Frontend exibe resposta estilo ChatGPT
9. Dark/Light mode persiste no localStorage
```

## 📊 Diagrama de Banco de Dados

```sql
users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

chat_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## 🚢 Deploy

### 🌐 URLs da Aplicação

| Ambiente | URL | Status |
|----------|-----|--------|
| **Frontend (Vercel)** | [https://fintechx-frontend.vercel.app](https://fintechx-frontend.vercel.app) | ✅ Online |
| **Backend (Render)** | [https://fintechx-backend.onrender.com](https://fintechx-backend.onrender.com) | ✅ Online |
| **Health Check** | [https://fintechx-backend.onrender.com/health](https://fintechx-backend.onrender.com/health) | ✅ Online |

### 🏗️ Infraestrutura em Nuvem

| Serviço | Plataforma | Plano | Motivo da Escolha |
|---------|------------|-------|-------------------|
| **Frontend** | Vercel | Gratuito | Deploy automático com GitHub, CDN global, build otimizado para React, certificado SSL automático |
| **Backend** | Render | Gratuito | Suporte nativo a Node.js/TypeScript, PostgreSQL integrado, 750 horas/mês |
| **Banco de Dados** | Render PostgreSQL | Gratuito | 1GB de armazenamento, conexão interna segura, backup automático |

### 🔄 CI/CD Pipeline (GitHub Actions)

```yaml
Workflow CI/CD Pipeline
├── 📦 Test Backend      # Jest + ESLint + Type Check
├── 📦 Test Frontend     # React Testing Library + ESLint
├── 🔨 Build Backend     # Verifica compilação TypeScript
├── 🔨 Build Frontend    # Verifica build React
├── 🚀 Deploy Backend    # Render (via API)
└── 🚀 Deploy Frontend   # Vercel (via GitHub Action)
```

**Gatilhos**: Push ou Pull Request na branch `main`

### ⚙️ Variáveis de Ambiente Configuradas

#### Backend (Render):

```env
DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
JWT_SECRET, GEMINI_API_KEY, GEMINI_MODEL_NAME
```

#### Frontend (Vercel):

```env
REACT_APP_API_URL=https://fintechx-backend.onrender.com/api
```

### 🔐 Secrets do GitHub Actions

| Secret | Finalidade |
|--------|------------|
| `RENDER_API_KEY` | Autenticação para deploy no Render |
| `RENDER_SERVICE_ID` | Identificação do serviço backend |
| `VERCEL_TOKEN` | Autenticação para deploy na Vercel |
| `VERCEL_ORG_ID` | Identificação da organização Vercel |
| `VERCEL_PROJECT_ID` | Identificação do projeto frontend |

### 📊 Estratégia de Deploy

Push na branch main → GitHub Actions → Testes → Build → Deploy Render + Vercel → ✅ Online


### 🎯 Decisões Técnicas

#### Escopo do Projeto

Baseado na descrição da tarefa no PDF _Development Assessment (Dev Front).pdf_, o foco principal é o **chatbot inteligente**. No entanto, para suportar uma experiência completa e realista, foram implementadas também:

- **Tela de Login** – permite que usuários existentes acessem o sistema
- **Tela de Registro** – permite criação de novas contas
- **Backend de Autenticação** – construído com **Clean Architecture**, garantindo separação de responsabilidades, testabilidade e facilidade de manutenção

#### Telas Não Implementadas

O Figma apresenta outras telas, como **Profile**, **Preferências**, **Alteração de Dados** e **Convite de Amigos** (Refer A Friend). Estas **não foram implementadas** pelos seguintes motivos:

1. **Fuga do escopo inicial** – O desafio proposto tem como foco principal o chatbot
2. **Informações insuficientes** – Não há especificações claras sobre:
   - Contratos de API para o backend
   - Comportamento esperado no frontend
   - Fluxos de dados e regras de negócio

Sem essas informações, a implementação seria baseada em suposições, o que poderia gerar inconsistências e retrabalho.

#### Segurança

A camada de segurança foi implementada **prioritariamente no frontend** utilizando:

- **DOMPurify** – Sanitização de HTML e prevenção de XSS
- **XSS library** – Proteção adicional contra injeção de scripts maliciosos
- **Validator** – Validação e sanitização de entradas (email, tamanho de strings)

**Decisão consciente:** Embora a segurança ideal deva existir em ambas as camadas, optou-se por focar no frontend porque:

- O backend implementa barreiras conhecidas (como CORS)
- O escopo do desafio é frontend
- A complexidade de implementar sanitização completa no backend fugiria ao tempo disponível

> ⚠️ **Nota:** Em um cenário de produção, a sanitização também deve ser aplicada no backend, utilizando ferramentas como `express-validator`.

✅ Status: Produção 🎉

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](https://license/) para mais detalhes.

## 👥 Autores

- Desenvolvedor - ****Alex Corrêa****

## 🙏 Agradecimentos

- (Google Gemini AI)[https://deepmind.google/technologies/gemini/] - Modelo de linguagem
- (Laborit Inc.)[https://deepmind.google/technologies/gemini/] - Desafio técnico

## 📞 Contato

Para dúvidas ou sugestões, entre em contato:

****Email****: alx.rcorrea@gmail.com

****GitHub****: (alex-correa-dev)[https://github.com/alex-correa-dev/]

_________________________

****Desenvolvido com 💙 por Alex Corrêa****
