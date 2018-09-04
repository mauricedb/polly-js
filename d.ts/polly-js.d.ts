type Info = {
    count: number;
};

declare interface AsyncRetryable {
    executeForPromise<T>(fn: (info: Info) => Promise<T>): Promise<T>;
    executeForNode(
        fn: (cb: (err?: object, data?: any) => any, info: Info) => any,
        cb?: (err?: object, data?: any) => any
    ): void;
}

declare interface Retryable extends AsyncRetryable {
    execute(fn: (info: Info) => any): any;
}

declare interface Polly {
    handle(fn: (err: any) => boolean): Polly;
    retry(numRetries: number): Retryable;
    waitAndRetry(delays: number[]): AsyncRetryable;
    waitAndRetry(numRetries: number): AsyncRetryable;
}

declare var polly: () => Polly;

declare module 'polly-js' {
    export default polly;
}
