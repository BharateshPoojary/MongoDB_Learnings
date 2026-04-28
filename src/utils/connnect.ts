import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import { startAccountChangeStream } from "../streams/account.stream";

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

type ConnectionResObj = {
  isConnected?: number;
};

const Connection: ConnectionResObj = {};
let db: typeof mongoose | null = null;

const dbConnect = async (): Promise<void> => {
  if (Connection.isConnected) {
    return;
  }
  try {
    const dbConnect = await mongoose.connect(process.env.MONGODB_URI!, {});
    startAccountChangeStream();
    db = dbConnect;
    Connection.isConnected = dbConnect.connections[0]?.readyState ?? 0;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// ✅ Add this — reuses the same MongoClient mongoose already holds
const getAdminDb = () => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error("Database not connected");
  }
  return mongoose.connection.getClient().db("admin");
};

export { dbConnect, db, getAdminDb };