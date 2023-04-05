import invariant from 'tiny-invariant';

export function getEnv() {
    invariant(
        process.env.OPENAPI_API_KEY,
        'process.env.OPENAPI_API_KEY not defined'
    );

    return {
        OPENAPI_API_KEY: process.env.OPENAPI_API_KEY
    };
}

type ENV = ReturnType<typeof getEnv>;

declare global {
    var ENV: ENV;
    interface Window {
        ENV: ENV;
    }
}
