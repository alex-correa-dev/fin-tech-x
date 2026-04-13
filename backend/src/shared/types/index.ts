export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface IUserResponse {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

export interface IChatMessage {
  id: number;
  userId: number;
  question: string;
  answer: string;
  createdAt: Date;
}

export interface ITokenPayload {
  userId: number;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

export interface IApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface IAuthResponse {
  user: IUserResponse;
  token: string;
}

export interface IChatResponse {
  answer: string;
  timestamp: string;
  model: string;
}

export interface IChatHistoryResponse {
  id: number;
  question: string;
  answer: string;
  timestamp: Date;
}
