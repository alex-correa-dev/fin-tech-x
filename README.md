
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

### 🏗️ Arquitetura

O projeto segue os princípios da **Clean Architecture**, garantindo:
- **Separação de responsabilidades** entre domínio, aplicação e infraestrutura
- **Independência de frameworks** (trocar Express por Fastify é fácil)
- **Independência de banco de dados** (trocar PostgreSQL por MongoDB é simples)
- **Testabilidade** total de todas as camadas
- **Código tipo-safety** com TypeScript

```
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
| Google Gemini AI | 1.5 Flash | Modelo de linguagem |
| Jest | 29.x | Testes unitários |

### Frontend
| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| React | 18.x | Biblioteca UI |
| TypeScript | 5.x | Tipagem estática |
| SCSS | 1.x | Estilização modular |
| React Router DOM | 6.x | Roteamento |

### Ferramentas de Desenvolvimento
- **Nodemon** - Hot-reload durante desenvolvimento
- **TS-Node** - Execução direta de TypeScript
- **Jest** - Testes unitários e coverage
- **ESLint** - Linting (opcional)

## 📁 Estrutura do Projeto

```
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
│ │ │ ├── Login/
│ │ │ ├── Register/
│ │ │ ├── Dashboard/
│ │ │ ├── ChatInterface/
│ │ │ └── Message/
│ │ ├── services/ # API e Auth services
│ │ ├── types/ # Tipos TypeScript
│ │ ├── styles/ # Variáveis e estilos globais SCSS
│ │ ├── App.tsx
│ │ └── index.tsx
│ ├── public/
│ ├── .env # Variáveis de ambiente
│ ├── tsconfig.json
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
🤖 IA Provider: gemini-1.5-flash
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

#### Executar todos os testes

```bash
cd backend
npm test
```

### Executar testes em modo watch

```bash
npm run test:watch
```

### Executar com coverage

```bash
npm run test:coverage
```

### Executar teste específico

```bash
npm test -- User.spec.ts
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

Os testes cobrem:

- ✅ Domain Entities - Validações e regras de negócio
- ✅ Use Cases - Fluxos principais (registro, login, chat)
- ✅ DTOs - Validações de dados
- ✅ Security Services - JWT, Bcrypt
- ✅ Repositories - Operações de banco (com mocks)
- ✅ AI Provider - Integração com Gemini

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

### Por que Clean Architecture?

- ****Separação clara de responsabilidades****
- ****Independência de frameworks e bibliotecas****
- ****Facilidade para trocar implementações**** (ex: PostgreSQL → MongoDB)
- ****Testabilidade máxima**** (cada camada pode ser testada isoladamente)
- ****Código mais expressivo e autodocumentado****

### Por que Google Gemini AI?

- ****Gratuito**** para desenvolvimento (tier generoso)
- ****Sem necessidade de cartão de crédito**** para começar
- ****Modelo Flash rápido e eficiente**** para chat
- ****Contexto de 1M tokens**** (muito maior que concorrentes)
- ****Facilidade de implementação****

### Por que TypeScript?

- ****Type safety**** reduz erros em produção
- ****Melhor experiência de desenvolvimento**** (autocomplete, refatoração)
- ****Código auto-documentado****
- ****Facilita manutenção em equipe****

### Por que SCSS Modular?

- ****Estilos encapsulados por componente****
- ****Variáveis globais reutilizáveis****
- ****Animações e responsividade integradas****
- ****Manutenção mais fácil que CSS puro****

### Por que testes colaterais (ao lado do código)?

- ****Facilita encontrar o teste (mesma pasta que o arquivo)****
- ****Importação mais simples (caminhos relativos)****
- ****Remove arquivos de teste no mesmo commit que o código****
- ****Prática recomendada pelo Jest****

## 🔄 Fluxo de Dados

```text
1. Usuário acessa frontend (React)
2. Faz login/registro → Backend (JWT)
3. Acessa chat autenticado
4. Envia pergunta → Backend
5. Backend chama Gemini AI (com contexto da FinTechX)
6. Resposta é salva no PostgreSQL
7. Frontend exibe resposta estilo ChatGPT
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

TODO

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
