import { Logger } from '../../../utils/logger';

export class QueueBrowserAutomation {
  private static instance: QueueBrowserAutomation;

  private static messageId: number = 0;

  private static activeTasks: number = 0;

  private static maxConcurrentTasks: number = 3;

  private static queue: { messageId: number; priority: number; resolve: () => void; reject: () => void }[] = [];

  private constructor() {}

  // priority is a number between 0 and 1, where 0 is the lowest priority and 1 is the highest
  public static waitInQueue(priority: number = 0): Promise<void> {
    this.getInstance();

    return new Promise((resolve, reject) => {
      this.queue.push({ messageId: this.messageId, priority, resolve, reject });

      // sort in descending order i.e higher priority first
      this.queue.sort((a, b) => b.priority - a.priority);

      this.messageId++;

      this.processQueue();
    });
  }

  public static taskDone() {
    this.activeTasks--;

    this.processQueue();
  }

  private static async processQueue() {
    while (this.activeTasks < this.maxConcurrentTasks && this.queue.length > 0) {
      const message = this.queue.shift();

      try {
        this.activeTasks++;

        message?.resolve();
      } catch (error) {
        Logger.consoleError('Error while processing QueueBrowserAutomation: ', error as Error);

        message?.reject();
      }
    }
  }

  private static getInstance(): QueueBrowserAutomation {
    return this.instance || (this.instance = new this());
  }
}
