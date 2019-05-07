// tslint:disable
// Type definitions for polly-js

declare module 'polly-js' {
    function polly (): polly.Polly;

    namespace polly {
      type Info = {
        count: number;
      };

      interface AsyncRetryable {
        executeForPromise<T> (fn: (info: Info) => Promise<T>): Promise<T>;
        executeForNode (
          fn: (cb: (err?: object, data?: any) => any, info: Info) => any,
          cb?: (err?: object, data?: any) => any
        ): void;
      }

      interface Retryable extends AsyncRetryable {
        execute (fn: (info: Info) => any): any;
      }

      interface Polly {
        handle (fn: (err: any) => boolean): Polly;
        retry (numRetries: number): Retryable;
        waitAndRetry (delays: number[]): AsyncRetryable;
        waitAndRetry (numRetries: number): AsyncRetryable;
      }

      type PollyDefaults = {
        delay: number;
      }

      const defaults: PollyDefaults;
    }

    export = polly;
  }
