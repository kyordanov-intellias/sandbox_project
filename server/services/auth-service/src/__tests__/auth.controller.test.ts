import { AuthController } from '../controllers/auth.controller';
import { userRepository } from '../repositories/user.repository';
import { rabbitMQService } from '../services/rabbitmq.service';
import { Context } from 'koa';
import jwt from 'jsonwebtoken';
import redis from '../../config/redis';

jest.mock('../repositories/user.repository');
jest.mock('../services/rabbitmq.service');
jest.mock('../../config/redis');
jest.mock('jsonwebtoken');

describe('AuthController', () => {
  let authController: AuthController;
  let mockCtx: Partial<Context>;

  beforeEach(() => {
    authController = new AuthController();
    jest.clearAllMocks();
    
    mockCtx = {
      request: {
        body: {} as Record<string, unknown>
      } as Context['request'],
      cookies: {
        get: jest.fn(),
        set: jest.fn(),
        secure: false,
        request: {} as unknown as Context['request'],
        response: {} as unknown as Context['response'],
      } as unknown as Context['cookies'],
      status: 0,
      body: {} as Record<string, unknown>,
    } as Partial<Context>;
  });

  describe('register', () => {
    const validRegisterData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      userRole: 'user',
      skills: [],
      contacts: [],
    };

    it('should successfully register a new user', async () => {
      const mockUser = {
        id: '1',
        email: validRegisterData.email,
        userRole: validRegisterData.userRole,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockedUserRepository = userRepository as jest.Mocked<typeof userRepository>;
      mockedUserRepository.validateRequestBody.mockReturnValue(null);
      mockedUserRepository.findByEmail.mockResolvedValue(null);
      mockedUserRepository.create.mockResolvedValue(mockUser);

      const mockedRabbitMQ = rabbitMQService as jest.Mocked<typeof rabbitMQService>;
      mockedRabbitMQ.publishUserCreated.mockResolvedValue(undefined);

      mockCtx.request!.body = validRegisterData;

      await authController.register(mockCtx as any);

      expect(mockCtx.status).toBe(201);
      expect(mockCtx.body).toHaveProperty('message', 'User registered successfully');
      expect(mockCtx.body).toEqual(expect.objectContaining({
        user: expect.objectContaining({
          id: mockUser.id,
          email: mockUser.email,
        }),
      }));
    });

    it('should return 400 if user already exists', async () => {
      const mockedUserRepository = userRepository as jest.Mocked<typeof userRepository>;
      mockedUserRepository.validateRequestBody.mockReturnValue(null);
      mockedUserRepository.findByEmail.mockResolvedValue({ id: 1 } as any);

      mockCtx.request!.body = validRegisterData;

      await authController.register(mockCtx as any);

      expect(mockCtx.status).toBe(400);
      expect(mockCtx.body).toEqual({ error: 'User already exists' });
    });

    it('should return 400 if required fields are empty', async () => {
      const emptyData = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        userRole: '',
        skills: [],
        contacts: [],
      };

      const mockedUserRepository = userRepository as jest.Mocked<typeof userRepository>;
      mockedUserRepository.validateRequestBody.mockReturnValue({ error: 'email is required and cannot be empty' });

      mockCtx.request!.body = emptyData;

      await authController.register(mockCtx as any);

      expect(mockCtx.status).toBe(400);
      expect(mockCtx.body).toEqual({ error: 'email is required and cannot be empty' });
    });
  });

  describe('login', () => {
    const validLoginData = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully login a user', async () => {
      const mockUser = {
        id: '1',
        email: validLoginData.email,
        password: 'hashedPassword',
        userRole: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockToken = 'mock-jwt-token';

      const mockedUserRepository = userRepository as jest.Mocked<typeof userRepository>;
      mockedUserRepository.validateRequestBody.mockReturnValue(null);
      mockedUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockedUserRepository.validatePassword.mockResolvedValue(true);

      (jwt.sign as jest.Mock).mockReturnValue(mockToken);
      (redis.set as jest.Mock).mockResolvedValue('OK');

      mockCtx.request!.body = validLoginData;

      await authController.login(mockCtx as any);

      expect(mockCtx.status).not.toBe(401);
      expect(mockCtx.body).toEqual({ token: mockToken });
      expect(redis.set).toHaveBeenCalled();
      expect(mockCtx.cookies?.set).toHaveBeenCalledWith(
        'authToken',
        mockToken,
        expect.any(Object)
      );
    });

    it('should return 401 for invalid password', async () => {
      const mockUser = {
        id: '1',
        email: validLoginData.email,
        password: 'hashedPassword',
        userRole: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockedUserRepository = userRepository as jest.Mocked<typeof userRepository>;
      mockedUserRepository.validateRequestBody.mockReturnValue(null);
      mockedUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockedUserRepository.validatePassword.mockResolvedValue(false);

      mockCtx.request!.body = validLoginData;

      await authController.login(mockCtx as any);

      expect(mockCtx.status).toBe(401);
      expect(mockCtx.body).toEqual({ error: 'Invalid password' });
    });

    it('should return 400 if required fields are empty', async () => {
      const emptyData = {
        email: '',
        password: '',
      };

      const mockedUserRepository = userRepository as jest.Mocked<typeof userRepository>;
      mockedUserRepository.validateRequestBody.mockReturnValue({ error: 'email is required and cannot be empty' });

      mockCtx.request!.body = emptyData;

      await authController.login(mockCtx as any);

      expect(mockCtx.status).toBe(400);
      expect(mockCtx.body).toEqual({ error: 'email is required and cannot be empty' });
    });
  });
});