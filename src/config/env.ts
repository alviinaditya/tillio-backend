const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};

export const NODE_ENV = getEnv("NODE_ENV", "development");
export const PORT = getEnv("PORT", "5000");
export const MONGODB_URI = getEnv("MONGODB_URI");
export const CLIENT_URL = getEnv("CLIENT_URL");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const EMAIL_SERVICE = getEnv("EMAIL_SERVICE");
export const EMAIL_USER = getEnv("EMAIL_USER");
export const EMAIL_PASSWORD = getEnv("EMAIL_PASSWORD");
