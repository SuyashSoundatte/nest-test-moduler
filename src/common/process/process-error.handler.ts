import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ProcessErrorHandler implements OnModuleInit {
  private readonly logger = new Logger(ProcessErrorHandler.name);
  
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.initialize();
  }

  private initialize(): void {
    // Catch uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      this.handleUncaughtException(error);
    });

    // Catch unhandled promise rejections
    process.on('unhandledRejection', (reason: any) => {
      this.handleUnhandledRejection(reason);
    });

    // Detect memory leaks
    process.on('warning', (warning: Error) => {
      if (warning.name === 'MaxListenersExceededWarning') {
        this.logger.error('⚠️  MEMORY LEAK DETECTED', warning);
        this.sendCriticalAlert('MEMORY_LEAK', warning);
      }
    });

    // Graceful shutdown
    process.on('SIGTERM', () => this.gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => this.gracefulShutdown('SIGINT'));
  }

  private handleUncaughtException(error: Error): void {
    this.logger.error('💥 UNCAUGHT EXCEPTION', {
      error: error.message,
      stack: error.stack,
      memory: process.memoryUsage(),
    });
    
    this.sendCriticalAlert('UNCAUGHT_EXCEPTION', error);
    this.gracefulShutdown('uncaughtException');
  }

  private handleUnhandledRejection(reason: any): void {
    this.logger.error('🚨 UNHANDLED REJECTION', {
      reason: reason instanceof Error ? reason.message : reason,
      stack: reason instanceof Error ? reason.stack : undefined,
    });
    
    this.sendCriticalAlert('UNHANDLED_REJECTION', reason);
  }

  private sendCriticalAlert(type: string, error: any): void {
    // Implement your alerting logic here
    this.logger.warn(`[ALERT] ${type}: ${error.message || error}`);
  }

  private async gracefulShutdown(signal: string): Promise<void> {
    this.logger.log(`Graceful shutdown initiated (${signal})`);
    
    // 30-second timeout for shutdown
    const timeout = setTimeout(() => {
      this.logger.error('Shutdown timeout - forcing exit');
      process.exit(1);
    }, 30000);

    try {
      // Close database connections
      // await this.closeDatabaseConnections();
      
      // Wait for pending requests (up to 5 seconds)
      // await this.waitForPendingRequests(5000);
      
      clearTimeout(timeout);
      process.exit(0);
    } catch (error) {
      this.logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  }
}


export class MemoryLeakDetector {
  private static memorySnapshots: number[] = [];

  static startMonitoring(intervalMs: number = 60000): void {
    setInterval(() => {
      const heapUsed = process.memoryUsage().heapUsed / 1024 / 1024;
      this.memorySnapshots.push(heapUsed);

      // Keep last 10 snapshots
      if (this.memorySnapshots.length > 10) {
        this.memorySnapshots.shift();
      }

      // Detect continuous growth
      if (this.isMemoryContinuouslyGrowing()) {
        Logger.warn('⚠️  MEMORY LEAK DETECTED', {
          current: heapUsed,
          trend: this.memorySnapshots,
        });
      }
    }, intervalMs);
  }

  private static isMemoryContinuouslyGrowing(): boolean {
    if (this.memorySnapshots.length < 5) return false;
    
    const recent = this.memorySnapshots.slice(-5);
    
    // Check if each snapshot is higher than the previous
    for (let i = 1; i < recent.length; i++) {
      if (recent[i] <= recent[i - 1]) return false;
    }
    
    // Check if growth is significant (>10%)
    const growth = ((recent[4] - recent[0]) / recent[0]) * 100;
    return growth > 10;
  }
}