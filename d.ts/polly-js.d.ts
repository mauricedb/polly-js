declare interface AsyncRetryable {
    executeForPromise<T>(fn: (any) => Promise<T>): Promise<T>
    executeForNode(fn: (err?: object, data?: any) => any, cb?: (err?: object, data?: any) => any): void
}

declare interface Retryable extends AsyncRetryable {
    execute(fn: Function): any
}

declare interface Polly {
    handle(fn: (err: any) => boolean): Polly
    retry(numRetries: number): Retryable
    waitAndRetry(delays: number[]): AsyncRetryable
    waitAndRetry(numRetries : number): AsyncRetryable
}

declare var polly: () => Polly;

declare module "polly-js" {
    export default polly;
}
