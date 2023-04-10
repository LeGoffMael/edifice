export interface CommonStateInterface {
  status: CommonStateStatusInterface;
}

type CommonStateStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

interface CommonStateStatusInterface {
  status: CommonStateStatusType;
  error: string | undefined;
}
export class CommonStateStatus {
  status: CommonStateStatusType;
  error: string | undefined;

  constructor(status: CommonStateStatusType, error: string | undefined) {
    this.status = status;
    this.error = error;
  }

  static fromInterface(i: CommonStateStatusInterface) {
    return new CommonStateStatus(i.status, i.error);
  }
  static idle: CommonStateStatusInterface = {
    status: 'idle',
    error: undefined,
  }
  static loading: CommonStateStatusInterface = {
    status: 'loading',
    error: undefined,
  }
  static succeeded: CommonStateStatusInterface = {
    status: 'succeeded',
    error: undefined,
  }
  static failed(errorMessage: string | undefined): CommonStateStatusInterface {
    return {
      status: 'failed',
      error: errorMessage,
    }
  }

  isIdle() {
    return this.status === 'idle';
  }
  isLoading() {
    return this.status === 'loading';
  }
  isFailed() {
    return this.status === 'failed';
  }
  isSucceeded() {
    return this.status === 'succeeded';
  }
}