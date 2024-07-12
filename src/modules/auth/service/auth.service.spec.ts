// auth.service.spec.ts
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@src/modules/user/service/user.service';
import * as bcrypt from 'bcrypt';
import { AuthDto } from '../dto/auth.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUser = {
    _id: "668ac95d3f456c4b24f19c21",
    name:'user mock',
    phone: "xxxx",
    country: "xxxx",
    province_state: "xxxx",
    address: "xxxx",
    email: "xxxx",
    username: "xxxx",
    password: "xxxx",
    gender: "xxxx",
    birthday: new Date(),
    horoscope: "xxxx",
    zodiac: "xxxx",
    height: 0,
    weight: 0,
    interests: ["tech", "business", "sport"],
    hashdRt: null,
    is_deleted:false,
    createdAt:new Date(),
    updatedAt: new Date(),
    deletedAt: null
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findUserByEmailOrUsername: jest.fn(),
            findById: jest.fn(),
            updateOne: jest.fn(),
            findUserByEmail: jest.fn(),
            findUserByUsername: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return success status is false if user not found', async () => {
      jest.spyOn(userService, 'findUserByEmailOrUsername').mockResolvedValue(null);

      const dto: LoginDto = { identity: 'userxxxx', password: 'password' };
      const result = await authService.login(dto);

      expect(result).toEqual({ success: false, info: 'email or username not found' });
    });

    it('should return success status false if password not match', async () => {
      jest.spyOn(userService, 'findUserByEmailOrUsername').mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      const dto: LoginDto = { identity: mockUser.email, password: mockUser.password };
      const result = await authService.login(dto);

      expect(result).toEqual({ success: false, info: 'password not match' });
    });

    it('should return success status is true if login is successful', async () => {
      const tokens = { access_token: 'at', refresh_token: 'rt' };
      jest.spyOn(userService, 'findUserByEmailOrUsername').mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(authService, 'getTokens').mockResolvedValue(tokens);
      jest.spyOn(authService, 'hashPassword').mockResolvedValue('hashedRt');
      jest.spyOn(userService, 'updateOne').mockResolvedValue(mockUser as any);

      const dto: LoginDto = { identity: mockUser.email, password: mockUser.password };
      const result = await authService.login(dto);

      const response: LoginResponseDto = {
        id: mockUser._id,
        name: mockUser.name,
        username: mockUser.username,
        phone: mockUser.phone,
        email: mockUser.email,
        token: tokens,
      };
      expect(result).toEqual({ success: true, info: response });
    });
  });

  describe('logout', () => {
    it('should return updated user if logout', async () => {
      jest.spyOn(userService, 'updateOne').mockResolvedValue(mockUser);

      const result = await authService.logout(mockUser._id);
      expect(result).toEqual(mockUser);
    });
  });

  describe('refreshTokens', () => {
    it('should return access denied if user not found or no hashed refresh token', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(null);

      const result = await authService.refreshTokens(mockUser._id, 'refreshToken');

      expect(result).toEqual({ success: false, info: 'access danied' });
    });

    it('should return access denied if refresh token does not match', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      const result = await authService.refreshTokens(mockUser._id, 'refreshToken');

      expect(result).toEqual({ success: false, info: 'access danied' });
    });

    it('should return new tokens if refresh token matches', async () => {
      const tokens = { access_token: 'at', refresh_token: 'rt' };
      mockUser.hashdRt = "xxxxxx"
      jest.spyOn(userService, 'findById').mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(authService, 'getTokens').mockResolvedValue(tokens);
      jest.spyOn(authService, 'hashPassword').mockResolvedValue('newHashedRt');
      jest.spyOn(userService, 'updateOne').mockResolvedValue(mockUser as any);

      const result = await authService.refreshTokens(mockUser._id, 'rt');
      console.log(result)

      expect(result).toEqual({ success: true, info: tokens });
    });
  });

  describe('register', () => {
    it('should return email not available if email is already registered', async () => {
      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(mockUser as any);

      const dto: AuthDto = { name:"userxxxxx", email: mockUser.email, username: mockUser.username, password: mockUser.password, re_password:mockUser.password };
      const result = await authService.register(dto);

      expect(result).toEqual({ success: false, info: 'email not available' });
    });

    it('should return username not available if username is already taken', async () => {
      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(null);
      jest.spyOn(userService, 'findUserByUsername').mockResolvedValue(mockUser as any);

      const dto: AuthDto = { name:"userxxxxx", email: mockUser.email, username: mockUser.username, password: mockUser.password, re_password:mockUser.password };
      const result = await authService.register(dto);

      expect(result).toEqual({ success: false, info: 'username not available' });
    });

    it('should return new created user if registration is successful', async () => {
      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(null);
      jest.spyOn(userService, 'findUserByUsername').mockResolvedValue(null);
      jest.spyOn(userService, 'create').mockResolvedValue(mockUser as any);

      const dto: AuthDto = { name:"userxxxxx", email: mockUser.email, username: mockUser.username, password: mockUser.password, re_password:mockUser.password };
      const result = await authService.register(dto);

      expect(result).toEqual({ success: true, info: mockUser });
    });
  });

  describe('generateTokens', () => {
    it('should return generated tokens and update hashed refresh token', async () => {
      const tokens = { access_token: 'at', refresh_token: 'rt' };
      jest.spyOn(authService, 'getTokens').mockResolvedValue(tokens);
      jest.spyOn(authService, 'hashPassword').mockResolvedValue('hashedRt');
      jest.spyOn(userService, 'updateOne').mockResolvedValue(mockUser as any);

      const result = await authService.generateTokens(mockUser);

      expect(result).toEqual(tokens);
      expect(userService.updateOne).toHaveBeenCalledWith(mockUser._id, { hashdRt: 'hashedRt' });
    });
  });

  describe('getTokens', () => {
    it('should return access and refresh tokens', async () => {
      const accessToken = 'access_token';
      const refreshToken = 'refresh_token';
      jest.spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce(accessToken)
        .mockResolvedValueOnce(refreshToken);

      const result = await authService.getTokens(mockUser as any);

      expect(result).toEqual({ access_token: accessToken, refresh_token: refreshToken });
    });
  });

  describe('hashPassword', () => {
    it('should return hashed password', async () => {
      const data = 'password';
      const hashed = 'hashedPassword';
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve(hashed));

      const result = await authService.hashPassword(data);

      expect(result).toEqual(hashed);
    });
  });
});
