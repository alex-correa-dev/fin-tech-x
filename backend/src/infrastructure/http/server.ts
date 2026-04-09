import express, { Application, Response } from 'express';
import cors from 'cors';
import config from '../../config/env';

import { PostgresDatabase } from '../database/PostgresDatabase';
import { PostgresUserRepository } from '../repositories/PostgresUserRepository';
import { PostgresChatRepository } from '../repositories/PostgresChatRepository';
import { BcryptService } from '../security/BcryptService';
import { JWTService } from '../security/JWTService';
import { AIProviderFactory } from '../ai/AIProviderFactory';

import { RegisterUserUseCase } from '../../domain/usecases/auth/RegisterUserUseCase';
import { LoginUserUseCase } from '../../domain/usecases/auth/LoginUserUseCase';
import { AskQuestionUseCase } from '../../domain/usecases/chat/AskQuestionUseCase';
import { GetChatHistoryUseCase } from '../../domain/usecases/chat/GetChatHistoryUseCase';

import { AuthController } from '../../interfaces/controllers/AuthController';
import { ChatController } from '../../interfaces/controllers/ChatController';

import { authMiddleware } from '../../interfaces/middlewares/authMiddleware';
import { errorHandler } from '../../interfaces/middlewares/errorHandler';

import { authRoutes } from './routes/authRoutes';
import { chatRoutes } from './routes/chatRoutes';

const SYSTEM_PROMPT = `Você é um assistente virtual especialista da FinTechX, uma empresa líder no setor financeiro. 
Você deve responder perguntas de clientes de forma amigável, profissional e personalizada.

INFORMAÇÕES OFICIAIS DA FINTECHX:
- Horários de atendimento: Segunda a sexta das 9h às 18h, sábados das 9h às 13h (horário de Brasília)
- Escritórios: São Paulo (Av. Paulista, 1000) e Rio de Janeiro (Av. Rio Branco, 156)
- Fundadores: Ana Silva e Carlos Mendes, fundada em 2020
- Segurança de dados: Criptografia ponta a ponta, autenticação em dois fatores, conformidade com LGPD
- E-mails suspeitos: Encaminhar para segurança@fintechx.com, nunca clicar em links suspeitos
- Educação financeira: Blog (blog.fintechx.com), webinars semanais, curso gratuito "Investindo do Zero"
- Promoções: Cadastrar na newsletter do site ou ativar notificações no app

REGRAS:
1. Seja sempre educado e atencioso
2. Personalize a resposta usando o nome do cliente quando disponível
3. Se não souber algo, ofereça contato com suporte humano
4. Mantenha respostas concisas mas completas (máximo 3-4 parágrafos)
5. Sempre ofereça ajuda adicional no final
6. Use emojis ocasionalmente para tornar a conversa mais amigável`;

class Server {
  private app: Application;
  private database: PostgresDatabase;

  constructor() {
    this.app = express();
    this.database = new PostgresDatabase();
  }

  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private async setupDependencies() {
    await this.database.connect();

    const userRepository = new PostgresUserRepository(this.database);
    const chatRepository = new PostgresChatRepository(this.database);

    const hashService = new BcryptService();
    const tokenService = new JWTService(config.jwt.secret, config.jwt.expiresIn);
    const aiProvider = AIProviderFactory.create({
      type: 'gemini',
      apiKey: config.ai.apiKey,
      modelName: config.ai.modelName
    });

    const registerUseCase = new RegisterUserUseCase(userRepository, {
      hashPassword: (pwd: string) => hashService.hash(pwd),
      comparePassword: (pwd: string, hash: string) => hashService.compare(pwd, hash),
      generateToken: (payload: any) => tokenService.generateToken(payload),
      verifyToken: (token: string) => tokenService.verifyToken(token)
    });

    const loginUseCase = new LoginUserUseCase(userRepository, {
      hashPassword: (pwd: string) => hashService.hash(pwd),
      comparePassword: (pwd: string, hash: string) => hashService.compare(pwd, hash),
      generateToken: (payload: any) => tokenService.generateToken(payload),
      verifyToken: (token: string) => tokenService.verifyToken(token)
    });

    const askQuestionUseCase = new AskQuestionUseCase(chatRepository, aiProvider, SYSTEM_PROMPT);
    const getHistoryUseCase = new GetChatHistoryUseCase(chatRepository);

    const authController = new AuthController(registerUseCase, loginUseCase);
    const chatController = new ChatController(askQuestionUseCase, getHistoryUseCase);

    return { authController, chatController, tokenService };
  }

  private setupRoutes(authController: AuthController, chatController: ChatController, tokenService: JWTService): void {
    this.app.use('/api/auth', authRoutes(authController));
    this.app.use('/api/chat', authMiddleware(tokenService), chatRoutes(chatController));

    this.app.get('/health', (res: Response) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
  }

  async start(): Promise<void> {
    try {
      this.setupMiddleware();
      const { authController, chatController, tokenService } = await this.setupDependencies();
      this.setupRoutes(authController, chatController, tokenService);
      this.app.use(errorHandler);

      const PORT = config.server.port;
      this.app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
        console.log(`📝 Ambiente: ${config.server.env}`);
        console.log(`🤖 IA Provider: ${config.ai.modelName}`);
      });
    } catch (error) {
      console.error('❌ Erro ao iniciar servidor:', error);
      process.exit(1);
    }
  }
}

const server = new Server();
server.start();