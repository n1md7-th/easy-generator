declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ORIGINS: string;
      HOST: string;
      PORT: string;
    }
  }
}

export {};
