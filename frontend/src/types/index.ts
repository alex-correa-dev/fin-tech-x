export interface IUser {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface IAuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: IUser;
    token: string;
  };
  error?: string;
}

export interface IChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface IChatResponse {
  success: boolean;
  data?: {
    answer: string;
    timestamp: string;
    model: string;
  };
  error?: string;
}

export interface IApiError {
  success: false;
  error: string;
}

export interface IRegisterData {
  name: string;
  email: string;
  password: string;
}

export interface ILoginData {
  email: string;
  password: string;
}
