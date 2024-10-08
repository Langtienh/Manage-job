import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { IUser } from './users.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && this.usersService.checkPassword(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      id: user._id,
      email: user.email,
      username: user.username,
      status: user.status,
      role: user.role
    };
    return {
      result: {
        accessToken: this.jwtService.sign(payload),
        refreshToken: this.jwtService.sign(
          { id: user._id },
          {
            expiresIn: this.configService.get<string>(
              'JWT_REFRESH_TOKEN_EXPIRES'
            )
          }
        )
      }
    };
  }
}
