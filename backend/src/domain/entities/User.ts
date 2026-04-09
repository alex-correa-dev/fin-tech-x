import { IUser, IUserResponse } from '../../shared/types';

export class User implements IUser {
  public readonly id: number;
  public readonly name: string;
  public readonly email: string;
  public readonly password: string;
  public readonly createdAt: Date;

  constructor(id: number, name: string, email: string, password: string, createdAt?: Date) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt || new Date();
  }

  public validate(): void {
    const errors: string[] = [];

    if (!this.name || this.name.length < 3) {
      errors.push('Nome deve ter no mínimo 3 caracteres');
    }

    if (!this.email || !this.email.includes('@')) {
      errors.push('E-mail inválido');
    }

    if (!this.password || this.password.length < 6) {
      errors.push('Senha deve ter no mínimo 6 caracteres');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }

  public toJSON(): IUserResponse {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt
    };
  }

  public static create(name: string, email: string, password: string): User {
    const user = new User(0, name, email, password);
    user.validate();
    return user;
  }
}