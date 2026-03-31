/**
 * Auth Service
 * Service for authentication and authorization
 */

import { BaseService, UnauthorizedError, ValidationError } from './base.service';
import type { Credentials, AuthToken, User } from '@/types/commonTypeDefinition';
import { UserRole } from '@/types/commonTypeDefinition';

// Demo credentials for offline/development use
const DEMO_USERS: Array<{ username: string; password: string; user: User }> = [
  {
    username: 'demo',
    password: 'password',
    user: {
      userId: 1,
      username: 'demo',
      email: 'demo@edlink.com',
      firstName: 'Demo',
      lastName: 'User',
      role: UserRole.ADMIN,
      permissions: [],
      isActive: true,
      lastLoginDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
];

export class AuthService extends BaseService {
  protected serviceName = 'AuthService';

  /**
   * Login user
   */
  async login(credentials: Credentials): Promise<AuthToken & { user: User }> {
    try {
      this.validateRequired(
        { name: 'username', value: credentials.username },
        { name: 'password', value: credentials.password }
      );

      this.logInfo(`Login attempt for user: ${credentials.username}`);

      const match = DEMO_USERS.find(
        u => u.username === credentials.username && u.password === credentials.password
      );

      if (!match) {
        throw new UnauthorizedError('Invalid credentials');
      }

      const token = btoa(`${match.user.userId}:${Date.now()}`);
      return {
        token,
        refreshToken: btoa(`refresh:${token}`),
        expiresIn: 86400,
        tokenType: 'Bearer',
        user: match.user
      };
    } catch (error) {
      this.handleError(error, 'login');
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(token: string): Promise<void> {
    try {
      this.validateRequired({ name: 'token', value: token });

      // Placeholder for demonstration
      this.logInfo('User logged out');
    } catch (error) {
      this.handleError(error, 'logout');
      throw error;
    }
  }

  /**
   * Verify token
   */
  async verifyToken(token: string): Promise<User> {
    try {
      this.validateRequired({ name: 'token', value: token });

      // Placeholder for demonstration
      this.logInfo('Token verified');

      throw new UnauthorizedError('Invalid or expired token');
    } catch (error) {
      this.handleError(error, 'verifyToken');
      throw error;
    }
  }

  /**
   * Refresh token
   */
  async refreshToken(refreshToken: string): Promise<AuthToken> {
    try {
      this.validateRequired({ name: 'refreshToken', value: refreshToken });

      // Placeholder for demonstration
      this.logInfo('Token refreshed');

      throw new UnauthorizedError('Invalid refresh token');
    } catch (error) {
      this.handleError(error, 'refreshToken');
      throw error;
    }
  }

  /**
   * Check permission
   */
  async checkPermission(userId: number, permission: string): Promise<boolean> {
    try {
      this.validateRequired(
        { name: 'userId', value: userId },
        { name: 'permission', value: permission }
      );

      // Placeholder for demonstration
      this.logInfo(`Checking permission ${permission} for user ${userId}`);
      return false;
    } catch (error) {
      this.handleError(error, 'checkPermission');
      throw error;
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      this.validateRequired({ name: 'email', value: email });
      this.validateEmail(email);

      // Placeholder for demonstration
      this.logInfo(`Password reset requested for: ${email}`);
    } catch (error) {
      this.handleError(error, 'requestPasswordReset');
      throw error;
    }
  }

  /**
   * Reset password with token
   */
  async resetPasswordWithToken(resetToken: string, newPassword: string): Promise<void> {
    try {
      this.validateRequired(
        { name: 'resetToken', value: resetToken },
        { name: 'newPassword', value: newPassword }
      );

      if (newPassword.length < 8) {
        throw new ValidationError('Password must be at least 8 characters');
      }

      // Placeholder for demonstration
      this.logInfo('Password reset completed');
    } catch (error) {
      this.handleError(error, 'resetPasswordWithToken');
      throw error;
    }
  }
}

export const getAuthService = (): AuthService => {
  return new AuthService();
};
