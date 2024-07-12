import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards
} from '@nestjs/common';
import { AtGuard, GetCurrentUser, GetCurrentUserId, Public, RtGuard } from '@src/common';
import { ResponseService } from '@src/utils/response/service/response.service';
import { AuthDto } from '../dto/auth.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthService } from '../service/auth.service';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private responseService: ResponseService) {}

  @Public()
  @Post('/login')
  async login(@Body() dto: LoginDto) {
    const login = await this.authService.login(dto);
    if (!login.success) {
      return this.responseService.error(login.info, HttpStatus.BAD_REQUEST)
    }
    // res.cookie('access_cookies', login.info.token.access_token, {
    //   httpOnly: true,
    //   expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    //   path: '/',
    //   sameSite: 'none',
    //   secure: true,
    // });
    return this.responseService.success(login.info)
  }

  @Public()
  @Post('/register')
  async register(@Body() dto: AuthDto): Promise<any> {
    const register = await this.authService.register(dto)
    if (!register.success) {
      return this.responseService.error(register.info, HttpStatus.BAD_REQUEST)
    }

    const token = await this.authService.generateTokens(register.success)
    
    const response : LoginResponseDto = {
      id: register.info._id,
      name: register.info.name,
      username: register.info.username,
      phone: register.info.phone,
      email: register.info.email,
      token: token
    }
    return this.responseService.success(response)
  }

  @Get('/logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async logout(@GetCurrentUserId() userId: string) {
    const result = await this.authService.logout(userId);
    if (!result) {
      return this.responseService.error("logout failed", HttpStatus.BAD_REQUEST)
    }
    return this.responseService.success(null, "logout success")
  }

  @Public()
  @UseGuards(RtGuard)
  @Get('/refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUser('refreshToken') refreshToken: string,
    @GetCurrentUserId() userId: string,
  ) {
    const result = await this.authService.refreshTokens(userId, refreshToken)
    if (!result.success) {
      return this.responseService.error(result.info, HttpStatus.BAD_REQUEST)
    }
    return this.responseService.success(result.info)
  }
}
