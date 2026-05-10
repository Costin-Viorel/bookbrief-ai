import { MongoClient } from "mongodb";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// Load .env.local manually
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");

envContent.split("\n").forEach((line) => {
  const [key, ...valueParts] = line.split("=");
  if (key && !key.startsWith("#")) {
    process.env[key.trim()] = valueParts.join("=").trim();
  }
});

const uri = process.env.NEXT_ATLAS_URI;

console.log("Testing MongoDB connection...");
console.log("URI:", uri?.substring(0, 80) + "...");

// Try direct connection
console.log("\n--- Testing Connection ---");
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000,
});

client
  .connect()
  .then(async () => {
    console.log("✅ Connected to MongoDB!");
    const db = client.db("CloudComputing");
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections);
    await client.close();
  })
  .catch((err) => {
    console.error("❌ Connection failed:", err.message);
  });
