import { z } from "zod";

const envSchema = z.object({
  INFLUX_URL: z.string().url(),
  INFLUX_TOKEN: z.string().min(1),
  INFLUX_ORG: z.string().min(1),
  INFLUX_BUCKET: z.string().min(1),
  API_KEY: z.string().min(8, "API Key must be at least 8 characters long"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const validateEnv = () => {
  try {
    return envSchema.parse({
      INFLUX_URL: process.env.INFLUX_URL,
      INFLUX_TOKEN: process.env.INFLUX_TOKEN,
      INFLUX_ORG: process.env.INFLUX_ORG,
      INFLUX_BUCKET: process.env.INFLUX_BUCKET,
      API_KEY: process.env.API_KEY,
      NODE_ENV: process.env.NODE_ENV,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Invalid environment variables:");
      error.issues.forEach((err) => {
        console.error(`   - ${err.path.join(".")}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
};

export const env = validateEnv();
