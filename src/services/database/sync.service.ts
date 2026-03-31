/**
 * Sync Service
 * Manages synchronization between local and remote database
 * 
 * NOTE: This service should be moved to the Electron main process
 * For now, it's a placeholder for IPC-based sync
 */

import { createLogger } from '@/utils/logger';
import axios, { AxiosInstance } from 'axios';

const logger = createLogger('SyncService');

export interface SyncConfig {
  apiBaseUrl: string;
  syncIntervalMs: number;
  retryAttempts: number;
  retryDelayMs: number;
  batchSize: number;
}

export interface SyncResult {
  success: boolean;
  recordsSynced?: number;
  failures?: Array<{ id: string; error: string }>;
  message?: string;
}

export class SyncService {
  private apiClient: AxiosInstance;
  private config: SyncConfig;
  private syncInProgress: boolean = false;
  private syncTimer: NodeJS.Timeout | null = null;

  constructor(config: SyncConfig) {
    this.config = config;

    this.apiClient = axios.create({
      baseURL: config.apiBaseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Start auto sync
   */
  startAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }

    this.performSync();

    this.syncTimer = setInterval(() => {
      if (navigator.onLine) {
        this.performSync();
      }
    }, this.config.syncIntervalMs);

    logger.info('Auto sync started');
  }

  /**
   * Stop auto sync
   */
  stopAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
    logger.info('Auto sync stopped');
  }

