import bcrypt from 'bcryptjs';
import { AppDataSource } from '@/config/database';
import { User } from '@/models/User';
import { JwtUtils, JwtPayload } from '@/utils/jwt';
import { logger } from '@/utils/logger';
import { i18n } from '@/utils/i18n';
import { createError } from '@/middleware/errorHandler';
import { CreateUserInput, LoginUserInput } from '@/types/validation';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async register(userData: CreateUserInput): Promise<{ user: Omit<User, 'password'>; token: string }> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: userData.email }
      });

      if (existingUser) {
        throw createError(i18n.t('auth.email_exists'), 409, 'EMAIL_EXISTS');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Create user
      const user = this.userRepository.create({
        ...userData,
        password: hashedPassword
      });

      const savedUser = await this.userRepository.save(user);

      // Generate JWT token
      const payload: JwtPayload = {
        userId: savedUser.id,
        email: savedUser.email
      };

      const token = JwtUtils.generateToken(payload);

      // Remove password from response
      const { password, ...userWithoutPassword } = savedUser;

      logger.info('User registered successfully', { userId: savedUser.id, email: savedUser.email });

      return { user: userWithoutPassword, token };
    } catch (error) {
      logger.error('Registration error', { error, email: userData.email });
      throw error;
    }
  }

  async login(loginData: LoginUserInput): Promise<{ user: Omit<User, 'password'>; token: string }> {
    try {
      // Find user by email
      const user = await this.userRepository.findOne({
        where: { email: loginData.email }
      });

      if (!user) {
        throw createError(i18n.t('auth.invalid_credentials'), 401, 'INVALID_CREDENTIALS');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(loginData.password, user.password);

      if (!isPasswordValid) {
        throw createError(i18n.t('auth.invalid_credentials'), 401, 'INVALID_CREDENTIALS');
      }

      // Generate JWT token
      const payload: JwtPayload = {
        userId: user.id,
        email: user.email
      };

      const token = JwtUtils.generateToken(payload);

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      logger.info('User logged in successfully', { userId: user.id, email: user.email });

      return { user: userWithoutPassword, token };
    } catch (error) {
      logger.error('Login error', { error, email: loginData.email });
      throw error;
    }
  }

  async getUserById(userId: string): Promise<Omit<User, 'password'> | null> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId }
      });

      if (!user) {
        return null;
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      logger.error('Get user by ID error', { error, userId });
      throw createError(i18n.t('server.internal_error'), 500, 'GET_USER_ERROR');
    }
  }
}
