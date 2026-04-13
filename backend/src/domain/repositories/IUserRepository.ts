import { User } from '../entities/User';

export interface IUserRepository {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  update(user: User): Promise<User>;
  delete(id: number): Promise<void>;
  exists(email: string): Promise<boolean>;
}