  /**
   * Perform sync operation
   */
  async performSync(): Promise<SyncResult> {
    if (this.syncInProgress) {
      logger.info('Sync already in progress');
      return { success: false, message: 'Sync already in progress' };
    }

    this.syncInProgress = true;
    const startTime = Date.now();
    let result: SyncResult = { success: true, recordsSynced: 0, failures: [] };

    try {
      logger.info('Starting sync operation...');

      // Get last sync metadata
      const metadata = await this.getSyncMetadata();
      const lastSyncTime = metadata?.lastSyncTime || new Date(0);

      // Sync outgoing changes
      const outgoingResult = await this.syncOutgoingChanges(lastSyncTime);
      result.recordsSynced = (result.recordsSynced || 0) + outgoingResult.synced;
      result.failures?.push(...outgoingResult.failures);

      // Sync incoming changes
      const incomingResult = await this.syncIncomingChanges(lastSyncTime);
      result.recordsSynced = (result.recordsSynced || 0) + incomingResult.synced;
      result.failures?.push(...incomingResult.failures);

      // Update metadata
      await this.updateSyncMetadata(
        true,
        result.recordsSynced || 0,
        (result.failures?.length || 0)
      );

      const duration = Date.now() - startTime;
      logger.info(`Sync completed in ${duration}ms. Records: ${result.recordsSynced}, Failures: ${result.failures?.length || 0}`);

      return result;
    } catch (error) {
      logger.error('Sync failed', error);
      await this.updateSyncMetadata(false, 0, 1);
      result.success = false;
      result.message = (error as Error).message;
      return result;
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Sync outgoing changes
   */
  private async syncOutgoingChanges(
    since: Date
  ): Promise<{ synced: number; failures: Array<{ id: string; error: string }> }> {
    const result = { synced: 0, failures: [] };

    try {
      const pendingOps = await this.prisma.syncOperation.findMany({
        where: {
          syncStatus: 'PENDING',
          createdAt: {
            gte: since
          }
        },
        orderBy: { createdAt: 'asc' },
        take: this.config.batchSize
      });

      logger.info(`Found ${pendingOps.length} pending sync operations`);

      for (const operation of pendingOps) {
        try {
          const payload = {
            operationType: operation.operationType,
            entityType: operation.entityType,
            entityId: operation.entityId,
            entityData: JSON.parse(operation.entityData),
            timestamp: operation.createdAt
          };

          await this.apiClient.post('/sync/apply', payload);

          await this.prisma.syncOperation.update({
            where: { id: operation.id },
            data: {
              syncStatus: 'SYNCED',
              syncedAt: new Date(),
              retryCount: 0
            }
          });

          result.synced++;
          logger.info(`Synced: ${operation.entityType} ${operation.entityId}`);
        } catch (error) {
          const errorMsg = (error as Error).message;
          result.failures.push({ id: operation.entityId, error: errorMsg });

          const retryCount = operation.retryCount + 1;
          if (retryCount < this.config.retryAttempts) {
            await this.prisma.syncOperation.update({
              where: { id: operation.id },
              data: {
                retryCount,
                errorMessage: errorMsg,
                updatedAt: new Date()
              }
            });
          } else {
            await this.prisma.syncOperation.update({
              where: { id: operation.id },
              data: {
                syncStatus: 'FAILED',
                errorMessage: `Max retries exceeded: ${errorMsg}`
              }
            });
          }

          logger.error(`Failed to sync: ${operation.entityType} ${operation.entityId}`, error);
        }
      }

      return result;
    } catch (error) {
      logger.error('Failed to sync outgoing changes', error);
      return result;
    }
  }

  /**
   * Sync incoming changes
   */
  private async syncIncomingChanges(
    since: Date
  ): Promise<{ synced: number; failures: Array<{ id: string; error: string }> }> {
    const result = { synced: 0, failures: [] };

    try {
      const response = await this.apiClient.post('/sync/delta', {
        since: since.toISOString()
      });

      const changes = response.data?.changes || [];
      logger.info(`Received ${changes.length} incoming changes`);

      for (let i = 0; i < changes.length; i += this.config.batchSize) {
        const batch = changes.slice(i, i + this.config.batchSize);

        try {
          await this.applyIncomingBatch(batch);
          result.synced += batch.length;
        } catch (error) {
          for (const change of batch) {
            result.failures.push({
              id: change.entityId,
              error: (error as Error).message
            });
          }
        }
      }

      return result;
    } catch (error) {
      logger.error('Failed to sync incoming changes', error);
      return result;
    }
  }

  /**
   * Apply incoming batch
   */
  private async applyIncomingBatch(changes: any[]): Promise<void> {
    await DatabaseConnection.getInstance().transaction(async (priisma) => {
      for (const change of changes) {
        try {
          switch (change.entityType) {
            case 'ActionRequest':
              await this.prisma.actionRequest.upsert({
                where: { actionRequestId: change.entityData.actionRequestId },
                create: change.entityData,
                update: {
                  ...change.entityData,
                  updatedAt: new Date(),
                  syncedAt: new Date()
                }
              });
              break;

            case 'InspectionScheduling':
              await this.prisma.inspectionScheduling.upsert({
                where: { allInspectionSchedulingId: change.entityData.allInspectionSchedulingId },
                create: change.entityData,
                update: {
                  ...change.entityData,
                  updatedAt: new Date(),
                  syncedAt: new Date()
                }
              });
              break;

            case 'ActionItem':
              await this.prisma.actionItem.upsert({
                where: { actionItemId: change.entityData.actionItemId },
                create: change.entityData,
                update: {
                  ...change.entityData,
                  updatedAt: new Date(),
                  syncedAt: new Date()
                }
              });
              break;
          }

          logger.info(`Applied change: ${change.entityType} ${change.entityId}`);
        } catch (error) {
          logger.error(`Failed to apply change ${change.entityId}`, error);
          throw error;
        }
      }
    });
  }

  /**
   * Get sync metadata
   */
  private async getSyncMetadata(): Promise<any> {
    try {
      return await this.prisma.syncMetadata.findFirst();
    } catch {
      return null;
    }
  }

  /**
   * Update sync metadata
   */
  private async updateSyncMetadata(
    success: boolean,
    recordsSynced: number,
    failures: number
  ): Promise<void> {
    try {
      const existing = await this.prisma.syncMetadata.findFirst();

      if (existing) {
        await this.prisma.syncMetadata.update({
          where: { id: existing.id },
          data: {
            lastSyncTime: new Date(),
            lastSyncStatus: success ? 'SUCCESS' : 'FAILED',
            totalRecordsSynced: existing.totalRecordsSynced + recordsSynced,
            totalFailures: existing.totalFailures + failures,
            updatedAt: new Date()
          }
        });
      } else {
        await this.prisma.syncMetadata.create({
          data: {
            lastSyncTime: new Date(),
            lastSyncStatus: success ? 'SUCCESS' : 'FAILED',
            totalRecordsSynced: recordsSynced,
            totalFailures: failures
          }
        });
      }
    } catch (error) {
      logger.error('Failed to update sync metadata', error);
    }
  }
}

export const getSyncService = (config: SyncConfig): SyncService => {
  return new SyncService(config);
};
