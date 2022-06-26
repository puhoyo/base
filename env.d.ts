declare global {
    namespace NodeJS {
      interface ProcessEnv {
        JWT_SECRET: string;
        NODE_ENV: 'local' | 'development' | 'production';
      }
    }
    interface User {
      userId: number;
    }
  }
  export {}