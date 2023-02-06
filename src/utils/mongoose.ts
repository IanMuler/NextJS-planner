import { connect, Mongoose } from "mongoose";

const conn = {
  isConnected: false,
};

export async function dbConnect() {
  if (conn.isConnected) {
    return;
  }
  const db: Mongoose = await connect(process.env.MONGODB_URI, {
    autoIndex: false,
  });
  conn.isConnected = db.connections[0].readyState === 1;
}
