/**
 * Base Service
 * Abstract base class for all services
 */

import { createLogger } from '@/utils/logger';

const logger = createLogger('BaseService');

export abstract class BaseService {
  protected serviceName: string = 'BaseService';

  constructor() {
    // Base service initialization
  }

  /**
   * Log informational message
   */
  protected logInfo(message: string, data?: any): void {
    logger.info(`[${this.serviceName}] ${message}`, data);
  }

  /**
   * Log error message
   */
  protected logError(message: string, error?: any): void {
    logger.error(`[${this.serviceName}] ${message}`, error);
  }

  /**
   * Handle service errors
   */
  protected handleError(error: any, context: string): void {
    this.logError(`Error in ${context}`, error);
    throw new ServiceError(error.message || 'An unexpected error occurred', context);
  }

  /**
   * Make HTTP GET request
   */
  protected async get<T>(url: string, options?: any): Promise<{ data: T }> {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      this.handleError(error, 'GET request');
      throw error;
    }
  }

  /**
   * Make HTTP POST request
   */
  protected async post<T>(url: string, payload: any, options?: any): Promise<{ data: T }> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        },
        body: JSON.stringify(payload),
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      this.handleError(error, 'POST request');
      throw error;
    }
  }

  /**
   * Make HTTP PUT request
   */
  protected async put<T>(url: string, payload: any, options?: any): Promise<{ data: T }> {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        },
        body: JSON.stringify(payload),
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      this.handleError(error, 'PUT request');
      throw error;
    }
  }

  /**
   * Make HTTP DELETE request
   */
  protected async delete<T>(url: string, options?: any): Promise<{ data: T }> {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      this.handleError(error, 'DELETE request');
      throw error;
    }
  }

  /**
   * Validate required fields
   */
  protected validateRequired(...fields: { name: string; value: any }[]): void {
    const missingFields = fields.filter(f => !f.value);
    if (missingFields.length > 0) {
      throw new ValidationError(
        `Missing required fields: ${missingFields.map(f => f.name).join(', ')}`
      );
    }
  }

  /**
   * Validate field length
   */
  protected validateLength(value: string, minLength: number, maxLength: number, fieldName: string): void {
    if (value.length < minLength || value.length > maxLength) {
      throw new ValidationError(
        `${fieldName} must be between ${minLength} and ${maxLength} characters`
      );
    }
  }

  /**
   * Validate email format
   */
  protected validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Invalid email format');
    }
  }

  /**
   * Validate date
   */
  protected validateDate(date: Date, fieldName: string): void {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new ValidationError(`${fieldName} must be a valid date`);
    }
  }

  /**
   * Validate enum value
   */
  protected validateEnum(value: any, enumObj: any, fieldName: string): void {
    if (!Object.values(enumObj).includes(value)) {
      throw new ValidationError(
        `${fieldName} must be one of: ${Object.values(enumObj).join(', ')}`
      );
    }
  }
}

/**
 * Custom Service Error
 */
export class ServiceError extends Error {
  constructor(
    message: string,
    public context: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

/**
 * Custom Validation Error
 */
export class ValidationError extends Error {
  constructor(message: string, public statusCode: number = 400) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Custom Not Found Error
 */
export class NotFoundError extends Error {
  constructor(resource: string, id?: any) {
    super(`${resource}${id ? ` with ID ${id}` : ''} not found`);
    this.name = 'NotFoundError';
  }
}

/**
 * Custom Conflict Error
 */
export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

/**
 * Custom Unauthorized Error
 */
export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized access') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}
