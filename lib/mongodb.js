import { MongoClient } from "mongodb";

const uri = process.env.NEXT_ATLAS_URI.replace('ssl=true', 'tls=true');
const dbName = process.env.NEXT_ATLAS_DATABASE;

if (!uri) {
  throw new Error("❌ NEXT_ATLAS_URI is missing in .env.local");
}

if (!dbName) {
  throw new Error("❌ NEXT_ATLAS_DATABASE is missing in .env.local");
}

// Global cache (evită reconectarea la fiecare request în dev)
let client;
let clientPromise;

const clientOptions = {
  retryWrites: true,
  maxPoolSize: 1,  // Reduce pool size for serverless
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  tls: true,
  tlsInsecure: true,  // Allow insecure TLS for Vercel compatibility
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, clientOptions);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, clientOptions);
  clientPromise = client.connect();
}

/**
 * Conectare sigură la MongoDB
 */
export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);

    return { client, db };
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error("Database connection failed");
  }
}

/**
 * Shortcut pentru colecții
 */
export async function getCollection(name) {
  const { db } = await connectToDatabase();
  return db.collection(name);
}