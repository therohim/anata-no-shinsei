import { HttpStatus } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ResponseService } from "@src/utils/response/service/response.service";
import { LoginDto } from "../dto/login.dto";
import { AuthService } from "../service/auth.service";
import { AuthController } from "./auth.controller";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "@src/modules/user/service/user.service";
import { UserRepository } from "@src/modules/user/repository/user.repostory";
import { AuthMockService } from "../service/auth.mock.service";
import { Tokens } from "../enum/tokens.enum";
import { LoginResponseDto } from "../dto/login-response.dto";

describe('AuthController', () => {
  let authController: AuthController
  let authService: AuthService
  let responseService: ResponseService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers:[
        {provide:AuthService, useClass: AuthMockService},
        ResponseService,
        // JwtService,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    responseService = module.get<ResponseService>(ResponseService);
  });

  describe('login', () => {
    it('should return response bad request and success status is false', async () => {
      const dto: LoginDto = { identity: "userxxx", password: "passwordxxx" };

      // const tokens : Tokens = {
      //   access_token:"accessexxx",
      //   refresh_token:"refreshexxx"
      // }
      // const response: LoginResponseDto = {
      //   id: "idx",
      //   name: "namex",
      //   username: "userxxx",
      //   phone: "92103813",
      //   email: "emailiex@gmail.com",
      //   token: tokens,
      // };
      const mockResponseDto = responseService.error('Request failed', HttpStatus.BAD_REQUEST);

      jest.spyOn(authService, 'login').mockResolvedValue(responseService.error('Request failed', HttpStatus.BAD_REQUEST) as any);

      const result = await authController.login(dto)

      expect(result).toEqual(mockResponseDto)
    });

    // it('should return response success and generate token', async () => {
    //   const dto: LoginDto = { identity: "userxxx", password: "passwordxxx" };

    //   const tokenns : Tokens = {
    //     access_token:"accessexxx",
    //     refresh_token:"refreshxxx"
    //   }
    //   const response : LoginResponseDto = {
    //     id: "668ac95d3f456c4b24f19c21",
    //     name:'user mock',
    //     phone: "xxxx",
    //     email: "xxxx",
    //     username: "xxxx",
    //     token: tokenns
    //   }
    //   const mockResponseDto = responseService.success(response);

    //   jest.spyOn(authService, 'login').mockResolvedValue(responseService.success(response) as any);

    //   const result = await authController.login(dto)
    //   console.log(result)
    //   console.log(mockResponseDto)

    //   expect(result).toEqual(mockResponseDto)
    // });
  });
});