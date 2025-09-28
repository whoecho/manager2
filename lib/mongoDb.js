import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI || '' // <-- Set this in your environment or replace with connection string
const DB_NAME = process.env.MONGO_DB || 'defect_tracker'

if (!MONGO_URI) {
  console.warn('MONGO_URI is empty. Please set MONGO_URI in environment or lib/mongodb.js');
}

let cachedClient = null
let cachedDb = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) return { client: cachedClient, db: cachedDb }
  if (!MONGO_URI) throw new Error('Missing MONGO_URI for MongoDB connection')

  const client = new MongoClient(MONGO_URI)
  await client.connect()
  const db = client.db(DB_NAME)
  cachedClient = client
  cachedDb = db
  return { client, db }
}

// Helper to get collections quickly
export async function getDb() {
  const { db } = await connectToDatabase()
  return db
}
