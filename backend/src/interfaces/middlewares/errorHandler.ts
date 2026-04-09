import { Request, Response, NextFunction } from 'express';
import { IApiResponse } from '../../shared/types';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);

  const response: IApiResponse<null> = {
    success: false,
    error: err.message
  };

  if (err.message.includes('obrigatório') || err.message.includes('inválido')) {
    res.status(400).json(response);
    return;
  }

  if (err.message.includes('Credenciais') || err.message.includes('Token')) {
    res.status(401).json(response);
    return;
  }

  response.error = 'Erro interno do servidor';
  res.status(500).json(response);
};