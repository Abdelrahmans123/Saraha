// src/db/connection.db.js
import mongoose from "mongoose";

let isConnected = false; // global flag

async function connectDB() {
	if (isConnected) return;

	try {
		const conn = await mongoose.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			serverSelectionTimeoutMS: 10000, // 10s timeout
		});

		isConnected = conn.connections[0].readyState === 1;
		console.log("✅ MongoDB connected:", conn.connection.host);
	} catch (error) {
		console.error("❌ MongoDB connection error:", error.message);
		throw error;
	}
}

export default connectDB;
