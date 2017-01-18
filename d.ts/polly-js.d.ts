declare interface AsyncRetryable {
    executeForPromise(fn: Function): any
    executeForNode(fn: Function): any
}

declare interface Retryable extends AsyncRetryable {
    execute(fn: Function): any
}

declare interface Polly {
    handle(fn: Function): Polly
    retry(): Retryable
    waitAndRetry(delays:any): AsyncRetryable
}

declare var polly: () => Polly;

declare module "polly-js" {
    export = polly;
}
