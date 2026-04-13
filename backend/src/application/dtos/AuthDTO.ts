export class RegisterDTO {
  public readonly name: string;
  public readonly email: string;
  public readonly password: string;

  constructor(data: { name: string; email: string; password: string }) {
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
  }

  validate(): void {
    const errors: string[] = [];

    if (!this.name) {
      errors.push('Nome é obrigatório');
    }
    if (this.name && this.name.length < 3) {
      errors.push('Nome deve ter no mínimo 3 caracteres');
    }
    if (!this.email) {
      errors.push('E-mail é obrigatório');
    }
    if (this.email && !this.email.includes('@')) {
      errors.push('E-mail inválido');
    }
    if (!this.password) {
      errors.push('Senha é obrigatória');
    }
    if (this.password && this.password.length < 6) {
      errors.push('Senha deve ter no mínimo 6 caracteres');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }
}

export class LoginDTO {
  public readonly email: string;
  public readonly password: string;

  constructor(data: { email: string; password: string }) {
    this.email = data.email;
    this.password = data.password;
  }

  validate(): void {
    if (!this.email || !this.password) {
      throw new Error('E-mail e senha são obrigatórios');
    }
  }
}
