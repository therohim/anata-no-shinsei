import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN } from '@src/environments';
import { User } from '@src/modules/user/schema/user.schema';
import { UserService } from '@src/modules/user/service/user.service';
import { AuthDto } from '../dto/auth.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { LoginDto } from '../dto/login.dto';
import { Tokens } from '../enum/tokens.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<{success: boolean; info: any }> {
    // check email
    const user: any = await this.userService.findUserByEmailOrUsername(dto.identity);
    if (!user) {
      return {success: false, info:"email or username not found"}
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatches) {
      return { success: false, info:"password not match"}
    }

    const tokens = await this.getTokens(user);

    const rtHash = await this.hashPassword(tokens.refresh_token);

    await this.userService.updateOne(user._id, { hashdRt: rtHash });

    const response : LoginResponseDto = {
      id: user._id,
      name: user.name,
      username: user.username,
      phone: user.phone,
      email: user.email,
      token: tokens
    }
    return { success: true, info: response}
  }

  async logout(userId: string): Promise<any> {
    // const userId2Object = new objectID
    return await this.userService.updateOne(userId, { hashdRt: null });
  }

  async refreshTokens(userId: string, rt: string): Promise<{success: boolean; info: any }> {
    const user = await this.userService.findById(userId);

    if (!user || !user.hashdRt) {
      return { success: false, info:'access danied'}
    }

    const rtMatches = await bcrypt.compare(rt, user.hashdRt);

    if (!rtMatches) {
      return { success: false, info:'access danied'}
    }

    const tokens = await this.getTokens(user);

    const rtHash = await this.hashPassword(tokens.refresh_token);

    await this.userService.updateOne(userId, { hashdRt: rtHash });

    return {success: true, info: tokens};
  }

  async register(dto: AuthDto): Promise<{success: boolean; info: any }> {
    // check email 
    const isEmail = await this.userService.findUserByEmail(dto.email)
    if (isEmail) {
      return {success: false, info:"email not available"}
    }

    // check username
    const isUsername = await this.userService.findUserByUsername(dto.username)
    if (isUsername) {
      return {success: false, info:"username not available"}
    }

    // find user
    const user: User = await this.userService.create(dto);
    return { success: true, info: user}
  }

  async generateTokens(user: any): Promise<Tokens> {
    const tokens = await this.getTokens(user);

    const rtHash = await this.hashPassword(tokens.refresh_token);

    await this.userService.updateOne(user._id, { hashdRt: rtHash });

    return tokens;
  }

  async getTokens(user: any) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user._id,
          email: user.email,
        },
        {
          secret: JWT_ACCESS_TOKEN,
          expiresIn: '24h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user._id,
          email: user.email,
        },
        {
          secret: JWT_REFRESH_TOKEN,
          expiresIn: '30d',
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async hashPassword(data: string) {
    return bcrypt.hash(data, 10);
  }
}
