/**
 * Database Connection Service
 * Manages SQLite connection and Prisma ORM initialization
 * 
 * NOTE: This should be in the Electron main process, not in the Vue app
 * This is a stub to prevent build errors
 */

import { createLogger } from '@/utils/logger';

const logger = createLogger('DatabaseConnection');

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private initialized: boolean = false;

  private constructor() {
    logger.warn('Database connection initialized in frontend context - use IPC calls instead');
  }

  /**
   * Get singleton instance
   */
  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  /**
   * Initialize database connection
   * 
   * This is a stub - actual initialization should happen in Electron main process
   */
  async initialize(): Promise<void> {
    try {
      if (this.initialized) {
        logger.info('Database stub initialized');
        return;
      }

      logger.info('Database connection initialized (stub)');
      this.initialized = true;
    } catch (error) {
      logger.error('Database initialization failed', error);
      throw new Error(`Database initialization failed: ${(error as Error).message}`);
    }
  }

  /**
   * Check if database is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    try {
      logger.info('Database connection closed (stub)');
    } catch (error) {
      logger.error('Failed to close database', error);
    }
  }
}
