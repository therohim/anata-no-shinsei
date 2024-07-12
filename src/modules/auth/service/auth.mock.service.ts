import { Injectable } from '@nestjs/common';
import { LoginResponseDto } from '../dto/login-response.dto';
import { Tokens } from '../enum/tokens.enum';

@Injectable()
export class AuthMockService {
  async login(username: string, password: string): Promise<any> {
    if (username === 'userxxx' && password === 'passwordxxx') {
      const tokenns : Tokens = {
        access_token:"accessexxx",
        refresh_token:"refreshxxx"
      }
      const response : LoginResponseDto = {
        id: "668ac95d3f456c4b24f19c21",
        name:'user mock',
        phone: "xxxx",
        email: "xxxx",
        username: "xxxx",
        token: tokenns
      }
      return { success: true, info:response };
    } else {
      return { success: false, info: 'Invalid credentials' };
    }
  }
}
