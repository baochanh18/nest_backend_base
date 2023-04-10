import { InternalServerErrorException } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

class Storage {
  constructor(
    readonly requestId = 1,
    readonly transactionDepth = 0,
  ) {}
}

interface RequestStorage {
  reset: () => void;
  resetTransactionDepth: () => void;
  increaseTransactionDepth: () => void;
  decreaseTransactionDepth: () => void;
  setRequestId: (requestId: number) => void;
}

class RequestStorageImplement implements RequestStorage {
  private readonly storage = new AsyncLocalStorage<Storage>();

  reset(): void {
    this.storage.enterWith(new Storage());
  }

  resetTransactionDepth(): void {
    const storage = this.getStorage();
    this.storage.enterWith({ ...storage, transactionDepth: 0 });
  }

  increaseTransactionDepth(): void {
    const storage = this.getStorage();
    this.storage.enterWith({
      ...storage,
      transactionDepth: storage.transactionDepth + 1,
    });
  }

  decreaseTransactionDepth(): void {
    const storage = this.getStorage();
    this.storage.enterWith({
      ...storage,
      transactionDepth: storage.transactionDepth - 1,
    });
  }

  setRequestId(requestId: number): void {
    const storage = this.getStorage();
    this.storage.enterWith({ ...storage, requestId });
  }

  getStorage(): Storage {
    const storage = this.storage.getStore();
    if (!storage)
      throw new InternalServerErrorException('RequestStorage is not found');
    return storage;
  }
}

export const RequestStorage = new RequestStorageImplement();
