// Settings read once from the environment.
export const PORT = Number(process.env.PORT) || 3000;

export const allowedOrigins = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
