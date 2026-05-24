import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import type { JwtPayload, SafeUser } from '../../utils/types';
import { AuthRepository } from './auth.repository';
import type { LoginDto } from './dto/login.dto';
import type { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async signup(dto: SignupDto): Promise<SafeUser> {
    const exists = await this.authRepository.emailExists(dto.email);
    if (exists) {
      throw new BadRequestException(
        'An account with this email already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.authRepository.create(
      dto.name,
      dto.email,
      hashedPassword,
      dto.role,
    );
  }

  async login(dto: LoginDto): Promise<{ token: string; user: SafeUser }> {
    const user = await this.authRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: JwtPayload = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not configured');

    const token = jwt.sign(payload, secret, { expiresIn: '7d' });

    const { password: _, ...safeUser } = user;
    void _;
    return { token, user: safeUser };
  }
}
