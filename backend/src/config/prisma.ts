import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not defined");
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });

export const connectDB = async (): Promise<void> => {
  try {
    // Test the PostgreSQL connection
    await pool.query("SELECT 1");
    console.log("PostgreSQL database connected via Prisma Pg adapter");
  } catch (error) {
    console.error(`PostgreSQL connection error: ${error}`);
    throw error;
  }
};
